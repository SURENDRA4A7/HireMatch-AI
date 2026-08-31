const pool = require("../config/db");



// EMPLOYER - VIEW MATCHED CANDIDATES FOR A JOB


const getMatchedCandidates = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { jobId } = req.params;

   
    // 1. Validate Job ID
   

    if (!jobId || isNaN(jobId)) {
      return res.status(400).json({
        message: "Valid job ID is required",
      });
    }

    
    // 2. Verify Job Belongs To Employer
   

    const [jobs] = await pool.query(
      `SELECT
        id,
        title,
        company,
        location,
        status
       FROM jobs
       WHERE id = ?
       AND employer_id = ?`,
      [jobId, employerId]
    );

    if (jobs.length === 0) {
      return res.status(404).json({
        message: "Job not found or access denied",
      });
    }

    const job = jobs[0];


    // 3. Get Applications + Candidate Details
   

    const [candidates] = await pool.query(
      `SELECT
        a.id AS application_id,
        a.job_id,
        a.candidate_id,
        a.resume_id,
        a.match_score,
        a.status,
        a.applied_at,

        u.name AS candidate_name,
        u.email AS candidate_email,

        r.file_name AS resume_file_name,
        r.extracted_text,
        r.extracted_skills

       FROM applications a

       INNER JOIN users u
         ON a.candidate_id = u.id

       LEFT JOIN resumes r
         ON a.resume_id = r.id

       WHERE a.job_id = ?

       ORDER BY a.match_score DESC, a.applied_at DESC`,
      [jobId]
    );

    // 4. Format Candidate Data

    const formattedCandidates = candidates.map(
      (candidate) => {
        let skills = [];

        try {
          if (candidate.extracted_skills) {
            skills = JSON.parse(
              candidate.extracted_skills
            );
          }
        } catch (error) {
          console.error(
            "Skill JSON parse error:",
            error.message
          );
        }

        return {
          applicationId: candidate.application_id,
          candidateId: candidate.candidate_id,

          candidate: {
            name: candidate.candidate_name,
            email: candidate.candidate_email,
          },

          resume: {
            id: candidate.resume_id,
            fileName: candidate.resume_file_name,
            skills,
          },

          matchScore: Number(candidate.match_score),

          status: candidate.status,

          appliedAt: candidate.applied_at,
        };
      }
    );

    // 5. Response

    return res.status(200).json({
      message: "Matched candidates fetched successfully",

      job: {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        status: job.status,
      },

      totalCandidates: formattedCandidates.length,

      candidates: formattedCandidates,
    });
  } catch (error) {
    console.error(
      "Get matched candidates error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch matched candidates",
      error: error.message,
    });
  }
};


// EMPLOYER - VIEW SINGLE CANDIDATE DETAILS

const getCandidateDetails = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { applicationId } = req.params;

    // Get Application + Verify Employer Ownership

    const [results] = await pool.query(
      `SELECT
        a.id AS application_id,
        a.job_id,
        a.candidate_id,
        a.resume_id,
        a.match_score,
        a.status,
        a.applied_at,

        j.title AS job_title,
        j.company,

        u.name AS candidate_name,
        u.email AS candidate_email,

        r.file_name AS resume_file_name,
        r.file_path AS resume_file_path,
        r.extracted_text,
        r.extracted_skills

       FROM applications a

       INNER JOIN jobs j
         ON a.job_id = j.id

       INNER JOIN users u
         ON a.candidate_id = u.id

       LEFT JOIN resumes r
         ON a.resume_id = r.id

       WHERE a.id = ?
       AND j.employer_id = ?`,
      [applicationId, employerId]
    );

    if (results.length === 0) {
      return res.status(404).json({
        message: "Application not found or access denied",
      });
    }

    const candidate = results[0];

    let skills = [];

    try {
      if (candidate.extracted_skills) {
        skills = JSON.parse(
          candidate.extracted_skills
        );
      }
    } catch (error) {
      console.error(
        "Skill JSON parse error:",
        error.message
      );
    }

    return res.status(200).json({
      message: "Candidate details fetched successfully",

      application: {
        id: candidate.application_id,
        status: candidate.status,
        matchScore: Number(candidate.match_score),
        appliedAt: candidate.applied_at,
      },

      job: {
        id: candidate.job_id,
        title: candidate.job_title,
        company: candidate.company,
      },

      candidate: {
        id: candidate.candidate_id,
        name: candidate.candidate_name,
        email: candidate.candidate_email,
      },

      resume: {
        id: candidate.resume_id,
        fileName: candidate.resume_file_name,
        filePath: candidate.resume_file_path,
        skills,
        extractedText: candidate.extracted_text,
      },
    });
  } catch (error) {
    console.error(
      "Get candidate details error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch candidate details",
      error: error.message,
    });
  }
};


module.exports = {
  getMatchedCandidates,
  getCandidateDetails,
};