import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  getCandidateDashboard,
} from "../../services/dashboardService";

import {
  useAuth,
} from "../../context/AuthContext";


function CandidateDashboard() {

  const {
    user,
  } = useAuth();


  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================
  // FETCH DASHBOARD DATA
  // =====================================

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        setLoading(true);

        setError("");


        const data =
          await getCandidateDashboard();


        console.log(
          "Candidate Dashboard:",
          data
        );


        setDashboardData(data);


      } catch (error) {

        console.error(
          "Candidate dashboard error:",
          error
        );


        setError(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load dashboard."
        );


      } finally {

        setLoading(false);

      }

    };


    fetchDashboard();


  }, []);


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <div className="page-container">

        <div className="loading-message">

          Loading your dashboard...

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

      </div>

    );

  }


  const summary =
    dashboardData?.summary || {};


  const recentApplications =
    dashboardData?.recentApplications || [];


  // =====================================
  // DASHBOARD
  // =====================================

  return (

    <div className="page-container">

      <div className="candidate-dashboard">


        {/* HEADER */}

        <div className="dashboard-header">

          <div>

            <h1>
              Candidate Dashboard
            </h1>

            <p>
              Welcome back
              {user?.name
                ? `, ${user.name}`
                : ""}!
            </p>

            <span>
              Track your job applications
              and opportunities.
            </span>

          </div>


          <div className="dashboard-header-actions">

            <Link
              to="/jobs"
              className="primary-button"
            >
              Browse Jobs
            </Link>

          </div>

        </div>


        {/* SUMMARY CARDS */}

        <div className="dashboard-stats-grid">


          <div className="dashboard-stat-card">

            <span>
              Total Applications
            </span>

            <h2>
              {summary.totalApplications ?? 0}
            </h2>

          </div>


          <div className="dashboard-stat-card">

            <span>
              Applied
            </span>

            <h2>
              {summary.applied ?? 0}
            </h2>

          </div>


          <div className="dashboard-stat-card">

            <span>
              Reviewing
            </span>

            <h2>
              {summary.reviewing ?? 0}
            </h2>

          </div>


          <div className="dashboard-stat-card">

            <span>
              Shortlisted
            </span>

            <h2>
              {summary.shortlisted ?? 0}
            </h2>

          </div>


          <div className="dashboard-stat-card">

            <span>
              Rejected
            </span>

            <h2>
              {summary.rejected ?? 0}
            </h2>

          </div>


          <div className="dashboard-stat-card">

            <span>
              Hired
            </span>

            <h2>
              {summary.hired ?? 0}
            </h2>

          </div>


        </div>


        {/* QUICK ACTIONS */}

        <div className="dashboard-section">

          <div className="dashboard-section-header">

            <h2>
              Quick Actions
            </h2>

          </div>


          <div className="dashboard-actions-grid">


            <Link
              to="/jobs"
              className="dashboard-action-card"
            >

              <h3>
                Browse Jobs
              </h3>

              <p>
                Explore available job
                opportunities.
              </p>

            </Link>


            <Link
              to="/candidate/upload-resume"
              className="dashboard-action-card"
            >

              <h3>
                Upload Resume
              </h3>

              <p>
                Upload or update your
                latest resume.
              </p>

            </Link>


            <Link
              to="/candidate/applications"
              className="dashboard-action-card"
            >

              <h3>
                My Applications
              </h3>

              <p>
                Track all your job
                applications.
              </p>

            </Link>


          </div>

        </div>


        {/* RECENT APPLICATIONS */}

        <div className="dashboard-section">

          <div className="dashboard-section-header">

            <h2>
              Recent Applications
            </h2>


            <Link
              to="/candidate/applications"
              className="view-all-link"
            >
              View All
            </Link>

          </div>


          {recentApplications.length === 0 ? (

            <div className="empty-dashboard-card">

              <h3>
                No applications yet
              </h3>

              <p>
                Start exploring jobs and
                apply to opportunities
                that match your skills.
              </p>


              <Link
                to="/jobs"
                className="primary-button"
              >
                Browse Jobs
              </Link>

            </div>

          ) : (

            <div className="recent-applications-list">


              {recentApplications.map(
                (application) => (

                  <div
                    key={application.id}
                    className="recent-application-card"
                  >


                    <div className="recent-application-main">

                      <h3>
                        {application.title}
                      </h3>


                      <p>
                        {application.company}
                      </p>


                      <span>
                        📍 {application.location}
                      </span>

                    </div>


                    <div className="recent-application-match">

                      <span>
                        Match Score
                      </span>

                      <strong>
                        {Number(
                          application.match_score || 0
                        ).toFixed(0)}%
                      </strong>

                    </div>


                    <div className="recent-application-status">

                      <span
                        className={`status-badge status-${application.status?.toLowerCase()}`}
                      >
                        {application.status}
                      </span>

                    </div>


                  </div>

                )
              )}


            </div>

          )}

        </div>


      </div>

    </div>

  );

}


export default CandidateDashboard;