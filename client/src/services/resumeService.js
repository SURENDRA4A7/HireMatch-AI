import api from "./api";

// Upload candidate resume
export const uploadResume = async (formData) => {
  const response = await api.post(
    "/resumes/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};