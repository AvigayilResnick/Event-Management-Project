import apiClient from "./apiClient";

export const signup = async (userData) => {
  const response = await apiClient.post("/auth/signup", userData);
  return response.data; // { token, user }
};

export const login = async (credentials) => {
  const response = await apiClient.post("/auth/login", credentials);
  return response.data; // { token, user }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
