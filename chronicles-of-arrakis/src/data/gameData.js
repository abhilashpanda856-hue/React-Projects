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
    title: "The Samosa Gambit",
    description: "You are at the university canteen. There is exactly one fresh samosa left. You and a formidable senior reach for it at the exact same time.",
    choices: [
      { text: "Challenge them to a 1-minute blitz chess match to determine the true owner.", stats: { int: 15, atk: 15, friendship: 5 } },
      { text: "Surrender it immediately, call them 'Bhaiya', and secure a powerful future ally.", stats: { friendship: 25, def: 10 } },
      { text: "Snatch it instantly and use a secret escape route back to Section O.", stats: { arrogance: 25, stamina: -10 } },
      { text: "Propose splitting it in half to maintain perfect universal equilibrium.", stats: { friendship: 15, int: 15 } },
      { text: "Stare at it intensely without breaking eye contact until they get uncomfortable and walk away.", stats: { stamina: 20, arrogance: 10 } }
    ]
  },
  {
    id: 2,
    title: "The Basic Electronics Meltdown",
    description: "Your Basic Electronics lab breadboard looks like a spaghetti monster. Suddenly, your LED starts smoking, and the strict professor is walking over.",
    choices: [
      { text: "Unplug everything, take a deep breath, and calmly trace the logic gates from scratch.", stats: { int: 25, stamina: 10 } },
      { text: "Confidently tell the professor it's a feature, and the LED is emitting 'invisible infrared light.'", stats: { arrogance: 25, int: -10 } },
      { text: "Ask your lab partner for a quick swap while distracting the professor with a theoretical question.", stats: { friendship: 20, atk: 10 } },
      { text: "Accept defeat, write down the error in your observation record, and ask for a new LED.", stats: { def: 20, stamina: 10 } },
      { text: "Blame the university's faulty jumper wires loud enough for the whole lab to hear.", stats: { arrogance: 20, friendship: -15 } }
    ]
  },
  {
    id: 3,
    title: "The Hardware Bottleneck",
    description: "You are trying to compile a massive AIML project, but your laptop has an Intel i3 processor and sounds like a jet engine preparing for takeoff.",
    choices: [
      { text: "Write the macro-level architecture out on paper and let your brain compile it instead.", stats: { int: 25, def: 10 } },
      { text: "Borrow a gaming laptop from a friend, offering them a week of free canteen snacks as tribute.", stats: { friendship: 25, stamina: -5 } },
      { text: "Attempt to aggressively overclock the i3. If the motherboard dies, it dies fighting.", stats: { atk: 20, arrogance: 15, stamina: -20 } },
      { text: "Put on some devotional music, close your eyes, and just wait the 6 hours for it to run.", stats: { stamina: 25, int: 5 } },
      { text: "Post a complaint on LinkedIn about how true software engineers don't need good hardware.", stats: { arrogance: 20, int: -5 } }
    ]
  },
  {
    id: 4,
    title: "The Clash Lane Ultimatum",
    description: "It’s 2 AM. Your Mathematics-II exam is tomorrow. Your squad sends an emergency invite: they desperately need a Fighter for one last rank-up push.",
    choices: [
      { text: "Lock in your Fighter, carry the team to victory, and then pull a sleepless all-nighter studying.", stats: { friendship: 20, atk: 15, stamina: -25 } },
      { text: "Decline the invite. The only boss fight you are preparing for tonight is Taylor Series formulas.", stats: { int: 25, def: 15 } },
      { text: "Accept, pick a fragile Mage for the Clash Lane, refuse to elaborate, and throw the game.", stats: { arrogance: 25, friendship: -20 } },
      { text: "Agree to play, but only if the voice chat is strictly used to quiz each other on calculus.", stats: { friendship: 15, int: 20 } },
      { text: "Go straight to sleep. A fully rested tactician is deadlier than a sleep-deprived genius.", stats: { stamina: 30, def: 10 } }
    ]
  },
  {
    id: 5,
    title: "The Solo Leveling Pitch",
    description: "At a hackathon, your teammate confidently pitches an app idea that is literally just a basic calculator. The judges are staring at you.",
    choices: [
      { text: "Take the mic, pivot the pitch entirely, and claim it uses 'AI-driven mathematical prediction.'", stats: { int: 20, atk: 15 } },
      { text: "Support your teammate, but use Tailwind CSS to make the calculator look like a dark-mode sci-fi HUD.", stats: { friendship: 20, def: 15 } },
      { text: "Openly laugh at the idea in front of the mentors to save your own reputation.", stats: { arrogance: 30, friendship: -25 } },
      { text: "Stay completely silent, stand in the back, and look incredibly mysterious.", stats: { stamina: 15, arrogance: 10 } },
      { text: "Admit it's simple, but showcase the flawless, bug-free component architecture behind it.", stats: { def: 20, int: 15 } }
    ]
  },
  {
    id: 6,
    title: "The Section O Synergy",
    description: "A surprise extra class is scheduled for Sunday morning, but you already organized a massive Honor of Kings tournament in the hostel.",
    choices: [
      { text: "Cancel the tournament and sit in the front row of the class to take perfect notes.", stats: { int: 20, def: 10, stamina: -5 } },
      { text: "Sneak your phone into class and lock in as a Clash Lane Fighter under the desk.", stats: { atk: 15, arrogance: 20, stamina: -15 } },
      { text: "Convince the entire section to collectively skip so the professor has to cancel it.", stats: { friendship: 30, arrogance: 15 } },
      { text: "Skip class, win the tournament, and barter your prize pool for someone else's notes later.", stats: { int: 15, atk: 10, friendship: 10 } },
      { text: "Play a Mage, cast your ultimate, and 'accidentally' disconnect the hostel router to delay the tournament.", stats: { arrogance: 25, int: 10, friendship: -20 } }
    ]
  }
];

export const TRIAL_QUESTIONS = [
  {
    id: 1,
    flavor: "Shai-Hulud roars, demanding to know the true name of the ancient order!",
    question: "What does the acronym IEEE actually stand for?",
    options: [
      "Institute of Electrical and Electronics Engineers", 
      "Institution of Extremely Exhausted Engineers", 
      "Infinite Engineering Educational Exams", 
      "Intergalactic Electrical Empire"
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    flavor: "The Maker spits a blast of wireless static at your vanguard!",
    question: "Which famous IEEE standard is the reason you can seamlessly scroll reels in the hostel instead of studying?",
    options: [
      "IEEE 404 (Not Found)", 
      "IEEE 3.1415", 
      "IEEE 802.11 (Wi-Fi)", 
      "IEEE 8080"
    ],
    correctAnswer: 2
  },
  {
    id: 3,
    flavor: "The desert sands shift, revealing ancient historical rivalries!",
    question: "IEEE was formed in 1963 by merging two massive groups. Whose legendary rivalry represents the roots of these electrical foundations?",
    options: [
      "Batman vs The Joker", 
      "Thomas Edison (DC) vs Nikola Tesla (AC)", 
      "React vs Angular", 
      "Sung Jinwoo vs The Architect"
    ],
    correctAnswer: 1
  },
  {
    id: 4,
    flavor: "The Boss forces your brain to calculate floating-point decimals under immense pressure!",
    question: "Which IEEE standard dictates how computers process floating-point math (and is the reason why 0.1 + 0.2 = 0.30000000000000004 in JavaScript)?",
    options: [
      "IEEE 999", 
      "IEEE 420", 
      "IEEE 754", 
      "IEEE 0.0001"
    ],
    correctAnswer: 2
  },
  {
    id: 5,
    flavor: "A fiery tremor erupts beneath your feet, threatening your hardware!",
    question: "IEEE 1394 is a high-speed data transfer standard, but Apple gave it a much cooler, cinematic name. What is it?",
    options: [
      "DragonGlass", 
      "Thunderbolt", 
      "MagSafe", 
      "FireWire"
    ],
    correctAnswer: 3
  },
  {
    id: 6,
    flavor: "The beast tests your knowledge of the local university tribes!",
    question: "What is the actual primary purpose of an IEEE Student Branch on campus?",
    options: [
      "To secretly mine cryptocurrency on the lab computers.", 
      "To bridge the gap between theoretical classes and real industry tech skills.", 
      "To provide a highly official excuse to miss classes.", 
      "To host MOBA rank-pushing LAN parties disguised as 'networking events'."
    ],
    correctAnswer: 1
  },
  {
    id: 7,
    flavor: "A glowing, ancient emblem appears in the raging dust storm!",
    question: "Look closely at the official IEEE logo. What two historical scientific symbols are combined in its design?",
    options: [
      "A right-hand magnetic field rule and Benjamin Franklin's kite", 
      "A compass and a protractor", 
      "A microchip and a global map", 
      "A slice of pizza and an energy drink"
    ],
    correctAnswer: 0
  },
  {
    id: 8,
    flavor: "The worm attempts to permanently disconnect you from the global mainframe!",
    question: "Before Wi-Fi ruled the world, there was the wire. What networking standard is defined by IEEE 802.3?",
    options: [
      "Bluetooth", 
      "Fiber Optics", 
      "Ethernet (LAN cables)", 
      "Dial-up Internet (the screeching sound)"
    ],
    correctAnswer: 2
  },
  {
    id: 9,
    flavor: "The Boss demands you search the ancient archives for forbidden knowledge!",
    question: "What is the name of IEEE's massive digital library that holds over 5 million technical documents?",
    options: [
      "The Jikan Anime Tracker API", 
      "Stack Overflow", 
      "IEEE Xplore", 
      "The Spectral Detective Database"
    ],
    correctAnswer: 2
  },
  {
    id: 10,
    flavor: "Shai-Hulud unleashes its final, ultimate query about the size of the empire!",
    question: "Just how massive is the global IEEE community that you are being oriented for today?",
    options: [
      "Just a few professors in a basement somewhere.", 
      "Exactly 100 people who guard the ocean's internet cables.", 
      "Everyone who has ever successfully fixed a broken TV remote.", 
      "Over 400,000 members across more than 160 countries."
    ],
    correctAnswer: 3
  },
  {
    id: 11,
    flavor: "The beast expands its domain, trapping you in a barrier of code!",
    question: "Just like a Domain Expansion in Jujutsu Kaisen, IEEE hosts a massive 24-hour global programming competition to trap coders. What is it called?",
    options: [
      "IEEE Infinite Void", 
      "IEEE Xtreme", 
      "The Big Code Protocol", 
      "Hackathon: Unlimited"
    ],
    correctAnswer: 1
  },
  {
    id: 12,
    flavor: "A rhythmic vibration echoes from the sand, syncing with your devices!",
    question: "Which IEEE standard governs the Bluetooth technology connecting your wireless earbuds?",
    options: [
      "IEEE 802.15.1", 
      "IEEE 1080p", 
      "IEEE 404.2", 
      "IEEE 777"
    ],
    correctAnswer: 0
  },
  {
    id: 13,
    flavor: "The Maker demands a tribute of ancient scrolls!",
    question: "What is the name of the flagship magazine published by IEEE to keep members updated on the latest tech?",
    options: [
      "The Daily Engineer", 
      "IEEE Spectrum", 
      "Wired: Arrakis Edition", 
      "The Silicon Chronicle"
    ],
    correctAnswer: 1
  },
  {
    id: 14,
    flavor: "The Sandworm bows, acknowledging your final stand!",
    question: "As an incoming junior, what is the best way to survive the engineering desert with IEEE?",
    options: [
      "Memorize every single textbook in the library.", 
      "Never sleep, only code.", 
      "Join the Student Branch, build a strong network, and learn by doing.", 
      "Write a C program to hack the university grading system."
    ],
    correctAnswer: 2
  }
];

export const ROLE_DEFINITIONS = {
  HARKONNEN: {
    name: "House Harkonnen",
    title: "The Ruthless Conqueror",
    description: "You stepped on others to climb the ranks. Raw violent force is yours, but fear breeds treachery.",
    lore: "High raw attack fueled by arrogance, but subject to internal sabotage and betrayal on failure.",
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
