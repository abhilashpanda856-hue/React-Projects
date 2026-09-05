import React, { useState, useCallback, useRef } from 'react';
import {
  BackgroundEffect,
  Header,
  IntroScreen,
  GrindingScreen,
  StatOverlay,
  RoleRevealScreen,
  TrialScreen,
  GameOverScreen,
  SummaryScreen,
  CountdownTimer,
  Footer,
} from './index';
import {
  INITIAL_STATS,
  GRINDING_SCENARIOS,
  TRIAL_QUESTIONS,
} from '../data/gameData';

export default function Game() {
  // GAME PROGRESSION STATE
  const [currentStep, setCurrentStep] = useState('INTRO'); // INTRO, GRINDING, OVERLAY, REVEAL, TRIAL, DEAD, SUMMARY
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [stats, setStats] = useState({ ...INITIAL_STATS });
  const clickLockRef = useRef(0);

  // COMBAT STATE
  const [playerHp, setPlayerHp] = useState(100);
  const [maxHp, setMaxHp] = useState(100);
  const [bossDamageDealt, setBossDamageDealt] = useState(0);

  // ROLE & SQUAD STATE
  const [selectedRole, setSelectedRole] = useState(null); // 'FREMEN', 'MENTAT', 'HARKONNEN'
  const [comrades, setComrades] = useState([]);
  const [tankUsed, setTankUsed] = useState(false);
  const [supportUsed, setSupportUsed] = useState(false);

  // UI STATE
  const [recentStatChanges, setRecentStatChanges] = useState({});
  const [combatMessage, setCombatMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // ROLE ARBITRATION
  const calculateRole = (finalStats) => {
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
        unlockedComrades.push({
          type: 'Sayyadina (Healer)',
          desc: 'Administers healing waters (Restores 20 HP)',
        });
      }
      if (finalStats.friendship >= 70) {
        unlockedComrades.push({
          type: 'Fedaykin (Commando)',
          desc: 'Elite desert warrior (+15 bonus damage)',
        });
      }
      if (finalStats.friendship >= 100) {
        unlockedComrades.push({
          type: 'Desert Scout',
          desc: 'Reads the sands (Dodges 1 wrong answer)',
        });
      }
    } else {
      role = 'MENTAT';
      initialHp = 75 + Math.floor(finalStats.stamina / 2); // Glass cannon
    }

    setSelectedRole(role);
    setComrades(unlockedComrades);
    setPlayerHp(initialHp);
    setMaxHp(initialHp);
  };

  // TIMEOUT HANDLER (GRINDING)
  const handleGrindingTimeout = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const penalty = { stamina: -10 };
    const nextStats = {
      ...stats,
      stamina: stats.stamina - 10,
    };
    setStats(nextStats);
    setRecentStatChanges(penalty);
    setCombatMessage('Time Up!');

    setTimeout(() => {
      setCombatMessage('');
      setIsProcessing(false);
      if (currentQuestionIndex < GRINDING_SCENARIOS.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        calculateRole(nextStats);
        setCurrentStep('REVEAL');
        setCurrentQuestionIndex(0);
      }
    }, 2000);
  };

  // TIMEOUT HANDLER (TRIAL)
  const handleTrialTimeout = () => {
    if (isProcessing) return;
    setIsProcessing(true);

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
      damageTaken = 0;
    }

    const updatedHp = Math.max(0, playerHp - damageTaken);
    setPlayerHp(updatedHp);
    setCombatMessage(message);

    // Support Heal logic after Question 2 (index 1) if Fremen unlocked Sayyadina
    if (
      currentQuestionIndex === 1 &&
      isFremen &&
      comrades.some((c) => c.type === 'Sayyadina (Healer)') &&
      !supportUsed
    ) {
      setTimeout(() => {
        setPlayerHp((prev) => Math.min(maxHp, prev + 20));
        setCombatMessage('The Sayyadina administers the water of life! Recovered 20 HP.');
        setSupportUsed(true);
      }, 1500);
    }

    setTimeout(() => {
      setCombatMessage('');
      setIsProcessing(false);

      if (updatedHp <= 0) {
        setCurrentStep('DEAD');
      } else if (currentQuestionIndex < TRIAL_QUESTIONS.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setCurrentStep('SUMMARY');
      }
    }, 2500);
  };

  // CHOICE HANDLER (SCENARIOS)
  const handleGrindingChoice = (choiceStats) => {
    const now = Date.now();
    if (isProcessing || now - clickLockRef.current < 1500) return;
    clickLockRef.current = now;
    setIsProcessing(true);

    const nextStats = { ...stats };
    for (const [key, value] of Object.entries(choiceStats)) {
      nextStats[key] = (nextStats[key] || 0) + value;
    }

    setStats(nextStats);
    setRecentStatChanges(choiceStats);
    setCurrentStep('OVERLAY');

    setTimeout(() => {
      setIsProcessing(false);
      if (currentQuestionIndex < GRINDING_SCENARIOS.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setCurrentStep('GRINDING');
      } else {
        calculateRole(nextStats);
        setCurrentStep('REVEAL');
        setCurrentQuestionIndex(0); // Reset index for Boss Trial
      }
    }, 2000);
  };

  // TRIAL QUESTION HANDLER (BOSS BATTLE)
  const handleTrialAnswer = (selectedIndex) => {
    const now = Date.now();
    if (isProcessing || now - clickLockRef.current < 1500) return;
    clickLockRef.current = now;
    setIsProcessing(true);

    const q = TRIAL_QUESTIONS[currentQuestionIndex];
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
        message = `CRITICAL STRIKE! Mentat calculation perfect. Dealt ${damage} damage!`;
      } else if (isFremen) {
        const hasFedaykin = comrades.some((c) => c.type === 'Fedaykin (Commando)');
        if (hasFedaykin) {
          damage += 15;
          message = `Tribe strikes together! Fedaykin commandos strike from the shadows! Dealt ${damage} damage!`;
        } else {
          message = `Solid hit! Dealt ${damage} damage!`;
        }
      } else {
        message = `Solid hit! Dealt ${damage} damage!`;
      }

      setBossDamageDealt((prev) => prev + damage);
    } else {
      // Incorrect answer: Worm strikes back
      let damageTaken = 30 - Math.floor(stats.def / 2);
      if (damageTaken < 10) damageTaken = 10;

      if (isHarkonnen) {
        damageTaken += 15;
        message = `WRONG! Your own subordinates betray you! Took ${damageTaken} total damage!`;
      } else if (isFremen && comrades.some((c) => c.type === 'Desert Scout') && !tankUsed) {
        message = "WRONG! But your Desert Scout predicted the Maker's movement! 0 damage taken.";
        setTankUsed(true);
        damageTaken = 0;
      } else {
        message = `WRONG! The Sandworm strikes you for ${damageTaken} damage!`;
      }

      updatedHp = Math.max(0, playerHp - damageTaken);
      setPlayerHp(updatedHp);
    }

    setCombatMessage(message);

    // Support Heal logic after Question 2 (index 1)
    if (
      currentQuestionIndex === 1 &&
      isFremen &&
      comrades.some((c) => c.type === 'Sayyadina (Healer)') &&
      !supportUsed
    ) {
      setTimeout(() => {
        setPlayerHp((prev) => {
          const healed = Math.min(maxHp, prev + 20);
          updatedHp = healed;
          return healed;
        });
        setCombatMessage('The Sayyadina administers the water of life! Recovered 20 HP.');
        setSupportUsed(true);
      }, 1500);
    }

    setTimeout(() => {
      setCombatMessage('');
      setIsProcessing(false);

      if (updatedHp <= 0) {
        setCurrentStep('DEAD');
      } else if (currentQuestionIndex < TRIAL_QUESTIONS.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setCurrentStep('SUMMARY');
      }
    }, 2500);
  };

  // RESTART SIMULATION
  const handleReset = useCallback(() => {
    setCurrentStep('INTRO');
    setCurrentQuestionIndex(0);
    setStats({ ...INITIAL_STATS });
    setPlayerHp(100);
    setMaxHp(100);
    setBossDamageDealt(0);
    setSelectedRole(null);
    setComrades([]);
    setRecentStatChanges({});
    setCombatMessage('');
    setTankUsed(false);
    setSupportUsed(false);
    setIsProcessing(false);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-x-hidden text-slate-100">
      {/* Dynamic Background Atmosphere */}
      <BackgroundEffect />

      {/* Persistent Sci-Fi Header with Stats */}
      <div className="relative z-10 w-full">
        <Header
          currentStep={currentStep}
          stats={stats}
          onReset={handleReset}
        />
      </div>

      {/* Active Phase Content */}
      <main className="relative z-10 w-full my-auto flex flex-col justify-center items-center py-4">
        {/* Visual Countdown Timer for GRINDING and TRIAL phases - only timer UI re-renders on ticks */}
        {(currentStep === 'GRINDING' || currentStep === 'TRIAL') && !combatMessage && (
          <div
            className={`w-full ${
              currentStep === 'TRIAL' ? 'max-w-4xl' : 'max-w-3xl'
            } mx-auto mb-4 animate-fade-in`}
          >
            <CountdownTimer
              key={`${currentStep}-${currentQuestionIndex}`}
              maxTime={15}
              isPaused={isProcessing || Boolean(combatMessage)}
              onTimeout={currentStep === 'GRINDING' ? handleGrindingTimeout : handleTrialTimeout}
            />
          </div>
        )}

        {currentStep === 'INTRO' && (
          <IntroScreen onStart={() => setCurrentStep('GRINDING')} />
        )}

        {currentStep === 'GRINDING' && (
          <GrindingScreen
            key={currentQuestionIndex}
            scenario={GRINDING_SCENARIOS[currentQuestionIndex]}
            currentIndex={currentQuestionIndex}
            totalScenarios={GRINDING_SCENARIOS.length}
            onChoiceSelect={handleGrindingChoice}
            combatMessage={combatMessage}
            isProcessing={isProcessing}
          />
        )}

        {currentStep === 'OVERLAY' && (
          <StatOverlay recentStatChanges={recentStatChanges} />
        )}

        {currentStep === 'REVEAL' && (
          <RoleRevealScreen
            selectedRole={selectedRole}
            comrades={comrades}
            onProceedToTrial={() => setCurrentStep('TRIAL')}
            onReset={handleReset}
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
            isProcessing={isProcessing}
          />
        )}

        {currentStep === 'DEAD' && (
          <GameOverScreen
            bossDamageDealt={bossDamageDealt}
            selectedRole={selectedRole}
            onReset={handleReset}
          />
        )}

        {currentStep === 'SUMMARY' && (
          <SummaryScreen
            bossDamageDealt={bossDamageDealt}
            selectedRole={selectedRole}
            comrades={comrades}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Dune Terminal Footer */}
      <Footer />
    </div>
  );
}
