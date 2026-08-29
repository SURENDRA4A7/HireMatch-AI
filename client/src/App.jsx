import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

import Jobs from "./pages/jobs/Jobs.jsx";
import JobDetails from "./pages/jobs/JobDetails.jsx";

import CandidateDashboard from "./pages/candidate/CandidateDashboard.jsx";
import ResumeUpload from "./pages/candidate/ResumeUpload.jsx";
import MyApplications from "./pages/candidate/MyApplications.jsx";
import MatchResult from "./pages/candidate/MatchResult.jsx";

import EmployerDashboard from "./pages/employer/EmployerDashboard.jsx";
import CreateJob from "./pages/employer/CreateJob.jsx";
import MyJobs from "./pages/employer/MyJobs.jsx";
import MatchedCandidates from "./pages/employer/MatchedCandidates.jsx";

import EditJob from "./pages/employer/EditJob";
import EmployerApplications from "./pages/employer/EmployerApplications";

function App() {
return (
<> <Navbar />

  <Routes>

    {/* Public Routes */}
    <Route
      path="/"
      element={<Home />}
    />

    <Route
      path="/login"
      element={<Login />}
    />

    <Route
      path="/register"
      element={<Register />}
    />

    {/* Public Job Routes */}
    <Route
      path="/jobs"
      element={<Jobs />}
    />

    <Route
      path="/jobs/:id"
      element={<JobDetails />}
    />

    {/* Candidate Protected Routes */}
    <Route
      path="/candidate/dashboard"
      element={
        <ProtectedRoute
          allowedRoles={["CANDIDATE"]}
        >
          <CandidateDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/candidate/upload-resume"
      element={
        <ProtectedRoute
          allowedRoles={["CANDIDATE"]}
        >
          <ResumeUpload />
        </ProtectedRoute>
      }
    />

    <Route
      path="/candidate/applications"
      element={
        <ProtectedRoute
          allowedRoles={["CANDIDATE"]}
        >
          <MyApplications />
        </ProtectedRoute>
      }
    />

    <Route
      path="/candidate/match/:jobId"
      element={
        <ProtectedRoute
          allowedRoles={["CANDIDATE"]}
        >
          <MatchResult />
        </ProtectedRoute>
      }
    />

    {/* Employer Protected Routes */}
    <Route
      path="/employer/dashboard"
      element={
        <ProtectedRoute
          allowedRoles={["EMPLOYER"]}
        >
          <EmployerDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/employer/create-job"
      element={
        <ProtectedRoute
          allowedRoles={["EMPLOYER"]}
        >
          <CreateJob />
        </ProtectedRoute>
      }
    />

    <Route
      path="/employer/jobs"
      element={
        <ProtectedRoute
          allowedRoles={["EMPLOYER"]}
        >
          <MyJobs />
        </ProtectedRoute>
      }
    />

    <Route
      path="/employer/jobs/:jobId/candidates"
      element={
        <ProtectedRoute
          allowedRoles={["EMPLOYER"]}
        >
          <MatchedCandidates />
        </ProtectedRoute>
      }
    />
    <Route
        path="/employer/edit-job/:id"
        element={<EditJob />}
   />
     <Route
       path="/employer/jobs/:jobId/applications"
      element={<EmployerApplications />}
     />

  </Routes>
</>

);
}

export default App;
