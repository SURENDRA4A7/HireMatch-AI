import api from "./api";



// CANDIDATE DASHBOARD


export const getCandidateDashboard = async () => {

  const response = await api.get(
    "/dashboard/candidate"
  );

  return response.data;

};


// EMPLOYER DASHBOARD


export const getEmployerDashboard = async () => {

  const response = await api.get(
    "/dashboard/employer"
  );

  return response.data;

};