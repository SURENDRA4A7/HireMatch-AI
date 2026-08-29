const pool = require("../config/db");

const {
  calculateMatchScore,
} = require("../services/matchingService");

const {
  extractSkills,
} = require("../services/nlpService");


// =====================================================
// CANDIDATE - APPLY FOR JOB
// =====================================================

const applyForJob = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    // -------------------------------------------------
    // 1. Validate Job ID
    // -------------------------------------------------

    if (!jobId || isNaN(jobId)) {
      return res.status(400).json({
        message: "Valid job ID is required",
      });
    }

    // -------------------------------------------------
    // 2. Get Job
    // -------------------------------------------------

    const [jobs] = await pool.query(
      `SELECT
        id,
        title,
        company,
        description,
        required_skills,
        location,
        employment_type,
        salary_min,
        salary_max,
        experience_required,
        status
       FROM jobs
       WHERE id = ?`,
      [jobId]
    );

    if (jobs.length === 0) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const job = jobs[0];

    // -------------------------------------------------
    // 3. Check Job Status
    // -------------------------------------------------

    if (job.status !== "OPEN") {
      return res.status(400).json({
        message: "This job is no longer accepting applications",
      });
    }

    // -------------------------------------------------
    // 4. Get Candidate's Latest Resume
    // -------------------------------------------------

    const [resumes] = await pool.query(
      `SELECT
        id,
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
      return res.status(400).json({
        message: "Please upload a resume before applying",
      });
    }

    const resume = resumes[0];

    // -------------------------------------------------
    // 5. Get Candidate Skills
    // -------------------------------------------------

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

      // Re-extract skills from resume text
      candidateSkills = extractSkills(
        resume.extracted_text
      );
    }

    // -------------------------------------------------
    // 6. Get Required Job Skills
    // -------------------------------------------------

    let requiredSkills = [];

    if (job.required_skills) {
      requiredSkills = job.required_skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);
    }

    // -------------------------------------------------
    // 7. Prepare Job Text
    // -------------------------------------------------

    const jobText = `
      ${job.title || ""}
      ${job.company || ""}
      ${job.description || ""}
      ${job.required_skills || ""}
      ${job.location || ""}
      ${job.employment_type || ""}
    `;

    // -------------------------------------------------
    // 8. Calculate Match Score
    // -------------------------------------------------

    const matchResult = calculateMatchScore({
      candidateText: resume.extracted_text,
      jobText,
      candidateSkills,
      requiredSkills,
    });

    const matchScore = matchResult.matchScore;

    // -------------------------------------------------
    // 9. Check Duplicate Application
    // -------------------------------------------------

    const [existingApplications] = await pool.query(
      `SELECT
        id,
        status,
        match_score
       FROM applications
       WHERE job_id = ?
       AND candidate_id = ?`,
      [jobId, candidateId]
    );

    if (existingApplications.length > 0) {
      return res.status(409).json({
        message: "You have already applied for this job",
        application: existingApplications[0],
      });
    }

    // -------------------------------------------------
    // 10. Create Application
    // -------------------------------------------------

    const [result] = await pool.query(
      `INSERT INTO applications
       (
         job_id,
         candidate_id,
         resume_id,
         match_score,
         status
       )
       VALUES (?, ?, ?, ?, 'APPLIED')`,
      [
        jobId,
        candidateId,
        resume.id,
        matchScore,
      ]
    );

    // -------------------------------------------------
    // 11. Response
    // -------------------------------------------------

    return res.status(201).json({
      message: "Application submitted successfully",

      application: {
        id: result.insertId,
        jobId: Number(jobId),
        candidateId,
        resumeId: resume.id,
        matchScore,
        status: "APPLIED",
      },

      match: {
        matchScore,
        textSimilarity: matchResult.textSimilarity,
        skillMatchScore: matchResult.skillMatchScore,
        matchedSkills: matchResult.matchedSkills,
        missingSkills: matchResult.missingSkills,
      },
    });
  } catch (error) {
    console.error("Apply for job error:", error);

    return res.status(500).json({
      message: "Failed to submit application",
      error: error.message,
    });
  }
};


// =====================================================
// CANDIDATE - VIEW OWN APPLICATIONS
// =====================================================

const getMyApplications = async (req, res) => {
  try {
    const candidateId = req.user.id;

    const [applications] = await pool.query(
      `SELECT
        a.id,
        a.job_id,
        a.resume_id,
        a.match_score,
        a.status,
        a.applied_at,

        j.title,
        j.company,
        j.location,
        j.employment_type,
        j.salary_min,
        j.salary_max

       FROM applications a

       INNER JOIN jobs j
         ON a.job_id = j.id

       WHERE a.candidate_id = ?

       ORDER BY a.applied_at DESC`,
      [candidateId]
    );

    return res.status(200).json({
      message: "Applications fetched successfully",
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get candidate applications error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};


// =====================================================
// EMPLOYER - VIEW APPLICATIONS
// =====================================================

const getEmployerApplications = async (req, res) => {
  try {
    const employerId = req.user.id;

    const [applications] = await pool.query(
      `SELECT
        a.id,
        a.job_id,
        a.candidate_id,
        a.resume_id,
        a.match_score,
        a.status,
        a.applied_at,

        j.title,
        j.company,
        j.location,

        u.name AS candidate_name,
        u.email AS candidate_email

       FROM applications a

       INNER JOIN jobs j
         ON a.job_id = j.id

       INNER JOIN users u
         ON a.candidate_id = u.id

       WHERE j.employer_id = ?

       ORDER BY a.match_score DESC, a.applied_at DESC`,
      [employerId]
    );

    return res.status(200).json({
      message: "Employer applications fetched successfully",
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get employer applications error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch employer applications",
      error: error.message,
    });
  }
};


// =====================================================
// EMPLOYER - UPDATE APPLICATION STATUS
// =====================================================

const updateApplicationStatus = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { applicationId } = req.params;
    const { status } = req.body;

    // -------------------------------------------------
    // Allowed Statuses
    // -------------------------------------------------

    const allowedStatuses = [
      "APPLIED",
      "REVIEWING",
      "SHORTLISTED",
      "REJECTED",
      "HIRED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
        allowedStatuses,
      });
    }

    // -------------------------------------------------
    // Verify Application Ownership
    // -------------------------------------------------

    const [applications] = await pool.query(
      `SELECT
        a.id,
        a.status AS current_status

       FROM applications a

       INNER JOIN jobs j
         ON a.job_id = j.id

       WHERE a.id = ?
       AND j.employer_id = ?`,
      [applicationId, employerId]
    );

    if (applications.length === 0) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // -------------------------------------------------
    // Update Status
    // -------------------------------------------------

    await pool.query(
      `UPDATE applications
       SET status = ?
       WHERE id = ?`,
      [status, applicationId]
    );

    return res.status(200).json({
      message: "Application status updated successfully",

      application: {
        id: Number(applicationId),
        previousStatus: applications[0].current_status,
        status,
      },
    });
  } catch (error) {
    console.error(
      "Update application status error:",
      error
    );

    return res.status(500).json({
      message: "Failed to update application status",
      error: error.message,
    });
  }
};


module.exports = {
  applyForJob,
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus,
};