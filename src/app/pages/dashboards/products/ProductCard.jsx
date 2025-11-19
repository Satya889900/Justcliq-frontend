/* ProductCard.jsx - Styled like ServiceCard.jsx */

import { Pencil, Trash2 } from "lucide-react";
import { FaRupeeSign, FaBoxOpen } from "react-icons/fa";

const ProductCard = ({ product, apiBaseUrl, onClick, onEdit, onDelete }) => {
  const getImageSrc = (url) => {
    if (!url || url.trim() === "") return null;
    if (url.startsWith("http")) return url;
    const cleanedUrl = url.replaceAll("\\", "/").replace(/^\/+/, "");
    return `${apiBaseUrl.replace(/\/$/, "")}/${cleanedUrl}`;
  };

  // Use first image or default
  const imgSrc =
    product.images && product.images.length > 0
      ? getImageSrc(product.images[0])
      : getImageSrc(product.image);

  // Default description if missing
  const description = product.description || `${product.name} details`;

  return (
    <div
      className="relative flex h-full cursor-pointer flex-col items-center rounded-2xl border border-gray-200 bg-gradient-to-tr from-white to-blue-50 p-4 shadow-md transition-all duration-300 hover:shadow-lg"
      onClick={onClick}
    >
      {/* Image / Icon */}
      {/* Image / Icon */}
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-blue-400 bg-gray-100 sm:h-24 sm:w-24 md:h-28 md:w-28">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              // Hide broken image and show icon
              e.currentTarget.style.display = "none";
              e.currentTarget.parentNode.querySelector(
                ".fallback-icon",
              ).style.display = "block";
            }}
          />
        ) : null}

        {/* Fallback Icon */}
        <FaBoxOpen
          className="fallback-icon text-4xl text-blue-500 sm:text-5xl md:text-6xl"
          style={{ display: imgSrc ? "none" : "block" }}
        />
      </div>

      {/* Content */}
      <div className="flex w-full flex-1 flex-col items-center text-center">
        {/* Name */}
        <h2 className="justify-text mb-1 text-center text-sm font-bold break-words text-gray-800 sm:text-base md:text-lg">
          {product.name}
        </h2>

        {/* Description */}
        <p className="justify-text mb-3 text-center text-xs break-words text-gray-600 sm:text-sm md:text-base">
          {description}
        </p>

        {/* Cost & Actions pushed to bottom */}
        <div className="mt-auto w-full">
          {/* Unit & Quantity/Weight/Volume */}
          <div className="mx-auto mb-3 flex w-full max-w-[160px] items-center justify-center gap-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 sm:text-sm md:text-base">
            {product?.unit === "quantity" && (
              <span>Qty: {product?.quantity ?? 0}</span>
            )}
            {product?.unit === "kg" && (
              <span>Weight: {product?.weight ?? 0} kg</span>
            )}
            {product?.unit === "liters" && (
              <span>Volume: {product?.volume ?? 0} L</span>
            )}
          </div>

          {/* Cost */}
          <div className="mx-auto mb-3 flex w-full max-w-[140px] items-center justify-center gap-1 rounded-full px-3 py-1 text-sm font-semibold text-gray-800 sm:text-base">
            <FaRupeeSign className="text-green-600" />
            <span>{product.cost ?? 0}</span>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex w-full flex-wrap justify-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(product);
              }}
              className="flex min-w-[65px] flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-yellow-600"
            >
              <Pencil className="h-4 w-4" /> Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(product);
              }}
              className="flex min-w-[65px] flex-1 items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
