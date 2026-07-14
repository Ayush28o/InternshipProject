import axios from "axios";

const api = axios.create({
  baseURL: "/api/products",
});

export const scrapeProducts = (payload) => api.post("/scrape", payload);
export const fetchProducts = (params) => api.get("/", { params });
export const fetchStats = () => api.get("/stats");
export const clearProducts = () => api.delete("/");
export const exportCsvUrl = () => "/api/products/export/csv";

export default api;
