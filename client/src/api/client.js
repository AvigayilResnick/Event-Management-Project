// client.js
import apiClient from "./apiClient";

// קבלת ספקים עם פרמטרים (כולל המרה למחיקה של ערכים ריקים)
export const getAllSuppliers = async (filters = {}) => {
  const cleanFilters = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value !== null && value !== undefined && value !== '') {
      cleanFilters[key] = value;
    }
  }
  const query = new URLSearchParams(cleanFilters).toString();
  const response = await apiClient.get(`/client/suppliers?${query}`);
  return response.data;
};
export const getAllEvents = async () => {
  const response = await apiClient.get('/client/events');
  return response.data; // ["Wedding", "Bar Mitzvah", ...]
};

export const requestToBecomeSupplier = async () => {
  const response = await apiClient.post("/roles/request", {requested_role: "supplier"});
  return response.data;
};
export const getAllCategories = async () => {
  const response = await apiClient.get('/client/categories');
  return response.data; // [{ category: "צילום" }, ...]
};

export const getSupplierFullDetails = async (supplierId) => {
  const response = await apiClient.get(`/client/suppliers/full/${supplierId}`);
  return response.data;
};

export const getMaxSupplierPrice = async () => {
  const response = await apiClient.get("/client/max-price");
  return response.data;
};
