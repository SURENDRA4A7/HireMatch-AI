import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getJobs } from "../../services/jobService";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [skillSearch, setSkillSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getJobs();

      // Supports either:
      // [ ...jobs ]
      // OR { jobs: [ ...jobs ] }

      const jobsData = Array.isArray(data)
        ? data
        : data.jobs || [];

      setJobs(jobsData);
      setFilteredJobs(jobsData);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const skill = skillSearch.toLowerCase().trim();
    const location = locationSearch.toLowerCase().trim();

    const filtered = jobs.filter((job) => {
      const jobSkills = (
        job.required_skills || ""
      ).toLowerCase();

      const jobLocation = (
        job.location || ""
      ).toLowerCase();

      const skillMatches =
        !skill || jobSkills.includes(skill);

      const locationMatches =
        !location || jobLocation.includes(location);

      return skillMatches && locationMatches;
    });

    setFilteredJobs(filtered);
  };

  const handleReset = () => {
    setSkillSearch("");
    setLocationSearch("");
    setFilteredJobs(jobs);
  };

  if (loading) {
    return (
      <div className="jobs-page">
        <h2>Loading jobs...</h2>
      </div>
    );
  }

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <h1>Find Your Next Opportunity</h1>

        <p>
          Explore jobs and find opportunities
          matching your skills.
        </p>
      </div>

      <div className="job-search-box">
        <div className="search-group">
          <label>Skills</label>

          <input
            type="text"
            placeholder="Java, React, Node.js..."
            value={skillSearch}
            onChange={(event) =>
              setSkillSearch(event.target.value)
            }
          />
        </div>

        <div className="search-group">
          <label>Location</label>

          <input
            type="text"
            placeholder="Bangalore, Hyderabad..."
            value={locationSearch}
            onChange={(event) =>
              setLocationSearch(event.target.value)
            }
          />
        </div>

        <button
          type="button"
          className="search-button"
          onClick={handleSearch}
        >
          Search Jobs
        </button>

        <button
          type="button"
          className="reset-button"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!error && (
        <div className="jobs-result-info">
          <p>
            {filteredJobs.length} job(s) found
          </p>
        </div>
      )}

      <div className="jobs-grid">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="job-card"
            >
              <h2>{job.title}</h2>

              <h3>
                {job.company || "Company"}
              </h3>

              <p className="job-location">
                📍 {job.location}
              </p>

              <p className="job-type">
                {job.employment_type}
              </p>

              <p className="job-description">
                {job.description}
              </p>

              <div className="skills-container">
                {(job.required_skills || "")
                  .split(",")
                  .filter(Boolean)
                  .map((skill, index) => (
                    <span
                      key={index}
                      className="skill-tag"
                    >
                      {skill.trim()}
                    </span>
                  ))}
              </div>

              <div className="job-card-footer">
                <span>
                  ₹{job.salary_min} - ₹{job.salary_max}
                </span>

                <Link
                  to={`/jobs/${job.id}`}
                  className="view-job-button"
                >
                  View Job
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-jobs">
            <h3>No jobs found</h3>

            <p>
              Try changing your skills or location
              search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Jobs;