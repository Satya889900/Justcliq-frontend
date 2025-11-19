// src/api/authApi.js
import axios from "axios";
import { toast } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ Set to true to allow sending cookies for auth
});

// attach token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// handle expired tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "jwt expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${API_BASE_URL}/admin/refresh`,
          {},
          { withCredentials: true } // ✅ Set to true to send refreshToken cookie
        );

        const { accessToken, refreshToken } = res.data.data;

        // store new tokens
        localStorage.setItem("authToken", accessToken);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken); // optional if you also store it
        }

        // retry the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        toast.error("Your session has expired. Please log in again.");
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/auth/login"; // redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export const getCurrentUser = async () => {
  const res = await api.get("/admin/me");
  return res.data;
};
// update admin profile (with image support)
export const updateAdminProfile = async (profileData) => {
  const formData = new FormData();
  formData.append("firstName", profileData.firstName);
  formData.append("lastName", profileData.lastName);
  formData.append("phone", profileData.phone || "");
  formData.append("address", profileData.address || "");

  // File upload (only append if user selected new image)
  if (profileData.profileImageFile) {
    formData.append("profileImage", profileData.profileImageFile);
  }

  const res = await api.put("/admin/profile/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};



export default api;
