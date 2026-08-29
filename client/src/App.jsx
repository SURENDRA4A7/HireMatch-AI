import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Jobs from "./pages/jobs/Jobs";
import JobDetails from "./pages/jobs/JobDetails";

import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import ResumeUpload from "./pages/candidate/ResumeUpload";
import MyApplications from "./pages/candidate/MyApplications";
import MatchResult from "./pages/candidate/MatchResult";

import EmployerDashboard from "./pages/employer/EmployerDashboard";
import CreateJob from "./pages/employer/CreateJob";
import MyJobs from "./pages/employer/MyJobs";
import MatchedCandidates from "./pages/employer/MatchedCandidates";

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Job Pages */}
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetails />} />

      {/* Candidate Pages */}
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

      {/* Employer Pages */}
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