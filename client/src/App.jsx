import { Routes, Route } from "react-router-dom";

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

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Jobs */}
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetails />} />

      {/* Candidate */}
      <Route
        path="/candidate/dashboard"
        element={<CandidateDashboard />}
      />

      <Route
        path="/candidate/upload-resume"
        element={<ResumeUpload />}
      />

      <Route
        path="/candidate/applications"
        element={<MyApplications />}
      />

      <Route
        path="/candidate/match/:jobId"
        element={<MatchResult />}
      />

      {/* Employer */}
      <Route
        path="/employer/dashboard"
        element={<EmployerDashboard />}
      />

      <Route
        path="/employer/create-job"
        element={<CreateJob />}
      />

      <Route
        path="/employer/jobs"
        element={<MyJobs />}
      />

      <Route
        path="/employer/jobs/:jobId/candidates"
        element={<MatchedCandidates />}
      />
    </Routes>
  );
}

export default App;