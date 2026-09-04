// --- GAME DATA ---

export const INITIAL_STATS = {
  atk: 10,
  def: 10,
  stamina: 50,
  friendship: 0,
  int: 0,
  arrogance: 0,
};

export const GRINDING_SCENARIOS = [
  {
    id: 1,
    title: "The 11:59 PM Assignment Panic",
    description: "The professor drops a massive assignment due in two days. The class group chat is in full panic mode.",
    choices: [
      { text: "Host an emergency hostel study room and split problems.", stats: { friendship: 15, def: 5, stamina: 5 } },
      { text: "Put on noise-canceling headphones and grind alone until 4 AM.", stats: { int: 20, atk: 15, stamina: -10 } },
      { text: "Wait for the group chat to drop answers, copy verbatim, and criticize handwriting.", stats: { arrogance: 20, friendship: -10 } }
    ]
  },
  {
    id: 2,
    title: "The Orientation Hackathon Team-Up",
    description: "Registration for a local hackathon is closing in 1 hour. You need a team.",
    choices: [
      { text: "Pair with curious freshmen who know zero coding and guide them patiently.", stats: { friendship: 20, def: 10 } },
      { text: "Register as a solo participant to avoid dead weight.", stats: { int: 25, atk: 10, def: -5 } },
      { text: "Force into a senior's team, skip meetings, and show up only for photos.", stats: { arrogance: 25, int: -10 } }
    ]
  },
  {
    id: 3,
    title: "The Lab Practical Disaster",
    description: "During a critical hardware lab, the main circuit board shorts out.",
    choices: [
      { text: "Share equipment calibration readings with struggling lab-bench neighbors.", stats: { friendship: 15, stamina: 10 } },
      { text: "Re-derive the physical formula from scratch to verify the anomaly.", stats: { int: 20, atk: 15 } },
      { text: "Blame the lab assistant loudly when your circuit shorts out.", stats: { arrogance: 20, def: -5 } }
    ]
  },
  {
    id: 4,
    title: "Mid-Semester Cram Session",
    description: "It's the week of mid-sems. You are running on 2 hours of sleep and caffeine.",
    choices: [
      { text: "Distribute organized handwritten summary sheets across the entire section.", stats: { friendship: 20, stamina: 5 } },
      { text: "Lock the hostel door, optimize sleep cycles to 20-minute intervals, and solve past papers.", stats: { int: 20, atk: 20, stamina: -10 } },
      { text: "Spread fake exam rumors in hallway corridors to psyche out peers.", stats: { arrogance: 25, friendship: -15 } }
    ]
  },
  {
    id: 5,
    title: "The Final Tech Showcase",
    description: "It's time to present your final semester project to the panel.",
    choices: [
      { text: "Present the project together, giving every single member equal speaking time.", stats: { friendship: 25, def: 15 } },
      { text: "Deliver a lightning-fast technical deep dive demonstrating custom architecture.", stats: { int: 25, atk: 25 } },
      { text: "Interrupt team members during questions to take credit for the entire codebase.", stats: { arrogance: 30, friendship: -20 } }
    ]
  }
];

export const TRIAL_QUESTIONS = [
  {
    id: 1,
    universe: "Jujutsu Kaisen",
    flavor: "The Boss casts an overwhelming Domain Expansion! (Jujutsu Kaisen)",
    question: "What is Satoru Gojo's Domain Expansion called?",
    options: ["Malevolent Shrine", "Infinite Void", "Chimera Shadow Garden", "Coffin of the Iron Mountain"],
    correctAnswer: 1
  },
  {
    id: 2,
    universe: "Solo Leveling",
    flavor: "Shadows emerge from the desert floor! (Solo Leveling)",
    question: "What was Sung Jinwoo's hunter rank before the Double Dungeon awakening?",
    options: ["E-Rank", "D-Rank", "B-Rank", "S-Rank"],
    correctAnswer: 0
  },
  {
    id: 3,
    universe: "Death Note",
    flavor: "A shadowy Shinigami descends from the sky! (Death Note)",
    question: "Which Shinigami dropped their Death Note into the human world out of sheer boredom?",
    options: ["Rem", "Gelus", "Ryuk", "Sidoh"],
    correctAnswer: 2
  },
  {
    id: 4,
    universe: "Attack on Titan",
    flavor: "Steam explodes from a 60-meter titan barrier! (Attack on Titan)",
    question: "Who was the original Colossal Titan shifter who breached Wall Maria?",
    options: ["Reiner Braun", "Bertholdt Hoover", "Armin Arlert", "Annie Leonhart"],
    correctAnswer: 1
  },
  {
    id: 5,
    universe: "Naruto",
    flavor: "The Boss prepares a final supreme technique! (Naruto)",
    question: "Which legendary ninja served as the Fourth Hokage of the Hidden Leaf?",
    options: ["Minato Namikaze", "Tobirama Senju", "Jiraiya", "Kakashi Hatake"],
    correctAnswer: 0
  }
];

export const ROLE_DEFINITIONS = {
  HARKONNEN: {
    name: "House Harkonnen",
    title: "The Betrayer",
    description: "You stepped on others to climb the ranks. You stole credit and spread lies. But the desert does not respect false kings.",
    lore: "A massive Sandworm senses your overwhelming Arrogance. It bursts from the sands and swallows you whole before the trial even begins.",
  },
  FREMEN: {
    name: "The Fremen Tribe",
    title: "Desert Vanguard",
    description: "You did not walk the desert alone. You built a tribe. The friends you made are now your vanguard. Stand together, or fall together.",
  },
  MENTAT: {
    name: "The Mentat",
    title: "Shadow Monarch",
    description: "You rejected the pack. You are the shadow monarch of your own destiny. Your mind is a weapon, but you have no shield. One mistake, and you fall.",
  }
};
