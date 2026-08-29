const pool = require("../config/db");

const {
  calculateMatch,
} = require("../services/matchingService");

const getJobMatch = async (req, res) => {
  try {
    const candidateId = req.user.id;

    const { jobId } = req.params;

    // Get latest uploaded resume
    const [resumes] = await pool.query(
      `
      SELECT
        id,
        file_name,
        extracted_text
      FROM resumes
      WHERE candidate_id = ?
      ORDER BY id DESC
      LIMIT 1
      `,
      [candidateId]
    );

    if (resumes.length === 0) {
      return res.status(404).json({
        message:
          "No resume found. Please upload your resume first.",
      });
    }

    const resume = resumes[0];

    // Get job details
    const [jobs] = await pool.query(
      `
      SELECT
        id,
        title,
        company,
        description,
        required_skills
      FROM jobs
      WHERE id = ?
      `,
      [jobId]
    );

    if (jobs.length === 0) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    const job = jobs[0];

    // Calculate resume and job match
    const matchResult = calculateMatch(
      resume.extracted_text,
      job.description,
      job.required_skills
    );

    return res.status(200).json({
      message:
        "Job match calculated successfully",

      job: {
        id: job.id,
        title: job.title,
        company: job.company,
      },

      resume: {
        id: resume.id,
        fileName: resume.file_name,
      },

      ...matchResult,
    });
  } catch (error) {
    console.error(
      "Job matching error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to calculate job match",
      error: error.message,
    });
  }
};

module.exports = {
  getJobMatch,
};