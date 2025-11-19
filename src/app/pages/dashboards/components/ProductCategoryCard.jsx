import { Pencil, Trash2 } from "lucide-react";

const ProductCategoryCard = ({
  user,
  description,
  skills,
  imageUrl,
  defaultIcon,
  onClick,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className="relative flex h-full cursor-pointer flex-col rounded-2xl border border-gray-200 bg-gradient-to-tr from-white to-green-50 p-4 shadow-md transition-all duration-300 hover:shadow-lg"
      onClick={onClick}
    >
      {/* Main Image / Icon */}
      <div className="flex justify-center">
        <div className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-blue-400 bg-white sm:h-28 sm:w-28 md:h-32 md:w-32">
          {imageUrl ? (
            <img
              src={
                imageUrl.startsWith("http")
                  ? imageUrl
                  : `${import.meta.env.VITE_API_BASE_URL}/${imageUrl.replaceAll("\\", "/").replace(/^\/+/, "")}`
              }
              alt={user}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center text-4xl text-green-500 sm:text-5xl md:text-6xl">
              {defaultIcon}
            </div>
          )}
        </div>
      </div>

      {/* User */}
      <h2 className="mb-1 text-center text-sm font-bold break-words text-gray-800 sm:text-base md:text-lg">
        {user}
      </h2>

      {/* description */}
      {description && (
        <p className="mb-3 text-center text-xs break-words text-gray-600 sm:text-sm md:text-base">
          {description}
        </p>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mt-2 mb-4 flex flex-wrap justify-center gap-2">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 px-2 py-1 text-[10px] text-purple-700 shadow-sm sm:text-xs md:text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Buttons at bottom */}
      {onEdit && onDelete && (
        <div className="mt-auto flex w-full flex-wrap justify-center gap-3 pt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="flex min-w-[65px] flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-yellow-600"
          >
            <Pencil className="h-4 w-4" /> Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="flex min-w-[65px] flex-1 items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCategoryCard;
