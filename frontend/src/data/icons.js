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
  {
    id: "app",
    name: "Application",
    keywords: ["app", "application", "software", "program", "service"],
    category: "general",
    icon: "/icons/app.png",
  },
  {
    id: "browser",
    name: "Browser",
    keywords: ["browser", "web", "chrome", "firefox", "client", "frontend"],
    category: "general",
    icon: "/icons/browser.png",
  },
  {
    id: "cassandra",
    name: "Cassandra",
    keywords: ["cassandra", "database", "nosql", "db", "distributed", "apache"],
    category: "database",
    icon: "/icons/Cassandra.png",
  },
  {
    id: "dns",
    name: "DNS",
    keywords: ["dns", "domain", "name", "server", "network", "resolution"],
    category: "infrastructure",
    icon: "/icons/dns.png",
  },
  {
    id: "firewall",
    name: "Firewall",
    keywords: ["firewall", "security", "network", "protection", "filter"],
    category: "infrastructure",
    icon: "/icons/firewall.png",
  },
  {
    id: "graphql",
    name: "GraphQL",
    keywords: ["graphql", "api", "query", "backend", "schema", "graph"],
    category: "backend",
    icon: "/icons/graphQL.png",
  },
  {
    id: "lambda",
    name: "AWS Lambda",
    keywords: ["lambda", "aws", "serverless", "function", "cloud", "faas"],
    category: "cloud",
    icon: "/icons/lambda.png",
  },
  {
    id: "loadbalancer",
    name: "Load Balancer",
    keywords: ["load", "balancer", "lb", "traffic", "distribution", "scaling"],
    category: "infrastructure",
    icon: "/icons/load balancer.png",
  },
  {
    id: "mysql",
    name: "MySQL",
    keywords: ["mysql", "database", "sql", "db", "relational", "oracle"],
    category: "database",
    icon: "/icons/my sql.png",
  },
  {
    id: "nginx",
    name: "Nginx",
    keywords: ["nginx", "server", "web", "proxy", "reverse", "load balancer"],
    category: "infrastructure",
    icon: "/icons/nginx.png",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    keywords: ["postgresql", "postgres", "database", "sql", "db", "relational"],
    category: "database",
    icon: "/icons/PostgreSQL.png",
  },
  {
    id: "rabbitmq",
    name: "RabbitMQ",
    keywords: [
      "rabbitmq",
      "rabbit",
      "mq",
      "message",
      "queue",
      "broker",
      "amqp",
    ],
    category: "infrastructure",
    icon: "/icons/rabbit mq.png",
  },
  {
    id: "react",
    name: "React",
    keywords: ["react", "reactjs", "frontend", "ui", "library", "component"],
    category: "frontend",
    icon: "/icons/react.png",
  },
  {
    id: "redis",
    name: "Redis",
    keywords: ["redis", "cache", "database", "nosql", "memory", "key-value"],
    category: "database",
    icon: "/icons/redis.png",
  },
  {
    id: "spring",
    name: "Spring",
    keywords: ["spring", "java", "backend", "framework", "boot", "enterprise"],
    category: "backend",
    icon: "/icons/spring.png",
  },
  {
    id: "sqlserver",
    name: "SQL Server",
    keywords: ["sql", "server", "microsoft", "mssql", "database", "relational"],
    category: "database",
    icon: "/icons/sql server.png",
  },
  {
    id: "user",
    name: "User",
    keywords: ["user", "person", "client", "customer", "actor", "human"],
    category: "general",
    icon: "/icons/user.png",
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
