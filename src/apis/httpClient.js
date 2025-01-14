import axios from "axios";
import LocalContextKey from "@/common/enum/LocalContextKey.js";
import Role from "@/common/enum/Role";

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
    const pageRole = window.PageRole;

    const contextKey =
      pageRole == Role.Admin
        ? LocalContextKey.Admin
        : pageRole == Role.Renter || pageRole == Role.Innkeeper
        ? LocalContextKey.Management
        : "context";

    const context = localStorage.getItem(contextKey);
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

// Interceptor để xử lý các yêu cầu
httpClient.interceptors.response.use(
  (response) => {
    return response;
  }, // Nếu thành công, trả về response
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xử lý lỗi 401 tại đây
      console.error("Unauthorized! Redirecting to login...");

      // Xóa context
      const pageRole = window.PageRole;

      const contextKey =
        pageRole == Role.Admin
          ? LocalContextKey.Admin
          : pageRole == Role.Renter || pageRole == Role.Innkeeper
          ? LocalContextKey.Management
          : "context";

      localStorage.removeItem(contextKey);
      // window.location.href = "/"; // Chuyển đến trang chủ
    }
    return Promise.reject(error); // Trả lại lỗi để xử lý tiếp
  }
);

export default httpClient;
