import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link
          to="/"
          className="navbar-logo"
        >
          HireMatch AI
        </Link>

        <div className="navbar-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/jobs">
            Jobs
          </Link>

          {!isAuthenticated && (
            <>
              <Link to="/login">
                Login
              </Link>

              <Link
                to="/register"
                className="register-link"
              >
                Register
              </Link>
            </>
          )}

          {isAuthenticated &&
            user?.role === "CANDIDATE" && (
              <>
                <Link to="/candidate/dashboard">
                  Dashboard
                </Link>

                <Link to="/candidate/upload-resume">
                  Upload Resume
                </Link>

                <Link to="/candidate/applications">
                  My Applications
                </Link>
              </>
            )}

          {isAuthenticated &&
            user?.role === "EMPLOYER" && (
              <>
                <Link to="/employer/dashboard">
                  Dashboard
                </Link>

                <Link to="/employer/create-job">
                  Post Job
                </Link>

                <Link to="/employer/jobs">
                  My Jobs
                </Link>
              </>
            )}

          {isAuthenticated && (
            <>
              <span className="navbar-user">
                {user?.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="logout-button"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;