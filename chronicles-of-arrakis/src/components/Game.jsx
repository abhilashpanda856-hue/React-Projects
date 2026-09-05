import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ref, update } from 'firebase/database';
import { db } from '../firebase';
import { useGameState } from '../hooks/useGameState';
import {
  BackgroundEffect,
  Header,
  IntroScreen,
  GrindingScreen,
  RoleRevealScreen,
  TrialScreen,
  GameOverScreen,
  SummaryScreen,
  CountdownTimer,
  NameEntryScreen,
  LeaderboardScreen,
  Footer,
} from './index';
import {
  INITIAL_STATS,
  GRINDING_SCENARIOS,
  TRIAL_QUESTIONS,
} from '../data/gameData';

export default function Game() {
  const gameState = useGameState();
  const currentStep = gameState?.status || 'WAITING'; // WAITING, INTRO, GRINDING, LEADERBOARD, REVEAL, TRIAL, DEAD, SUMMARY
  const currentQuestionIndex = gameState?.currentQuestionIndex || 0;

  // PLAYER STATE
  const [playerId, setPlayerId] = useState(null);
  const [playerName, setPlayerName] = useState('');

  // LOCAL GAME STATE (Syncs to Firebase)
  const [stats, setStats] = useState({ ...INITIAL_STATS });
  const [playerHp, setPlayerHp] = useState(100);
  const [maxHp, setMaxHp] = useState(100);
  const [bossDamageDealt, setBossDamageDealt] = useState(0);
  const [selectedRole, setSelectedRole] = useState(null);
  const [comrades, setComrades] = useState([]);
  const [tankUsed, setTankUsed] = useState(false);
  const [supportUsed] = useState(false);
  const [isDead, setIsDead] = useState(false);

  // UI STATE
  const [combatMessage, setCombatMessage] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const clickLockRef = useRef(0);

  // Sync state to Firebase whenever relevant player stats change
  const syncPlayerToFirebase = useCallback(
    async (updates) => {
      if (!playerId) return;
      try {
        await update(ref(db, `players/${playerId}`), updates);
      } catch (e) {
        console.error('Failed to sync player state', e);
      }
    },
    [playerId]
  );

  // Reset local state when a new question starts
  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    setHasAnswered(false);
    setCombatMessage('');
    setIsProcessing(false);
  }, [currentQuestionIndex, currentStep]);

  // ROLE ARBITRATION (Run when reaching REVEAL phase or end of GRINDING)
  const calculateRole = useCallback(
    (finalStats) => {
      let role = '';
      const unlockedComrades = [];
      let initialHp = 100;

      if (
        finalStats.arrogance >= 50 ||
        finalStats.arrogance > (finalStats.friendship + finalStats.int) / 2
      ) {
        role = 'HARKONNEN';
        initialHp = 120 + finalStats.atk;
      } else if (finalStats.friendship >= finalStats.int) {
        role = 'FREMEN';
        initialHp = 150 + finalStats.stamina;

        if (finalStats.friendship >= 40) {
          unlockedComrades.push({ type: 'Sayyadina (Healer)', desc: 'Restores 20 HP' });
        }
        if (finalStats.friendship >= 70) {
          unlockedComrades.push({ type: 'Fedaykin (Commando)', desc: '+15 bonus damage' });
        }
        if (finalStats.friendship >= 100) {
          unlockedComrades.push({ type: 'Desert Scout', desc: 'Dodges 1 wrong answer' });
        }
      } else {
        role = 'MENTAT';
        initialHp = 75 + Math.floor(finalStats.stamina / 2);
      }

      setSelectedRole(role);
      setComrades(unlockedComrades);
      setPlayerHp(initialHp);
      setMaxHp(initialHp);

      syncPlayerToFirebase({
        role,
        comrades: unlockedComrades,
        hp: initialHp,
        maxHp: initialHp,
      });
    },
    [syncPlayerToFirebase]
  );

  // Run calculate role once if we transition to REVEAL
  useEffect(() => {
    if (currentStep === 'REVEAL' && !selectedRole) {
      // eslint-disable-next-line react/set-state-in-effect
      calculateRole(stats);
    }
  }, [currentStep, stats, selectedRole, calculateRole]);

  // TIMEOUT HANDLER (GRINDING)
  const handleGrindingTimeout = useCallback(() => {
    if (hasAnswered || isProcessing) return;
    setHasAnswered(true);
    setStats((prevStats) => {
      const nextStats = { ...prevStats, stamina: prevStats.stamina - 10 };
      syncPlayerToFirebase({ stats: nextStats });
      return nextStats;
    });
    setCombatMessage('Time Up! (-10 Stamina). Waiting for Admin...');
  }, [hasAnswered, isProcessing, syncPlayerToFirebase]);

  // TIMEOUT HANDLER (TRIAL)
  const handleTrialTimeout = useCallback(() => {
    if (hasAnswered || isDead || isProcessing) return;
    setHasAnswered(true);

    const isFremen = selectedRole === 'FREMEN';
    const isHarkonnen = selectedRole === 'HARKONNEN';
    let damageTaken = 30 - Math.floor(stats.def / 2);
    if (damageTaken < 10) damageTaken = 10;
    let message = 'Time Up! The Maker strikes!';

    if (isHarkonnen) {
      damageTaken += 15;
      message = `WRONG! Your own subordinates betray you! Took ${damageTaken} total damage!`;
    } else if (isFremen && comrades.some((c) => c.type === 'Desert Scout') && !tankUsed) {
      message = "Time Up! The Maker strikes! But your Desert Scout predicted the movement! 0 damage taken.";
      setTankUsed(true);
      syncPlayerToFirebase({ tankUsed: true });
      damageTaken = 0;
    }

    const updatedHp = Math.max(0, playerHp - damageTaken);
    setPlayerHp(updatedHp);

    if (updatedHp <= 0) {
      setIsDead(true);
      syncPlayerToFirebase({ isDead: true, hp: 0 });
      setCombatMessage('You have perished. Waiting for Admin...');
    } else {
      setCombatMessage(message + ' Waiting for Admin...');
      syncPlayerToFirebase({ hp: updatedHp });
    }
  }, [
    hasAnswered,
    isDead,
    isProcessing,
    selectedRole,
    stats.def,
    comrades,
    tankUsed,
    playerHp,
    syncPlayerToFirebase,
  ]);

  // CHOICE HANDLER (SCENARIOS)
  const handleGrindingChoice = useCallback(
    (choiceStats) => {
      const now = Date.now();
      if (hasAnswered || isProcessing || now - clickLockRef.current < 1500) return;
      clickLockRef.current = now;
      setIsProcessing(true);
      setHasAnswered(true);

      setStats((prevStats) => {
        const nextStats = { ...prevStats };
        for (const [key, value] of Object.entries(choiceStats)) {
          nextStats[key] = (nextStats[key] || 0) + value;
        }
        syncPlayerToFirebase({ stats: nextStats });
        return nextStats;
      });

      setCombatMessage('Choice locked in. Waiting for Admin...');

      setTimeout(() => {
        setIsProcessing(false);
      }, 1500);
    },
    [hasAnswered, isProcessing, syncPlayerToFirebase]
  );

  // TRIAL QUESTION HANDLER (BOSS BATTLE)
  const handleTrialAnswer = useCallback(
    (selectedIndex) => {
      const now = Date.now();
      if (hasAnswered || isDead || isProcessing || now - clickLockRef.current < 1500) return;
      clickLockRef.current = now;
      setIsProcessing(true);
      setHasAnswered(true);

      const q = TRIAL_QUESTIONS[currentQuestionIndex];
      if (!q) return;
      const isCorrect = selectedIndex === q.correctAnswer;
      const isMentat = selectedRole === 'MENTAT';
      const isFremen = selectedRole === 'FREMEN';
      const isHarkonnen = selectedRole === 'HARKONNEN';
      let message = '';
      let updatedHp = playerHp;

      if (isCorrect) {
        let damage = stats.atk + stats.int;
        if (isHarkonnen) {
          damage = stats.atk + stats.arrogance;
          message = `Brute force strike! Dealt ${damage} damage!`;
        } else if (isMentat) {
          damage = Math.floor(damage * 2.5);
          message = `CRITICAL STRIKE! Dealt ${damage} damage!`;
        } else if (isFremen && comrades.some((c) => c.type === 'Fedaykin (Commando)')) {
          damage += 15;
          message = `Fedaykin commandos strike! Dealt ${damage} damage!`;
        } else {
          message = `Solid hit! Dealt ${damage} damage!`;
        }
        setBossDamageDealt((prev) => {
          const newBossDmg = prev + damage;
          syncPlayerToFirebase({ bossDamageDealt: newBossDmg });
          return newBossDmg;
        });
      } else {
        let damageTaken = 30 - Math.floor(stats.def / 2);
        if (damageTaken < 10) damageTaken = 10;

        if (isHarkonnen) {
          damageTaken += 15;
          message = `WRONG! Your own subordinates betray you! Took ${damageTaken} total damage!`;
        } else if (isFremen && comrades.some((c) => c.type === 'Desert Scout') && !tankUsed) {
          message = "WRONG! But your Desert Scout dodged! 0 damage taken.";
          setTankUsed(true);
          syncPlayerToFirebase({ tankUsed: true });
          damageTaken = 0;
        } else {
          message = `WRONG! The Sandworm strikes you for ${damageTaken} damage!`;
        }

        updatedHp = Math.max(0, playerHp - damageTaken);
        setPlayerHp(updatedHp);
      }

      if (updatedHp <= 0) {
        setIsDead(true);
        syncPlayerToFirebase({ isDead: true, hp: 0 });
        setCombatMessage('You have perished. Waiting for Admin...');
      } else {
        setCombatMessage(message + ' Waiting for Admin...');
        syncPlayerToFirebase({ hp: updatedHp });
      }

      setTimeout(() => {
        setIsProcessing(false);
      }, 1500);
    },
    [
      hasAnswered,
      isDead,
      isProcessing,
      currentQuestionIndex,
      selectedRole,
      playerHp,
      stats,
      comrades,
      tankUsed,
      syncPlayerToFirebase,
    ]
  );

  const handleJoin = useCallback((id, name) => {
    setPlayerId(id);
    setPlayerName(name);
  }, []);

  if (!playerId) {
    return (
      <div className="relative min-h-screen w-full flex flex-col justify-center p-4">
        <BackgroundEffect />
        <div className="relative z-10 w-full">
          <NameEntryScreen onJoin={handleJoin} />
        </div>
      </div>
    );
  }

  // If player is dead and we are in TRIAL, show Game Over screen early for them, 
  // or let them watch the leaderboard.
  if (isDead && currentStep === 'TRIAL') {
     return (
      <div className="relative min-h-screen w-full flex flex-col justify-between p-4">
        <BackgroundEffect />
        <div className="relative z-10 w-full my-auto flex flex-col justify-center items-center">
           <GameOverScreen bossDamageDealt={bossDamageDealt} selectedRole={selectedRole} />
           <p className="mt-4 text-stone-400">Waiting for Admin to end the trial...</p>
        </div>
      </div>
     );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-x-hidden text-slate-100">
      <BackgroundEffect />

      <div className="relative z-10 w-full">
        <Header currentStep={currentStep} stats={stats} />
      </div>

      <main className="relative z-10 w-full my-auto flex flex-col justify-center items-center py-4">
        {/* Isolated CountdownTimer: internal 1s state tick re-renders ONLY this timer */}
        {(currentStep === 'GRINDING' || currentStep === 'TRIAL') && !hasAnswered && (
          <div
            className={`w-full ${
              currentStep === 'TRIAL' ? 'max-w-4xl' : 'max-w-3xl'
            } mx-auto mb-4 animate-fade-in`}
          >
            <CountdownTimer
              key={`${currentStep}-${currentQuestionIndex}`}
              maxTime={15}
              isPaused={hasAnswered || isProcessing || Boolean(combatMessage)}
              onTimeout={currentStep === 'GRINDING' ? handleGrindingTimeout : handleTrialTimeout}
            />
          </div>
        )}

        {currentStep === 'WAITING' && (
          <div className="text-2xl font-serif text-amber-500 animate-pulse">
            Waiting for Admin to start the game...
          </div>
        )}

        {currentStep === 'INTRO' && (
          <IntroScreen />
        )}

        {currentStep === 'GRINDING' && (
          <GrindingScreen
            key={currentQuestionIndex}
            scenario={GRINDING_SCENARIOS[currentQuestionIndex]}
            currentIndex={currentQuestionIndex}
            totalScenarios={GRINDING_SCENARIOS.length}
            onChoiceSelect={handleGrindingChoice}
            combatMessage={combatMessage}
            isProcessing={isProcessing || hasAnswered}
          />
        )}

        {currentStep === 'LEADERBOARD' && (
          <LeaderboardScreen phase={currentQuestionIndex < GRINDING_SCENARIOS.length ? 'GRINDING' : 'TRIAL'} />
        )}

        {currentStep === 'REVEAL' && (
          <RoleRevealScreen
            selectedRole={selectedRole}
            comrades={comrades}
          />
        )}

        {currentStep === 'TRIAL' && (
          <TrialScreen
            key={currentQuestionIndex}
            question={TRIAL_QUESTIONS[currentQuestionIndex]}
            questionIndex={currentQuestionIndex}
            totalQuestions={TRIAL_QUESTIONS.length}
            playerHp={playerHp}
            maxHp={maxHp}
            bossDamageDealt={bossDamageDealt}
            combatMessage={combatMessage}
            selectedRole={selectedRole}
            comrades={comrades}
            tankUsed={tankUsed}
            supportUsed={supportUsed}
            onAnswer={handleTrialAnswer}
            isProcessing={isProcessing || hasAnswered}
          />
        )}

        {currentStep === 'DEAD' && (
          <GameOverScreen
            bossDamageDealt={bossDamageDealt}
            selectedRole={selectedRole}
          />
        )}

        {currentStep === 'SUMMARY' && (
          <SummaryScreen
            bossDamageDealt={bossDamageDealt}
            selectedRole={selectedRole}
            comrades={comrades}
          />
        )}
      </main>

      <Footer playerName={playerName} />
    </div>
  );
}
