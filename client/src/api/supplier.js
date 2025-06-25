import apiClient from "./apiClient";

export const getSupplierProfile = async (supplierId) => {
  const response = await apiClient.get(`/suppliers/supplier-profile/myProfile`);
  return response.data;
};

export const updateSupplierProfile = async (supplierData) => {
  const response = await apiClient.put(`/supplier/profile`, supplierData);
  return response.data;
};
export const createSupplierPage = async (formData) => {
  const response = await apiClient.post("/suppliers/supplier-profile", formData);
  return response.data;
};
