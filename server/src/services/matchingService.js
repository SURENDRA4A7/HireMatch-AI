const natural = require("natural");

const TfIdf = natural.TfIdf;

/**
 * Calculate cosine similarity between two vectors.
 */
const cosineSimilarity = (vectorA, vectorB) => {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];

    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
};

/**
 * Calculate TF-IDF similarity between candidate resume
 * and job description.
 */
const calculateTextSimilarity = (candidateText, jobText) => {
  if (!candidateText || !jobText) {
    return 0;
  }

  const tfidf = new TfIdf();

  tfidf.addDocument(candidateText.toLowerCase());
  tfidf.addDocument(jobText.toLowerCase());

  const vocabulary = new Set();

  tfidf.listTerms(0).forEach((item) => {
    vocabulary.add(item.term);
  });

  tfidf.listTerms(1).forEach((item) => {
    vocabulary.add(item.term);
  });

  const terms = Array.from(vocabulary);

  const candidateVector = terms.map((term) =>
    tfidf.tfidf(term, 0)
  );

  const jobVector = terms.map((term) =>
    tfidf.tfidf(term, 1)
  );

  const similarity = cosineSimilarity(
    candidateVector,
    jobVector
  );

  return Math.round(similarity * 100);
};

/**
 * Calculate skill-based matching.
 */
const calculateSkillMatch = (
  candidateSkills,
  requiredSkills
) => {
  if (
    !Array.isArray(candidateSkills) ||
    !Array.isArray(requiredSkills) ||
    requiredSkills.length === 0
  ) {
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: requiredSkills || [],
    };
  }

  const candidateSkillSet = new Set(
    candidateSkills.map((skill) =>
      skill.toLowerCase().trim()
    )
  );

  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach((skill) => {
    const normalizedSkill = skill.toLowerCase().trim();

    if (candidateSkillSet.has(normalizedSkill)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const score = Math.round(
    (matchedSkills.length / requiredSkills.length) * 100
  );

  return {
    score,
    matchedSkills,
    missingSkills,
  };
};

/**
 * Combine TF-IDF similarity and skill matching.
 */
const calculateMatchScore = ({
  candidateText,
  jobText,
  candidateSkills,
  requiredSkills,
}) => {
  const textScore = calculateTextSimilarity(
    candidateText,
    jobText
  );

  const skillResult = calculateSkillMatch(
    candidateSkills,
    requiredSkills
  );

  /*
   * Skill matching gets more weight because
   * required skills are important for recruitment.
   */
  const finalScore = Math.round(
    textScore * 0.4 +
    skillResult.score * 0.6
  );

  return {
    matchScore: finalScore,
    textSimilarity: textScore,
    skillMatchScore: skillResult.score,
    matchedSkills: skillResult.matchedSkills,
    missingSkills: skillResult.missingSkills,
  };
};

module.exports = {
  cosineSimilarity,
  calculateTextSimilarity,
  calculateSkillMatch,
  calculateMatchScore,
};