// import { useState, useEffect, useRef } from "react";
// import { toast } from "react-hot-toast";
// import { FaSave, FaSpinner } from "react-icons/fa";
// import { Button, Input } from "components/ui";
// import { Page } from "components/shared/Page";
// import api, { updateAdminProfile } from "../api/authApi";

// export function AdminProfilePage() {
//   const [user, setUser] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     address: "",
//     profileImage: "",
//     profileImageFile: null,
//     previewImage: null, // For temporary client-side preview
//   });

//   const [loading, setLoading] = useState(true);
//   const [originalUser, setOriginalUser] = useState(null); // To store the initial state
//   const [saving, setSaving] = useState(false);
//   const fileInputRef = useRef(null);

//   // Fetch profile
//   useEffect(() => {
//     const fetchUser = async () => {
//       setLoading(true);
//       try {
//         const res = await api.get("/admin/profile");
//         const data = res.data.data;

//         // Construct full image URL if it's a relative path
//         const fullImage =
//           data.profileImage && !data.profileImage.startsWith("http")
//             ? `${import.meta.env.VITE_API_BASE_URL}${data.profileImage}`
//             : data.profileImage;

//         const initialProfile = {
//           firstName: data.firstName || "",
//           lastName: data.lastName || "",
//           email: data.email || "",
//           phone: data.phone || "",
//           address: data.address || "",
//           profileImage: fullImage || "",
//           profileImageFile: null,
//           previewImage: null,
//         };

//         setUser(initialProfile);
//         setOriginalUser(initialProfile); // Store the original state
//       } catch {
//         toast.error("Failed to load profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   // Text input handling
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUser((prev) => ({ ...prev, [name]: value }));
//   };

//   // Image upload handler
//   const handleImageUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setUser((prev) => ({
//       ...prev,
//       profileImageFile: file, // The actual file to be uploaded
//       previewImage: URL.createObjectURL(file), // For temporary preview only
//     }));
//   };

//   // Cancel changes and revert to original state
//   const handleCancel = () => {
//     setUser(originalUser);
//     if (fileInputRef.current) fileInputRef.current.value = ""; // Clear file input
//     toast("Changes discarded.");
//   };

//   // Save changes
//   const handleSaveChanges = async (e) => {
//     e.preventDefault();
//     setSaving(true);

//     try {
//       const response = await updateAdminProfile(user); // response.data will be { success, message, data: { ...user, profileImage: '...' } }
//       const newProfileData = response.data.data;

//       // Construct full image URL from backend response
//       const newFullImage =
//         newProfileData.profileImage && !newProfileData.profileImage.startsWith("http")
//           ? `${import.meta.env.VITE_API_BASE_URL}${newProfileData.profileImage}`
//           : newProfileData.profileImage;

//       const updatedUser = {
//         ...user, // Use current user state as a base
//         ...newProfileData, // Override with fresh data from the backend
//         profileImage: newFullImage || "",
//         previewImage: null, // Clear the temporary preview
//         profileImageFile: null,
//       };

//       setUser(updatedUser);
//       setOriginalUser(updatedUser); // ✅ Sync the original user state with the new saved state

//       toast.success("Profile updated successfully!");
//     } catch (err) {
//       toast.error(err.message || "Failed to update profile");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <FaSpinner className="animate-spin text-4xl text-blue-600" />
//       </div>
//     );
//   }

//   return (
//     <Page title="Admin Profile">
//       <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
//         <div className="bg-white dark:bg-dark-700 shadow-lg rounded-xl p-6">
//           <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-100 mb-6">
//             Edit Profile
//           </h1>

//           {/* Avatar Upload Section */}
//           <div className="flex flex-col items-center mb-6">
//             <div className="relative w-32 h-32">
//               <img
//                 src={
//                   user.previewImage
//                     ? user.previewImage // 1. Show new preview
//                     : user.profileImage // 2. Show saved Cloudinary URL
//                     ? user.profileImage
//                     : "/images/200x200.png" // 3. Fallback
//                 }
//                 alt="Profile"
//                 className="w-full h-full rounded-full object-cover border shadow"
//               />
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current.click()}
//                 className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full text-sm shadow"
//               >
//                 ✏️
//               </button>

//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 className="hidden"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//               />
//             </div>
//             <p className="text-xs text-gray-500 mt-2">Click icon to change photo</p>
//           </div>

//           {/* Form Section */}
//           <form onSubmit={handleSaveChanges} className="space-y-4">
//             <Input
//               label="First Name"
//               name="firstName"
//               value={user.firstName}
//               onChange={handleInputChange}
//               placeholder="Enter your first name"
//             />

//             <Input
//               label="Last Name"
//               name="lastName"
//               value={user.lastName}
//               onChange={handleInputChange}
//               placeholder="Enter your last name"
//             />

//             <Input
//               label="Email"
//               name="email"
//               type="email"
//               value={user.email}
//               disabled
//             />

//             <Input
//               label="Phone Number"
//               name="phone"
//               value={user.phone}
//               onChange={handleInputChange}
//               placeholder="9876543210"
//             />

//             <Input
//               label="Address"
//               name="address"
//               value={user.address}
//               onChange={handleInputChange}
//               placeholder="Enter your address"
//             />

//             <div className="flex justify-end pt-4 gap-3">
//               <Button
//                 type="button"
//                 onClick={handleCancel}
//                 disabled={saving}
//                 variant="outline"
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={saving} className="gap-2">
//                 {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
//                 <span>{saving ? "Saving..." : "Save Changes"}</span>
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </Page>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { FaSave, FaSpinner } from "react-icons/fa";
import { Button, Input } from "components/ui";
import { Page } from "components/shared/Page";
import api, { updateAdminProfile } from "../api/authApi";

export function AdminProfilePage() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    profileImage: "",
    profileImageFile: null,
    previewImage: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [originalUser, setOriginalUser] = useState(null);

  const fileInputRef = useRef(null);

  // -----------------------------
  // Fetch Admin Profile
  // -----------------------------
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await api.get("/admin/profile");
        const data = res.data.data;

        const fullImage =
          data.profileImage && !data.profileImage.startsWith("http")
            ? `${import.meta.env.VITE_API_BASE_URL}${data.profileImage}`
            : data.profileImage;

        const initialData = {
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          profileImage: fullImage,
          profileImageFile: null,
          previewImage: null,
        };

        setUser(initialData);
        setOriginalUser(initialData);
      } catch (err) {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // -----------------------------
  // Input Change Handler
  // -----------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // -----------------------------
  // Image Upload Preview
  // -----------------------------
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUser((prev) => ({
      ...prev,
      profileImageFile: file,
      previewImage: URL.createObjectURL(file),
    }));
  };

  // -----------------------------
  // Cancel Changes
  // -----------------------------
  const handleCancel = () => {
    if (originalUser) {
      setUser(originalUser);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast("Changes discarded.");
  };

  // -----------------------------
  // Save Changes
  // -----------------------------
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedAdmin = await updateAdminProfile(user);
      const newData = updatedAdmin.data.admin || updatedAdmin.data;

      const fullImage =
        newData.profileImage && !newData.profileImage.startsWith("http")
          ? `${import.meta.env.VITE_API_BASE_URL}${newData.profileImage}`
          : newData.profileImage;

      const updatedUserData = {
        ...user,
        ...newData,
        profileImage: fullImage,
        previewImage: null,
        profileImageFile: null,
      };

      setUser(updatedUserData);
      setOriginalUser(updatedUserData);

      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // Loader Screen
  // -----------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <Page title="Admin Profile">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white dark:bg-dark-700 shadow-lg rounded-xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-100 mb-6">
            Edit Profile
          </h1>

          {/* Profile Image */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-32 h-32">
              <img
                src={
                  user.previewImage
                    ? user.previewImage
                    : user.profileImage || "/images/200x200.png"
                }
                alt="Profile"
                className="w-full h-full rounded-full object-cover border shadow"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full text-sm shadow"
              >
                ✏️
              </button>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Click icon to change photo
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveChanges} className="space-y-4">
            <Input
              label="First Name"
              name="firstName"
              value={user.firstName}
              onChange={handleInputChange}
            />

            <Input
              label="Last Name"
              name="lastName"
              value={user.lastName}
              onChange={handleInputChange}
            />

            <Input label="Email" name="email" type="email" value={user.email} disabled />

            <Input
              label="Phone"
              name="phone"
              value={user.phone}
              onChange={handleInputChange}
            />

            <Input
              label="Address"
              name="address"
              value={user.address}
              onChange={handleInputChange}
            />

            <div className="flex justify-end pt-4 gap-3">
              <Button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                variant="outline"
              >
                Cancel
              </Button>

              <Button type="submit" disabled={saving} className="gap-2">
                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Page>
  );
}
