// src/api/roleRequests.js
import apiClient from "./apiClient";

// שליפת כל הבקשות (admin only)
export const getAllRoleRequests = async () => {
  const res = await apiClient.get("/role-requests/requests");
  return res.data;
};

// אישור או דחיית בקשה
export const respondToRoleRequest = async (requestId, status) => {
  const res = await apiClient.patch(`/role-requests/requests/${requestId}`, { status });
  return res.data;
};


export const requestToBecomeSupplier = async () => {
  const response = await apiClient.post("/roles/request", {requested_role: "supplier"});
  return response.data;
};