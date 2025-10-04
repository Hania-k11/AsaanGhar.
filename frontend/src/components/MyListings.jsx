/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  X,
  Layers,
  Clock,
  CheckCircle,
  PauseCircle,
  Calendar,
  DollarSign,
  Eye,
  Star,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  RefreshCw,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  BarChart3,
  Building2,
  Tag,
  MessageSquare,
  MapPin,
  Bed,
  Bath,
  Ruler,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropertyGrid from "./PropertyGrid";
import LoadingSpinner from "./LoadingSpinner";
import {
  useMyProperties,
  usePropertyStats,
  useUpdatePropertyStatus,
  useUpdatePropertyDetails,
  useDeleteProperty, // <-- performs SOFT delete (is_deleted=1) on backend
  useUpdatePropertyListingType,
} from "../hooks/useMyListings";
import { useAuth } from "../context/AuthContext";

/* -----------------------
   Styled Components
   ----------------------- */

const Card = ({ children, className = "", ...props }) => (
  <div
    className={`bg-white/95 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const Button = ({ variant = "default", size = "md", children, className = "", disabled = false, ...props }) => {
  const variants = {
    default:
      "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400",
    primary:
      "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-sm disabled:from-gray-400 disabled:to-gray-400",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 disabled:text-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm disabled:bg-red-400",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3",
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      disabled={disabled}
      className={`${variants[variant]} ${sizes[size]} rounded-xl font-medium transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const Badge = ({ variant = "default", children, className = "" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    sale: "bg-green-100 text-green-700 border border-green-200",
    rent: "bg-blue-100 text-blue-700 border border-blue-200",
  };

  return (
    <span className={`${variants[variant]} px-2.5 py-1 rounded-lg text-xs font-medium ${className}`}>
      {children}
    </span>
  );
};

const Input = React.forwardRef(({ icon: Icon, className = "", error = false, ...props }, ref) => (
  <div className="relative w-full">
    {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />}
    <input
      ref={ref}
      className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-2.5 rounded-xl border ${
        error ? "border-red-300" : "border-gray-200"
      } bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500 ${className}`}
      {...props}
    />
  </div>
));
Input.displayName = "Input";

const Select = ({ children, className = "", error = false, ...props }) => (
  <select
    className={`px-4 py-2.5 rounded-xl border ${
      error ? "border-red-300" : "border-gray-200"
    } bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 appearance-none cursor-pointer disabled:bg-gray-50 disabled:text-gray-500 ${className}`}
    {...props}
  >
    {children}
  </select>
);
/* -----------------------
   Toast (lightweight)
   ----------------------- */
const ToastItem = ({ id, type = "success", title, message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(() => onClose(id), 3200);
    return () => clearTimeout(t);
  }, [id, onClose]);

  const colors = {
    success: "bg-emerald-600",
    danger: "bg-red-600",
    info: "bg-blue-600",
    warning: "bg-amber-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      className="rounded-xl shadow-lg overflow-hidden border border-black/10 bg-white"
    >
      <div className="flex items-start gap-3 p-3">
        <span className={`inline-block w-1.5 rounded ${colors[type]} mt-0.5`} />
        <div className="pr-6">
          {title && <div className="text-sm font-semibold text-gray-900">{title}</div>}
          {message && <div className="text-sm text-gray-700">{message}</div>}
        </div>
        <button
          className="ml-auto p-1 rounded hover:bg-gray-100 transition-colors"
          onClick={() => onClose(id)}
          aria-label="Close"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>
    </motion.div>
  );
};

function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback(({ type = "success", title, message }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    return id;
  }, []);
  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  return { toasts, push, dismiss };
}

/* -----------------------
   Modal Components
   ----------------------- */

const Modal = ({ isOpen, onClose, children, size = "md" }) => {
  const sizes = {
    sm: "sm:max-w-md",
    md: "sm:max-w-2xl",
    lg: "sm:max-w-3xl",
    xl: "sm:max-w-5xl",
  };

  const containerRef = useRef(null);
  const firstFocusable = useRef(null);
  const lastFocusable = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    const handleEsc = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", handleEsc);

    const timer = setTimeout(() => {
      if (!containerRef.current) return;
      const focusables = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length) {
        firstFocusable.current = focusables[0];
        lastFocusable.current = focusables[focusables.length - 1];
        firstFocusable.current.focus();
      }
    }, 0);

    const trapFocus = (e) => {
      if (e.key !== "Tab") return;
      const active = document.activeElement;
      if (e.shiftKey) {
        if (active === firstFocusable.current) {
          e.preventDefault();
          lastFocusable.current?.focus();
        }
      } else {
        if (active === lastFocusable.current) {
          e.preventDefault();
          firstFocusable.current?.focus();
        }
      }
    };
    document.addEventListener("keydown", trapFocus);

    return () => {
      body.style.overflow = prevOverflow || "";
      body.style.paddingRight = prevPaddingRight || "";
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("keydown", trapFocus);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[2147483647] flex items-end sm:items-center justify-center p-0 sm:p-6"
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          className={`relative w-full sm:w-auto h-[92vh] sm:h-auto ${sizes[size]} sm:max-h-[92vh]`}
          style={{ zIndex: 2147483647 }}
        >
          <div
            ref={containerRef}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 h-full sm:h-auto flex flex-col overflow-hidden"
          >
            <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-gutter:stable]">{children}</div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel, propertyTitle }) => (
  <Modal isOpen={isOpen} onClose={onCancel} size="sm">
    <div className="p-6">
      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
        <AlertCircle className="w-6 h-6 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Move Property to Trash</h3>
      <p className="text-sm text-gray-600 text-center mb-2">
        Are you sure you want to move <span className="font-medium">"{propertyTitle}"</span> to Trash?
      </p>
      <p className="text-sm text-amber-700 text-center mb-6 font-medium">
      </p>
      <div className="flex gap-3">
  <Button type="button" variant="default" className="flex-1" onClick={onCancel}>
    Cancel
  </Button>
  <Button type="button" variant="danger" className="flex-1" onClick={onConfirm}>
    Move to Trash
  </Button>
</div>

    </div>
  </Modal>
);

const FilterModal = ({ isOpen, filters, onApplyFilters, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setLocalFilters(filters);
    setErrors({});
  }, [filters, isOpen]);

  const handleChange = (name, value) => {
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateFilters = () => {
    const newErrors = {};
    if (localFilters.minPrice && localFilters.maxPrice) {
      const min = parseFloat(localFilters.minPrice);
      const max = parseFloat(localFilters.maxPrice);
      if (min >= max) newErrors.maxPrice = "Maximum price must be greater than minimum price";
    }
    const numericFields = ["minBeds", "minBaths", "minArea", "minPrice", "maxPrice"];
    numericFields.forEach((field) => {
      if (localFilters[field] && (isNaN(localFilters[field]) || parseFloat(localFilters[field]) < 0)) {
        newErrors[field] = "Must be a positive number";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApply = () => {
    if (validateFilters()) {
      onApplyFilters(localFilters);
      onClose();
    }
  };

  const handleReset = () => {
    const reset = Object.keys(localFilters).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {});
    setLocalFilters(reset);
    setErrors({});
    onApplyFilters(reset);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
            <p className="text-sm text-gray-500 mt-1">Refine your property search</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Bedrooms</label>
              <Input
                type="number"
                min="0"
                value={localFilters.minBeds}
                onChange={(e) => handleChange("minBeds", e.target.value)}
                placeholder="Any"
                error={errors.minBeds}
              />
              {errors.minBeds && <p className="text-xs text-red-600 mt-1">{errors.minBeds}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Bathrooms</label>
              <Input
                type="number"
                min="0"
                value={localFilters.minBaths}
                onChange={(e) => handleChange("minBaths", e.target.value)}
                placeholder="Any"
                error={errors.minBaths}
              />
              {errors.minBaths && <p className="text-xs text-red-600 mt-1">{errors.minBaths}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Area (sqft)</label>
            <Input
              type="number"
              min="0"
              value={localFilters.minArea}
              onChange={(e) => handleChange("minArea", e.target.value)}
              placeholder="Any size"
              error={errors.minArea}
            />
            {errors.minArea && <p className="text-xs text-red-600 mt-1">{errors.minArea}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (PKR)</label>
              <Input
                type="number"
                min="0"
                value={localFilters.minPrice}
                onChange={(e) => handleChange("minPrice", e.target.value)}
                placeholder="0"
                error={errors.minPrice}
              />
              {errors.minPrice && <p className="text-xs text-red-600 mt-1">{errors.minPrice}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (PKR)</label>
              <Input
                type="number"
                min="0"
                value={localFilters.maxPrice}
                onChange={(e) => handleChange("maxPrice", e.target.value)}
                placeholder="No limit"
                error={errors.maxPrice}
              />
              {errors.maxPrice && <p className="text-xs text-red-600 mt-1">{errors.maxPrice}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
            <Select value={localFilters.listingType} onChange={(e) => handleChange("listingType", e.target.value)}>
              <option value="">All Types</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
            <Select value={localFilters.propertyType} onChange={(e) => handleChange("propertyType", e.target.value)}>
              <option value="">All Properties</option>
              <option value="HOUSE">House</option>
              <option value="APARTMENT">Apartment</option>
              <option value="OFFICE">Office</option>
              <option value="COMMERCIAL">Commercial</option>
              <option value="ROOM">Room</option>
              <option value="SHOP">Shop</option>
              <option value="WAREHOUSE">Warehouse</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Furnishing Status</label>
            <Select
              value={localFilters.furnishingStatus}
              onChange={(e) => handleChange("furnishingStatus", e.target.value)}
            >
              <option value="">Any Status</option>
              <option value="fully-furnished">Fully Furnished</option>
              <option value="semi-furnished">Semi-Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </Select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button variant="ghost" className="flex-1" onClick={handleReset}>
            Reset All
          </Button>
          <Button variant="primary" className="flex-1" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const EditPropertyModal = ({ isOpen, property, onSave, onClose }) => {
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || "",
        address: property.address || "",
        street_address: property.street_address || "",
        price: property.price || "",
        bedrooms: property.bedrooms || "",
        bathrooms: property.bathrooms || "",
        area_sqft: property.area_sqft || "",
      });
    }
    setError(null);
    setValidationErrors({});
  }, [property, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) setValidationErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title?.trim()) errors.title = "Title is required";
    if (!formData.address?.trim()) errors.address = "Address is required";
    if (!formData.price || parseFloat(formData.price) <= 0) errors.price = "Valid price is required";

    ["bedrooms", "bathrooms", "area_sqft"].forEach((field) => {
      if (formData[field] && (isNaN(formData[field]) || parseFloat(formData[field]) < 0)) {
        errors[field] = "Must be a positive number";
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const updates = { ...formData, property_id: property.property_id };
      await onSave(updates);
      onClose();
    } catch (err) {
      setError("Failed to save changes. Please try again.");
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!property) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <div className="p-6 flex items-center justify-center">
          <span className="ml-2 text-gray-600">Loading property details...</span>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Edit Property Details</h3>
          <button type="button" onClick={onClose} className="p-0 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Property Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Cozy 2-Bedroom Apartment"
              error={validationErrors.title}
              required
            />
            {validationErrors.title && <p className="text-xs text-red-600 mt-1">{validationErrors.title}</p>}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Main Address <span className="text-red-500">*</span>
            </label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g., Main Street, PECHS Block 6"
              error={validationErrors.address}
              required
            />
            {validationErrors.address && <p className="text-xs text-red-600 mt-1">{validationErrors.address}</p>}
          </div>

          <div>
            <label htmlFor="street_address" className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <Input
              id="street_address"
              name="street_address"
              value={formData.street_address}
              onChange={handleChange}
              placeholder="e.g., Street 5, Block A"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (PKR) <span className="text-red-500">*</span>
            </label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              error={validationErrors.price}
              required
            />
            {validationErrors.price && <p className="text-xs text-red-600 mt-1">{validationErrors.price}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <Input
                id="bedrooms"
                type="number"
                min="0"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="0"
                error={validationErrors.bedrooms}
              />
              {validationErrors.bedrooms && <p className="text-xs text-red-600 mt-1">{validationErrors.bedrooms}</p>}
            </div>
            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <Input
                id="bathrooms"
                type="number"
                min="0"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="0"
                error={validationErrors.bathrooms}
              />
              {validationErrors.bathrooms && <p className="text-xs text-red-600 mt-1">{validationErrors.bathrooms}</p>}
            </div>
            <div>
              <label htmlFor="area_sqft" className="block text-sm font-medium text-gray-700 mb-1">
                Area (sqft)
              </label>
              <Input
                id="area_sqft"
                type="number"
                min="0"
                name="area_sqft"
                value={formData.area_sqft}
                onChange={handleChange}
                placeholder="0"
                error={validationErrors.area_sqft}
              />
              {validationErrors.area_sqft && <p className="text-xs text-red-600 mt-1">{validationErrors.area_sqft}</p>}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button type="button" variant="default" className="flex-1" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1" disabled={isSaving}>
            {isSaving ? (
              <>
                <LoadingSpinner size={16} className="text-white" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

/* -----------------------
   Stat Card Component
   ----------------------- */

const StatCard = ({ icon: Icon, label, value, trend, color, isLoading }) => {
  const colors = {
    emerald: "text-emerald-600 bg-emerald-50",
    amber: "text-amber-600 bg-amber-50",
    blue: "text-blue-600 bg-blue-50",
    purple: "text-purple-600 bg-purple-50",
    teal: "text-teal-600 bg-teal-50",
  };

  return (
    <Card className="p-6 group hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900">
            {isLoading ? <span className="inline-block w-20 h-8 bg-gray-200 rounded animate-pulse" /> : (value || 0).toLocaleString()}
          </p>
          {trend && !isLoading && (
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-600">+{trend}%</span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          )}
        </div>

        <div className={`p-3 rounded-xl ${colors[color]} transition-transform duration-300 group-hover:scale-110`}>
          {isLoading ? <div className="w-5 h-5 bg-gray-300 rounded animate-pulse" /> : <Icon size={20} />}
        </div>
      </div>
    </Card>
  );
};

/* -----------------------
   Filter Chips Component
   ----------------------- */

const FilterChips = ({ filters, onRemove, onClear }) => {
  const chips = Object.entries(filters)
    .filter(([_, value]) => value)
    .map(([key, value]) => {
      const labels = {
        minBeds: `${value}+ Beds`,
        minBaths: `${value}+ Baths`,
        minArea: `${value}+ sqft`,
        minPrice: `Min PKR ${Number(value).toLocaleString()}`,
        maxPrice: `Max PKR ${Number(value).toLocaleString()}`,
        listingType: value === "sale" ? "For Sale" : "For Rent",
        propertyType: value.charAt(0).toUpperCase() + value.slice(1).replace(/([A-Z])/g, " $1"),
        furnishingStatus: value.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      };
      return { key, label: labels[key] || value };
    });

  if (chips.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {chips.map(({ key, label }) => (
        <Badge key={key} variant="default" className="flex items-center gap-1 pr-1">
          {label}
          <button
            onClick={() => onRemove(key)}
            className="ml-1 hover:bg-gray-200 rounded p-0.5 transition-colors"
            aria-label={`Remove ${label} filter`}
          >
            <X size={12} />
          </button>
        </Badge>
      ))}
      <button
        onClick={onClear}
        className="text-sm text-gray-500 hover:text-gray-700 font-medium px-2 py-1 rounded hover:bg-gray-100 transition-colors"
      >
        Clear all
      </button>
    </div>
  );
};

/* -----------------------
   Main Component
   ----------------------- */

const tabs = [
  { id: "all", label: "All Properties", icon: Layers },
  { id: "active", label: "Active", icon: Clock },
  { id: "sold", label: "Sold", icon: CheckCircle },
  { id: "paused", label: "Paused", icon: PauseCircle },
  { id: "sale", label: "Sale", icon: Tag },
  { id: "rent", label: "Rent", icon: Building2 },
];

const MyListings = () => {
  const { isLoggedIn, authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate, authLoading]);

  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState(null); // can be object or id
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modals, setModals] = useState({ filter: false, delete: false, edit: false });
  const [filters, setFilters] = useState({
    minBeds: "",
    minBaths: "",
    minArea: "",
    listingType: "",
    propertyType: "",
    furnishingStatus: "",
    minPrice: "",
    maxPrice: "",
  });

  const [removedIds, setRemovedIds] = useState(new Set());
const { toasts, push: notify, dismiss } = useToast();

  const priceRange = useMemo(
    () => [
      filters.minPrice ? parseFloat(filters.minPrice) : 0,
      filters.maxPrice ? parseFloat(filters.maxPrice) : 9999999999,
    ],
    [filters.minPrice, filters.maxPrice]
  );

  const advancedFilters = useMemo(
    () => ({
      minBeds: filters.minBeds,
      minBaths: filters.minBaths,
      minArea: filters.minArea,
      propertyType: filters.propertyType,
      furnishingStatus: filters.furnishingStatus,
      status: ["sale", "rent"].includes(activeTab) ? undefined : activeTab === "all" ? undefined : activeTab,
      listingType: ["sale", "rent"].includes(activeTab) ? activeTab : filters.listingType,
    }),
    [filters, activeTab]
  );

  const {
    data: propertiesData,
    isLoading: propertiesLoading,
    refetch: refetchProperties,
    error: propertiesError,
  } = useMyProperties({
    filter: filters.listingType || "all",
    searchTerm: searchQuery,
    priceRange,
    sortBy: sortOrder,
    currentPage,
    limit: 12,
    advancedFilters,
  });

  const { data: statsData, isLoading: statsLoading, error: statsError } = usePropertyStats();
  const updateStatusMutation = useUpdatePropertyStatus();
  const updateDetailsMutation = useUpdatePropertyDetails();
  const deletePropertyMutation = useDeleteProperty(); // soft-delete
  const updateListingTypeMutation = useUpdatePropertyListingType();

  // Helper to safely resolve property by ID
  const getById = useCallback(
    (id) => (propertiesData?.data || []).find((p) => p.property_id === id),
    [propertiesData]
  );

  const handleListingTypeChange = useCallback(
    async (propertyId, newListingType) => {
      try {
        await updateListingTypeMutation.mutateAsync({ propertyId, listingType: newListingType });
        await refetchProperties();
      } catch (error) {
        console.error("Listing type change error:", error);
      }
    },
    [updateListingTypeMutation, refetchProperties]
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetchProperties();
    } catch (error) {
      console.error("Error refreshing properties:", error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [refetchProperties]);

  // Opens the confirm modal; accepts property object OR id
  const handlePropertyDelete = useCallback(
    (propertyOrId) => {
      const prop = typeof propertyOrId === "number" ? getById(propertyOrId) : propertyOrId;
      setSelectedProperty(prop ?? propertyOrId); // keep id if prop not found
      setModals((prev) => ({ ...prev, delete: true }));
    },
    [getById]
  );

  // Confirms delete; does the soft delete + optimistic UI
 const handleConfirmDelete = useCallback(async () => {
  if (!selectedProperty) return;

  const id = typeof selectedProperty === "number" ? selectedProperty : selectedProperty.property_id;
  if (!id) return;

  try {
    // optimistic hide
    setRemovedIds((prev) => {
      const copy = new Set(prev);
      copy.add(id);
      return copy;
    });

    await deletePropertyMutation.mutateAsync(id); // soft delete API

    const name =
      typeof selectedProperty === "object"
        ? selectedProperty?.title
        : (getById(id)?.title || `#${id}`);
    notify({
      type: "success",
      title: "Moved to Trash",
      message: `"${name}" has been moved to Trash successfully.`,
    });

    setModals((prev) => ({ ...prev, delete: false }));
    setSelectedProperty(null);
    await refetchProperties();
  } catch (error) {
    console.error("Delete error:", error);
    // rollback optimistic hide
    setRemovedIds((prev) => {
      const copy = new Set(prev);
      copy.delete(id);
      return copy;
    });

    // ❌ ERROR TOAST
    notify({
      type: "danger",
      title: "Failed to Move",
      message: "Could not move this property to Trash. Please try again.",
    });
  }
}, [selectedProperty, deletePropertyMutation, refetchProperties, getById, notify]);

  const handlePropertyEdit = useCallback((property) => {
    setSelectedProperty(property);
    setModals((prev) => ({ ...prev, edit: true }));
  }, []);

  const handleUpdateProperty = useCallback(
    async (updatedData) => {
      try {
        const updates = {
          title: updatedData.title,
          price: parseFloat(updatedData.price),
          bedrooms: updatedData.bedrooms ? parseInt(updatedData.bedrooms) : null,
          bathrooms: updatedData.bathrooms ? parseInt(updatedData.bathrooms) : null,
          area_sqft: updatedData.area_sqft ? parseFloat(updatedData.area_sqft) : null,
          address: updatedData.address,
          street_address: updatedData.street_address,
        };

        await updateDetailsMutation.mutateAsync({
          propertyId: updatedData.property_id,
          updates,
        });

        setModals((prev) => ({ ...prev, edit: false }));
        setSelectedProperty(null);
        await refetchProperties();
      } catch (error) {
        console.error("Update error:", error);
        throw error;
      }
    },
    [updateDetailsMutation, refetchProperties]
  );

  const handleStatusChange = useCallback(
    async (propertyId, newStatus) => {
      try {
        await updateStatusMutation.mutateAsync({ propertyId, status: newStatus });
        await refetchProperties();
      } catch (error) {
        console.error("Status change error:", error);
      }
    },
    [updateStatusMutation, refetchProperties]
  );

  const handleApplyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleRemoveFilter = useCallback((key) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      minBeds: "",
      minBaths: "",
      minArea: "",
      listingType: "",
      propertyType: "",
      furnishingStatus: "",
      minPrice: "",
      maxPrice: "",
    });
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, filters, sortOrder]);

  const properties = propertiesData?.data || [];
  const visibleProperties = useMemo(
    () => properties.filter((p) => !removedIds.has(p.property_id)),
    [properties, removedIds]
  );

  const totalPages = propertiesData?.pagination?.totalPages || 1;
  const totalProperties = propertiesData?.pagination?.total || 0;
  const hasFilters = Object.values(filters).some((v) => v);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size={40} />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const EnhancedPropertyGrid = ({ properties, ...props }) => {
    const enhancedProperties = properties.map((property) => ({
      ...property,
      listing_type_name:
        property.listing_type_name || (property.listing_type_id === 1 ? "rent" : property.listing_type_id === 2 ? "sale" : "unknown"),
    }));

    return <PropertyGrid {...props} properties={enhancedProperties} />;
  };

  const selectedTitle =
    typeof selectedProperty === "object"
      ? selectedProperty?.title
      : (() => {
          const p = typeof selectedProperty === "number" ? getById(selectedProperty) : null;
          return p?.title || (selectedProperty ? `#${selectedProperty}` : "");
        })();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <Building2 className="w-8 h-8 text-emerald-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Property Dashboard</h1>
                  <p className="text-sm text-gray-500">Manage your real estate portfolio</p>
                </div>
              </div>
              <h1 className="text-xl font-bold text-gray-900 sm:hidden">My Properties</h1>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="default"
                size="sm"
                onClick={handleRefresh}
                disabled={propertiesLoading || isRefreshing}
                className="hidden sm:flex"
              >
                {propertiesLoading || isRefreshing ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                Refresh
              </Button>
              <Button variant="primary" onClick={() => navigate("/sell")} className="whitespace-nowrap">
                <Plus size={18} />
                Add Property
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Clock} label="Active Listings" value={statsData?.active} trend={8} color="blue" isLoading={statsLoading} />
          <StatCard icon={CheckCircle} label="Sold Properties" value={statsData?.sold} trend={23} color="purple" isLoading={statsLoading} />
          <StatCard icon={PauseCircle} label="Paused Listings" value={statsData?.paused} trend={12} color="emerald" isLoading={statsLoading} />
          <StatCard icon={Eye} label="Total Views" value={statsData?.views} trend={18} color="amber" isLoading={statsLoading} />
        </div>

        {/* Errors */}
        {(propertiesError || statsError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
                <p className="text-sm text-red-600 mt-1">
                  {propertiesError?.message || statsError?.message || "Please try refreshing the page."}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRefresh} className="ml-auto text-red-600 hover:text-red-700">
                <RefreshCw size={16} />
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Main Card */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {tabs.map((tab) => {
                let count = 0;
                if (!statsLoading && statsData) {
                  switch (tab.id) {
                    case "all":
                      count = (statsData.active || 0) + (statsData.paused || 0) + (statsData.sold || 0);
                      break;
                    case "active":
                      count = statsData.active || 0;
                      break;
                    case "sold":
                      count = statsData.sold || 0;
                      break;
                    case "paused":
                      count = statsData.paused || 0;
                      break;
                    default:
                      break;
                  }
                }

                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                    className="whitespace-nowrap"
                  >
                    <tab.icon size={16} />
                    {tab.label}
                    {!statsLoading && count > 0 && (
                      <Badge variant={activeTab === tab.id ? "default" : "info"} className="ml-1 px-1.5 py-0.5 text-xs">
                        {count}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Search + Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  icon={Search}
                  type="text"
                  placeholder="Search properties by title, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="default"
                  size="md"
                  onClick={() => setModals((prev) => ({ ...prev, filter: true }))}
                  className="whitespace-nowrap"
                >
                  <Filter size={16} />
                  Filters
                  {hasFilters && <Badge variant="danger" className="ml-1 px-1.5 py-0.5">{Object.values(filters).filter((v) => v).length}</Badge>}
                </Button>

                <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-auto min-w-[140px]">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="views_high">Most Viewed</option>
                </Select>

                <div className="flex items-center border border-gray-200 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-500"}`}
                    aria-label="Grid view"
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-500"}`}
                    aria-label="List view"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {hasFilters && (
              <div className="mt-3">
                <FilterChips filters={filters} onRemove={handleRemoveFilter} onClear={handleClearFilters} />
              </div>
            )}
          </div>

          {/* Grid/List */}
          <div className="p-4">
            {propertiesLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
                <span className="ml-3 text-gray-600">Loading your properties...</span>
              </div>
            ) : visibleProperties.length === 0 ? (
              <div className="text-center py-12">
                <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {hasFilters || searchQuery ? "No properties match your criteria" : "No properties found"}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  {hasFilters || searchQuery
                    ? "Try adjusting your filters or search terms to see more results"
                    : "Start by adding your first property listing to begin managing your portfolio"}
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Button variant="primary" onClick={() => navigate("/sell")}>
                    <Plus size={16} />
                    Add First Property
                  </Button>
                  {(hasFilters || searchQuery) && (
                    <Button
                      variant="default"
                      onClick={() => {
                        handleClearFilters();
                        setSearchQuery("");
                      }}
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <p>
                    Showing <span className="font-medium">{visibleProperties.length}</span> of{" "}
                    <span className="font-medium">{totalProperties}</span> properties
                  </p>
                  {totalProperties > visibleProperties.length && <p>Page {currentPage} of {totalPages}</p>}
                </div>

                <EnhancedPropertyGrid
                  properties={visibleProperties}
                  viewMode={viewMode}
                  isOwner={true}
                  onDelete={handlePropertyDelete}        // accepts id or object
                  onEdit={handlePropertyEdit}
                  onChangeStatus={handleStatusChange}
                  onChangeListingType={handleListingTypeChange}
                />

                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-200 gap-4">
                    <div className="text-sm text-gray-600 text-center sm:text-left">
                      Page <span className="font-medium">{currentPage}</span> of{" "}
                      <span className="font-medium">{totalPages}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-3"
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </Button>

                      <div className="flex items-center gap-1 overflow-x-auto max-w-xs">
                        <button
                          onClick={() => setCurrentPage(1)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === 1 ? "bg-emerald-600 text-white" : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          1
                        </button>

                        {currentPage > 3 && <span className="px-1 text-gray-400">...</span>}

                        {Array.from({ length: Math.min(3, totalPages - 2) }, (_, i) => {
                          const pageNum = Math.max(2, Math.min(totalPages - 1, currentPage - 1 + i));
                          if (pageNum === 1 || pageNum === totalPages) return null;

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === pageNum ? "bg-emerald-600 text-white" : "hover:bg-gray-100 text-gray-700"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        {currentPage < totalPages - 2 && <span className="px-1 text-gray-400">...</span>}

                        {totalPages > 1 && (
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === totalPages ? "bg-emerald-600 text-white" : "hover:bg-gray-100 text-gray-700"
                            }`}
                          >
                            {totalPages}
                          </button>
                        )}
                      </div>

                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3"
                      >
                        Next
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Modals */}
      <FilterModal
        isOpen={modals.filter}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onClose={() => setModals((prev) => ({ ...prev, filter: false }))}
      />

      <DeleteConfirmModal
        isOpen={modals.delete}
        propertyTitle={selectedTitle}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setModals((prev) => ({ ...prev, delete: false }));
          setSelectedProperty(null);
        }}
      />

      <EditPropertyModal
        isOpen={modals.edit}
        property={selectedProperty && typeof selectedProperty === "object" ? selectedProperty : null}
        onSave={handleUpdateProperty}
        onClose={() => {
          setModals((prev) => ({ ...prev, edit: false }));
          setSelectedProperty(null);
        }}
      />
      {/* Toast viewport */}
<div className="fixed bottom-4 right-4 z-[2147483647] space-y-3 w-[92vw] max-w-sm">
  <AnimatePresence initial={false}>
    {toasts.map((t) => (
      <ToastItem key={t.id} {...t} onClose={dismiss} />
    ))}
  </AnimatePresence>
</div>

    </div>
  );
};

export default MyListings;
