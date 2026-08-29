const natural = require("natural");


const tokenizeText = (text) => {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
};


const normalizeSkill = (skill) => {
  return String(skill || "")
    .toLowerCase()
    .trim()
    .replace(/\./g, "")
    .replace(/\s+/g, " ");
};


const calculateTextSimilarity = (
  resumeText,
  jobDescription,
  requiredSkills
) => {

  const tfidf = new natural.TfIdf();

  const resumeContent =
    String(resumeText || "");

  let skillsContent = "";

  if (Array.isArray(requiredSkills)) {
    skillsContent =
      requiredSkills.join(" ");
  } else {
    skillsContent =
      String(requiredSkills || "");
  }


  const jobContent = `
    ${jobDescription || ""}
    ${skillsContent}
  `;


  tfidf.addDocument(
    resumeContent
  );

  tfidf.addDocument(
    jobContent
  );


  const terms = new Set();


  tfidf.listTerms(0).forEach(
    (item) => {
      terms.add(item.term);
    }
  );


  tfidf.listTerms(1).forEach(
    (item) => {
      terms.add(item.term);
    }
  );


  let dotProduct = 0;

  let resumeMagnitude = 0;

  let jobMagnitude = 0;


  terms.forEach((term) => {

    const resumeValue =
      tfidf.tfidf(term, 0);

    const jobValue =
      tfidf.tfidf(term, 1);


    dotProduct +=
      resumeValue * jobValue;

    resumeMagnitude +=
      resumeValue * resumeValue;

    jobMagnitude +=
      jobValue * jobValue;

  });


  if (
    resumeMagnitude === 0 ||
    jobMagnitude === 0
  ) {
    return 0;
  }


  const similarity =
    dotProduct /
    (
      Math.sqrt(resumeMagnitude) *
      Math.sqrt(jobMagnitude)
    );


  return Math.round(
    similarity * 100
  );

};


const extractRequiredSkills = (
  requiredSkills
) => {

  if (!requiredSkills) {
    return [];
  }


  // Already an array
  if (Array.isArray(requiredSkills)) {

    return requiredSkills
      .map(
        (skill) =>
          String(skill).trim()
      )
      .filter(Boolean);

  }


  // String value
  if (
    typeof requiredSkills ===
    "string"
  ) {

    // Try JSON array first
    try {

      const parsedSkills =
        JSON.parse(requiredSkills);


      if (
        Array.isArray(parsedSkills)
      ) {

        return parsedSkills
          .map(
            (skill) =>
              String(skill).trim()
          )
          .filter(Boolean);

      }

    } catch (error) {
      // Normal comma-separated string
    }


    return requiredSkills
      .split(",")
      .map(
        (skill) =>
          skill.trim()
      )
      .filter(Boolean);

  }


  return [];

};


const calculateSkillMatch = (
  resumeText,
  requiredSkills
) => {

  const requiredSkillList =
    extractRequiredSkills(
      requiredSkills
    );


  const normalizedResume =
    normalizeSkill(
      resumeText
    );


  const matchedSkills = [];

  const missingSkills = [];


  requiredSkillList.forEach(
    (skill) => {

      const normalizedSkill =
        normalizeSkill(skill);


      if (
        normalizedSkill &&
        normalizedResume.includes(
          normalizedSkill
        )
      ) {

        matchedSkills.push(
          String(skill)
        );

      } else {

        missingSkills.push(
          String(skill)
        );

      }

    }
  );


  const skillMatchScore =
    requiredSkillList.length > 0
      ? Math.round(
          (
            matchedSkills.length /
            requiredSkillList.length
          ) * 100
        )
      : 0;


  return {

    skillMatchScore,

    matchedSkills,

    missingSkills,

  };

};


const calculateMatch = (
  resumeText,
  jobDescription,
  requiredSkills
) => {

  const textSimilarity =
    calculateTextSimilarity(
      resumeText,
      jobDescription,
      requiredSkills
    );


  const {
    skillMatchScore,
    matchedSkills,
    missingSkills,
  } = calculateSkillMatch(
    resumeText,
    requiredSkills
  );


  const matchScore =
    Math.round(
      textSimilarity * 0.4 +
      skillMatchScore * 0.6
    );


  return {

    matchScore,

    textSimilarity,

    skillMatchScore,

    matchedSkills,

    missingSkills,

  };

};


module.exports = {

  calculateMatch,

};