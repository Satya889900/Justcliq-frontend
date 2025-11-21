// src/app/pages/featured/AddFeaturedServiceCategoryForm.jsx
import { useState, useEffect } from "react";
import { MdAddCircleOutline, MdCloudUpload } from "react-icons/md";
import { VscSymbolNamespace } from "react-icons/vsc";
import { toast } from "react-hot-toast";
import {
  createFeaturedCategory,
  updateFeaturedCategory,
} from "../../api/featuredApi";

const AddFeaturedServiceCategoryForm = ({ onClose, onAdded, initialData }) => {
  const isEdit = Boolean(initialData?._id);

  const [name, setName] = useState(initialData?.name || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(initialData?.image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(initialData?.status || "Active");

  // Load previous data for edit
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setPreview(initialData.image || null);
      setStatus(initialData.status || "Active");
    }
  }, [initialData]);

  // IMAGE UPLOAD
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/avif"];
    if (!allowed.includes(file.type)) {
      toast.error("Invalid image type");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // SUBMIT (ADD + EDIT)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Name is required");

    setIsSubmitting(true);

    try {
      let data;

      if (isEdit) {
        // EDIT FEATURED SERVICE
        data = await updateFeaturedCategory(
          "services",
          initialData._id,
          name.trim(),
          image,
          status
        );
        toast.success(`Featured service "${data?.name}" updated successfully 🎉`);
      } else {
        // ADD FEATURED SERVICE
        data = await createFeaturedCategory("services", name.trim(), image, status);
        toast.success(`Featured service "${data?.name}" added 🎉`);
      }

      onAdded?.(data);
      onClose?.();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          (isEdit ? "Failed to update service" : "Failed to create service")
      );
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto p-5">

      <h2 className="text-center text-2xl sm:text-3xl font-bold flex items-center justify-center gap-2">
        <MdAddCircleOutline className="text-yellow-500" size={32} />
        {isEdit ? "Edit Featured Service" : "Add Featured Service"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* NAME */}
        <div>
          <label className="font-semibold text-gray-700">Service Name</label>
          <div className="relative mt-1">
            <VscSymbolNamespace className="absolute left-3 top-3 text-gray-500" />
            <input
              value={name}
              placeholder="e.g., AC Repair"
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 pl-10 pr-4 py-3 border rounded-lg focus:ring-yellow-500"
            />
          </div>
        </div>

        {/* STATUS */}
        {isEdit && (
        <div>
          <label className="font-semibold text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`w-full bg-gray-50 border px-3 py-3 rounded-lg mt-1 font-semibold ${
              status === "Active"
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        )}

        {/* IMAGE */}
        <div>
          <label className="font-semibold text-gray-700">
            Image {isEdit ? "(optional)" : ""}
          </label>

          <input
            type="file"
            className="hidden"
            id="service-img"
            onChange={handleFileChange}
            accept="image/*"
          />

          <label
            htmlFor="service-img"
            className="h-44 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer bg-gray-50"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-32 w-32 sm:h-36 sm:w-36 object-cover rounded-md border border-gray-300"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <MdCloudUpload size={50} />
                <span>Click to upload</span>
              </div>
            )}
          </label>
        </div>

        {/* SUBMIT */}
        <button
          disabled={isSubmitting}
          className="bg-yellow-500 py-3 text-white font-bold rounded-lg disabled:bg-gray-400"
        >
          {isSubmitting
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
            ? "Update Service Category"
            : "Create Service Category"}
        </button>

      </form>
    </div>
  );
};

export default AddFeaturedServiceCategoryForm;
