import { api } from "./axiosConfig";

// All product-related API calls
const productsPath = "/api/products";

export const productsApi = {
  getAll: () => api.get(productsPath),
  create: (data) => api.post(`${productsPath}/add`, data),
  update: (id, data) => api.put(`${productsPath}/${id}`, data),
  delete: (id) => api.delete(`${productsPath}/${id}`),
  uploadImage: (formData) => api.post(`${productsPath}/upload-image`, formData),
};
