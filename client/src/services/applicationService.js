import api from "./api";


// =====================================
// APPLY FOR JOB
// =====================================

export const applyForJob = async (
  jobId,
  applicationData = {}
) => {

  const response =
    await api.post(
      `/applications/jobs/${jobId}`,
      applicationData
    );

  return response.data;

};


// =====================================
// CANDIDATE MY APPLICATIONS
// =====================================

export const getMyApplications =
  async () => {

    const response =
      await api.get(
        "/applications/my"
      );

    return response.data;

  };


// =====================================
// EMPLOYER APPLICATIONS
// =====================================

export const getEmployerApplications =
  async () => {

    const response =
      await api.get(
        "/applications/employer"
      );

    return response.data;

  };


// =====================================
// UPDATE APPLICATION STATUS
// =====================================

export const updateApplicationStatus =
  async (
    applicationId,
    status
  ) => {

    const response =
      await api.patch(
        `/applications/${applicationId}/status`,
        { status }
      );

    return response.data;

  };