import api from "./api";

// Get all jobs
export const getJobs = async () => {
  const response = await api.get("/jobs");

  return response.data;
};

// Get job by ID
export const getJobById = async (id) => {
  const response = await api.get(`/jobs/${id}`);

  return response.data;
};