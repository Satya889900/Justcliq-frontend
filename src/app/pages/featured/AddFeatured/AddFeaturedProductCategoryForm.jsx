// src/app/pages/featured/AddFeaturedProductCategoryForm.jsx
import { useState, useEffect } from "react";
import { MdAddCircleOutline, MdCloudUpload } from "react-icons/md";
import { VscSymbolNamespace } from "react-icons/vsc";
import { toast } from "react-hot-toast";
import {
  createFeaturedCategory,
  updateFeaturedCategory,
} from "../../api/featuredApi";

const AddFeaturedProductCategoryForm = ({ onClose, onAdded, initialData }) => {
  const isEdit = Boolean(initialData?._id);

  const [name, setName] = useState(initialData?.name || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(initialData?.image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(initialData?.status || "Active");

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setPreview(initialData.image || null);
      setStatus(initialData.status || "Active");
    }
  }, [initialData]);

  // Image upload handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/avif"];
    if (!allowed.includes(file.type)) {
      toast.error("Invalid file type");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Submit handler (Add + Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");

    setIsSubmitting(true);

    try {
      let data;

      if (isEdit) {
        // EDIT PRODUCT
        data = await updateFeaturedCategory(
          "products",
          initialData._id,
          name.trim(),
          image,
          status
        );
        toast.success(`Product "${data?.name}" updated successfully 🎉`);
      } else {
        // ADD PRODUCT
        data = await createFeaturedCategory("products", name.trim(), image, status);
        toast.success(`Product "${data?.name}" added successfully 🎉`);
      }

      onAdded?.(data);
      onClose?.();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          (isEdit ? "Failed to update product" : "Failed to add product")
      );
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto p-5">

      <h2 className="text-center text-2xl sm:text-3xl font-bold flex items-center justify-center gap-2">
        <MdAddCircleOutline className="text-green-600" size={32} />
        {isEdit ? "Edit Featured Product" : "Add Featured Product"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* NAME FIELD */}
        <div>
          <label className="font-semibold text-gray-700">Product Name</label>
          <div className="relative mt-1">
            <VscSymbolNamespace className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Electronics"
              className="w-full bg-gray-50 pl-10 pr-4 py-3 border rounded-lg focus:ring-green-600"
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

        {/* IMAGE FIELD */}
        <div>
          <label className="font-semibold text-gray-700">
            Product Image {isEdit ? "(optional)" : ""}
          </label>

          <input
            type="file"
            id="product-img"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />

          <label
            htmlFor="product-img"
            className="h-44 border-2 border-dashed bg-gray-50 rounded-lg flex items-center justify-center cursor-pointer"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-32 w-32 rounded object-cover border"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <MdCloudUpload size={50} />
                <span>Click to upload</span>
              </div>
            )}
          </label>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-600 text-white py-3 rounded-lg font-bold disabled:bg-gray-400"
        >
          {isSubmitting
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
            ? "Update Product Category"
            : "Create Product Category"}
        </button>

      </form>
    </div>
  );
};

export default AddFeaturedProductCategoryForm;
