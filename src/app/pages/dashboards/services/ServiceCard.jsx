import { Pencil, Trash2 } from "lucide-react";
import { FaRupeeSign, FaWrench  } from "react-icons/fa";

const ServiceCard = ({
  service,
  apiBaseUrl,
  onClick,
  onEdit,
  onDelete,
}) => {
  const getImageSrc = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const cleanedUrl = url.replaceAll("\\", "/").replace(/^\/+/, "");
    return `${apiBaseUrl.replace(/\/$/, "")}/${cleanedUrl}`;
  };

  const imgSrc = getImageSrc(service.image);

  return (
    <div
      className="relative flex flex-col h-full bg-gradient-to-tr from-white to-indigo-50
                 rounded-2xl border border-gray-200 p-4 shadow-md hover:shadow-lg 
                 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
       {/* Image */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-indigo-400 mb-4 mx-auto flex items-center justify-center bg-gray-100">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <FaWrench className="text-gray-400 text-3xl sm:text-4xl md:text-5xl" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 w-full items-center text-center">
        {/* Name */}
        <h2 className="text-sm sm:text-base md:text-lg  justify-text font-bold text-gray-800 break-words mb-1 text-center">
          {service.name}
        </h2>

        
        {/* Wage Type */}
        {service?.wageType && (
          <span className="text-xs sm:text-sm md:text-sm text-indigo-600 font-medium mb-2 px-2 py-0.5 bg-indigo-100 rounded-full">
            {service?.wageType}
          </span>
        )}

        {/* Description */}
        {service.description ? (
          <p className="text-xs sm:text-sm md:text-base justify-text text-gray-600 break-words mb-3 text-center">
            {service.description}
          </p>
        ) : (
            <p className="text-xs sm:text-sm md:text-base  justify-text text-gray-600 break-words mb-3 text-center">
          {service.name} details
          </p>
        )}

        {/* Cost & Actions pushed to bottom */}
        <div className="mt-auto w-full">

          {/* Cost */}
          <div className="flex items-center justify-center gap-1 text-gray-800 font-semibold px-3 py-1 rounded-full text-sm sm:text-base w-full max-w-[140px] mx-auto mb-3">
            <FaRupeeSign className="text-green-600" />
            <span>{service.cost ?? 0}</span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 w-full justify-center flex-wrap mt-4">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit?.(service); }}
              className="flex-1 min-w-[65px] flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <Pencil className="h-4 w-4" /> Edit
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete?.(service); }}
              className="flex-1 min-w-[65px] flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ServiceCard;
