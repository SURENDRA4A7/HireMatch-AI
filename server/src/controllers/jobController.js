const pool = require("../config/db");

const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      location,
      employment_type,
      salary_min,
      salary_max,
      required_skills,
    } = req.body;

    const employerId = req.user.id;

    if (
      !title ||
      !company ||
      !description ||
      !location ||
      !employment_type ||
      !required_skills
    ) {
      return res.status(400).json({
        message:
          "Title, company, description, location, employment type and required skills are required",
      });
    }

    if (
      salary_min !== undefined &&
      salary_max !== undefined &&
      Number(salary_min) > Number(salary_max)
    ) {
      return res.status(400).json({
        message: "Minimum salary cannot be greater than maximum salary",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO jobs
      (
        employer_id,
        title,
        company,
        description,
        location,
        employment_type,
        salary_min,
        salary_max,
        required_skills
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employerId,
        title.trim(),
        company.trim(),
        description.trim(),
        location.trim(),
        employment_type.trim(),
        salary_min || null,
        salary_max || null,
        required_skills.trim(),
      ]
    );

    return res.status(201).json({
      message: "Job created successfully",
      jobId: result.insertId,
    });
  } catch (error) {
    console.error("Create job error:", error);

    return res.status(500).json({
      message: "Failed to create job",
    });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const { skill, location } = req.query;

    let query = `
      SELECT
        j.id,
        j.employer_id,
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
      WHERE j.status = 'OPEN'
    `;

    const values = [];

    if (skill) {
      query += ` AND LOWER(j.required_skills) LIKE LOWER(?)`;
      values.push(`%${skill}%`);
    }

    if (location) {
      query += ` AND LOWER(j.location) LIKE LOWER(?)`;
      values.push(`%${location}%`);
    }

    query += ` ORDER BY j.created_at DESC`;

    const [jobs] = await pool.query(query, values);

    return res.status(200).json({
      message: "Jobs fetched successfully",
      count: jobs.length,
      filters: {
        skill: skill || null,
        location: location || null,
      },
      jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error);

    return res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};


const getJobById = async (req, res) => {
  try {
    const jobId = Number(req.params.id);

    if (!Number.isInteger(jobId) || jobId <= 0) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

    const [jobs] = await pool.query(
      `SELECT
        j.id,
        j.employer_id,
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
        u.name AS employer_name,
        u.email AS employer_email
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

    return res.status(200).json({
      message: "Job fetched successfully",
      job: jobs[0],
    });
  } catch (error) {
    console.error("Get job by ID error:", error);

    return res.status(500).json({
      message: "Failed to fetch job",
      error: error.message,
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const jobId = Number(req.params.id);
    const employerId = req.user.id;

    if (!Number.isInteger(jobId) || jobId <= 0) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

    const {
      title,
      company,
      description,
      required_skills,
      location,
      employment_type,
      salary_min,
      salary_max,
      experience_required,
      status,
    } = req.body;

    if (
      !title ||
      !company ||
      !description ||
      !required_skills ||
      !location ||
      !employment_type ||
      experience_required === undefined
    ) {
      return res.status(400).json({
        message: "Required job fields are missing",
      });
    }

    if (!["OPEN", "CLOSED"].includes(status)) {
      return res.status(400).json({
        message: "Status must be OPEN or CLOSED",
      });
    }

    if (
      salary_min !== undefined &&
      salary_max !== undefined &&
      Number(salary_min) > Number(salary_max)
    ) {
      return res.status(400).json({
        message: "Minimum salary cannot be greater than maximum salary",
      });
    }

    const [result] = await pool.query(
      `UPDATE jobs
       SET
         title = ?,
         company = ?,
         description = ?,
         required_skills = ?,
         location = ?,
         employment_type = ?,
         salary_min = ?,
         salary_max = ?,
         experience_required = ?,
         status = ?
       WHERE id = ?
       AND employer_id = ?`,
      [
        title.trim(),
        company.trim(),
        description.trim(),
        required_skills.trim(),
        location.trim(),
        employment_type.trim(),
        salary_min || null,
        salary_max || null,
        experience_required,
        status,
        jobId,
        employerId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Job not found or you are not the owner",
      });
    }

    return res.status(200).json({
      message: "Job updated successfully",
    });
  } catch (error) {
    console.error("Update job error:", error);

    return res.status(500).json({
      message: "Failed to update job",
      error: error.message,
    });
  }
};



const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const employerId = req.user.id;

    const [result] = await pool.query(
      `DELETE FROM jobs
       WHERE id = ?
       AND employer_id = ?`,
      [id, employerId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Job not found or you are not the owner",
      });
    }

    return res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete job error:", error);

    return res.status(500).json({
      message: "Failed to delete job",
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
};