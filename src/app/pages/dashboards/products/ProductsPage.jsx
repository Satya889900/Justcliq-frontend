/*productsPage.jsx*/

/* ProductsPage.jsx */

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiPlus, FiArrowLeft, } from "react-icons/fi";
import { MdOutlineElectricalServices } from "react-icons/md";

import ProductCard from "./ProductCard";
import Modal from "../components/Modal";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";
import ProductDeleteForm from "./ProductDeleteForm";
import Spinner from "../components/Spinner";

import { fetchProductsByCategory, fetchProductCategories } from "../../api/productApi.js";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();
  const { categoryId } = useParams();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return navigate("/login");

      const categories = await fetchProductCategories();
      const foundCategory = categories.find((c) => c._id === categoryId);
      setCategory(foundCategory || { name: "Products" });

      let productsData = await fetchProductsByCategory(categoryId);

      // Admin products first
      productsData.sort((a, b) => {
        if (a.userType === "Admin" && b.userType !== "Admin") return -1;
        if (a.userType !== "Admin" && b.userType === "Admin") return 1;
        return 0;
      });

      // Default description if empty
      const updatedProducts = productsData.map(p => ({
        ...p,
        description: p.description || `${foundCategory?.name || "this category"} products`,
      }));

      setProducts(updatedProducts);
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to load products", "error");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId, navigate]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleProductAdded = () => {
    setAddModalOpen(false);
    showToast("Product added successfully!", "success");
    loadProducts();
  };

  const handleProductUpdated = () => {
    setEditModalOpen(false);
    showToast("Product updated successfully!", "success");
    loadProducts();
  };

  const handleProductDeleted = async () => {
    setDeleteModalOpen(false);
    showToast("Product deleted successfully!", "success");
    loadProducts();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" color="primary" />
      </div>
    );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-10 bg-gray-50 min-h-screen font-sans">
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        {/* Left Section - Title */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-200/50 shadow-md backdrop-blur-sm">
            <MdOutlineElectricalServices className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 capitalize">
              {category?.name || "Products"}
            </h1>
            <p className="text-xs text-gray-600">
              Manage products in this category
            </p>
          </div>
        </div>

        {/* Right Section - Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="group relative inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-lg shadow-sm hover:bg-white hover:text-gray-900 hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <FiArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="group relative inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <FiPlus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
        </div>
      </header>


      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              apiBaseUrl={import.meta.env.VITE_API_BASE_URL}
              onEdit={() => {
                setSelectedProduct(product);
                setEditModalOpen(true);
              }}
              onDelete={() => {
                setSelectedProduct(product);
                setDeleteModalOpen(true);
              }}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 text-lg py-10">
            No products found for this category.
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <AddProductForm
          onClose={() => setAddModalOpen(false)}
          onProductAdded={handleProductAdded}
          categoryId={categoryId}
          categoryName={category?.name}
        />
      </Modal>

      {/* Edit Product Modal */}
      {selectedProduct && (
        <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <EditProductForm
            productData={selectedProduct}
            onClose={() => setEditModalOpen(false)}
            onProductUpdated={handleProductUpdated}
          />
        </Modal>
      )}

      {/* Delete Product Modal */}
      {selectedProduct && (
        <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <ProductDeleteForm
            product={selectedProduct}
            onCancel={() => setDeleteModalOpen(false)}
            onDeleted={handleProductDeleted}
          />
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 max-w-xs sm:max-w-sm w-full sm:w-auto px-4 py-3 rounded shadow flex items-center gap-2 text-white transition-opacity z-50 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <span className="font-semibold text-sm sm:text-base">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
