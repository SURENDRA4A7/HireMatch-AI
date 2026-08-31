import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  getEmployerDashboard,
} from "../../services/dashboardService";


function EmployerDashboard() {

  const {
    user,
  } = useAuth();


  const [
    dashboardData,
    setDashboardData,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  
  // FETCH EMPLOYER DASHBOARD
  

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        setLoading(true);

        setError("");


        const data =
          await getEmployerDashboard();


        console.log(
          "Employer Dashboard Data:",
          data
        );


        setDashboardData(data);


      } catch (error) {

        console.error(
          "Employer dashboard error:",
          error
        );


        setError(
          error.response?.data?.message ||
          error.message ||
          "Failed to load employer dashboard."
        );


      } finally {

        setLoading(false);

      }

    };


    fetchDashboard();


  }, []);


  
  // LOADING STATE


  if (loading) {

    return (

      <div className="page-container">

        <div className="loading-message">

          Loading your employer dashboard...

        </div>

      </div>

    );

  }


 
  // ERROR STATE
 

  if (error) {

    return (

      <div className="page-container">

        <div className="dashboard-error">

          <h2>
            Unable to Load Dashboard
          </h2>

          <p>
            {error}
          </p>


          <button
            type="button"
            onClick={() => window.location.reload()}
            className="primary-button"
          >
            Try Again
          </button>

        </div>

      </div>

    );

  }


  const summary =
    dashboardData?.summary || {};


  const recentJobs =
    dashboardData?.recentJobs || [];


  const recentApplications =
    dashboardData?.recentApplications || [];


  return (

    <div className="page-container">

      <div className="employer-dashboard">


        {/* DASHBOARD HEADER */}

        <div className="employer-dashboard-header">

          <div className="employer-header-content">

            <span className="dashboard-label">
              EMPLOYER PORTAL
            </span>


            <h1>
              Welcome back
              {user?.name
                ? `, ${user.name}`
                : ""}!
            </h1>


            <p>
              Manage your job postings, track
              applications, and discover the
              right talent for your team.
            </p>

          </div>


          <Link
            to="/employer/create-job"
            className="employer-post-job-button"
          >
            + Post a New Job
          </Link>

        </div>


        {/* STATISTICS CARDS */}

        <div className="employer-stats-grid">


          <div className="employer-stat-card">

            <div className="stat-icon">
              💼
            </div>

            <div>

              <span>
                Jobs Posted
              </span>

              <h2>
                {summary.totalJobs ?? 0}
              </h2>

            </div>

          </div>


          <div className="employer-stat-card">

            <div className="stat-icon">
              📄
            </div>

            <div>

              <span>
                Total Applications
              </span>

              <h2>
                {summary.totalApplications ?? 0}
              </h2>

            </div>

          </div>


          <div className="employer-stat-card">

            <div className="stat-icon">
              🔍
            </div>

            <div>

              <span>
                Under Review
              </span>

              <h2>
                {summary.reviewing ?? 0}
              </h2>

            </div>

          </div>


          <div className="employer-stat-card">

            <div className="stat-icon">
              ⭐
            </div>

            <div>

              <span>
                Shortlisted
              </span>

              <h2>
                {summary.shortlisted ?? 0}
              </h2>

            </div>

          </div>


          <div className="employer-stat-card">

            <div className="stat-icon">
              🎉
            </div>

            <div>

              <span>
                Hired
              </span>

              <h2>
                {summary.hired ?? 0}
              </h2>

            </div>

          </div>


        </div>


        {/* QUICK ACTIONS*/}

        <div className="employer-dashboard-section">

          <div className="employer-section-title">

            <div>

              <span>
                QUICK ACCESS
              </span>

              <h2>
                Manage Your Hiring
              </h2>

            </div>

          </div>


          <div className="employer-actions-grid">


            <Link
              to="/employer/create-job"
              className="employer-action-card"
            >

              <div className="action-icon">
                ＋
              </div>

              <h3>
                Post a Job
              </h3>

              <p>
                Create a new opportunity and
                start receiving applications.
              </p>

              <span>
                Create Job →
              </span>

            </Link>


            <Link
              to="/employer/jobs"
              className="employer-action-card"
            >

              <div className="action-icon">
                💼
              </div>

              <h3>
                Manage Jobs
              </h3>

              <p>
                View, manage and monitor all
                your active job postings.
              </p>

              <span>
                View Jobs →
              </span>

            </Link>


            <Link
              to="/employer/applications"
              className="employer-action-card"
            >

              <div className="action-icon">
                👥
              </div>

              <h3>
                View Candidates
              </h3>

              <p>
                Review candidate applications
                and discover your best matches.
              </p>

              <span>
                View Applications →
              </span>

            </Link>


          </div>

        </div>


        {/* RECENT JOBS */}

        <div className="employer-dashboard-section">

          <div className="employer-section-header">

            <div>

              <span className="section-label">
                YOUR JOBS
              </span>

              <h2>
                Recent Job Postings
              </h2>

            </div>


            <Link
              to="/employer/jobs"
              className="view-all-link"
            >
              View All →
            </Link>

          </div>


          {recentJobs.length === 0 ? (

            <div className="employer-empty-state">

              <div className="empty-icon">
                💼
              </div>

              <h3>
                No jobs posted yet
              </h3>

              <p>
                Start building your team by
                posting your first job.
              </p>


              <Link
                to="/employer/create-job"
                className="employer-post-job-button"
              >
                + Post Your First Job
              </Link>

            </div>

          ) : (

            <div className="employer-jobs-list">


              {recentJobs.map((job) => (

                <div
                  key={job.id}
                  className="employer-job-item"
                >

                  <div className="job-main-info">

                    <div className="job-icon">
                      💼
                    </div>


                    <div>

                      <h3>
                        {job.title}
                      </h3>


                      <p>
                        {job.company}
                      </p>


                      <div className="job-meta">

                        <span>
                          📍 {job.location}
                        </span>

                        <span>
                          {job.employment_type}
                        </span>

                      </div>

                    </div>

                  </div>


                  <Link
                    to="/employer/jobs"
                    className="job-manage-link"
                  >
                    Manage →
                  </Link>

                </div>

              ))}


            </div>

          )}

        </div>


        {/* RECENT APPLICATIONS*/}

        <div className="employer-dashboard-section">

          <div className="employer-section-header">

            <div>

              <span className="section-label">
                CANDIDATES
              </span>

              <h2>
                Recent Applications
              </h2>

            </div>


            <Link
              to="/employer/applications"
              className="view-all-link"
            >
              View All →
            </Link>

          </div>


          {recentApplications.length === 0 ? (

            <div className="employer-empty-state">

              <div className="empty-icon">
                👥
              </div>

              <h3>
                No applications yet
              </h3>

              <p>
                Candidate applications will
                appear here once candidates
                apply to your jobs.
              </p>

            </div>

          ) : (

            <div className="employer-applications-list">


              {recentApplications.map(
                (application) => (

                  <div
                    key={application.id}
                    className="employer-application-item"
                  >


                    <div className="candidate-info">

                      <div className="candidate-avatar">

                        {application.candidate_name
                          ? application.candidate_name
                            .charAt(0)
                            .toUpperCase()
                          : "C"}

                      </div>


                      <div>

                        <h3>
                          {application.candidate_name}
                        </h3>


                        <p>
                          {application.candidate_email}
                        </p>


                        <span>
                          Applied for
                          {" "}
                          <strong>
                            {application.title}
                          </strong>
                        </span>

                      </div>

                    </div>


                    <div className="application-right-section">


                      <div className="match-score-small">

                        <span>
                          Match Score
                        </span>


                        <strong>

                          {Number(
                            application.match_score || 0
                          ).toFixed(0)}%

                        </strong>

                      </div>


                      <span
                        className={`application-status status-${application.status?.toLowerCase()}`}
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


export default EmployerDashboard;