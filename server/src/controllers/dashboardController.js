const pool = require("../config/db");



// CANDIDATE DASHBOARD


const getCandidateDashboard = async (
  req,
  res
) => {
  try {

    const candidateId = req.user.id;


   
    // TOTAL APPLICATIONS

    const [
      totalResult,
    ] = await pool.query(
      `SELECT COUNT(*) AS totalApplications
       FROM applications
       WHERE candidate_id = ?`,
      [candidateId]
    );


    // APPLICATION STATUS COUNTS

    const [
      statusResult,
    ] = await pool.query(
      `SELECT
        status,
        COUNT(*) AS count
       FROM applications
       WHERE candidate_id = ?
       GROUP BY status`,
      [candidateId]
    );


    const statusCounts = {
      APPLIED: 0,
      REVIEWING: 0,
      SHORTLISTED: 0,
      REJECTED: 0,
      HIRED: 0,
    };


    statusResult.forEach(
      (item) => {
        statusCounts[item.status] =
          item.count;
      }
    );


    // RECENT APPLICATIONS
    

    const [
      recentApplications,
    ] = await pool.query(
      `SELECT
        a.id,
        a.job_id,
        a.match_score,
        a.status,
        a.applied_at,

        j.title,
        j.company,
        j.location,
        j.employment_type

       FROM applications a

       INNER JOIN jobs j
         ON a.job_id = j.id

       WHERE a.candidate_id = ?

       ORDER BY
         a.applied_at DESC

       LIMIT 5`,
      [candidateId]
    );


    return res.status(200).json({

      message:
        "Candidate dashboard fetched successfully",

      summary: {

        totalApplications:
          totalResult[0]
            .totalApplications,

        applied:
          statusCounts.APPLIED,

        reviewing:
          statusCounts.REVIEWING,

        shortlisted:
          statusCounts.SHORTLISTED,

        rejected:
          statusCounts.REJECTED,

        hired:
          statusCounts.HIRED,

      },

      recentApplications,

    });


  } catch (error) {

    console.error(
      "Candidate dashboard error:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to fetch candidate dashboard",

      error:
        error.message,

    });

  }
};


      // EMPLOYER DASHBOARD

const getEmployerDashboard = async (
  req,
  res
) => {
  try {

    const employerId = req.user.id;


          // TOTAL JOBS POSTED

    const [
      totalJobsResult,
    ] = await pool.query(
      `SELECT COUNT(*) AS totalJobs
       FROM jobs
       WHERE employer_id = ?`,
      [employerId]
    );


            // TOTAL APPLICATIONS RECEIVED

    const [
      totalApplicationsResult,
    ] = await pool.query(
      `SELECT COUNT(*) AS totalApplications

       FROM applications a

       INNER JOIN jobs j
         ON a.job_id = j.id

       WHERE j.employer_id = ?`,
      [employerId]
    );


          // APPLICATION STATUS COUNTS
    

    const [
      statusResult,
    ] = await pool.query(
      `SELECT
        a.status,
        COUNT(*) AS count

       FROM applications a

       INNER JOIN jobs j
         ON a.job_id = j.id

       WHERE j.employer_id = ?

       GROUP BY a.status`,
      [employerId]
    );


    const statusCounts = {
      APPLIED: 0,
      REVIEWING: 0,
      SHORTLISTED: 0,
      REJECTED: 0,
      HIRED: 0,
    };


    statusResult.forEach(
      (item) => {

        statusCounts[item.status] =
          item.count;

      }
    );


    
    // RECENT JOBS
    
    const [
      recentJobs,
    ] = await pool.query(
      `SELECT
        id,
        title,
        company,
        location,
        employment_type,
        created_at

       FROM jobs

       WHERE employer_id = ?

       ORDER BY
         created_at DESC

       LIMIT 5`,
      [employerId]
    );


    
    // RECENT APPLICATIONS
    
    const [
      recentApplications,
    ] = await pool.query(
      `SELECT
        a.id,
        a.job_id,
        a.candidate_id,
        a.match_score,
        a.status,
        a.applied_at,

        j.title,
        j.company,

        u.name AS candidate_name,
        u.email AS candidate_email

       FROM applications a

       INNER JOIN jobs j
         ON a.job_id = j.id

       INNER JOIN users u
         ON a.candidate_id = u.id

       WHERE j.employer_id = ?

       ORDER BY
         a.applied_at DESC

       LIMIT 5`,
      [employerId]
    );


    
    
    // DASHBOARD RESPONSE
    

    return res.status(200).json({

      message:
        "Employer dashboard fetched successfully",

      summary: {

        totalJobs:
          totalJobsResult[0]
            .totalJobs,

        totalApplications:
          totalApplicationsResult[0]
            .totalApplications,

        applied:
          statusCounts.APPLIED,

        reviewing:
          statusCounts.REVIEWING,

        shortlisted:
          statusCounts.SHORTLISTED,

        rejected:
          statusCounts.REJECTED,

        hired:
          statusCounts.HIRED,

      },

      recentJobs,

      recentApplications,

    });


  } catch (error) {

    console.error(
      "Employer dashboard error:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to fetch employer dashboard",

      error:
        error.message,

    });

  }
};



// EXPORT CONTROLLERS


module.exports = {

  getCandidateDashboard,

  getEmployerDashboard,

};