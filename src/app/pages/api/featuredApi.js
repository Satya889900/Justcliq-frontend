// src/api/featuredApi.js
import api from "./authApi";

/* =========================================================
    FEATURED SERVICES & PRODUCTS
   ========================================================= */

/** GET all featured categories */
export const fetchFeaturedCategories = async (type) => {
  const url =
    type === "services"
      ? "/admin/api/featured-services/services"
      : "/admin/api/featured-products/products";

  const res = await api.get(url);
  return res.data?.data || [];
};

/** CREATE featured category (name + image) */
export const createFeaturedCategory = async (type, name, imageFile) => {
  const formData = new FormData();
  formData.append("name", name);

  if (imageFile) {
    formData.append("image", imageFile);
  }

  const url =
    type === "services"
      ? "/admin/api/featured-services/services"
      : "/admin/api/featured-products/products";

  const res = await api.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data?.data;
};

/** UPDATE featured category (name and/or image) */
export const updateFeaturedCategory = async (type, id, name, imageFile, status) => {
  const formData = new FormData();
  if (name) formData.append("name", name);
  if (status) formData.append("status", status);
  if (imageFile) formData.append("image", imageFile);

  const url =
    type === "services"
      ? `/admin/api/featured-services/services/${id}`
      : `/admin/api/featured-products/products/${id}`;

  const res = await api.put(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data?.data;
};

/** DELETE featured category */
export const deleteFeaturedCategory = async (type, id) => {
  const url =
    type === "services"
      ? `/admin/api/featured-services/services/${id}`
      : `/admin/api/featured-products/products/${id}`;

  const res = await api.delete(url);
  return res.data?.data;
};

/* No sub-items in your backend */
export const fetchFeaturedItemsByCategory = async () => [];
export const createFeaturedItem = async () => null;
export const deleteFeaturedItem = async () => null;

/** Single category */
export const fetchFeaturedCategoryById = async (type, id) => {
  const list = await fetchFeaturedCategories(type);
  return list.find((x) => x._id === id) || null;
};
