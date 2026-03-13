export const SYLLABUS = {
  physics: {
    id: "physics",
    name: "Physics",
    color: "from-indigo-500 to-cyan-400",
    shadow: "shadow-indigo-500/25",
    class11: [
      "Basic Mathematics", "Units and Measurements", "Motion in a Straight Line", 
      "Motion in a Plane", "Laws of Motion", "Work Energy and Power", 
      "System of Particles and Rotational Motion", "Gravitation", 
      "Mechanical Properties of Solids", "Mechanical Properties of Fluids", 
      "Thermal Properties of Matter", "Thermodynamics", "Kinetic Theory", 
      "Oscillations", "Waves"
    ],
    class12: [
      "Electric Charges and Fields", "Electrostatic Potential and Capacitance", 
      "Current Electricity", "Moving Charges and Magnetism", "Magnetism and Matter", 
      "Electromagnetic Induction", "Alternating Current", "Electromagnetic Waves", 
      "Ray Optics and Optical Instruments", "Wave Optics", 
      "Dual Nature of Radiation and Matter", "Atoms", "Nuclei", "Semiconductor Electronics"
    ]
  },
  chemistry: {
    id: "chemistry",
    name: "Chemistry",
    color: "from-purple-500 to-pink-500",
    shadow: "shadow-purple-500/25",
    class11: [
      "Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements", 
      "Chemical Bonding", "States of Matter", "Thermodynamics", "Equilibrium", 
      "Redox Reactions", "Hydrogen", "The s Block Elements", 
      "Organic Chemistry Basic Principles", "Hydrocarbons"
    ],
    class12: [
      "Solid State", "Solutions", "Electrochemistry", "Chemical Kinetics", 
      "Surface Chemistry", "General Principles of Metallurgy", "Haloalkanes and Haloarenes", 
      "Alcohols Phenols and Ethers", "Aldehydes Ketones and Carboxylic Acids", 
      "Amines", "Biomolecules", "Polymers"
    ]
  },
  botany: {
    id: "botany",
    name: "Botany",
    color: "from-emerald-500 to-teal-400",
    shadow: "shadow-emerald-500/25",
    class11: [
      "The Living World", "Biological Classification", "Plant Kingdom", 
      "Morphology of Flowering Plants", "Anatomy of Flowering Plants", 
      "Cell Structure and Function", "Cell Cycle and Division", "Transport in Plants", 
      "Mineral Nutrition", "Photosynthesis in Higher Plants", "Respiration in Plants", 
      "Plant Growth and Development"
    ],
    class12: [
      "Sexual Reproduction in Flowering Plants", "Principles of Inheritance and Variation", 
      "Molecular Basis of Inheritance", "Evolution", "Biotechnology Principles and Processes", 
      "Biotechnology and Its Applications", "Organisms and Populations", "Ecosystem", 
      "Biodiversity and Conservation", "Environmental Issues"
    ]
  },
  zoology: {
    id: "zoology",
    name: "Zoology",
    color: "from-amber-500 to-red-500",
    shadow: "shadow-amber-500/25",
    class11: [
      "Animal Kingdom", "Structural Organisation in Animals", "Biomolecules", 
      "Digestion and Absorption", "Breathing and Exchange of Gases", 
      "Body Fluids and Circulation", "Excretory Products and their Elimination", 
      "Locomotion and Movement", "Neural Control and Coordination", "Chemical Coordination and Integration"
    ],
    class12: [
      "Human Reproduction", "Reproductive Health", "Human Health and Disease", 
      "Strategies for Enhancement in Food Production", "Microbes in Human Welfare"
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
