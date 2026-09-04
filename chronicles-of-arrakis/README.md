# Chronicles of Arrakis: Orientation Trial

A Dune-inspired sci-fi RPG orientation trial built with **React**, **Vite**, **Tailwind CSS**, and **lucide-react**.

Walk the sands, make high-stakes student and orientation decisions to shape your stats, face desert judgment, unlock your archetype (**Fremen Tribe**, **Mentat Glass Cannon**, or doom in **House Harkonnen**), and duel the mighty Sandworm (*Shai-Hulud*) in an anime trivia trial!

---

## 🚀 Quick Start

```bash
# Navigate to project directory
cd ~/projects/chronicles-of-arrakis
# (or cd ~/chronicles-of-arrakis)

# Install dependencies (already installed)
npm install

# Start local Vite development server
npm run dev

# Build for production
npm run build

# Run Oxlint
npm run lint
```

---

## 🏜️ Game Phases & Mechanics

1. **Orientation Briefing (`INTRO`)**:
   - Welcome to Arrakis. Sets the narrative tone and previews the three destiny paths.
2. **Tribal Selection Decisions (`GRINDING`)**:
   - 5 scenario challenges simulating college/hostel crises (late-night assignments, hackathon team-ups, lab practical circuit disasters, exam prep rumors, tech showcase presentations).
   - Each decision alters your core stats:
     - **ATK** (Attack)
     - **DEF** (Defense)
     - **STM** (Stamina)
     - **FRND** (Friendship)
     - **INT** (Intelligence)
     - **ARRG** (Arrogance)
3. **Stat Overlay (`OVERLAY`)**:
   - Visual feedback displaying the numerical impact of your actions.
4. **Desert Arbitration (`REVEAL`)**:
   - The desert judges your soul based on your decisions:
     - **House Harkonnen**: If Arrogance >= 35 or exceeds your combined virtue, you are instantly swallowed by the Sandworm!
     - **The Fremen Tribe**: If Friendship >= Intelligence, you unlock the Vanguard based on friendship milestones:
       - *Sayyadina (Healer)* (>=20 Friendship): Administers healing waters (Restores 20 HP after Trial Q2).
       - *Fedaykin (Commando)* (>=35 Friendship): Elite desert warrior (+15 bonus damage).
       - *Desert Scout* (>=50 Friendship): Reads the sands (Dodges 1 wrong answer).
     - **The Mentat**: If Intelligence > Friendship, become a devastating Glass Cannon with **2.5x critical damage multiplier**, reduced base HP, and zero squad shields.
5. **Sandworm Combat Trial (`TRIAL`)**:
   - Boss fight against Shai-Hulud featuring trivia questions across iconic anime universes (*Jujutsu Kaisen*, *Solo Leveling*, *Death Note*, *Attack on Titan*, *Naruto*).
   - Dynamic HP bar, combat feedback banners, damage counters, and squad ability triggers.
6. **Outcomes (`DEAD` or `SUMMARY`)**:
   - **Consumed by the Sands**: Triggered if player HP reaches 0.
   - **Trial Complete**: Unlocks rank assessment:
     - **Lisan al Gaib (1st Tier)** (> 300 damage)
     - **Fedaykin Warrior (2nd Tier)** (> 200 damage)
     - **Desert Survivor (3rd Tier)** (> 100 damage)
     - **Initiate** (<= 100 damage)

---

## 📁 Modular Architecture (`src/components/`)

```
src/
├── data/
│   └── gameData.js             # Scenarios, anime questions, initial stats, roles
├── components/
│   ├── BackgroundEffect.jsx    # Dune desert ambient glow & noise styling
│   ├── Header.jsx              # Navigation header with step status & stat bar
│   ├── StatBar.jsx             # Reusable individual stat pill
│   ├── StatPanel.jsx           # Global 6-stat attribute monitor
│   ├── IntroScreen.jsx         # Opening orientation screen
│   ├── GrindingScreen.jsx      # Scenario choices card & progress
│   ├── StatOverlay.jsx         # Decisions logged animation overlay
│   ├── RoleRevealScreen.jsx    # Fremen Vanguard / Mentat / Harkonnen judgment
│   ├── TrialScreen.jsx         # Boss combat arena with HP & anime trivia
│   ├── GameOverScreen.jsx      # Defeat screen with retry button
│   ├── SummaryScreen.jsx       # Victory trophy & rank breakdown
│   ├── Game.jsx                # Main game orchestrator & state machine
│   └── index.js                # Centralized export barrel
├── App.jsx                     # Root application wrapper
├── main.jsx                    # Vite React entry point
└── index.css                   # Tailwind directives & Dune theme utilities
```

