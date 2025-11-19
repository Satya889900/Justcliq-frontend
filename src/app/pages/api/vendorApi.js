import api from "./authApi";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches all product vendors.
 * @param {string} token - The authentication token.
 * @returns {Promise<Array>} A list of vendors.
 */
export const fetchVendors = async (token) => {
  try {
    const res = await api.get(`/admin/api/productVendor/vendors`);

    if (res.data?.success) {
      return res.data.data;
    }
    throw new Error(res.data.message || "Failed to fetch vendors");
  } catch (err) {
    console.error("❌ Error fetching vendors:", err);
    throw new Error(err.response?.data?.message || "Could not fetch vendors.");
  }
};