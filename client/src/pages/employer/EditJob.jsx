import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getJobById,
  updateJob,
} from "../../services/jobService";


function EditJob() {

  const { id } = useParams();

  const navigate = useNavigate();


  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");


  const [formData, setFormData] =
    useState({

      title: "",

      company: "",

      description: "",

      required_skills: "",

      location: "",

      employment_type: "",

      salary_min: "",

      salary_max: "",

      experience_required: "",

      status: "OPEN",

    });


  // =====================================
  // FETCH JOB DETAILS
  // =====================================

  useEffect(() => {

    const fetchJob = async () => {

      try {

        setLoading(true);

        setError("");


        const data =
          await getJobById(id);


        const job =
          data.job;


        setFormData({

          title:
            job.title || "",

          company:
            job.company || "",

          description:
            job.description || "",

          required_skills:
            job.required_skills || "",

          location:
            job.location || "",

          employment_type:
            job.employment_type || "",

          salary_min:
            job.salary_min ?? "",

          salary_max:
            job.salary_max ?? "",

          experience_required:
            job.experience_required ?? "",

          status:
            job.status || "OPEN",

        });


      } catch (error) {

        console.error(
          "Fetch job error:",
          error
        );


        setError(

          error.response?.data?.message ||

          "Failed to fetch job details."

        );


      } finally {

        setLoading(false);

      }

    };


    fetchJob();


  }, [id]);


  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange =
    (event) => {

      const {
        name,
        value,
      } = event.target;


      setFormData(

        (previousData) => ({

          ...previousData,

          [name]: value,

        })

      );

    };


  // =====================================
  // UPDATE JOB
  // =====================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();


      try {

        setSubmitting(true);

        setError("");

        setSuccessMessage("");


        await updateJob(
          id,
          formData
        );


        setSuccessMessage(
          "Job updated successfully!"
        );


        setTimeout(
          () => {

            navigate(
              "/employer/jobs"
            );

          },
          1200
        );


      } catch (error) {

        console.error(
          "Update job error:",
          error
        );


        console.error(
          "Server response:",
          error.response?.data
        );


        setError(

          error.response?.data?.message ||

          "Failed to update job."

        );


      } finally {

        setSubmitting(false);

      }

    };


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <div className="page-container">

        <div className="loading-message">

          Loading job details...

        </div>

      </div>

    );

  }


  // =====================================
  // EDIT JOB PAGE
  // =====================================

  return (

    <div className="page-container">

      <div className="job-form-container">


        <div className="job-form-header">

          <h1>
            Edit Job
          </h1>

          <p>
            Update your job posting details.
          </p>

        </div>


        {error && (

          <div className="error-message">

            {error}

          </div>

        )}


        {successMessage && (

          <div className="success-message">

            {successMessage}

          </div>

        )}


        <form
          onSubmit={handleSubmit}
          className="job-form"
        >


          {/* JOB TITLE */}

          <div className="form-group">

            <label>
              Job Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

          </div>


          {/* COMPANY */}

          <div className="form-group">

            <label>
              Company
            </label>

            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            />

          </div>


          {/* LOCATION */}

          <div className="form-group">

            <label>
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />

          </div>


          {/* EMPLOYMENT TYPE */}

          <div className="form-group">

            <label>
              Employment Type
            </label>

            <select
              name="employment_type"
              value={formData.employment_type}
              onChange={handleChange}
              required
            >

              <option value="">
                Select Employment Type
              </option>

              <option value="FULL_TIME">
                Full Time
              </option>

              <option value="PART_TIME">
                Part Time
              </option>

              <option value="CONTRACT">
                Contract
              </option>

              <option value="INTERNSHIP">
                Internship
              </option>

            </select>

          </div>


          {/* EXPERIENCE */}

          <div className="form-group">

            <label>
              Experience Required (Years)
            </label>

            <input
              type="number"
              name="experience_required"
              value={
                formData.experience_required
              }
              onChange={handleChange}
              min="0"
              required
            />

          </div>


          {/* SALARY MIN */}

          <div className="form-group">

            <label>
              Minimum Salary
            </label>

            <input
              type="number"
              name="salary_min"
              value={formData.salary_min}
              onChange={handleChange}
              min="0"
            />

          </div>


          {/* SALARY MAX */}

          <div className="form-group">

            <label>
              Maximum Salary
            </label>

            <input
              type="number"
              name="salary_max"
              value={formData.salary_max}
              onChange={handleChange}
              min="0"
            />

          </div>


          {/* STATUS */}

          <div className="form-group">

            <label>
              Job Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >

              <option value="OPEN">
                Open
              </option>

              <option value="CLOSED">
                Closed
              </option>

            </select>

          </div>


          {/* REQUIRED SKILLS */}

          <div className="form-group full-width">

            <label>
              Required Skills
            </label>

            <input
              type="text"
              name="required_skills"
              value={
                formData.required_skills
              }
              onChange={handleChange}
              placeholder="Java, Spring Boot, MySQL"
              required
            />

          </div>


          {/* DESCRIPTION */}

          <div className="form-group full-width">

            <label>
              Job Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="8"
              required
            />

          </div>


          {/* BUTTONS */}

          <div className="job-form-actions">

            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >

              {submitting
                ? "Updating Job..."
                : "Update Job"}

            </button>


            <button
              type="button"
              className="secondary-button"
              onClick={
                () => navigate(
                  "/employer/jobs"
                )
              }
            >

              Cancel

            </button>

          </div>


        </form>

      </div>

    </div>

  );

}


export default EditJob;