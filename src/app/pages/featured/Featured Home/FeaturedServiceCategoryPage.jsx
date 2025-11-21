import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowLeftIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

import {
  fetchFeaturedItemsByCategory,
  fetchFeaturedCategoryById,
} from "../../api/featuredApi";
import ServiceCard from "../../dashboards/services/ServiceCard";
import Spinner from "../../dashboards/components/Spinner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FeaturedServiceCategoryPage = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [categoryData, itemsData] = await Promise.all([
        fetchFeaturedCategoryById("services", categoryId),
        fetchFeaturedItemsByCategory("services", categoryId),
      ]);
      setCategory(categoryData);
      setItems(itemsData);
    } catch (err) {
      console.error("Failed to load data:", err);
      toast.error(err.message || "Failed to load featured items for the category");
      setCategory(null);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/featured?tab=services"
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {loading ? "Loading..." : category?.name || "Featured Services"}
            </h1>
            <p className="text-sm text-gray-500">
              Services featured in this category
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-dashed">
          <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No Services Found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            There are currently no services featured in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {items.map((item) => {
            // The category name for a service card is the service's own category, not the "featured" category
            const serviceCategoryName = item.category?.name || "Service";

            return (
              <ServiceCard
                key={item._id}
                service={item}
                apiBaseUrl={API_BASE_URL}
                categoryName={serviceCategoryName}
                // Since these are just references, we don't provide edit/delete here.
                // Management should happen on the main services page.
                onEdit={null}
                onDelete={null}
                // You could add an onClick handler if you want to navigate somewhere
                onClick={() =>
                  toast.success(`Clicked on service: ${item.name}`)
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FeaturedServiceCategoryPage;