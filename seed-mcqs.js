const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query'],
})

const mcqData = {
  class10: {
    general: [
      {
        question: "What is the smallest unit of life?",
        optionA: "Cell",
        optionB: "Tissue",
        optionC: "Organ",
        optionD: "Atom",
        correctOption: 1
      },
      {
        question: "Which of the following is NOT a type of plant?",
        optionA: "Rose",
        optionB: "Cactus",
        optionC: "Fern",
        optionD: "All are plants",
        correctOption: 4
      },
      {
        question: "What is the process by which plants make food?",
        optionA: "Respiration",
        optionB: "Digestion",
        optionC: "Photosynthesis",
        optionD: "Transpiration",
        correctOption: 3
      },
      {
        question: "Which part of the plant absorbs water?",
        optionA: "Stem",
        optionB: "Leaves",
        optionC: "Roots",
        optionD: "All of the above",
        correctOption: 4
      },
      {
        question: "What is the male gamete in plants called?",
        optionA: "Egg",
        optionB: "Sperm",
        optionC: "Pollen",
        optionD: "Ovule",
        correctOption: 2
      }
    ],
    science: [
      {
        question: "What is the chemical formula of water?",
        optionA: "H2O",
        optionB: "CO2",
        optionC: "NaCl",
        optionD: "CH4",
        correctOption: 1
      },
      {
        question: "Which element has the atomic number 6?",
        optionA: "Carbon",
        optionB: "Oxygen",
        optionC: "Nitrogen",
        optionD: "Hydrogen",
        correctOption: 1
      },
      {
        question: "What is the pH value of pure water?",
        optionA: "5",
        optionB: "6",
        optionC: "7",
        optionD: "8",
        correctOption: 3
      },
      {
        question: "Which of the following is a noble gas?",
        optionA: "Oxygen",
        optionB: "Nitrogen",
        optionC: "Argon",
        optionD: "All of the above",
        correctOption: 3
      },
      {
        question: "What type of bond is formed between sodium and chlorine?",
        optionA: "Ionic",
        optionB: "Covalent",
        optionC: "Metallic",
        optionD: "Hydrogen",
        correctOption: 1
      }
    ]
  },
  class11: {
    physics: [
      {
        question: "What is Newton's First Law of Motion?",
        optionA: "Force equals mass times acceleration",
        optionB: "Every action has an equal and opposite reaction",
        optionC: "Energy cannot be created or destroyed",
        optionD: "Objects at rest stay at rest",
        correctOption: 4
      },
      {
        question: "What is the SI unit of force?",
        optionA: "Newton (N)",
        optionB: "Joule (J)",
        optionC: "Watt (W)",
        optionD: "Pascal (Pa)",
        correctOption: 1
      },
      {
        question: "What is the formula for kinetic energy?",
        optionA: "KE = 1/2 mv²",
        optionB: "KE = mgh",
        optionC: "Both A and B",
        optionD: "Neither A nor B",
        correctOption: 1
      },
      {
        question: "What is the acceleration due to gravity on Earth?",
        optionA: "9.8 m/s²",
        optionB: "10.0 m/s²",
        optionC: "8.9 m/s²",
        optionD: "10.8 m/s²",
        correctOption: 1
      },
      {
        question: "Which type of wave is sound?",
        optionA: "Longitudinal",
        optionB: "Transverse",
        optionC: "Electromagnetic",
        optionD: "Both A and B",
        correctOption: 1
      }
    ],
    chemistry: [
      {
        question: "What is the molecular formula of glucose?",
        optionA: "C6H12O6",
        optionB: "C12H22O11",
        optionC: "C6H12O12",
        optionD: "C12H22O6",
        correctOption: 1
      },
      {
        question: "What type of reaction is 2H2 + O2 → 2H2O?",
        optionA: "Combination",
        optionB: "Decomposition",
        optionC: "Displacement",
        optionD: "Synthesis",
        correctOption: 1
      },
      {
        question: "What is Avogadro's number?",
        optionA: "6.022 × 10²³",
        optionB: "6.022 × 10²²",
        optionC: "6.022 × 10²³",
        optionD: "6.022 × 10²³",
        correctOption: 1
      },
      {
        question: "Which of the following is a strong acid?",
        optionA: "Acetic acid",
        optionB: "Hydrochloric acid",
        optionC: "Carbonic acid",
        optionD: "Sulfuric acid",
        correctOption: 4
      },
      {
        question: "What is the oxidation state of oxygen in most compounds?",
        optionA: "-1",
        optionB: "-2",
        optionC: "-3",
        optionD: "-4",
        correctOption: 2
      }
    ],
    commerce: [
      {
        question: "What is the main objective of accounting?",
        optionA: "To maximize profits",
        optionB: "To record financial transactions",
        optionC: "To minimize taxes",
        optionD: "To maximize sales",
        correctOption: 2
      },
      {
        question: "What is the accounting equation?",
        optionA: "Assets = Liabilities + Equity",
        optionB: "Assets + Liabilities = Equity",
        optionC: "Assets - Liabilities = Equity",
        optionD: "Revenue - Expenses = Profit",
        correctOption: 1
      },
      {
        question: "What is depreciation?",
        optionA: "Increase in asset value over time",
        optionB: "Decrease in asset value over time",
        optionC: "Allocating cost of asset over its useful life",
        optionD: "Recording purchase of asset",
        correctOption: 3
      },
      {
        question: "Which is NOT a type of business organization?",
        optionA: "Sole proprietorship",
        optionB: "Partnership",
        optionC: "Corporation",
        optionD: "All are business organizations",
        correctOption: 4
      },
      {
        question: "What is a debit in accounting?",
        optionA: "Left side of a ledger",
        optionB: "Right side of a ledger",
        optionC: "Increase in assets",
        optionD: "Decrease in liabilities",
        correctOption: 1
      }
    ],
    botany: [
      {
        question: "What is photosynthesis?",
        optionA: "Process by which plants make food",
        optionB: "Process by which plants release energy",
        optionC: "Process by which plants absorb water",
        optionD: "Process by which plants grow",
        correctOption: 1
      },
      {
        question: "What is the function of chloroplast?",
        optionA: "To store water",
        optionB: "To conduct photosynthesis",
        optionC: "To protect the plant cell",
        optionD: "To produce oxygen",
        correctOption: 2
      },
      {
        question: "What is the role of stomata in leaves?",
        optionA: "To absorb sunlight",
        optionB: "To allow gas exchange",
        optionC: "To transport water",
        optionD: "To protect the leaf",
        correctOption: 2
      },
      {
        question: "What type of plant tissue is responsible for growth?",
        optionA: "Meristematic tissue",
        optionB: "Ground tissue",
        optionC: "Vascular tissue",
        optionD: "Dermal tissue",
        correctOption: 1
      },
      {
        question: "What is the male reproductive organ in flowering plants?",
        optionA: "Stamen",
        optionB: "Pistil",
        optionC: "Sepal",
        optionD: "Ovary",
        correctOption: 1
      }
    ],
    computerApp: [
      {
        question: "What is a computer program?",
        optionA: "A set of instructions for a computer",
        optionB: "Hardware component",
        optionC: "Operating system",
        optionD: "Computer application",
        correctOption: 1
      },
      {
        question: "What is CPU?",
        optionA: "Central Processing Unit",
        optionB: "Computer Processing Unit",
        optionC: "Central Program Unit",
        optionD: "Control Panel Unit",
        correctOption: 1
      },
      {
        question: "What is RAM?",
        optionA: "Random Access Memory",
        optionB: "Read Access Memory",
        optionC: "Random Application Memory",
        optionD: "Read Application Memory",
        correctOption: 1
      },
      {
        question: "What is the function of an operating system?",
        optionA: "To create documents",
        optionB: "To manage hardware resources",
        optionC: "To browse the internet",
        optionD: "All of the above",
        correctOption: 2
      },
      {
        question: "What is a compiler?",
        optionA: "Converts high-level code to machine code",
        optionB: "Executes machine code",
        optionC: "Debugs programs",
        optionD: "Creates user interface",
        correctOption: 1
      }
    ]
  },
  class12: {
    physics: [
      {
        question: "What is the formula for Coulomb's Law?",
        optionA: "F = k * q1 * q2 / r²",
        optionB: "F = k * q / r²",
        optionC: "F = q1 * q2 / k * r²",
        optionD: "F = m1 * m2 / r²",
        correctOption: 1
      },
      {
        question: "What is the unit of electric charge?",
        optionA: "Volt (V)",
        optionB: "Ampere (A)",
        optionC: "Coulomb (C)",
        optionD: "Ohm (Ω)",
        correctOption: 3
      },
      {
        question: "What is Ohm's Law?",
        optionA: "V = IR",
        optionB: "I = V/R",
        optionC: "R = V/I",
        optionD: "P = VI",
        correctOption: 1
      },
      {
        question: "What type of circuit has components in series?",
        optionA: "Same current",
        optionB: "Same voltage",
        optionC: "Different resistance",
        optionD: "All of the above",
        correctOption: 1
      },
      {
        question: "What is a capacitor?",
        optionA: "Device that stores electrical energy",
        optionB: "Resistor",
        optionC: "Inductor",
        optionD: "Diode",
        correctOption: 1
      }
    ],
    chemistry: [
      {
        question: "What is the process of conversion of liquid to gas?",
        optionA: "Condensation",
        optionB: "Evaporation",
        optionC: "Sublimation",
        optionD: "Deposition",
        correctOption: 1
      },
      {
        question: "What is the chemical formula of methane?",
        optionA: "CH4",
        optionB: "C2H6",
        optionC: "CO2",
        optionD: "H2O",
        correctOption: 1
      },
      {
        question: "What is the pH of a solution with H+ concentration of 10^-4 M?",
        optionA: "1",
        optionB: "2",
        optionC: "3",
        optionD: "4",
        correctOption: 4
      },
      {
        question: "Which of the following is a hydrocarbon?",
        optionA: "C2H5OH (ethanol)",
        optionB: "CH3COOH (acetic acid)",
        optionC: "H2O (water)",
        optionD: "CO2 (carbon dioxide)",
        correctOption: 2
      },
      {
        question: "What is the difference between ionic and covalent bonds?",
        optionA: "Ionic involves sharing electrons",
        optionB: "Covalent involves sharing electrons",
        optionC: "Both involve transferring electrons",
        optionD: "No difference",
        correctOption: 2
      }
    ],
    commerce: [
      {
        question: "What is the meaning of 'double entry' in accounting?",
        optionA: "Recording transaction twice",
        optionB: "Each transaction affects two accounts",
        optionC: "Recording only debit entries",
        optionD: "Recording only credit entries",
        correctOption: 2
      },
      {
        question: "What is a balance sheet?",
        optionA: "Statement of assets",
        optionB: "Statement of liabilities",
        optionC: "Statement of assets and liabilities",
        optionD: "Financial position of a business",
        correctOption: 4
      },
      {
        question: "What is the trial balance?",
        optionA: "Statement of all accounts and their balances",
        optionB: "Check if debits equal credits",
        optionC: "Financial statement",
        optionD: "Ledger summary",
        correctOption: 1
      },
      {
        question: "What is goodwill?",
        optionA: "Intangible asset representing business reputation",
        optionB: "Physical asset",
        optionC: "Current liability",
        optionD: "Owners' equity",
        correctOption: 1
      },
      {
        question: "What is the accounting cycle?",
        optionA: "The period between financial statements",
        optionB: "The time to complete all transactions",
        optionC: "The year-end closing process",
        optionD: "All of the above",
        correctOption: 4
      }
    ],
    biology: [
      {
        question: "What is the powerhouse of the cell?",
        optionA: "Nucleus",
        optionB: "Mitochondria",
        optionC: "Ribosome",
        optionD: "Golgi apparatus",
        correctOption: 2
      },
      {
        question: "What is DNA?",
        optionA: "Deoxyribonucleic Acid",
        optionB: "Ribonucleic Acid",
        optionC: "Amino Acid",
        optionD: "Fatty Acid",
        correctOption: 1
      },
      {
        question: "What is mitosis?",
        optionA: "Cell division that produces identical daughter cells",
        optionB: "Cell division that produces genetically different cells",
        optionC: "Formation of gametes",
        optionD: "Cell death",
        correctOption: 1
      },
      {
        question: "What is the function of the cell membrane?",
        optionA: "To store DNA",
        optionB: "To produce energy",
        optionC: "To control what enters and exits the cell",
        optionD: "To provide structure to the cell",
        correctOption: 3
      },
      {
        question: "What is meiosis?",
        optionA: "Cell division producing somatic cells",
        optionB: "Cell division producing gametes",
        optionC: "DNA replication",
        optionD: "Protein synthesis",
        correctOption: 2
      }
    ],
    computerApp: [
      {
        question: "What is data type?",
        optionA: "A classification of data",
        optionB: "A specific value assigned to a variable",
        optionC: "A collection of related data",
        optionD: "None of the above",
        correctOption: 1
      },
      {
        question: "What is a loop in programming?",
        optionA: "A sequence of repeated instructions",
        optionB: "A conditional statement",
        optionC: "A function call",
        optionD: "A variable declaration",
        correctOption: 1
      },
      {
        question: "What is an array?",
        optionA: "A single value",
        optionB: "A collection of values of the same type",
        optionC: "A function that returns values",
        optionD: "A text string",
        correctOption: 2
      },
      {
        question: "What is a database?",
        optionA: "A program that manages data",
        optionB: "A spreadsheet application",
        optionC: "A file system",
        optionD: "All of the above",
        correctOption: 1
      },
      {
        question: "What is SQL?",
        optionA: "Structured Query Language",
        optionB: "Simple Query Language",
        optionC: "Standard Query Language",
        optionD: "Sequential Query Language",
        correctOption: 1
      }
    ]
  },
  languages: {
    tamil: [
      {
        question: "How many letters are in the Tamil alphabet?",
        optionA: "18",
        optionB: "247",
        optionC: "26",
        optionD: "12",
        correctOption: 3
      },
      {
        question: "Which script is used for Tamil?",
        optionA: "Devanagari",
        optionB: "Tamil Script",
        optionC: "Latin Script",
        optionD: "Grantha Script",
        correctOption: 2
      },
      {
        question: "What is the oldest Tamil literary work?",
        optionA: "Tirukkural",
        optionB: "Silappathikaram",
        optionC: "Kural",
        optionD: "Manimekalai",
        correctOption: 2
      },
      {
        question: "Which of these is a Tamil Sangam literature?",
        optionA: "Pattuppattu",
        optionB: "Eight Anthologies",
        optionC: "Ten Idylls",
        optionD: "All of the above",
        correctOption: 4
      },
      {
        question: "What is the meaning of 'Aayiram' in Tamil?",
        optionA: "Evening",
        optionB: "Morning",
        optionC: "Night",
        optionD: "Sunset",
        correctOption: 2
      }
    ],
    english: [
      {
        question: "What is the past tense of 'go'?",
        optionA: "goed",
        optionB: "went",
        optionC: "goes",
        optionD: "gone",
        correctOption: 2
      },
      {
        question: "Which is a noun?",
        optionA: "A word that describes an action",
        optionB: "A word that describes a state",
        optionC: "A word that describes a quality",
        optionD: "A naming word",
        correctOption: 4
      },
      {
        question: "What is a verb?",
        optionA: "A naming word",
        optionB: "An action word",
        optionC: "A describing word",
        optionD: "A connecting word",
        correctOption: 2
      },
      {
        question: "What is the plural of 'child'?",
        optionA: "childs",
        optionB: "childrens",
        optionC: "children",
        optionD: "childes",
        correctOption: 3
      },
      {
        question: "What is an adjective?",
        optionA: "A word that modifies a noun",
        optionB: "A word that shows time",
        optionC: "A word that shows place",
        optionD: "A word that shows manner",
        correctOption: 1
      }
    ]
  }
}

async function seedMCQs() {
  try {
    console.log('=== Seeding MCQ Questions ===\n')

    let totalQuestions = 0

    // Class 10 - General Knowledge
    for (const q of mcqData.class10.general) {
      await prisma.question.create({
        data: {
          ...q,
          class: 10,
          subject: 'General Knowledge',
          stream: 'General',
          videoId: 'class10-general'
        }
      })
      totalQuestions++
    }
    console.log(`✓ Added 5 Class 10 General Knowledge questions`)

    // Class 10 - Science
    for (const q of mcqData.class10.science) {
      await prisma.question.create({
        data: {
          ...q,
          class: 10,
          subject: 'Science',
          stream: 'General',
          videoId: 'class10-science'
        }
      })
      totalQuestions++
    }
    console.log(`✓ Added 5 Class 10 Science questions`)

    // Class 11 - Physics
    for (const q of mcqData.class11.physics) {
      await prisma.question.create({
        data: {
          ...q,
          class: 11,
          subject: 'Physics',
          stream: 'CSC Maths',
          videoId: 'class11-physics-unit2'
        }
      })
      totalQuestions++
    }
    console.log(`✓ Added 5 Class 11 Physics questions`)

    // Class 11 - Chemistry
    for (const q of mcqData.class11.chemistry) {
      await prisma.question.create({
        data: {
          ...q,
          class: 11,
          subject: 'Chemistry',
          stream: 'CSC Maths',
          videoId: 'class11-chemistry'
        }
      })
      totalQuestions++
    }
    console.log(`✓ Added 5 Class 11 Chemistry questions`)

    // Class 11 - Commerce
    for (const q of mcqData.class11.commerce) {
      await prisma.question.create({
        data: {
          ...q,
          class: 11,
          subject: 'Commerce',
          stream: 'Accounts/Commerce',
          videoId: 'class11-commerce'
        }
      })
      totalQuestions++
    }
    console.log(`✓ Added 5 Class 11 Commerce questions`)

    // Class 11 - Botany
    for (const q of mcqData.class11.botany) {
      await prisma.question.create({
        data: {
          ...q,
          class: 11,
          subject: 'Botany',
          stream: 'Bio Maths',
          videoId: 'class11-botany'
        }
      })
      totalQuestions++
    }
    console.log(`✓ Added 5 Class 11 Botany questions`)

    // Class 11 - Computer Application
    for (const q of mcqData.class11.computerApp) {
      await prisma.question.create({
        data: {
          ...q,
          class: 11,
          subject: 'Computer Application',
          stream: 'CSC Maths',
          videoId: 'class11-computerapp'
        }
      })
      totalQuestions++
    }
    console.log(`✓ Added 5 Class 11 Computer Application questions`)

    // Class 12 - Physics
    for (const q of mcqData.class12.physics) {
      await prisma.question.create({
        data: {
          ...q,
          class: 12,
          subject: 'Physics',
          stream: 'CSC Maths',
          videoId: 'class12-physics'
        }
      })
      totalQuestions++
    }
    console.log(`✓ Added 5 Class 12 Physics questions`)

    // Class 12 - Chemistry
    for (const q of mcqData.class12.chemistry) {
      await prisma.question.create({
        data: {
          ...q,
          class: 12,
          subject: 'Chemistry',
          stream: 'CSC Maths',
          videoId: 'class12-chemistry'
        }
      })
      totalQuestions++
    }
    console.log(`✓ Added 5 Class 12 Chemistry questions`)

    // Class 12 - Commerce
    for (const q of mcqData.class12.commerce) {
      await prisma.question.create({
        data: {
          ...q,
          class: 12,
          subject: 'Commerce',
          stream: 'Accounts/Commerce',
          videoId: 'class12-commerce'
        }
      })
      totalQuestions++
    }
    console.log(`✓ Added 5 Class 12 Commerce questions`)

    // Class 12 - Biology
    for (const q of mcqData.class12.biology) {
      await prisma.question.create({
        data: {
          ...q,
          class: 12,
          subject: 'Biology',
          stream: 'Bio Maths',
          videoId: 'class12-biology'
        }
      })
      totalQuestions++
    }
    console.log(`✓ Added 5 Class 12 Biology questions`)

    // Class 12 - Computer Application
    for (const q of mcqData.class12.computerApp) {
      await prisma.question.create({
        data: {
          ...q,
          class: 12,
          subject: 'Computer Application',
          stream: 'CSC Maths',
          videoId: 'class12-computerapp'
        }
      })
      totalQuestions++
    }
    console.log(`✓ Added 5 Class 12 Computer Application questions`)

    // Tamil Language (All Classes)
    for (const q of mcqData.languages.tamil) {
      await prisma.question.create({
        data: {
          ...q,
          class: 10,
          subject: 'Tamil',
          stream: 'General'
        }
      })
      totalQuestions++
    }
    console.log(`✓ Added 5 Tamil questions`)

    // English Language (All Classes)
    for (const q of mcqData.languages.english) {
      await prisma.question.create({
        data: {
          ...q,
          class: 10,
          subject: 'English',
          stream: 'General'
        }
      })
      totalQuestions++
    }
    console.log(`✓ Added 5 English questions`)

    console.log(`\n🎉 Successfully seeded ${totalQuestions} MCQ questions!`)
    console.log('\n📚 Summary:')
    console.log('   • Class 10: 10 questions (General Knowledge + Science)')
    console.log('   • Class 11: 25 questions (Physics, Chemistry, Commerce, Botany, Computer App)')
    console.log('   • Class 12: 25 questions (Physics, Chemistry, Commerce, Biology, Computer App)')
    console.log('   • Languages: 10 questions (Tamil + English)')
    console.log('   • Total: 70 questions')

  } catch (error) {
    console.error('❌ Error seeding MCQs:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedMCQs()
