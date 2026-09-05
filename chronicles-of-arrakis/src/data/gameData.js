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
    title: "The 11:59 PM PDF Drop",
    description: "A senior drops a massive, unexplained 40-page PDF into the official group chat and simply says, 'Read this for tomorrow.'",
    choices: [
      { text: "Organize a quick Google Meet with Section O to divide and conquer the reading.", stats: { friendship: 15, stamina: 5, def: 5 } },
      { text: "Ignore the chat, read the entire PDF alone at 2x speed, and refuse to elaborate.", stats: { int: 20, stamina: -10, atk: 5 } },
      { text: "Reply 'Thanks Bhaiya!' immediately to look good, then go to sleep without opening it.", stats: { arrogance: 20, int: -10 } },
      { text: "Feed the PDF to an AI summarizer and trade the summary to classmates for canteen snacks.", stats: { int: 10, arrogance: 10, friendship: 5 } },
      { text: "Reply with a highly inappropriate meme by accident, delete it, and stress about it all night.", stats: { stamina: -15, friendship: 10 } }
    ]
  },
  {
    id: 2,
    title: "The Basic Electronics Nightmare",
    description: "Your Basic Electronics lab circuit is dead. The breadboard looks like a spaghetti monster, and the professor is walking over.",
    choices: [
      { text: "Unplug everything, take a deep breath, do a quick micro-meditation, and start over.", stats: { stamina: 20, int: 5 } },
      { text: "Calmly trace the logic gates from scratch to find the exact loose jumper wire.", stats: { int: 20, atk: 15 } },
      { text: "Panic and quickly swap your breadboard with the neighboring bench when they aren't looking.", stats: { arrogance: 25, friendship: -20 } },
      { text: "Ask your lab partner to double-check the connections while you verify the datasheet.", stats: { friendship: 15, def: 10 } },
      { text: "Confidently tell the professor the LED is actually emitting 'invisible infrared light'.", stats: { arrogance: 15, int: -5 } }
    ]
  },
  {
    id: 3,
    title: "The Hardware Struggle",
    description: "You need to run a heavy machine learning simulator, but your laptop has an Intel i3 processor and sounds like a jet engine taking off.",
    choices: [
      { text: "Complain loudly that the university should provide better hardware for AIML students.", stats: { arrogance: 20, def: -5 } },
      { text: "Form a study group with someone who has a gaming laptop and bring them snacks as tribute.", stats: { friendship: 20, stamina: 5 } },
      { text: "Optimize your code to run with absolute minimal resources. Software > Hardware.", stats: { int: 25, atk: 15 } },
      { text: "Try to overclock the i3 processor anyway. If the laptop dies, it dies with honor.", stats: { int: 10, arrogance: 10, stamina: -15 } },
      { text: "Shut it down, put on some devotional music, and write the algorithm out on paper instead.", stats: { stamina: 15, int: 10 } }
    ]
  },
  {
    id: 4,
    title: "The Midnight Push",
    description: "It’s 2 AM before a minor exam. Your squad sends an emergency invite: they need you for one last Clash Lane push to reach the next rank.",
    choices: [
      { text: "Decline. The only ranking you care about right now is your CGPA.", stats: { int: 20, stamina: 10 } },
      { text: "Lock in as a Fighter, carry the team to victory, then study with zero sleep.", stats: { friendship: 15, atk: 15, stamina: -20 } },
      { text: "Tell them you'll play, but only if everyone quizzes each other on math formulas over voice chat.", stats: { friendship: 15, int: 15 } },
      { text: "Accept, intentionally pick a terrible hero, throw the game quickly, and go back to studying.", stats: { arrogance: 20, friendship: -15 } },
      { text: "Go to sleep. A true tactician knows that resting is better than tilting in a MOBA.", stats: { stamina: 25, def: 10 } }
    ]
  },
  {
    id: 5,
    title: "The Hackathon Pitch",
    description: "Your team is pitching an app at a technical event. The judges ask a brutal question about a massive bug they found in your code.",
    choices: [
      { text: "Analyze the bug on the spot and whiteboard a patch in front of them.", stats: { int: 25, atk: 20 } },
      { text: "Interrupt the judge, aggressively explaining why it’s actually a 'feature,' not a bug.", stats: { arrogance: 25, int: -10 } },
      { text: "Step forward and smoothly take the blame, protecting your junior teammates.", stats: { friendship: 25, def: 15 } },
      { text: "Let your teammate answer, but use hand signals from behind the judges to guide them.", stats: { friendship: 15, int: 10, stamina: -5 } },
      { text: "Subtly point out that the other team's project didn't even compile.", stats: { arrogance: 15, friendship: -10 } }
    ]
  },
  {
    id: 6,
    title: "The Library Showdown",
    description: "The library only has one copy of the recommended textbook left. You and another student reach for it at the exact same time.",
    choices: [
      { text: "Snatch it out of their hand, stating your curriculum is obviously more important.", stats: { arrogance: 25, friendship: -15 } },
      { text: "Suggest scanning the important chapters together so you both get the material.", stats: { friendship: 20, stamina: 5 } },
      { text: "Challenge them to a quick 3-minute blitz chess match on your phone. Winner takes the book.", stats: { int: 15, atk: 10, friendship: 5 } },
      { text: "Let them have it. You already memorized the syllabus from YouTube tutorials anyway.", stats: { int: 20, def: 10 } },
      { text: "Agree to study together, but secretly plan to just listen to EDM and let them do the reading.", stats: { arrogance: 15, stamina: 10 } }
    ]
  },
  {
    id: 7,
    title: "The Proxy Dilemma",
    description: "You woke up late. You need someone to give your attendance proxy in a strict professor's class.",
    choices: [
      { text: "Message the quiet kid who always sits in the front row and promise them a favor.", stats: { int: 10, friendship: 10 } },
      { text: "Accept your fate, skip the class, and use the time to build a personal web project instead.", stats: { int: 20, atk: 10, stamina: 5 } },
      { text: "Demand that your roommate does it, even though their voice sounds completely different.", stats: { arrogance: 20, int: -5 } },
      { text: "Rush to class anyway, sprint through the corridors, and sneak in through the back door.", stats: { stamina: -10, def: 15 } },
      { text: "Coordinate a massive distraction with 5 friends so you can all slip in unnoticed.", stats: { friendship: 25, atk: 5 } }
    ]
  },
  {
    id: 8,
    title: "The Unbalanced Group Project",
    description: "It's the final week of a group project. Two members have contributed absolutely nothing to the codebase.",
    choices: [
      { text: "Host a chill coding session with pizza to motivate them to write at least some documentation.", stats: { friendship: 20, stamina: -5 } },
      { text: "Delete their names from the final slide deck right before the presentation.", stats: { arrogance: 25, friendship: -20 } },
      { text: "Isolate yourself, rewrite the entire architecture overnight, and carry the team.", stats: { int: 25, atk: 20, stamina: -20 } },
      { text: "Assign them non-coding tasks like designing the UI or making the presentation look pretty.", stats: { int: 15, friendship: 10 } },
      { text: "Do nothing. Let the project fail to teach them a lesson about the real world.", stats: { arrogance: 15, int: -15 } }
    ]
  },
  {
    id: 9,
    title: "The Society Recruitment",
    description: "You are attending an orientation for a major technical society (like IEEE!). A senior asks why you want to join.",
    choices: [
      { text: "To meet brilliant seniors, collaborate on open-source, and grow together.", stats: { friendship: 25, def: 10 } },
      { text: "To gain access to the technical resources so I can build my solo startup faster.", stats: { int: 20, atk: 10 } },
      { text: "Because I'm already better at coding than half the current members.", stats: { arrogance: 30, friendship: -15 } },
      { text: "Honestly? I heard you guys have the best post-event food.", stats: { stamina: 15, friendship: 10 } },
      { text: "To network, optimize my resume, and understand the macro-level architecture of tech events.", stats: { int: 15, def: 15 } }
    ]
  },
  {
    id: 10,
    title: "The End-Semester Exam",
    description: "You flip over the question paper. Question 1 is completely out of syllabus and worth 20 marks.",
    choices: [
      { text: "Write an extremely aggressive note to the examiner on the first page.", stats: { arrogance: 25, int: -10 } },
      { text: "Derive the closest possible formula from first principles and attempt a partial solution.", stats: { int: 25, atk: 15 } },
      { text: "Make eye contact with your friends across the hall and share a collective look of despair.", stats: { friendship: 15, stamina: 5 } },
      { text: "Skip it immediately. Perfectly optimize your time for the remaining 80 marks.", stats: { int: 20, def: 20 } },
      { text: "Write out the lyrics to an anime opening theme and hope they give you pity marks.", stats: { arrogance: 10, stamina: -5, friendship: 5 } }
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
    flavor: "The Boss questions your technical allegiance and macro-level understanding!",
    question: "Despite having 'Electrical' in the name, IEEE represents many modern fields. Which of these is currently a massive part of IEEE?",
    options: [
      "Culinary Arts and Hospitality",
      "Astrological Charting",
      "Computer Science and Artificial Intelligence",
      "Advanced Procrastination Theory"
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
