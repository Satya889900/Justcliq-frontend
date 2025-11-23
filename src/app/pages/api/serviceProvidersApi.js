// // src/api/serviceProvidersApi.js
// import Joi from "joi";
// import api from "./authApi"; // use the centralized axios instance

// import axios from "axios";
// import { API_BASE } from "../../../configs/auth.config";

// // src/validations/providerAction.validation.js


// // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // Fetch all service providers
// // Fetch all service providers
// export const fetchServiceProviders = async (token) => {
//   try {
//     const res = await axios.get(
//       `${API_BASE}/admin/api/serviceProvider/serviceproviders`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return res.data.data || [];
//   } catch (err) {
//     console.error("Fetch service providers error:", err);
//     throw err;
//   }
// };


// // Update provider action
// export const updateProviderAction = async (id, action, reason) => {
//   try {
//     const res = await api.patch(`/admin/api/serviceProvider/services/${id}/action`, {
//       action,
//       reason,
//     });
//     return res.data;
//   } catch (err) {
//     throw new Error(err.response?.data?.message || err.message || "Failed to update provider action");
//   }
// };

// // Joi validation schema
// export const providerActionSchema = Joi.object({
//   action: Joi.string()
//   .valid("Approved", "Disapproved", "Suspended", "Pending")
//   .required(),
//   reason: Joi.string().allow("").max(200),
// });


// export const getAllServiceProviders = async (token) => {
//   try {
//     const res = await axios.get(`${API_BASE}/admin/api/serviceProvider/serviceproviders`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return res.data.data || [];
//   } catch (error) {
//     throw new Error(
//       error.response?.data?.message || "Failed to load service providers"
//     );
//   }
// };

// src/api/serviceProvidersApi.js
// src/app/pages/api/serviceProvidersApi.js
import Joi from "joi";
import api from "./authApi"; // centralized axios instance (baseURL + auth)
import axios from "axios";
import { API_BASE } from "../../../configs/auth.config";

// 🔹 Joi validation schema for provider action
export const providerActionSchema = Joi.object({
  action: Joi.string()
    .valid("Approved", "Disapproved", "Suspended", "Pending")
    .required(),
  reason: Joi.string().allow("").max(200),
});

// 🔹 Fetch all service providers (Admin list)
export const fetchServiceProviders = async (token) => {
  if (!token) {
    throw new Error("Admin token is missing. Please login again.");
  }

  try {
    const res = await axios.get(
      `${API_BASE}/admin/api/serviceProvider/serviceproviders`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data.data || [];
  } catch (err) {
    console.error("Fetch service providers error:", err);
    throw new Error(
      err.response?.data?.message || err.message || "Failed to load service providers"
    );
  }
};

// (Optional helper if you need same elsewhere)
export const getAllServiceProviders = async (token) => {
  return fetchServiceProviders(token);
};

// 🔹 Update provider action (Approve / Disapprove / Suspend / Pending)
export const updateProviderAction = async (serviceId, action, reason) => {
  try {
    const res = await api.patch(
      `/admin/api/serviceProvider/services/${serviceId}/action`,
      {
        action,
        reason,
      }
    );
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message ||
        err.message ||
        "Failed to update provider action"
    );
  }
};
