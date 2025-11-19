import { useState, useEffect } from "react";
import { FaTimes, FaSave, FaSpinner } from "react-icons/fa";

const ManageStockModal = ({ isOpen, onClose, items, type, onSave }) => {
  const [stockUpdates, setStockUpdates] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Initialize stockUpdates from items prop
      const initialStock = {};
      items.forEach(item => {
        initialStock[item.id] = {
          quantity: item.quantity || 0,
          weight: item.weight || 0,
          volume: item.volume || 0,
        };
      });
      setStockUpdates(initialStock);
    }
  }, [isOpen, items]);

  const handleInputChange = (itemId, field, value) => {
    const numericValue = value === '' ? '' : Number(value);
    if (numericValue < 0) return; // Prevent negative values

    setStockUpdates(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: numericValue,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(stockUpdates);
    setIsSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800">Manage {type === 'product' ? 'Product' : 'Service'} Stock</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={22} />
          </button>
        </div>

        <div className="overflow-y-auto flex-grow">
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center p-3 border rounded-lg">
                <div className="sm:col-span-1 font-semibold text-gray-800">{item.name}</div>
                
                {type === 'product' ? (
                  <>
                    <div className="sm:col-span-1">
                      <label className="text-xs text-gray-500">Quantity (pcs)</label>
                      <input
                        type="number"
                        min="0"
                        value={stockUpdates[item.id]?.quantity ?? ''}
                        onChange={(e) => handleInputChange(item.id, 'quantity', e.target.value)}
                        className="w-full p-2 border rounded-md text-sm"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="text-xs text-gray-500">Weight (kg)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={stockUpdates[item.id]?.weight ?? ''}
                        onChange={(e) => handleInputChange(item.id, 'weight', e.target.value)}
                        className="w-full p-2 border rounded-md text-sm"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="text-xs text-gray-500">Volume (L)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={stockUpdates[item.id]?.volume ?? ''}
                        onChange={(e) => handleInputChange(item.id, 'volume', e.target.value)}
                        className="w-full p-2 border rounded-md text-sm"
                      />
                    </div>
                  </>
                ) : (
                  <div className="sm:col-span-3 text-sm text-gray-500">
                    Stock management is not applicable for services.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
          >
            {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageStockModal;