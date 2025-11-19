// // src/api/categoryApi.js
// import axios from "axios";

// const API_BASE = import.meta.env.VITE_API_BASE_URL;// adjust if backend differs

// // ✅ Fetch all service + product categories
// export const fetchCategories = async (token) => {
//   try {
//     const res = await axios.get(`${API_BASE}/admin/api/stock/categories`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (res.data?.success) {
//       return res.data.data; // { serviceCategories, productCategories }
//     } else {
//       throw new Error(res.data.message || "Failed to fetch categories");
//     }
//   } catch (err) {
//     console.error("❌ Error fetching categories:", err);
//     throw err;
//   }
// };


// // Fetch category items based on ID and type
// export const fetchCategoryItems = async (categoryId, type, token) => {
//   try {
//     const response = await axios.get(
//       `${API_BASE}/admin/api/stock/category-items/${categoryId}`,
//       {
//         params: { type },
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return response.data?.data || [];
//   } catch (error) {
//     console.error("Error fetching stock items:", error);
//     throw new Error(
//       error.response?.data?.message || "Failed to fetch stock items"
//     );
//   }
// };

// // ✅ Batch update stock for products/services
// export const batchUpdateStock = async (type, updates, token) => {
//   try {
//     const res = await axios.post(
//       `${API_BASE}/admin/api/stock/batch-update`,
//       { type, updates },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!res.data?.success) {
//       throw new Error(res.data.message || "Failed to update stock");
//     }
//   } catch (err) {
//     console.error("❌ Error updating stock:", err);
//     throw new Error(err.response?.data?.message || "Could not save stock updates.");
//   }
// };

// src/api/stockApi.js
import api from "./authApi";

// -------------------------------------------
// ✅ Fetch all stock categories
// -------------------------------------------
export const fetchCategories = async () => {
  // No need to pass token, axios instance handles it
  const res = await api.get(`/admin/api/stock/categories`);
  return res.data.data; 
};

// -------------------------------------------
// ✅ Fetch category items (products/services)
// -------------------------------------------
export const fetchCategoryItems = async (categoryId, type) => {
  // No need to pass token, axios instance handles it
  const response = await api.get(
    `/admin/api/stock/category-items/${categoryId}`,
    { params: { type } }
  );

  return response.data.data;
};

// -------------------------------------------
// ✅ Batch update stock for products/services
// -------------------------------------------
export const batchUpdateStock = async (type, updates) => {
  // No need to pass token, axios instance handles it
  const res = await api.post(
    `/admin/api/stock/batch-update`,
    {
      type,
      updates, // Must be an array: [{id, quantity}, {id, weight}, ...]
    }
  );

  return res.data.data;
};
