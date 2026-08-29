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
  // FORMAT DATE
  // =====================================

  const formatDate =
    (date) => {

      if (!date) {

        return "Not available";

      }


      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    };


  // =====================================
  // FORMAT STATUS
  // =====================================

  const formatStatus =
    (status) => {

      if (!status) {

        return "Unknown";

      }


      return status
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(
          /\b\w/g,
          (letter) =>
            letter.toUpperCase()
        );

    };


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <div className="page-container">

        <div className="my-applications-loading">

          <div className="loading-spinner" />

          <p>
            Loading your applications...
          </p>

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

        <div className="my-applications-error">

          <div className="state-icon">
            !
          </div>

          <h2>
            Unable to Load Applications
          </h2>

          <p>
            {error}
          </p>


          <Link
            to="/jobs"
            className="applications-primary-button"
          >
            Browse Jobs
          </Link>

        </div>

      </div>

    );

  }


  // =====================================
  // PAGE
  // =====================================

  return (

    <div className="page-container">

      <div className="my-applications-page">


        {/* =================================
            HEADER
        ================================= */}

        <div className="my-applications-hero">


          <div className="my-applications-hero-content">

            <div className="page-label">
              CANDIDATE PORTAL
            </div>


            <h1>
              My Applications
            </h1>


            <p>
              Track your job applications and stay updated
              on every stage of your hiring journey.
            </p>


            <div className="application-summary-row">

              <div className="application-summary-item">

                <span className="summary-number">
                  {applications.length}
                </span>

                <span className="summary-label">
                  Total Applications
                </span>

              </div>


              <div className="application-summary-divider" />


              <div className="application-summary-item">

                <span className="summary-number">

                  {
                    applications.filter(
                      (application) =>
                        application.status ===
                        "SHORTLISTED"
                    ).length
                  }

                </span>

                <span className="summary-label">
                  Shortlisted
                </span>

              </div>


              <div className="application-summary-divider" />


              <div className="application-summary-item">

                <span className="summary-number">

                  {
                    applications.filter(
                      (application) =>
                        application.status ===
                        "HIRED"
                    ).length
                  }

                </span>

                <span className="summary-label">
                  Hired
                </span>

              </div>

            </div>

          </div>


          <Link
            to="/jobs"
            className="applications-primary-button"
          >
            <span>
              +
            </span>

            Find Jobs
          </Link>


        </div>


        {/* =================================
            EMPTY STATE
        ================================= */}

        {applications.length === 0 ? (

          <div className="my-applications-empty">

            <div className="empty-illustration">

              📋

            </div>


            <h2>
              No Applications Yet
            </h2>


            <p>
              Explore available opportunities and apply
              for jobs that match your skills.
            </p>


            <Link
              to="/jobs"
              className="applications-primary-button"
            >
              Explore Jobs
            </Link>

          </div>


        ) : (


          <>

            {/* =============================
                SECTION HEADER
            ============================== */}

            <div className="applications-section-heading">

              <div>

                <h2>
                  Application History
                </h2>

                <p>
                  View and track the status of your submitted applications.
                </p>

              </div>


              <div className="application-count-badge">

                {applications.length}

                <span>
                  Applications
                </span>

              </div>

            </div>


            {/* =============================
                APPLICATION LIST
            ============================== */}

            <div className="professional-applications-list">


              {applications.map(
                (application) => {


                  const matchScore =
                    Number(
                      application.match_score
                    ) || 0;


                  return (

                    <div
                      key={
                        application.id ||
                        application.application_id
                      }
                      className="professional-application-card"
                    >


                      {/* =====================
                          TOP SECTION
                      ====================== */}

                      <div className="application-card-top">


                        <div className="application-main-info">


                          <div className="application-title-section">

                            <h2>
                              {application.title}
                            </h2>


                            <p className="application-company-name">

                              {application.company}

                            </p>

                          </div>


                          <span
                            className={`professional-status-badge ${
                              application.status
                                ?.toLowerCase()
                                .replace(
                                  /_/g,
                                  "-"
                                ) || ""
                            }`}
                          >

                            <span className="status-dot" />

                            {
                              formatStatus(
                                application.status
                              )
                            }

                          </span>


                        </div>


                        {/* MATCH SCORE */}

                        <div className="match-score-section">

                          <div
                            className="match-score-circle"
                            style={{

                              "--score":
                                `${matchScore * 3.6}deg`,

                            }}
                          >

                            <div className="match-score-inner">

                              <strong>
                                {matchScore}%
                              </strong>

                            </div>

                          </div>


                          <span>
                            Match Score
                          </span>

                        </div>


                      </div>


                      {/* =====================
                          META INFORMATION
                      ====================== */}

                      <div className="professional-application-meta">


                        <div className="professional-meta-item">

                          <span className="meta-icon">

                            📍

                          </span>


                          <div>

                            <small>
                              Location
                            </small>


                            <strong>

                              {
                                application.location ||
                                "Not specified"
                              }

                            </strong>

                          </div>

                        </div>


                        <div className="professional-meta-item">

                          <span className="meta-icon">

                            💼

                          </span>


                          <div>

                            <small>
                              Employment
                            </small>


                            <strong>

                              {
                                application.employment_type ||
                                "Not specified"
                              }

                            </strong>

                          </div>

                        </div>


                        <div className="professional-meta-item">

                          <span className="meta-icon">

                            📅

                          </span>


                          <div>

                            <small>
                              Applied On
                            </small>


                            <strong>

                              {
                                formatDate(
                                  application.applied_at
                                )
                              }

                            </strong>

                          </div>

                        </div>


                      </div>


                      {/* =====================
                          FOOTER
                      ====================== */}

                      <div className="professional-application-footer">


                        <div className="application-id-text">

                          Application #

                          {
                            application.id ||
                            application.application_id ||
                            application.job_id
                          }

                        </div>


                        <Link
                          to={`/candidate/match/${application.job_id}`}
                          className="view-match-professional-button"
                        >

                          View Match

                          <span>
                            →
                          </span>

                        </Link>


                      </div>


                    </div>

                  );

                }

              )}


            </div>


          </>

        )}


      </div>

    </div>

  );

}


export default MyApplications;