/* home/index.jsx */
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  WrenchScrewdriverIcon, 
  CubeIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
// import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { MdMiscellaneousServices, MdProductionQuantityLimits } from "react-icons/md";
import { toast } from "react-hot-toast";

import Modal from "../components/Modal";
import AddServiceForm from "../category/AddServiceForm";
import AddProductForm from "../category/AddProductForm";
import ServiceCategoryCard from "../components/ServiceCategoryCard";
import ProductCategoryCard from "../components/ProductCategoryCard";
import ServiceCard from "../services/ServiceCard";
import ProductCard from "../products/ProductCard";
import EditServiceCategoryForm from "../category/EditServiceCategoryForm";
import EditProductCategoryForm from "../category/EditProductCategoryForm";
import EditServiceForm from "../services/EditServiceForm";
import EditProductForm from "../products/EditProductForm";
import ServiceCategoryDeleteForm from "../category/ServiceCategoryDeleteForm";
import ProductCategoryDeleteForm from "../category/ProductCategoryDeleteForm";
import ServiceDeleteForm from "../services/ServiceDeleteForm";
import ProductDeleteForm from "../products/ProductDeleteForm";
import Spinner from "../components/Spinner";

import { fetchCategoriesApi } from "../../api/categoryApi";
import { fetchCategoryServices } from "../../api/servicesApi";
import { fetchProductsByCategory } from "../../api/productApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "services";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesMap, setCategoriesMap] = useState({});

  const navigate = useNavigate();

  const fetchCategoriesWithSubItems = useCallback(async () => {
    setLoading(true);
    try {
      const cats = await fetchCategoriesApi(activeTab);
      const catMap = {};
      cats.forEach(cat => {
        catMap[cat._id] = cat;
      });
      setCategoriesMap(catMap);
      
      const catsWithSubItems = await Promise.all(
        cats.map(async (cat) => {
          const subItems =
            activeTab === "services"
              ? await fetchCategoryServices(cat._id)
              : await fetchProductsByCategory(cat._id);
          return { ...cat, subItems };
        })
      );
      setCategories(catsWithSubItems);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    setSearchParams({ tab: activeTab });
    fetchCategoriesWithSubItems();
  }, [activeTab, setSearchParams, fetchCategoriesWithSubItems]);

  const refreshCategories = async () => await fetchCategoriesWithSubItems();

  const handleCategoryEdit = (cat) => {
    setEditCategory(cat);
    setIsModalOpen(true);
  };
  const handleCategoryDelete = (cat) => setDeleteCategory(cat);

  const handleItemEdit = (item, parentCat) => {
    setEditItem({ ...item, parentCategory: parentCat, categoryId: parentCat?._id || item.categoryId });
    setIsModalOpen(true);
  };
  const handleItemDelete = (item) => setDeleteItem(item);

  const q = searchQuery.toLowerCase();

  const displayItems = categories.reduce((acc, cat) => {
    const categoryMatch = cat.name.toLowerCase().includes(q);
    const filteredSubItems =
      cat.subItems?.filter((item) => item.name.toLowerCase().includes(q)) || [];

    if (searchQuery) {
      if (categoryMatch) acc.push({ type: "category", data: [cat] });
      if (filteredSubItems.length > 0)
        acc.push({ type: "subItems", data: filteredSubItems, parent: cat });
    } else {
      acc.push({ type: "category", data: [cat] });
    }
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/30">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-green-200 to-blue-200 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Navigation Bar */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left Section - Title */}
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${
                activeTab === "services" 
                  ? "bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-200/50" 
                  : "bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-200/50"
              } shadow-md backdrop-blur-sm`}>
                {activeTab === "services" ? (
                  <WrenchScrewdriverIcon className="h-5 w-5 text-blue-600" />
                ) : (
                  <CubeIcon className="h-5 w-5 text-green-600" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {activeTab === "services" ? "Services" : "Products"}
                </h1>
                <p className="text-xs text-gray-600">
                  Manage your {activeTab} categories
                </p>
              </div>
            </div>

            {/* Right Section - Search and Add Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[240px]">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg blur-sm"></div>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${activeTab}...`}
                    className="w-full pl-9 pr-9 py-2 bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 placeholder-gray-400 text-xs hover:shadow focus:shadow-md"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors duration-200">
                    <FunnelIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Add Category Button */}
              <button
                onClick={() => {
                  setEditCategory(null);
                  setEditItem(null);
                  setIsModalOpen(true);
                }}
                className="group relative inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 hover:from-blue-700 hover:to-indigo-800 min-w-[120px] overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <PlusIcon className="h-3 w-3 relative z-10" />
                <span className="relative z-10">Add Category</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs and Stats Bar */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Tabs */}
            <div className="flex gap-2">
              {[
                { 
                  key: "services", 
                  icon: <WrenchScrewdriverIcon className="h-4 w-4" />,
                  label: "Services",
                  gradient: "from-blue-500 to-blue-600",
                },
                { 
                  key: "products", 
                  icon: <CubeIcon className="h-4 w-4" />,
                  label: "Products",
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
                  }`}x
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              {searchQuery && (
                <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  <span>Search:</span>
                  <span className="font-medium">&quot;{searchQuery}&quot;</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="relative">
                <Spinner size="medium" color="primary" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-lg"></div>
              </div>
              <p className="mt-3 text-sm text-gray-600 font-medium">
                Loading your {activeTab}...
              </p>
            </div>
          </div>
        ) : displayItems.length === 0 ? (
          <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-xl border border-dashed border-gray-300/60 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="max-w-sm mx-auto">
              <div className={`p-3 rounded-xl inline-flex mb-3 bg-gradient-to-br ${
                activeTab === "services" 
                  ? "from-blue-100 to-blue-200 text-blue-600" 
                  : "from-green-100 to-green-200 text-green-600"
              } shadow-sm`}>
                {activeTab === "services" ? (
                  <WrenchScrewdriverIcon className="h-8 w-8" />
                ) : (
                  <CubeIcon className="h-8 w-8" />
                )}
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                No {activeTab} found
              </h3>
              <p className="text-gray-600 mb-4 text-xs">
                {searchQuery ? `No results found for &quot;${searchQuery}&quot;` : `Start by creating your first ${activeTab.slice(0, -1)} category`}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <PlusIcon className="h-3 w-3" />
                  Create First Category
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {displayItems.map((itemBlock) => {
              if (itemBlock.type === "category") {
                const cat = itemBlock.data[0];
                const imageUrl = cat.image?.startsWith("http")
                  ? cat.image
                  : cat.image
                    ? `${API_BASE_URL}/${cat.image.replace(/^\/+/, "").replaceAll("\\", "/")}`
                    : null;

                return activeTab === "services" ? (
                  <ServiceCategoryCard
                    key={cat._id}
                    service={cat}
                    user={cat.name}
                    role={cat.description}
                    imageUrl={imageUrl}
                    defaultIcon={<MdMiscellaneousServices className="text-2xl text-blue-500" />}
                   
                    onEdit={() => handleCategoryEdit(cat)}
                    onDelete={() => handleCategoryDelete(cat)}
                  />
                ) : (
                  <ProductCategoryCard
                    key={cat._id}
                    product={cat}
                    user={cat.name}
                    role={cat.description}
                    imageUrl={imageUrl}
                    defaultIcon={<MdProductionQuantityLimits className="text-2xl text-green-500" />}

                    onEdit={() => handleCategoryEdit(cat)}
                    onDelete={() => handleCategoryDelete(cat)}
                  />
                );
              }

              if (itemBlock.type === "subItems") {
                return itemBlock.data.map((sub) => {
                  const categoryName =
                    activeTab === "services"
                      ? categoriesMap[sub.categoryId]?.name || "Unknown Category"
                      : sub.category?.name || "Unknown Category";

                  return activeTab === "services" ? (
                    <ServiceCard
                      key={sub._id}
                      service={sub}
                      apiBaseUrl={API_BASE_URL}
                      categoryName={categoryName}
                      onClick={() => navigate(`/dashboards/services/${sub.categoryId}`)}
                      onEdit={() => handleItemEdit(sub)}
                      onDelete={() => handleItemDelete(sub)}
                    />
                  ) : (
                    <ProductCard
                      key={sub._id}
                      product={sub}
                      apiBaseUrl={API_BASE_URL}
                      categoryName={categoryName}
                      onClick={() => navigate(`/dashboards/products/${sub.categoryId}`)}
                      onEdit={() => handleItemEdit(sub, itemBlock.parent)}
                      onDelete={() => handleItemDelete(sub)}
                    />
                  );
                });
              }

              return null;
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {/* Category Edit */}
        {editCategory ? (
          activeTab === "services" ? (
            <EditServiceCategoryForm
              category={editCategory}
              parentCategory={editItem?.parentCategory}
              onSave={refreshCategories}
              onCancel={() => setIsModalOpen(false)}
            />
          ) : (
            <EditProductCategoryForm
              category={editCategory}
              parentCategory={editItem?.parentCategory}
              onSave={refreshCategories}
              onCancel={() => setIsModalOpen(false)}
            />
          )
        ) : editItem ? (
          activeTab === "services" ? (
            <EditServiceForm
              serviceData={editItem}
              categoryId={editItem.parentCategory?._id || editItem.categoryId}
              onClose={() => setIsModalOpen(false)}
              onServiceUpdated={refreshCategories}
            />
          ) : (
            <EditProductForm
              productData={editItem}
              categoryId={editItem.parentCategory?._id || editItem.categoryId}
              onClose={() => setIsModalOpen(false)}
              onProductUpdated={refreshCategories}
            />
          )
        ) : activeTab === "services" ? (
          <AddServiceForm onClose={() => setIsModalOpen(false)} onServiceAdded={refreshCategories} />
        ) : (
          <AddProductForm onClose={() => setIsModalOpen(false)} onProductAdded={refreshCategories} />
        )}
      </Modal>

      {/* Delete Modals */}
      {deleteCategory &&
        (activeTab === "services" ? (
          <ServiceCategoryDeleteForm
            serviceCategory={deleteCategory}
            onCancel={() => setDeleteCategory(null)}
            onDeleted={async (deletedCat) => {
              setDeleteCategory(null);
              toast.success(`Service category "${deletedCat.name}" deleted ✅`);
              await refreshCategories();
            }}
          />
        ) : (
          <ProductCategoryDeleteForm
            productCategory={deleteCategory}
            onCancel={() => setDeleteCategory(null)}
            onDeleted={async (deletedCat) => {
              setDeleteCategory(null);
              toast.success(`Product category "${deletedCat.name}" deleted ✅`);
              await refreshCategories();
            }}
          />
        ))}

      {deleteItem &&
        (activeTab === "services" ? (
          <ServiceDeleteForm
            service={deleteItem}
            onCancel={() => setDeleteItem(null)}
            onDelete={async () => {
              await refreshCategories();
              toast.success(`Service "${deleteItem.name}" deleted ✅`);
            }}
          />
        ) : (
          <ProductDeleteForm
            product={deleteItem}
            onCancel={() => setDeleteItem(null)}
            onDelete={async () => {
              await refreshCategories();
              toast.success(`Product "${deleteItem.name}" deleted ✅`);
            }}
          />
        ))}
    </div>
  );
};

export default Home;