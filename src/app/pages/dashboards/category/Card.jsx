import { EllipsisHorizontalIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const Card = ({ user, role, imageUrl, onClick, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const defaultImage = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";

  const handleMoreOptionsClick = (e) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    setShowActions(false);
    if (action === 'edit' && onEdit) onEdit();
    if (action === 'delete' && onDelete) onDelete();
  };

  return (
    <div
      className="
        group
        relative
        bg-gradient-to-br from-white/80 to-white/60
        hover:from-white/90 hover:to-white/80
        border border-gray-200/60
        hover:border-blue-200/80
        rounded-2xl
        p-6
        backdrop-blur-sm
        shadow-sm
        hover:shadow-xl
        transition-all
        duration-300
        ease-out
        flex flex-col items-center text-center
        w-full
        cursor-pointer
        transform
        hover:scale-105
        hover:-translate-y-1
      "
      onClick={onClick}
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

      {/* Image with Gradient Border */}
      <div className="relative mb-4">
        <div className="w-20 h-20 rounded-full p-0.5 bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg">
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
            <img
              src={imageUrl || defaultImage}
              alt={user}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = defaultImage;
              }}
            />
          </div>
        </div>
        
        {/* Online Status Indicator */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full shadow-sm" />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center flex-1 w-full">
        <h2 className="text-lg font-bold text-gray-800 mb-1 leading-tight line-clamp-2">
          {user}
        </h2>
        {role && (
          <p className="text-sm text-gray-500 mb-3 leading-relaxed line-clamp-2 flex-1">
            {role}
          </p>
        )}
        
        {/* Skills/Tags */}
        <div className="flex flex-wrap gap-1 justify-center w-full mt-auto">
          {['Design', 'Development']?.slice(0, 2).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-200/50"
            >
              {skill}
            </span>
          ))}
          {['Design', 'Development']?.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
              +{['Design', 'Development']?.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Action Menu */}
      <div className="absolute top-3 right-3">
        <button 
          onClick={handleMoreOptionsClick}
          className="
            p-1.5
            rounded-xl
            bg-white/80
            backdrop-blur-sm
            text-gray-400
            hover:text-gray-600
            hover:bg-white
            border border-gray-200/60
            shadow-sm
            hover:shadow-md
            transition-all
            duration-200
            opacity-0
            group-hover:opacity-100
            transform
            translate-y-1
            group-hover:translate-y-0
          "
        >
          <EllipsisHorizontalIcon className="h-4 w-4" />
        </button>

        {/* Dropdown Actions */}
        {showActions && (
          <div className="absolute right-0 top-10 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/60 py-2 min-w-[120px] z-10 animate-in fade-in-0 zoom-in-95">
            {onEdit && (
              <button
                onClick={(e) => handleActionClick(e, 'edit')}
                className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition-colors duration-150"
              >
                <PencilIcon className="h-3.5 w-3.5" />
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => handleActionClick(e, 'delete')}
                className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 transition-colors duration-150"
              >
                <TrashIcon className="h-3.5 w-3.5" />
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200/30 transition-all duration-300 pointer-events-none" />
    </div>
  );
};

export default Card;