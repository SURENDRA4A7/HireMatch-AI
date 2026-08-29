import api from "./api";

export const getJobMatch = async (jobId) => {
  const response = await api.post(
    `/matching/job/${jobId}`
  );

  return response.data;
};