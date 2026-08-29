const pool = require("../config/db");

const {
  calculateMatch,
} = require("../services/matchingService");

const {
  sendApplicationConfirmation,
  sendApplicationStatusEmail,
} = require("../services/emailService");


// =====================================================
// CANDIDATE - APPLY FOR JOB
// =====================================================

const applyForJob = async (req, res) => {

  try {

    const candidateId =
      req.user.id;

    const { jobId } =
      req.params;

    const {
      coverLetter = "",
    } = req.body || {};


    // -------------------------------------------------
    // 1. Validate Job ID
    // -------------------------------------------------

    if (!jobId || isNaN(jobId)) {

      return res.status(400).json({

        message:
          "Valid job ID is required",

      });

    }


    // -------------------------------------------------
    // 2. Get Job
    // -------------------------------------------------

    const [jobs] =
      await pool.query(

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

        message:
          "Job not found",

      });

    }


    const job =
      jobs[0];


    // -------------------------------------------------
    // 3. Check Job Status
    // -------------------------------------------------

    if (job.status !== "OPEN") {

      return res.status(400).json({

        message:
          "This job is no longer accepting applications",

      });

    }


    // -------------------------------------------------
    // 4. Get Candidate + Latest Resume
    // -------------------------------------------------

    const [candidates] =
      await pool.query(

        `SELECT
          id,
          name,
          email
        FROM users
        WHERE id = ?`,

        [candidateId]

      );


    if (candidates.length === 0) {

      return res.status(404).json({

        message:
          "Candidate not found",

      });

    }


    const candidate =
      candidates[0];


    const [resumes] =
      await pool.query(

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

        message:
          "Please upload a resume before applying",

      });

    }


    const resume =
      resumes[0];


    // -------------------------------------------------
    // 5. Check Duplicate Application
    // -------------------------------------------------

    const [existingApplications] =
      await pool.query(

        `SELECT
          id,
          status,
          match_score
        FROM applications
        WHERE job_id = ?
        AND candidate_id = ?`,

        [
          jobId,
          candidateId,
        ]

      );


    if (
      existingApplications.length > 0
    ) {

      return res.status(409).json({

        message:
          "You have already applied for this job",

        application:
          existingApplications[0],

      });

    }


    // -------------------------------------------------
    // 6. Calculate Match Score
    // -------------------------------------------------

    const matchResult =
      calculateMatch(

        resume.extracted_text || "",

        job.description || "",

        job.required_skills || ""

      );


    const matchScore =
      Number(
        matchResult.matchScore
      ) || 0;


    // -------------------------------------------------
    // 7. Create Application
    // -------------------------------------------------

    const [result] =
      await pool.query(

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
    // 8. Send Application Confirmation Email
    // -------------------------------------------------

    sendApplicationConfirmation(

      candidate.email,

      candidate.name,

      job.title,

      job.company

    ).catch(
      (emailError) => {

        console.error(
          "Application confirmation email error:",
          emailError.message
        );

      }
    );


    // -------------------------------------------------
    // 9. Response
    // -------------------------------------------------

    return res.status(201).json({

      message:
        "Application submitted successfully",

      application: {

        id:
          result.insertId,

        jobId:
          Number(jobId),

        candidateId,

        resumeId:
          resume.id,

        matchScore,

        status:
          "APPLIED",

      },

      match: {

        matchScore:
          matchResult.matchScore,

        textSimilarity:
          matchResult.textSimilarity,

        skillMatchScore:
          matchResult.skillMatchScore,

        matchedSkills:
          matchResult.matchedSkills,

        missingSkills:
          matchResult.missingSkills,

      },

    });


  } catch (error) {

    console.error(
      "Apply for job error:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to submit application",

      error:
        error.message,

    });

  }

};


// =====================================================
// CANDIDATE - VIEW OWN APPLICATIONS
// =====================================================

const getMyApplications =
  async (req, res) => {

    try {

      const candidateId =
        req.user.id;


      const [applications] =
        await pool.query(

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

          ORDER BY
            a.applied_at DESC`,

          [candidateId]

        );


      return res.status(200).json({

        message:
          "Applications fetched successfully",

        count:
          applications.length,

        applications,

      });


    } catch (error) {

      console.error(
        "Get candidate applications error:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to fetch applications",

        error:
          error.message,

      });

    }

  };


// =====================================================
// EMPLOYER - VIEW APPLICATIONS
// =====================================================

const getEmployerApplications =
  async (req, res) => {

    try {

      const employerId =
        req.user.id;


      const [applications] =
        await pool.query(

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

            u.name
              AS candidate_name,

            u.email
              AS candidate_email

          FROM applications a

          INNER JOIN jobs j
            ON a.job_id = j.id

          INNER JOIN users u
            ON a.candidate_id = u.id

          WHERE j.employer_id = ?

          ORDER BY
            a.match_score DESC,
            a.applied_at DESC`,

          [employerId]

        );


      return res.status(200).json({

        message:
          "Employer applications fetched successfully",

        count:
          applications.length,

        applications,

      });


    } catch (error) {

      console.error(
        "Get employer applications error:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to fetch employer applications",

        error:
          error.message,

      });

    }

  };


// =====================================================
// EMPLOYER - UPDATE APPLICATION STATUS
// =====================================================

const updateApplicationStatus =
  async (req, res) => {

    try {

      const employerId =
        req.user.id;

      const {
        applicationId,
      } = req.params;

      const {
        status,
      } = req.body;


      // -------------------------------------------------
      // 1. Allowed Statuses
      // -------------------------------------------------

      const allowedStatuses = [

        "APPLIED",

        "REVIEWING",

        "SHORTLISTED",

        "REJECTED",

        "HIRED",

      ];


      if (
        !allowedStatuses.includes(
          status
        )
      ) {

        return res.status(400).json({

          message:
            "Invalid application status",

          allowedStatuses,

        });

      }


      // -------------------------------------------------
      // 2. Verify Ownership + Get Email Information
      // -------------------------------------------------

      const [applications] =
        await pool.query(

          `SELECT
            a.id,

            a.status
              AS current_status,

            u.name
              AS candidate_name,

            u.email
              AS candidate_email,

            j.title
              AS job_title,

            j.company
              AS company

          FROM applications a

          INNER JOIN jobs j
            ON a.job_id = j.id

          INNER JOIN users u
            ON a.candidate_id = u.id

          WHERE a.id = ?
          AND j.employer_id = ?`,

          [
            applicationId,
            employerId,
          ]

        );


      if (
        applications.length === 0
      ) {

        return res.status(404).json({

          message:
            "Application not found",

        });

      }


      const application =
        applications[0];


      // -------------------------------------------------
      // 3. Check if Status is Already the Same
      // -------------------------------------------------

      if (
        application.current_status ===
        status
      ) {

        return res.status(200).json({

          message:
            "Application already has this status",

          application: {

            id:
              Number(
                applicationId
              ),

            previousStatus:
              application.current_status,

            status,

          },

        });

      }


      // -------------------------------------------------
      // 4. Update Status
      // -------------------------------------------------

      await pool.query(

        `UPDATE applications
        SET status = ?
        WHERE id = ?`,

        [
          status,
          applicationId,
        ]

      );


      // -------------------------------------------------
      // 5. Send Status Update Email
      // -------------------------------------------------

      sendApplicationStatusEmail(

        application.candidate_email,

        application.candidate_name,

        application.job_title,

        application.company,

        status

      ).catch(
        (emailError) => {

          console.error(
            "Status update email error:",
            emailError.message
          );

        }
      );


      // -------------------------------------------------
      // 6. Response
      // -------------------------------------------------

      return res.status(200).json({

        message:
          "Application status updated successfully",

        application: {

          id:
            Number(
              applicationId
            ),

          previousStatus:
            application.current_status,

          status,

        },

      });


    } catch (error) {

      console.error(
        "Update application status error:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to update application status",

        error:
          error.message,

      });

    }

  };


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

  applyForJob,

  getMyApplications,

  getEmployerApplications,

  updateApplicationStatus,

};