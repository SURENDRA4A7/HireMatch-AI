import api from "./api";

// Register user
export const registerUser = async (userData) => {
  const response = await api.post(
    "/auth/register",
    userData
  );

  return response.data;
};


// Login user
export const loginUser = async (credentials) => {
  const response = await api.post(
    "/auth/login",
    credentials
  );

  return response.data;
};