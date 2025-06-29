// client.js
import apiClient from "./apiClient";



export const getAllSuppliers = async (filters, signal) => {
  const response = await apiClient.get("/client/suppliers", {
    params: filters,
    signal, // ✅ Axios יתמוך בביטול עם signal
  });
  return response.data;
};


export const getAllEvents = async () => {
  const response = await apiClient.get('/client/events');
  return response.data; // ["Wedding", "Bar Mitzvah", ...]
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

export const getSuppliersForHome = async (filters) => {
  const response = await apiClient.get("/client/suppliers", {
    params: {
      ...filters,
      limit: filters.limit || 4,
      offset: filters.offset || 0,
    },
  });
  return response.data;
};