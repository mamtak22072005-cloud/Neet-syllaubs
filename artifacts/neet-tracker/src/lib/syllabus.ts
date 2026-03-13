export const SYLLABUS = {
  physics: {
    id: "physics",
    name: "Physics",
    color: "from-indigo-500 to-cyan-400",
    shadow: "shadow-indigo-500/25",
    class11: [
      "Basic Mathematics",
      "Vectors",
      "Units and Measurements",
      "Motion in a Straight Line",
      "Motion in a Plane",
      "Laws of Motion",
      "Work, Energy and Power",
      "System of Particles and Rotational Motion",
      "Gravitation",
      "Mechanical Properties of Solids",
      "Mechanical Properties of Fluids",
      "Thermal Properties of Matter",
      "Thermodynamics",
      "Kinetic Theory",
      "Oscillations",
      "Waves"
    ],
    class12: [
      "Electrostatics",
      "Current Electricity",
      "Moving Charges and Magnetism",
      "Magnetism and Matter",
      "Electromagnetic Induction",
      "Alternating Current",
      "Electromagnetic Waves",
      "Ray Optics and Optical Instruments",
      "Wave Optics",
      "Dual Nature of Radiation and Matter",
      "Atoms",
      "Nuclei",
      "Semiconductor Electronics"
    ]
  },
  chemistry: {
    id: "chemistry",
    name: "Chemistry",
    color: "from-purple-500 to-pink-500",
    shadow: "shadow-purple-500/25",
    class11: [
      "Some Basic Concepts of Chemistry",
      "Structure of Atom",
      "Thermodynamics",
      "Equilibrium",
      "Redox Reactions",
      "Organic Chemistry: Basic Principles and Techniques",
      "Hydrocarbons",
      "Classification of Elements and Periodicity",
      "Chemical Bonding and Molecular Structure"
    ],
    class12: [
      "Solutions",
      "Electrochemistry",
      "Chemical Kinetics",
      "Haloalkanes and Haloarenes",
      "Alcohols, Phenols and Ethers",
      "Aldehydes, Ketones and Carboxylic Acids",
      "Amines",
      "Biomolecules",
      "d- and f-Block Elements",
      "Coordination Compounds"
    ]
  },
  botany: {
    id: "botany",
    name: "Botany",
    color: "from-emerald-500 to-teal-400",
    shadow: "shadow-emerald-500/25",
    class11: [
      "The Living World",
      "Biological Classification",
      "Plant Kingdom",
      "Morphology of Flowering Plants",
      "Anatomy of Flowering Plants",
      "Cell: The Unit of Life",
      "Cell Cycle and Cell Division",
      "Photosynthesis in Higher Plants",
      "Respiration in Plants",
      "Plant Growth and Development"
    ],
    class12: [
      "Sexual Reproduction in Flowering Plants",
      "Principles of Inheritance and Variation",
      "Molecular Basis of Inheritance",
      "Microbes in Human Welfare",
      "Organisms and Populations",
      "Ecosystem",
      "Biodiversity and Conservation"
    ]
  },
  zoology: {
    id: "zoology",
    name: "Zoology",
    color: "from-amber-500 to-red-500",
    shadow: "shadow-amber-500/25",
    class11: [
      "Animal Kingdom",
      "Structural Organisation in Animals",
      "Biomolecules",
      "Breathing and Exchange of Gases",
      "Body Fluids and Circulation",
      "Excretory Products and their Elimination",
      "Locomotion and Movement",
      "Neural Control and Coordination",
      "Chemical Coordination and Integration"
    ],
    class12: [
      "Human Reproduction",
      "Reproductive Health",
      "Evolution",
      "Human Health and Disease",
      "Biotechnology: Principles and Processes",
      "Biotechnology and its Applications"
    ]
  }
} as const;

export type SubjectId = keyof typeof SYLLABUS;
export const TASKS = ['lecture', 'notes', 'ncert', 'dpp', 'rev1', 'rev2', 'rev3', 'rev4', 'rev5'] as const;
export type TaskId = typeof TASKS[number];

export const TASK_LABELS: Record<TaskId, string> = {
  lecture: "📚 Lecture Completed",
  notes: "📝 Class Notes Completed",
  ncert: "📖 NCERT Reading Completed",
  dpp: "✏️ DPP Solved",
  rev1: "🔄 Revision 1",
  rev2: "🔄 Revision 2",
  rev3: "🔄 Revision 3",
  rev4: "🔄 Revision 4",
  rev5: "🔄 Revision 5"
};
