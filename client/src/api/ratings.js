import apiClient from "./apiClient";

// שליחת דירוג – לוקח את userId מהטוקן
export const addRating = async ({ supplierId, rating }) => {
  const res = await apiClient.post("/ratings", { supplierId, rating });
  return res.data;
};

// קבלת ממוצע וסה"כ דירוגים
export const getSupplierRating = async (supplierId) => {
  const res = await apiClient.get(`/ratings/${supplierId}`);
  return res.data; // { average: 4.3, total: 12 }
};
