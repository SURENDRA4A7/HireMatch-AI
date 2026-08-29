import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getEmployerApplications,
  updateApplicationStatus,
} from "../../services/applicationService";


function EmployerApplications() {

  const { jobId } =
    useParams();

  const navigate =
    useNavigate();


  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updatingId, setUpdatingId] =
    useState(null);


  // =====================================
  // FETCH APPLICATIONS
  // =====================================

  useEffect(() => {

    const fetchApplications =
      async () => {

        try {

          setLoading(true);

          setError("");


          const data =
            await getEmployerApplications();


          console.log(
            "Employer Applications:",
            data
          );


          // Filter applications for selected job

          const jobApplications =
            (data.applications || [])
              .filter(
                (application) =>
                  String(
                    application.job_id
                  ) === String(
                    jobId
                  )
              );


          setApplications(
            jobApplications
          );


        } catch (error) {

          console.error(
            "Fetch applications error:",
            error
          );


          setError(

            error.response?.data?.message ||

            "Failed to fetch applications."

          );


        } finally {

          setLoading(false);

        }

      };


    fetchApplications();


  }, [jobId]);


  // =====================================
  // UPDATE APPLICATION STATUS
  // =====================================

  const handleStatusChange =
    async (
      applicationId,
      newStatus
    ) => {

      try {

        setUpdatingId(
          applicationId
        );


        await updateApplicationStatus(
          applicationId,
          newStatus
        );


        // Update status in UI

        setApplications(
          (previousApplications) =>

            previousApplications.map(
              (application) =>

                application.id ===
                applicationId

                  ? {
                      ...application,

                      status:
                        newStatus,
                    }

                  : application

            )

        );


      } catch (error) {

        console.error(
          "Update status error:",
          error
        );


        alert(

          error.response?.data?.message ||

          "Failed to update application status."

        );


      } finally {

        setUpdatingId(
          null
        );

      }

    };


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <div className="page-container">

        <div className="loading-message">

          Loading applications...

        </div>

      </div>

    );

  }


  // =====================================
  // PAGE
  // =====================================

  return (

    <div className="page-container">

      <div className="employer-applications-container">


        {/* HEADER */}

        <div className="applications-header">

          <div>

            <button
              type="button"
              className="back-button"
              onClick={
                () =>
                  navigate(
                    "/employer/jobs"
                  )
              }
            >

              ← Back to My Jobs

            </button>


            <h1>
              Job Applications
            </h1>


            <p>

              Review and manage candidates
              who applied for this position.

            </p>

          </div>


          <div
            className="application-total"
          >

            {applications.length}

            {" "}

            Applications

          </div>

        </div>


        {/* ERROR */}

        {error && (

          <div className="error-message">

            {error}

          </div>

        )}


        {/* EMPTY */}

        {applications.length === 0 ? (

          <div className="empty-jobs">

            <h2>
              No applications yet
            </h2>

            <p>

              Applications from candidates
              will appear here.

            </p>

          </div>

        ) : (

          <div className="applications-list">


            {applications.map(
              (application) => (

                <div
                  key={application.id}
                  className="application-card"
                >


                  {/* CANDIDATE INFO */}

                  <div
                    className="candidate-application-info"
                  >

                    <h2>

                      {
                        application.candidate_name ||
                        "Candidate"
                      }

                    </h2>


                    <p
                      className="candidate-email"
                    >

                      {
                        application.candidate_email ||
                        "Email not available"
                      }

                    </p>


                    <p
                      className="applied-date"
                    >

                      Applied on{" "}

                      {
                        application.applied_at
                          ? new Date(
                              application.applied_at
                            ).toLocaleDateString()
                          : "-"
                      }

                    </p>

                  </div>


                  {/* MATCH SCORE */}

                  <div
                    className="application-match"
                  >

                    <span>
                      Match Score
                    </span>

                    <strong>

                      {
                        Number(
                          application.match_score || 0
                        ).toFixed(0)
                      }%

                    </strong>

                  </div>


                  {/* STATUS */}

                  <div
                    className="application-status-section"
                  >

                    <label>
                      Status
                    </label>


                    <select
                      value={
                        application.status
                      }
                      disabled={
                        updatingId ===
                        application.id
                      }
                      onChange={
                        (event) =>
                          handleStatusChange(
                            application.id,
                            event.target.value
                          )
                      }
                    >

                      <option value="APPLIED">
                        Applied
                      </option>

                      <option value="REVIEWING">
                        Reviewing
                      </option>

                      <option value="SHORTLISTED">
                        Shortlisted
                      </option>

                      <option value="REJECTED">
                        Rejected
                      </option>

                      <option value="HIRED">
                        Hired
                      </option>

                    </select>

                  </div>


                </div>

              )
            )}


          </div>

        )}


      </div>

    </div>

  );

}


export default EmployerApplications;