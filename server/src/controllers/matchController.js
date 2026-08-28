const pool = require("../config/db");
const {
  extractSkills,
} = require("../services/nlpService");

const {
  calculateMatchScore,
} = require("../services/matchingService");

// Get match score between logged-in candidate and a job
const getJobMatch = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const { jobId } = req.params;

    // Validate job ID
    if (!jobId || isNaN(jobId)) {
      return res.status(400).json({
        message: "Valid job ID is required",
      });
    }

    // --------------------------------------------------
    // 1. Get candidate's latest resume
    // --------------------------------------------------

    const [resumes] = await pool.query(
      `SELECT
        id,
        candidate_id,
        file_name,
        extracted_text,
        extracted_skills
       FROM resumes
       WHERE candidate_id = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [candidateId]
    );

    if (resumes.length === 0) {
      return res.status(404).json({
        message: "Please upload a resume before matching",
      });
    }

    const resume = resumes[0];

    // --------------------------------------------------
    // 2. Get job
    // --------------------------------------------------

    const [jobs] = await pool.query(
      `SELECT
        j.id,
        j.title,
        j.company,
        j.description,
        j.required_skills,
        j.location,
        j.employment_type,
        j.salary_min,
        j.salary_max,
        j.experience_required,
        j.status,
        j.created_at,
        u.name AS employer_name
       FROM jobs j
       INNER JOIN users u
         ON j.employer_id = u.id
       WHERE j.id = ?`,
      [jobId]
    );

    if (jobs.length === 0) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const job = jobs[0];

    // --------------------------------------------------
    // 3. Prepare candidate skills
    // --------------------------------------------------

    let candidateSkills = [];

    try {
      candidateSkills = resume.extracted_skills
        ? JSON.parse(resume.extracted_skills)
        : [];
    } catch (error) {
      console.error(
        "Candidate skills JSON parse error:",
        error.message
      );

      // Re-extract skills if stored JSON is invalid
      candidateSkills = extractSkills(
        resume.extracted_text
      );
    }

    // --------------------------------------------------
    // 4. Prepare required job skills
    // --------------------------------------------------

    let requiredSkills = [];

    if (job.required_skills) {
      requiredSkills = job.required_skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);
    }

    // --------------------------------------------------
    // 5. Prepare job text
    // --------------------------------------------------

    const jobText = `
      ${job.title || ""}
      ${job.company || ""}
      ${job.description || ""}
      ${job.required_skills || ""}
      ${job.location || ""}
      ${job.employment_type || ""}
    `;

    // --------------------------------------------------
    // 6. Calculate match
    // --------------------------------------------------

    const matchResult = calculateMatchScore({
      candidateText: resume.extracted_text,
      jobText,
      candidateSkills,
      requiredSkills,
    });

    // --------------------------------------------------
    // 7. Return result
    // --------------------------------------------------

    return res.status(200).json({
      message: "Job match calculated successfully",

      job: {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        employmentType: job.employment_type,
        salaryMin: job.salary_min,
        salaryMax: job.salary_max,
        experienceRequired: job.experience_required,
        status: job.status,
      },

      candidate: {
        id: candidateId,
        resumeId: resume.id,
        resumeFileName: resume.file_name,
      },

      match: {
        matchScore: matchResult.matchScore,
        textSimilarity: matchResult.textSimilarity,
        skillMatchScore: matchResult.skillMatchScore,
        matchedSkills: matchResult.matchedSkills,
        missingSkills: matchResult.missingSkills,
      },
    });
  } catch (error) {
    console.error("Job matching error:", error);

    return res.status(500).json({
      message: "Failed to calculate job match",
      error: error.message,
    });
  }
};

module.exports = {
  getJobMatch,
};