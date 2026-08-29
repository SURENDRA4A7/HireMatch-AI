import api from "./api";


export const applyForJob = async (
  jobId,
  coverLetter = ""
) => {
  const response = await api.post(
    `/applications/jobs/${jobId}`,
    {
      coverLetter,
    }
  );

  return response.data;
};


export const getMyApplications = async () => {
  const response = await api.get(
    "/applications/my"
  );

  return response.data;
};