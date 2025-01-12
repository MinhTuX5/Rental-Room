import axios from "axios";

// Content-Type
const ApplicationJson = "application/json";
// tạo 1 axios instances
const httpClient = axios.create({
  baseURL: "https://localhost:44364/api/v1/",
  // timeout: 30000, // Nếu kết nối có vấn đề -> tránh treo kết nối mãi mãi
  headers: {
    "Content-Type": ApplicationJson,
  },
});

/**
 * Kiểm tra lại với mỗi request xem có token không
 */
httpClient.interceptors.request.use(
  (config) => {
    const context = localStorage.getItem("context");
    if (context) {
      const contextObj = JSON.parse(context);
      if (contextObj.token) {
        config.headers["Authorization"] = `Bearer ${contextObj.token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default httpClient;
