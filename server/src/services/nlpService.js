const natural = require("natural");
const { removeStopwords } = require("stopword");

const tokenizer = new natural.WordTokenizer();

const SKILL_DICTIONARY = [
  "Java",
  "JavaScript",
  "TypeScript",
  "Python",
  "C",
  "C++",
  "SQL",
  "HTML",
  "CSS",
  "React",
  "React.js",
  "Node.js",
  "Express.js",
  "Spring",
  "Spring Boot",
  "Hibernate",
  "MySQL",
  "MongoDB",
  "PostgreSQL",
  "REST API",
  "REST APIs",
  "JWT",
  "Git",
  "GitHub",
  "AWS",
  "Docker",
  "Kubernetes",
  "Microservices",
  "RabbitMQ",
  "Selenium",
  "Machine Learning",
  "ML",
  "Natural Language Processing",
  "NLP",
  "OOP",
  "OOPs",
  "Data Structures",
  "Algorithms",
  "Agile",
  "Linux"
];

const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s.+#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const tokenizeText = (text) => {
  return tokenizer.tokenize(text);
};

const extractSkills = (text) => {
  if (!text) {
    return [];
  }

  const normalizedText = normalizeText(text);

  // Tokenization
  const tokens = tokenizeText(normalizedText);

  // Stopword removal
  const meaningfulTokens = removeStopwords(tokens);

  const processedText = meaningfulTokens.join(" ");

  const foundSkills = [];

  for (const skill of SKILL_DICTIONARY) {
    const normalizedSkill = normalizeText(skill);

    if (processedText.includes(normalizedSkill)) {
      foundSkills.push(skill);
    }
  }

  return [...new Set(foundSkills)];
};

module.exports = {
  normalizeText,
  tokenizeText,
  extractSkills,
};