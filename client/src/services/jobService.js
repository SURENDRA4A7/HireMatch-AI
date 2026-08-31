import api from "./api";



// GET ALL JOBS


export const getJobs =
  async (filters = {}) => {

    const response =
      await api.get(
        "/jobs",
        {
          params: filters,
        }
      );

    return response.data;

  };



// GET EMPLOYER JOBS


export const getMyJobs =
  async () => {

    const response =
      await api.get(
        "/jobs/employer/my-jobs"
      );

    return response.data;

  };



// GET JOB BY ID


export const getJobById =
  async (id) => {

    const response =
      await api.get(
        `/jobs/${id}`
      );

    return response.data;

  };



// CREATE JOB


export const createJob =
  async (jobData) => {

    const response =
      await api.post(
        "/jobs",
        jobData
      );

    return response.data;

  };



// UPDATE JOB


export const updateJob =
  async (
    id,
    jobData
  ) => {

    const response =
      await api.put(
        `/jobs/${id}`,
        jobData
      );

    return response.data;

  };



// DELETE JOB


export const deleteJob =
  async (id) => {

    const response =
      await api.delete(
        `/jobs/${id}`
      );

    return response.data;

  };