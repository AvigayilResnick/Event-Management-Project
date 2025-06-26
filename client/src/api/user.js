import apiClient from "./apiClient";

// שליפת פרטי המשתמש המחובר
export const getMyUser = async () => {
  const response = await apiClient.get("/users/me");
  return response.data;
};

// עדכון שם, טלפון, אימייל (אם צריך)
export const updateMyUser = async (data) => {
  const response = await apiClient.put("/users/me", data);
  return response.data;
};

// שינוי סיסמה – מחייב סיסמה נוכחית
export const changeUserPassword = async ({ currentPassword, newPassword }) => {
  const response = await apiClient.post("/users/change-password", {
    currentPassword,
    newPassword,
  });
  return response.data;
};
