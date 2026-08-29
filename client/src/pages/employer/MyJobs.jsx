import { useEffect, useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getMyJobs,
  deleteJob,
} from "../../services/jobService";


function MyJobs() {

  const navigate =
    useNavigate();


  const [jobs, setJobs] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  const [deletingId, setDeletingId] =
    useState(null);


  // =====================================
  // FETCH EMPLOYER JOBS
  // =====================================

  const fetchMyJobs =
    async () => {

      try {

        setLoading(true);

        setError("");


        const data =
          await getMyJobs();


        console.log(
          "My Jobs Response:",
          data
        );


        setJobs(
          data.jobs || []
        );


      } catch (error) {

        console.error(
          "Fetch My Jobs Error:",
          error
        );


        console.error(
          "Server response:",
          error.response?.data
        );


        setError(

          error.response?.data?.message ||

          "Failed to fetch your jobs."

        );


      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    fetchMyJobs();

  }, []);


  // =====================================
  // VIEW APPLICATIONS
  // =====================================

  const handleViewApplications =
    (jobId) => {

      navigate(
        `/employer/jobs/${jobId}/applications`
      );

    };


  // =====================================
  // EDIT JOB
  // =====================================

  const handleEdit =
    (jobId) => {

      navigate(
        `/employer/edit-job/${jobId}`
      );

    };


  // =====================================
  // DELETE JOB
  // =====================================

  const handleDelete =
    async (jobId) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this job?"
        );


      if (!confirmDelete) {

        return;

      }


      try {

        setDeletingId(jobId);

        setError("");


        await deleteJob(jobId);


        // Remove deleted job from UI

        setJobs(
          (previousJobs) =>

            previousJobs.filter(
              (job) =>
                job.id !== jobId
            )

        );


      } catch (error) {

        console.error(
          "Delete job error:",
          error
        );


        console.error(
          "Server response:",
          error.response?.data
        );


        setError(

          error.response?.data?.message ||

          "Failed to delete job."

        );


      } finally {

        setDeletingId(null);

      }

    };


  // =====================================
  // FORMAT REQUIRED SKILLS
  // =====================================

  const getSkills =
    (requiredSkills) => {

      if (!requiredSkills) {

        return [];

      }


      // Backend may return skills as an array

      if (
        Array.isArray(
          requiredSkills
        )
      ) {

        return requiredSkills;

      }


      // Backend may return comma-separated skills

      return requiredSkills
        .split(",")
        .map(
          (skill) =>
            skill.trim()
        )
        .filter(Boolean);

    };


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <div className="page-container">

        <div className="loading-message">

          Loading your posted jobs...

        </div>

      </div>

    );

  }


  // =====================================
  // PAGE
  // =====================================

  return (

    <div className="page-container">

      <div className="my-jobs-container">


        {/* ================================
            HEADER
        ================================= */}

        <div className="my-jobs-header">

          <div>

            <h1>
              My Jobs
            </h1>

            <p>
              Manage and track all your posted jobs.
            </p>

          </div>


          <Link
            to="/employer/create-job"
            className="primary-button"
          >

            + Post New Job

          </Link>

        </div>


        {/* ================================
            ERROR MESSAGE
        ================================= */}

        {error && (

          <div className="error-message">

            {error}

          </div>

        )}


        {/* ================================
            EMPTY STATE
        ================================= */}

        {jobs.length === 0 ? (

          <div className="empty-jobs">

            <h2>
              No jobs posted yet
            </h2>

            <p>
              Start hiring by posting your first job.
            </p>


            <Link
              to="/employer/create-job"
              className="primary-button"
            >

              + Post Your First Job

            </Link>

          </div>

        ) : (

          <div className="jobs-list">


            {jobs.map(
              (job) => {

                const skills =
                  getSkills(
                    job.required_skills
                  );


                return (

                  <div
                    key={job.id}
                    className="employer-job-card"
                  >


                    {/* ======================
                        JOB INFORMATION
                    ====================== */}

                    <div className="employer-job-info">


                      {/* TITLE + STATUS */}

                      <div className="job-title-row">

                        <h2>

                          {job.title}

                        </h2>


                        <span
                          className={
                            `job-status ${job.status?.toLowerCase()}`
                          }
                        >

                          {job.status}

                        </span>

                      </div>


                      {/* COMPANY */}

                      <h3>

                        {job.company}

                      </h3>


                      {/* JOB META */}

                      <div className="job-meta">

                        <span>

                          📍 {job.location}

                        </span>


                        <span>

                          💼 {job.employment_type}

                        </span>


                        <span>

                          👥 {
                            job.application_count ??
                            0
                          } Applications

                        </span>

                      </div>


                      {/* DESCRIPTION */}

                      <p
                        className="job-description-preview"
                      >

                        {job.description}

                      </p>


                      {/* SKILLS */}

                      {skills.length > 0 && (

                        <div
                          className="job-skills"
                        >

                          {skills.map(

                            (
                              skill,
                              index
                            ) => (

                              <span
                                key={index}
                                className="skill"
                              >

                                {skill}

                              </span>

                            )

                          )}

                        </div>

                      )}


                    </div>


                    {/* ======================
                        ACTION BUTTONS
                    ====================== */}

                    <div
                      className="job-card-actions"
                    >


                      {/* ==================
                          VIEW APPLICATIONS
                      ================== */}

                      <button
                        type="button"
                        className="view-applications-button"
                        onClick={
                          () =>
                            handleViewApplications(
                              job.id
                            )
                        }
                      >

                        👥 Applications
                        {" "}
                        (
                          {job.application_count ?? 0}
                        )

                      </button>


                      {/* ==================
                          EDIT JOB
                      ================== */}

                      <button
                        type="button"
                        className="edit-job-button"
                        onClick={
                          () =>
                            handleEdit(
                              job.id
                            )
                        }
                      >

                        ✏ Edit

                      </button>


                      {/* ==================
                          DELETE JOB
                      ================== */}

                      <button
                        type="button"
                        className="delete-job-button"
                        disabled={
                          deletingId ===
                          job.id
                        }
                        onClick={
                          () =>
                            handleDelete(
                              job.id
                            )
                        }
                      >

                        {
                          deletingId === job.id

                            ? "Deleting..."

                            : "🗑 Delete"
                        }

                      </button>


                    </div>


                  </div>

                );

              }

            )}


          </div>

        )}


      </div>

    </div>

  );

}


export default MyJobs;