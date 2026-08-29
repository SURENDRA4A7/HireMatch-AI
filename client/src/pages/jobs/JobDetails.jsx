import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { getJobById } from "../../services/jobService";
import { useAuth } from "../../context/AuthContext";

function JobDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getJobById(id);

      // Supports different backend response structures
      const jobData = data.job || data;

      setJob(jobData);
    } catch (error) {
      console.error("Failed to fetch job:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load job details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "CANDIDATE") {
      alert("Only candidates can apply for jobs.");
      return;
    }

    navigate(`/candidate/match/${job.id}`);
  };

  if (loading) {
    return (
      <div className="job-details-page">
        <h2>Loading job details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-details-page">
        <div className="error-message">
          {error}
        </div>

        <Link
          to="/jobs"
          className="back-button"
        >
          Back to Jobs
        </Link>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-details-page">
        <h2>Job not found</h2>

        <Link
          to="/jobs"
          className="back-button"
        >
          Back to Jobs
        </Link>
      </div>
    );
  }

  const skills = (job.required_skills || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  return (
    <div className="job-details-page">

      <Link
        to="/jobs"
        className="back-button"
      >
        ← Back to Jobs
      </Link>

      <div className="job-details-card">

        <div className="job-details-header">
          <div>
            <h1>{job.title}</h1>

            <h2>
              {job.company || "Company"}
            </h2>

            <p className="job-location">
              📍 {job.location || "Not specified"}
            </p>
          </div>

          <span className="job-status">
            {job.status || "OPEN"}
          </span>
        </div>

        <hr />

        <section className="job-details-section">
          <h3>Job Type</h3>

          <p>
            {job.employment_type || "Not specified"}
          </p>
        </section>

        <section className="job-details-section">
          <h3>Job Description</h3>

          <p>
            {job.description ||
              "No description available."}
          </p>
        </section>

        <section className="job-details-section">
          <h3>Required Skills</h3>

          <div className="skills-container">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <span
                  key={index}
                  className="skill-tag"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p>No skills specified.</p>
            )}
          </div>
        </section>

        <section className="job-details-section">
          <h3>Salary Range</h3>

          <p className="salary-text">
            ₹{job.salary_min || "Not specified"}
            {" - "}
            ₹{job.salary_max || "Not specified"}
          </p>
        </section>

        <section className="job-details-section">
          <h3>Experience Required</h3>

          <p>
            {job.experience_required ?? 0} year(s)
          </p>
        </section>

        <div className="job-details-actions">

          {user?.role === "EMPLOYER" ? (
            <p className="employer-info">
              Employers cannot apply for jobs.
            </p>
          ) : (
            <button
              type="button"
              className="apply-button"
              onClick={handleApply}
            >
              Check Match & Apply
            </button>
          )}

        </div>

      </div>
    </div>
  );
}

export default JobDetails;