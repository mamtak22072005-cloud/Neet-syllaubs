export const SYLLABUS = {
  physics: {
    id: "physics",
    name: "Physics",
    color: "from-blue-500 to-cyan-400",
    shadow: "shadow-blue-500/20",
    class11: [
      "Basic Mathematics", "Units and Dimensions", "Motion in Straight Line", 
      "Motion in Plane", "Laws of Motion", "Work Energy Power", "Centre of Mass", 
      "Rotational Motion", "Gravitation", "Mechanical Properties of Solids", 
      "Mechanical Properties of Fluids", "Thermal Properties of Matter", 
      "Thermodynamics", "Kinetic Theory", "Oscillations", "Waves"
    ],
    class12: [
      "Electrostatics", "Current Electricity", "Moving Charges and Magnetism", 
      "Magnetism and Matter", "Electromagnetic Induction", "Alternating Current", 
      "Electromagnetic Waves", "Ray Optics", "Wave Optics", 
      "Dual Nature of Radiation", "Atoms", "Nuclei", "Semiconductors"
    ]
  },
  chemistry: {
    id: "chemistry",
    name: "Chemistry",
    color: "from-purple-500 to-pink-500",
    shadow: "shadow-purple-500/20",
    class11: [
      "Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements", 
      "Chemical Bonding", "States of Matter", "Thermodynamics", "Equilibrium", 
      "Redox Reactions", "Hydrogen", "s Block Elements", 
      "Organic Chemistry Basic Principles", "Hydrocarbons", "Environmental Chemistry"
    ],
    class12: [
      "Solid State", "Solutions", "Electrochemistry", "Chemical Kinetics", 
      "Surface Chemistry", "Metallurgy", "Haloalkanes and Haloarenes", 
      "Alcohols Phenols Ethers", "Aldehydes Ketones Carboxylic Acids", 
      "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life"
    ]
  },
  botany: {
    id: "botany",
    name: "Botany",
    color: "from-emerald-500 to-teal-400",
    shadow: "shadow-emerald-500/20",
    class11: [
      "The Living World", "Biological Classification", "Plant Kingdom", 
      "Morphology of Flowering Plants", "Anatomy of Flowering Plants", 
      "Cell Structure", "Cell Cycle", "Transport in Plants", 
      "Mineral Nutrition", "Photosynthesis", "Respiration in Plants", 
      "Plant Growth and Development"
    ],
    class12: [
      "Sexual Reproduction in Flowering Plants", "Genetics", "Molecular Basis of Inheritance", 
      "Evolution", "Biotechnology Principles", "Biotechnology Applications", 
      "Organisms and Populations", "Ecosystem", "Biodiversity", "Environmental Issues"
    ]
  },
  zoology: {
    id: "zoology",
    name: "Zoology",
    color: "from-orange-500 to-rose-500",
    shadow: "shadow-orange-500/20",
    class11: [
      "Animal Kingdom", "Structural Organisation in Animals", "Biomolecules", 
      "Digestion and Absorption", "Breathing and Exchange of Gases", 
      "Body Fluids and Circulation", "Excretory Products", "Locomotion and Movement", 
      "Neural Control and Coordination", "Chemical Coordination and Integration"
    ],
    class12: [
      "Human Reproduction", "Reproductive Health", "Human Health and Disease", 
      "Strategies for Enhancement in Food Production", "Microbes in Human Welfare", 
      "Biotechnology", "Biotechnology Applications", "Evolution", "Human Health", "Ecology"
    ]
  }
} as const;

export type SubjectId = keyof typeof SYLLABUS;
export const TASKS = ['lecture', 'notes', 'ncert', 'dpp', 'rev1', 'rev2', 'rev3', 'rev4', 'rev5'] as const;
export type TaskId = typeof TASKS[number];

export const TASK_LABELS: Record<TaskId, string> = {
  lecture: "📚 Lecture Completed",
  notes: "📝 Class Notes Completed",
  ncert: "📖 NCERT Reading",
  dpp: "✏️ DPP Solved",
  rev1: "🔄 Revision 1",
  rev2: "🔄 Revision 2",
  rev3: "🔄 Revision 3",
  rev4: "🔄 Revision 4",
  rev5: "🔄 Revision 5"
};
