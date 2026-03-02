export const ICONS = [
  {
    id: "aws",
    name: "AWS",
    keywords: ["aws", "amazon", "cloud", "web services", "infrastructure"],
    category: "cloud",
    icon: "/icons/aws.png",
  },
  {
    id: "express",
    name: "Express.js",
    keywords: [
      "express",
      "expressjs",
      "node",
      "backend",
      "server",
      "api",
      "framework",
    ],
    category: "backend",
    icon: "/icons/express.png",
  },
  {
    id: "js",
    name: "JavaScript",
    keywords: [
      "javascript",
      "js",
      "frontend",
      "web",
      "programming",
      "language",
      "ecmascript",
    ],
    category: "language",
    icon: "/icons/js.png",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    keywords: ["mongodb", "mongo", "database", "nosql", "db", "document"],
    category: "database",
    icon: "/icons/mongodb.png",
  },
  {
    id: "nodejs",
    name: "Node.js",
    keywords: ["nodejs", "node", "backend", "server", "javascript", "runtime"],
    category: "backend",
    icon: "/icons/nodejs.png",
  },
  {
    id: "redux",
    name: "Redux",
    keywords: ["redux", "state", "management", "react", "store", "frontend"],
    category: "frontend",
    icon: "/icons/redux.png",
  },
];

// Helper function to search icons by query
export const searchIcons = (query) => {
  if (!query || query.trim() === "") {
    return ICONS;
  }

  const searchTerm = query.toLowerCase().trim();

  return ICONS.filter((icon) => {
    // Search in name
    if (icon.name.toLowerCase().includes(searchTerm)) return true;

    // Search in keywords
    if (
      icon.keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchTerm),
      )
    )
      return true;

    // Search in category
    if (icon.category.toLowerCase().includes(searchTerm)) return true;

    return false;
  });
};

// Get all unique categories
export const getCategories = () => {
  const categories = [...new Set(ICONS.map((icon) => icon.category))];
  return categories.sort();
};
