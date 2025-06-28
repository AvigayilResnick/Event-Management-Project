// src/api/roleRequests.js
import apiClient from "./apiClient";

// שליפת כל הבקשות (admin only)
export const getAllRoleRequests = async () => {
  const res = await apiClient.get("/roles/requests");
  return res.data;
};

// אישור או דחיית בקשה
export const respondToRoleRequest = async (requestId, status) => {
  const res = await apiClient.patch(`/roles/requests/${requestId}`, { status });
  return res.data;
};


export const requestToBecomeSupplier = async () => {
  const response = await apiClient.post("/roles/request", {requested_role: "supplier"});
  return response.data;
};
// // שליפת בקשת תפקיד אחת לפי המשתמש
// export const getMyRoleRequest = async () => {
//   const response = await apiClient.get("/roles/my-request");
//   return response.data; // { status, requested_role } או 404 אם אין
// };
export const getRoleRequestStatus = async () => {
  const response = await apiClient.get("/roles/status");
  return response.data; // { status: "pending" | "approved" | "rejected" | null }
};
