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


        {/* LOGO */}

        <Link
          to="/"
          className="navbar-logo"
        >

          <span className="navbar-logo-icon">
            H
          </span>

          <span>
            HireMatch
            <strong> AI</strong>
          </span>

        </Link>


        {/* NAVIGATION LINKS */}

        <div className="navbar-links">


          <Link
            to="/"
            className="nav-link"
          >
            Home
          </Link>


          <Link
            to="/jobs"
            className="nav-link"
          >
            Jobs
          </Link>


          {/* NOT LOGGED IN */}

          {!isAuthenticated && (

            <>

              <Link
                to="/login"
                className="nav-link"
              >
                Login
              </Link>


              <Link
                to="/register"
                className="navbar-register-button"
              >
                Get Started
              </Link>

            </>

          )}


          {/* CANDIDATE NAVIGATION */}

          {isAuthenticated &&
            user?.role === "CANDIDATE" && (

              <>

                <Link
                  to="/candidate/dashboard"
                  className="nav-link"
                >
                  Dashboard
                </Link>


                <Link
                  to="/candidate/upload-resume"
                  className="nav-link"
                >
                  Resume
                </Link>


                <Link
                  to="/candidate/applications"
                  className="nav-link"
                >
                  Applications
                </Link>

              </>

            )}


          {/* EMPLOYER NAVIGATION */}

          {isAuthenticated &&
            user?.role === "EMPLOYER" && (

              <>

                <Link
                  to="/employer/dashboard"
                  className="nav-link"
                >
                  Dashboard
                </Link>


                <Link
                  to="/employer/create-job"
                  className="nav-link"
                >
                  Post Job
                </Link>


                <Link
                  to="/employer/jobs"
                  className="nav-link"
                >
                  My Jobs
                </Link>

              </>

            )}


          {/* LOGGED IN USER */}

          {isAuthenticated && (

            <div className="navbar-user-section">

              <div className="navbar-user-info">

                <span className="navbar-user-avatar">
                  {user?.name
                    ? user.name
                        .charAt(0)
                        .toUpperCase()
                    : "U"}
                </span>


                <span className="navbar-user-name">
                  {user?.name}
                </span>

              </div>


              <button
                type="button"
                onClick={handleLogout}
                className="navbar-logout-button"
              >
                Logout
              </button>

            </div>

          )}


        </div>

      </div>

    </nav>

  );

}


export default Navbar;