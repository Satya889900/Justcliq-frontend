// // src/app/pages/featured/index.jsx
// import { useState, useEffect, useCallback } from "react";
// import { useNavigate, useSearchParams} from "react-router-dom";
// import {
//   WrenchScrewdriverIcon,
//   CubeIcon,
//   PlusIcon,
//   MagnifyingGlassIcon,
//   FunnelIcon,
//   StarIcon,
// } from "@heroicons/react/24/outline";
// import { MdMiscellaneousServices, MdProductionQuantityLimits } from "react-icons/md";
// import { toast } from "react-hot-toast";

// import Modal from "../dashboards/components/Modal";
// import ServiceCategoryCard from "../dashboards/components/ServiceCategoryCard";
// import ProductCategoryCard from "../dashboards/components/ProductCategoryCard";
// import Spinner from "../dashboards/components/Spinner";
// import { fetchFeaturedCategories } from "../api/featuredApi";

// import AddFeaturedServiceCategoryForm from "./AddFeatured/AddFeaturedServiceCategoryForm";
// import AddFeaturedProductCategoryForm from "./AddFeatured/AddFeaturedProductCategoryForm";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const FeaturedHome = () => {
//   const [categories, setCategories] = useState([]);
//   const [searchParams, setSearchParams] = useSearchParams();
//   const defaultTab = searchParams.get("tab") || "services";
//   const [activeTab, setActiveTab] = useState(defaultTab); // "services" | "products"
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const navigate = useNavigate();

//   const loadCategories = useCallback(async () => {
//     setLoading(true);
//     try {
//       const data = await fetchFeaturedCategories(activeTab);
//       setCategories(data);
//     } catch (err) {
//       console.error(err);
//       toast.error(err.message || "Failed to load featured categories");
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [activeTab]);

//   useEffect(() => {
//     setSearchParams({ tab: activeTab });
//     loadCategories();
//   }, [activeTab, setSearchParams, loadCategories]);

//   const refreshCategories = async () => {
//     await loadCategories();
//   };

//   const handleCategoryClick = (cat) =>
//     navigate(
//       activeTab === "services"
//         ? `/featured/services/${cat._id}`
//         : `/featured/products/${cat._id}`
//     );

//   const q = searchQuery.toLowerCase();

//   const filteredCategories = categories.filter((cat) =>
//     cat.name?.toLowerCase().includes(q)
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/30">
//       {/* Bg blur circles */}
//       <div className="fixed inset-0 -z-10 overflow-hidden">
//         <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-green-200 to-blue-200 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
//       </div>

//       <div className="px-4 sm:px-6 lg:px-8 py-6">
//         {/* Header */}
//         <div className="mb-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             {/* Left: title */}
//             <div className="flex items-center gap-3">
//               <div
//                 className={`p-3 rounded-xl ${
//                   activeTab === "services"
//                     ? "bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-200/50"
//                     : "bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-200/50"
//                 } shadow-md backdrop-blur-sm`}
//               >
//                 <StarIcon className="h-5 w-5 text-yellow-500" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-semibold text-gray-900">
//                   Featured {activeTab === "services" ? "Services" : "Products"}
//                 </h1>
//                 <p className="text-xs text-gray-600">
//                   Manage featured {activeTab} categories
//                 </p>
//               </div>
//             </div>

//             {/* Right: search + add */}
//             <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
//               {/* Search */}
//               <div className="relative flex-1 min-w-[240px]">
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg blur-sm"></div>
//                 <div className="relative">
//                   <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder={`Search featured ${activeTab}...`}
//                     className="w-full pl-9 pr-9 py-2 bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 placeholder-gray-400 text-xs hover:shadow focus:shadow-md"
//                   />
//                   <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors duration-200">
//                     <FunnelIcon className="h-3 w-3" />
//                   </button>
//                 </div>
//               </div>

//               {/* Add Featured Category */}
//               <button
//                 onClick={() => setIsModalOpen(true)}
//                 className="group relative inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 min-w-[140px] overflow-hidden"                
//               >
//                 <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
//                 <PlusIcon className="h-3 w-3 relative z-10" />
//                 <span className="relative z-10">                  
//                   Add Featured {activeTab === "services" ? "Service" : "Product"} Category
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="mb-6">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div className="flex gap-2">
//               {[
//                 {
//                   key: "services",
//                   icon: <WrenchScrewdriverIcon className="h-4 w-4" />,
//                   label: "Featured Services",
//                   gradient: "from-blue-500 to-blue-600",
//                 },
//                 {
//                   key: "products",
//                   icon: <CubeIcon className="h-4 w-4" />,
//                   label: "Featured Products",
//                   gradient: "from-green-500 to-green-600",
//                 },
//               ].map((tab) => (
//                 <button
//                   key={tab.key}
//                   onClick={() => setActiveTab(tab.key)}
//                   className={`group flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 ${
//                     activeTab === tab.key
//                       ? `text-white bg-gradient-to-r ${tab.gradient} shadow-md`
//                       : "text-gray-600 bg-white/80 backdrop-blur-sm border border-gray-200/60 hover:bg-white hover:text-gray-900 hover:shadow-sm"
//                   }`}
//                 >
//                   {tab.icon}
//                   {tab.label}
//                 </button>
//               ))}
//             </div>

//             {searchQuery && (
//               <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
//                 <span>Search:</span>
//                 <span className="font-medium">&quot;{searchQuery}&quot;</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Content */}
//         {loading ? (
//           <div className="flex justify-center items-center py-16">
//             <div className="text-center">
//               <div className="relative">
//                 <Spinner size="medium" color="primary" />
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-lg"></div>
//               </div>
//               <p className="mt-3 text-sm text-gray-600 font-medium">
//                 Loading your featured {activeTab}...
//               </p>
//             </div>
//           </div>
//         ) : filteredCategories.length === 0 ? (
//           <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-xl border border-dashed border-gray-300/60 shadow-md hover:shadow-lg transition-all duration-300">
//             <div className="max-w-sm mx-auto">
//               <div
//                 className={`p-3 rounded-xl inline-flex mb-3 bg-gradient-to-br ${
//                   activeTab === "services"
//                     ? "from-blue-100 to-blue-200 text-blue-600"
//                     : "from-green-100 to-green-200 text-green-600"
//                 } shadow-sm`}
//               >
//                 <StarIcon className="h-8 w-8" />
//               </div>
//               <h3 className="text-base font-semibold text-gray-900 mb-1">
//                 No featured {activeTab} found
//               </h3>
//               <p className="text-gray-600 mb-4 text-xs">
//                 {searchQuery
//                   ? `No results found for "${searchQuery}"`
//                   : `Start by creating your first featured ${activeTab.slice(
//                       0,
//                       -1
//                     )} category`}
//               </p>
//               {!searchQuery && (
//                 <button
//                   onClick={() => setIsModalOpen(true)}
//                   className="group inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
//                 >
//                   <PlusIcon className="h-3 w-3" />
//                   Create Featured Category
//                 </button>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
//             {filteredCategories.map((cat) => {
//               const imageUrl = cat.image?.startsWith("http")
//                 ? cat.image
//                 : cat.image
//                 ? `${API_BASE_URL}/${cat.image
//                     .replace(/^\/+/, "")
//                     .replaceAll("\\", "/")}`
//                 : null;

//               return activeTab === "services" ? (
//                 <ServiceCategoryCard
//                   key={cat._id}
//                   service={cat}
//                   user={cat.name}
//                   role={cat.description}
//                   imageUrl={imageUrl}
//                   defaultIcon={
//                     <MdMiscellaneousServices className="text-2xl text-blue-500" />
//                   }
//                   onClick={() => handleCategoryClick(cat)}
//                   // You can add edit/delete for featured if you build backend
//                   onEdit={null}
//                   onDelete={null}
//                 />
//               ) : (
//                 <ProductCategoryCard
//                   key={cat._id}
//                   product={cat}
//                   user={cat.name}
//                   role={cat.description}
//                   imageUrl={imageUrl}
//                   defaultIcon={
//                     <MdProductionQuantityLimits className="text-2xl text-green-500" />
//                   }
//                   onClick={() => handleCategoryClick(cat)}
//                   onEdit={null}
//                   onDelete={null}
//                 />
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* Add Featured Category Modal */}
//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         {activeTab === "services" ? (
//           <AddFeaturedServiceCategoryForm
//             onClose={() => setIsModalOpen(false)}
//             onAdded={refreshCategories}
//           />
//         ) : (
//           <AddFeaturedProductCategoryForm
//             onClose={() => setIsModalOpen(false)}
//             onAdded={refreshCategories}
//           />
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default FeaturedHome;

// src/app/pages/featured/index.jsx
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  WrenchScrewdriverIcon,
  CubeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { MdMiscellaneousServices, MdProductionQuantityLimits } from "react-icons/md";
import { toast } from "react-hot-toast";

import Modal from "../dashboards/components/Modal";
import ServiceCategoryCard from "../dashboards/components/ServiceCategoryCard";
import ProductCategoryCard from "../dashboards/components/ProductCategoryCard";
import Spinner from "../dashboards/components/Spinner";
import {
  fetchFeaturedCategories,
  deleteFeaturedCategory,
} from "../api/featuredApi";

import AddFeaturedServiceCategoryForm from "./AddFeatured/AddFeaturedServiceCategoryForm";
import AddFeaturedProductCategoryForm from "./AddFeatured/AddFeaturedProductCategoryForm";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FeaturedHome = () => {
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "services";
  const [activeTab, setActiveTab] = useState(defaultTab); // "services" | "products"
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCategory, setEditingCategory] = useState(null); // 🔁 for edit

  // const navigate = useNavigate();

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchFeaturedCategories(activeTab);
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load featured categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    setSearchParams({ tab: activeTab });
    setEditingCategory(null); // reset edit when tab changes
    loadCategories();
  }, [activeTab, setSearchParams, loadCategories]);

  const refreshCategories = async () => {
    await loadCategories();
  };

  // const handleCategoryClick = (cat) =>
  //   navigate(
  //     activeTab === "services"
  //       ? `/featured/services/${cat._id}`
  //       : `/featured/products/${cat._id}`
  //   );

  const openCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (type, cat) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${cat.name}" featured ${
        type === "services" ? "service" : "product"
      } category?`
    );
    if (!confirmed) return;

    try {
      await deleteFeaturedCategory(type, cat._id);
      toast.success("Featured category deleted");
      await loadCategories();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  const q = searchQuery.toLowerCase();

  const filteredCategories = categories.filter((cat) =>
    cat.name?.toLowerCase().includes(q)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/30">
      {/* Bg blur circles */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-green-200 to-blue-200 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left: title */}
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl ${
                  activeTab === "services"
                    ? "bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-200/50"
                    : "bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-200/50"
                } shadow-md backdrop-blur-sm`}
              >
                <StarIcon className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Featured {activeTab === "services" ? "Services" : "Products"}
                </h1>
                <p className="text-xs text-gray-600">
                  Manage featured {activeTab} categories
                </p>
              </div>
            </div>

            {/* Right: search + add */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[240px]">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg blur-sm"></div>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search featured ${activeTab}...`}
                    className="w-full pl-9 pr-9 py-2 bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 placeholder-gray-400 text-xs hover:shadow focus:shadow-md"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors duration-200">
                    <FunnelIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Add Featured Category */}
              <button
                onClick={openCreateModal}
                className="group relative inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 min-w-[140px] overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <PlusIcon className="h-3 w-3 relative z-10" />
                <span className="relative z-10">
                  {editingCategory
                    ? `Edit Featured ${
                        activeTab === "services" ? "Service" : "Product"
                      }`
                    : `Add Featured ${
                        activeTab === "services" ? "Service" : "Product"
                      } Category`}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-2">
              {[
                {
                  key: "services",
                  icon: <WrenchScrewdriverIcon className="h-4 w-4" />,
                  label: "Featured Services",
                  gradient: "from-blue-500 to-blue-600",
                },
                {
                  key: "products",
                  icon: <CubeIcon className="h-4 w-4" />,
                  label: "Featured Products",
                  gradient: "from-green-500 to-green-600",
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`group flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 ${
                    activeTab === tab.key
                      ? `text-white bg-gradient-to-r ${tab.gradient} shadow-md`
                      : "text-gray-600 bg-white/80 backdrop-blur-sm border border-gray-200/60 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {searchQuery && (
              <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                <span>Search:</span>
                <span className="font-medium">&quot;{searchQuery}&quot;</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="relative">
                <Spinner size="medium" color="primary" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-lg"></div>
              </div>
              <p className="mt-3 text-sm text-gray-600 font-medium">
                Loading your featured {activeTab}...
              </p>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-xl border border-dashed border-gray-300/60 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="max-w-sm mx-auto">
              <div
                className={`p-3 rounded-xl inline-flex mb-3 bg-gradient-to-br ${
                  activeTab === "services"
                    ? "from-blue-100 to-blue-200 text-blue-600"
                    : "from-green-100 to-green-200 text-green-600"
                } shadow-sm`}
              >
                <StarIcon className="h-8 w-8" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                No featured {activeTab} found
              </h3>
              <p className="text-gray-600 mb-4 text-xs">
                {searchQuery
                  ? `No results found for "${searchQuery}"`
                  : `Start by creating your first featured ${activeTab.slice(
                      0,
                      -1
                    )} category`}
              </p>
              {!searchQuery && (
                <button
                  onClick={openCreateModal}
                  className="group inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <PlusIcon className="h-3 w-3" />
                  Create Featured Category
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {filteredCategories.map((cat) => {
              const imageUrl = cat.image?.startsWith("http")
                ? cat.image
                : cat.image
                ? `${API_BASE_URL}/${cat.image
                    .replace(/^\/+/, "")
                    .replaceAll("\\", "/")}`
                : null;

              return activeTab === "services" ? (
                <ServiceCategoryCard
                  key={cat._id}
                  service={cat}
                  user={cat.name}
                  role={cat.description}
                  imageUrl={imageUrl}
                  defaultIcon={
                    <MdMiscellaneousServices className="text-2xl text-blue-500" />
                  }
onClick={null}

                  onEdit={() => openEditModal(cat)}
                  onDelete={() => handleDeleteCategory("services", cat)}
                />
              ) : (
                <ProductCategoryCard
                  key={cat._id}
                  product={cat}
                  user={cat.name}
                  role={cat.description}
                  imageUrl={imageUrl}
                  defaultIcon={
                    <MdProductionQuantityLimits className="text-2xl text-green-500" />
                  }
                 
                  onEdit={() => openEditModal(cat)}
                  onDelete={() => handleDeleteCategory("products", cat)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Featured Category Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {activeTab === "services" ? (
          <AddFeaturedServiceCategoryForm
            onClose={() => setIsModalOpen(false)}
            onAdded={refreshCategories}
            initialData={editingCategory}
          />
        ) : (
          <AddFeaturedProductCategoryForm
            onClose={() => setIsModalOpen(false)}
            onAdded={refreshCategories}
            initialData={editingCategory}
          />
        )}
      </Modal>
    </div>
  );
};

export default FeaturedHome;
