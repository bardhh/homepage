interface Course {
  title: string;
  semester: string;
  description?: string;
  link?: string | null;
}

export const courses: Course[] = [
  {
    title: "CS 437: Machine Learning and Soft Computing",
    semester: "Fall 2019",
    description: "Introduced rule-based reasoning, fuzzy logic, neural networks, and evolutionary computation. Topics included designing fuzzy inference systems and using genetic algorithms to search for solutions.",
  },
  {
    title: "CS 404: Autonomous Mobile Robots",
    semester: "Spring 2019",
    description: "Examined how mobile robots use sensors, actuators, and control algorithms to move through their environment. The course also covered coordination among robots and interaction with people.",
  },
  {
    title: "CS 591: Testing and Verification of Cyber-Physical Systems",
    semester: "Fall 2018",
    description: "This course focused on the verification and testing of Cyber-Physical Systems (CPS). Topics included: Hybrid Automata, Reachability Analysis, Temporal Logics (LTL, MTL, STL), Falsification, and Data-Driven Verification.",
    link: null
  },
  {
    title: "CS 499: Senior Project",
    semester: "Spring 2018",
    description: "Capstone project course for computer science seniors. Students worked in teams to design and implement significant software projects.",
    link: null
  },
  {
    title: "CS 410: Computer Security",
    semester: "Spring 2018",
    description: "Surveyed how cryptography and access controls protect data and how software and network defenses protect systems. Topics also included security auditing, risk management, and privacy.",
  },
  {
    title: "CS 498: Senior Project",
    semester: "Fall 2017",
    description: "First part of the senior capstone sequence. Focus on requirements analysis, design, and prototyping.",
    link: null
  },
  {
    title: "CS 290: Communication Skills",
    semester: "Fall 2017",
    description: "Course designed to improve technical communication skills, including writing technical reports and giving presentations.",
    link: null
  }
];
