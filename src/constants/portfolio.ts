import { PROFILE_IMAGE } from "@/constants/images";

export type RouteName =
  | "index"
  | "about"
  | "education"
  | "college"
  | "skills"
  | "projects"
  | "internship"
  | "resume"
  | "certificates"
  | "experience"
  | "gallery"
  | "contact"
  | "settings";

export const profile = {
  name: "Gaurav Kale",
  title: "Full Stack Developer",

  tagline:
    "Passionate third-year B.Tech Information Technology student with hands-on experience in building full-stack web applications, Android applications, and AI-based software solutions.",
  email: "gauravkale216@gmail.com",
  phone: "+91 7558293765",
  location: "Chhatrapati Sambhajinagar, Maharashtra, India",
  portfolio: "https://gaurav-kale-portfolio.netlify.app",
  github: "https://github.com/VaruagX",
  linkedin: "https://linkedin.com/in/gauravkale-web",
  instagram: "",
  whatsapp: "https://wa.me/917558293765",
  image: PROFILE_IMAGE,
};

export const drawerItems: { route: RouteName; label: string; icon: string }[] =
  [
    { route: "index", label: "Home", icon: "home" },
    { route: "about", label: "About Me", icon: "user" },
    { route: "education", label: "Education", icon: "graduation-cap" },
    { route: "college", label: "College", icon: "school" },
    { route: "skills", label: "Skills", icon: "code-2" },
    { route: "projects", label: "Projects", icon: "rocket" },
    { route: "internship", label: "Internship", icon: "scroll-text" },
    { route: "resume", label: "Resume", icon: "file-text" },
    { route: "certificates", label: "Certificates", icon: "award" },
    { route: "experience", label: "Experience", icon: "briefcase-business" },
    { route: "gallery", label: "Gallery", icon: "image" },
    { route: "contact", label: "Contact", icon: "phone" },
    { route: "settings", label: "Settings", icon: "settings" },
  ];

export const stats = [
  {
    label: "Projects",
    value: "5+",
    description: "Personal & academic projects",
    icon: "rocket",
  },
  {
    label: "Certificates",
    value: "0",
    description: "Will be updated soon",
    icon: "award",
  },
  {
    label: "Skills",
    value: "10+",
    description: "Programming & development",
    icon: "code-2",
  },
  {
    label: "Internship",
    value: "Seeking",
    description: "Looking for opportunities",
    icon: "briefcase-business",
  },
  {
    label: "Education",
    value: "B.Tech IT",
    description: "5th Semester",
    icon: "graduation-cap",
  },
  {
    label: "GitHub",
    value: "Active",
    description: "Building & sharing projects",
    icon: "github",
  },
];

export const quickActions = [
  {
    title: "View Resume",
    description: "Open the latest developer resume.",
    route: "resume" as RouteName,
  },
  {
    title: "Featured Work",
    description: "Explore product-ready app projects.",
    route: "projects" as RouteName,
  },
  {
    title: "Contact Me",
    description: "Start a conversation or collaboration.",
    route: "contact" as RouteName,
  },
];

export const aboutSections = [
  {
    title: "Introduction",
    body: "I am a passionate B.Tech Information Technology student at the Institute of Information & Communication Technology (IICT), MGM University. I have hands-on experience building full-stack web applications, Android applications, and AI-powered software solutions through academic and personal projects. I enjoy solving real-world problems by creating modern, user-friendly, and scalable applications while continuously expanding my technical skills.",
  },
  {
    title: "Career Objective",
    body: "I am seeking a Software Developer Internship where I can apply my knowledge of JavaScript, React Native, Node.js, Express.js, PostgreSQL, HTML, CSS, and Git to real-world projects. My goal is to learn from experienced professionals, contribute to impactful software, and grow into a skilled full-stack software engineer.",
  },
];

export const personalInfo = [
  ["Name", profile.name],
  ["Role", profile.title],
  ["Location", profile.location],
  ["Email", profile.email],
  ["Availability", "Open to internships and junior developer roles"],
];

export const interests = [
  "Mobile Apps",
  "UI Engineering",
  "Cloud APIs",
  "Open Source",
  "Product Design",
];
export const languages = ["English", "Hindi", "Marathi"];
export const hobbies = [
  "Coding side projects",
  "Tech blogging",
  "Fitness",
  "Photography",
];

export const college = {
  name: "Institute of Information & Communication Technology (IICT), MGM University",

  degree: "Bachelor of Technology (B.Tech)",

  branch: "Information Technology",

  semester: "Third Year",

  cgpa: "7.64 / 10",

  passingYear: "Expected 2028",

  activities: [
    "Full Stack Web Development",
    "Mobile Application Development",
    "Personal Software Projects",
    "Continuous Learning of Modern Technologies",
  ],

  achievements: [],
};

export const academicTimeline = [
  {
    year: "2022",
    title: "Secondary School (SSC)",
    subtitle: "Passed 10th Standard",
    meta: "Percentage: 75.20%",
  },
  {
    year: "2024",
    title: "Higher Secondary (HSC)",
    subtitle: "Science Stream",
    meta: "Percentage: 76.00%",
  },
  {
    year: "2024 - Expected 2028",
    title: "B.Tech Information Technology",
    subtitle:
      "Institute of Information & Communication Technology (IICT), MGM University",
    meta: `Current CGPA: ${college.cgpa}`,
  },
  {
    year: "Current",
    title: "5th Semester",
    subtitle: "Bachelor of Technology (Information Technology)",
    meta: "Learning Full Stack Development, React Native, Node.js, and PostgreSQL",
  },
];

export const skills = [
  {
    category: "Programming",
    items: ["Java", "JavaScript", "Python", "C", "SQL"],
    progress: 84,
  },
  {
    category: "Frontend",
    items: ["HTML", "CSS", "React", "React Native"],
    progress: 88,
  },
  { category: "Backend", items: ["Node.js", "Express"], progress: 76 },
  { category: "Database", items: ["PostgreSQL", "MySQL"], progress: 72 },
  {
    category: "Tools",
    items: ["Git", "GitHub", "VS Code", "Android Studio", "Postman"],
    progress: 82,
  },
];

export const projects = [
  {
    title: "Varuag Drive",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    description:
      "A cloud-drive style file manager with secure folders, upload flows, and clean storage dashboards.",
    stack: ["React Native", "Node.js", "PostgreSQL"],
    features: ["File previews", "Folder sharing", "Recent activity"],
  },
  {
    title: "Portfolio Website",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    description:
      "A responsive portfolio website with project showcases, contact flows, and modern animation.",
    stack: ["React", "CSS", "JavaScript"],
    features: ["Responsive layout", "SEO-friendly pages", "Project gallery"],
  },
  {
    title: "Hospital Management",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
    description:
      "A role-based hospital workflow system for patients, doctors, appointments, and billing.",
    stack: ["Java", "MySQL", "REST APIs"],
    features: ["Appointments", "Patient records", "Billing reports"],
  },
  {
    title: "Face Attendance",
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
    description:
      "An attendance prototype using face recognition concepts and automated class reports.",
    stack: ["Python", "OpenCV", "SQLite"],
    features: ["Face capture", "Daily reports", "CSV export"],
  },
  {
    title: "Invoice Generator",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    description:
      "A business utility that generates clean invoices and tracks payment status.",
    stack: ["React", "Node.js", "PDF"],
    features: ["PDF invoices", "Client records", "Tax summary"],
  },
  {
    title: "Expense Tracker",
    image:
      "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1200&q=80",
    description:
      "A personal finance app with budgets, category insights, and monthly trend views.",
    stack: ["React Native", "SQLite", "Charts"],
    features: ["Budgets", "Categories", "Monthly analytics"],
  },
];

export const internship = {
  company: "Currently Seeking Internship",

  role: "Software Developer Intern",

  duration: "Available Immediately",

  certificate: "Will be updated after internship",

  description:
    "Currently seeking a Software Developer Internship where I can apply my skills in full-stack web development, React Native, Node.js, Express.js, PostgreSQL, and JavaScript while contributing to real-world projects and learning from experienced developers.",

  skillsLearned: [
    "React Native",
    "JavaScript",
    "Node.js",
    "Express.js",
    "PostgreSQL",
    "Git & GitHub",
  ],
};

export const resumeHighlights = [
  "Full-stack web application development using JavaScript, Node.js, Express.js, and PostgreSQL",
  "Building Android applications with React Native and Expo",
  "Hands-on experience developing projects including Face Attendance System, Varuag Drive, Hospital Management System, Invoice Generator, and Currency Converter",
  "Comfortable with Git, GitHub, VS Code, Android Studio, Postman, REST APIs, and modern development workflows",
];

export const certificates = [
  "React Native Essentials",
  "Java Programming",
  "Python for Developers",
  "SQL Database Design",
  "Git and GitHub",
  "Web Development",
  "Node.js APIs",
  "Cloud Fundamentals",
].map((title, index) => ({
  title,
  issuer: ["Coursera", "Udemy", "Google Developer Groups", "Microsoft Learn"][
    index % 4
  ],
  image: `https://images.unsplash.com/photo-${
    [
      "1523240795612-9a054b0db644",
      "1434030216411-0b793f4b4173",
      "1523580846011-d3a5bc25702b",
      "1519389950473-47ba0277781c",
    ][index % 4]
  }?auto=format&fit=crop&w=900&q=80`,
}));

export const experiences = [
  {
    role: "B.Tech Information Technology Student",
    company:
      "Institute of Information & Communication Technology (IICT), MGM University",
    period: "2024 - Present",
    detail:
      "Pursuing a Bachelor of Technology in Information Technology while building full-stack web and mobile applications through academic and personal projects.",
  },
  {
    role: "Personal Project Developer",
    company: "Self Learning",
    period: "2024 - Present",
    detail:
      "Developing full-stack web applications and Android applications using JavaScript, React Native, Node.js, Express.js, PostgreSQL, HTML, CSS, and Git.",
  },
  {
    role: "Software Developer Intern",
    company: "Currently Seeking Internship",
    period: "Available",
    detail:
      "Actively looking for a Software Developer Internship to gain industry experience, contribute to real-world projects, and expand technical skills.",
  },
];

export const gallery = [
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
];
