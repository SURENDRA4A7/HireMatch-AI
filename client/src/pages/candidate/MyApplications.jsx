import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  getMyApplications,
} from "../../services/applicationService";


function MyApplications() {
  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getMyApplications();

        console.log(
          "My Applications:",
          data
        );

        setApplications(
          data.applications || []
        );

      } catch (error) {

        console.error(
          "Fetch applications error:",
          error
        );

        console.error(
          "Server response:",
          error.response?.data
        );

        setError(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load applications."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchApplications();

  }, []);


  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="page-container">

        <div className="loading-message">
          Loading your applications...
        </div>

      </div>
    );
  }


  // =====================================
  // ERROR
  // =====================================

  if (error) {
    return (
      <div className="page-container">

        <div className="error-message">
          {error}
        </div>

        <Link
          to="/jobs"
          className="primary-button"
        >
          Browse Jobs
        </Link>

      </div>
    );
  }


  // =====================================
  // PAGE
  // =====================================

  return (
    <div className="page-container">

      <div className="applications-container">

        <div className="applications-header">

          <div>

            <h1>
              My Applications
            </h1>

            <p>
              Track the jobs you have applied for.
            </p>

          </div>


          <Link
            to="/jobs"
            className="primary-button"
          >
            Browse Jobs
          </Link>

        </div>


        {/* NO APPLICATIONS */}

        {applications.length === 0 ? (

          <div className="empty-applications">

            <h2>
              No Applications Yet
            </h2>

            <p>
              Start exploring available jobs
              and apply for opportunities.
            </p>

            <Link
              to="/jobs"
              className="primary-button"
            >
              Browse Jobs
            </Link>

          </div>

        ) : (

          <div className="applications-grid">

            {applications.map(
              (application) => (

                <div
                  key={application.application_id}
                  className="application-card"
                >

                  <div className="application-card-header">

                    <div>

                      <h2>
                        {application.title}
                      </h2>

                      <p className="application-company">
                        {application.company}
                      </p>

                    </div>


                    <span
                      className={`application-status ${application.status?.toLowerCase()}`}
                    >
                      {application.status}
                    </span>

                  </div>


                  <div className="application-details">

                    <div className="application-detail">

                      <span>
                        📍 Location
                      </span>

                      <strong>
                        {application.location || "Not specified"}
                      </strong>

                    </div>


                    <div className="application-detail">

                      <span>
                        💼 Employment
                      </span>

                      <strong>
                        {application.employment_type || "Not specified"}
                      </strong>

                    </div>


                    <div className="application-detail">

                      <span>
                        📊 Match Score
                      </span>

                      <strong className="application-match-score">
                        {application.match_score ?? 0}%
                      </strong>

                    </div>


                    <div className="application-detail">

                      <span>
                        📅 Applied On
                      </span>

                      <strong>
                        {application.applied_at
                          ? new Date(
                              application.applied_at
                            ).toLocaleDateString()
                          : "Not available"}
                      </strong>

                    </div>

                  </div>


                  <div className="application-card-footer">

                    <Link
                      to={`/candidate/match/${application.job_id}`}
                      className="secondary-button"
                    >
                      View Match
                    </Link>

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


export default MyApplications;