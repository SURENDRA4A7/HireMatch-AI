import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <span className="hero-badge">
          SMART CAREER PLATFORM
        </span>

        <h1>
          Find the Right Job.
          <br />

          Hire the Right Talent.

          <span>
            Powered by AI.
          </span>
        </h1>

        <p>
          HireMatch AI intelligently connects candidates with
          the right opportunities by analyzing skills,
          experience, resumes, and job requirements.
        </p>

        <div className="hero-actions">
          <Link
            to="/jobs"
            className="primary-button"
          >
            Find Jobs
          </Link>

          <Link
            to="/register"
            className="secondary-button"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;