import React, { useState } from "react";

const SellPage = ({ setUserProperties }) => {
  const [activeTab, setActiveTab] = useState("sell");

  const renderTabs = () => (
    <div className="flex justify-center mb-10 gap-4">
      <button
        onClick={() => setActiveTab("sell")}
        className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
          activeTab === "sell"
            ? "bg-emerald-600 text-white"
            : "bg-white border border-emerald-600 text-emerald-600"
        }`}
      >
        Sell
      </button>
      <button
        onClick={() => setActiveTab("rent")}
        className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
          activeTab === "rent"
            ? "bg-emerald-600 text-white"
            : "bg-white border border-emerald-600 text-emerald-600"
        }`}
      >
        Rent
      </button>
    </div>
  );

  return (
    <div className="pt-24 pb-10 px-4 container mx-auto bg-gray-50 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-extrabold text-emerald-600">
          Post Your Property 
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Fill in the details below to create an eye-catching property listing.
        </p>
      </div>

      {renderTabs()}

      {activeTab === "sell" ? (
        <SellForm setUserProperties={setUserProperties} />
      ) : (
        <RentForm setUserProperties={setUserProperties} />
      )}
    </div>
  );
};


// Paste your full SellForm code here
const SellForm = ({ setUserProperties }) => {
  // your full Sell form code goes here...
   const [formData, setFormData] = useState({
      title: "",
      location: "",
      price: "",
      type: "",
      bedrooms: "",
      bathrooms: "",
      area: "",
      description: "",
      owner: "",
      contact: "",
      yearBuilt: "",
      parking: "",
      image: null,
    });
  
    const handleChange = (e) => {
      const { name, value, files } = e.target;
      if (name === "image") {
        setFormData({ ...formData, image: files[0] });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const newProperty = {
        id: Date.now(),
        ...formData,
        image: formData.image ? URL.createObjectURL(formData.image) : null,
        listingType: "sell",
      };
      setUserProperties((prev) => [...prev, newProperty]);
      alert("Property submitted successfully!");
      setFormData({
        title: "",
        location: "",
        price: "",
        type: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
        description: "",
        owner: "",
        contact: "",
        yearBuilt: "",
        parking: "",
        image: null,
      });
    };
  
    return (
      <div className="pt-4 pb-2 px-4 container mx-auto bg-gray-50 min-h-screen">
        
  
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-2xl space-y-8"
          encType="multipart/form-data"
        >
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-emerald-600 mt-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-8 w-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />
  </svg>
  <h2 className="text-2xl font-bold">Property Details</h2>
</div>

  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Property Title (e.g., 10 Marla House for Sale)"
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location (e.g., Bahria Town, Lahore)"
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
              />
            </div>
  
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">PKR</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Sale Price"
                  required
                  min="0"
                  className="w-full pl-16 pr-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
                />
              </div>
  
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 appearance-none"
              >
                <option value="">Property Type</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Plot">Plot</option>
                <option value="Commercial">Commercial</option>
              </select>
  
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="Bedrooms"
                min="0"
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
                required
              />
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="Bathrooms"
                min="0"
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
                required
              />
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="Area (e.g., 1800 sq ft)"
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
              />
              <input
                type="number"
                name="yearBuilt"
                value={formData.yearBuilt}
                onChange={handleChange}
                placeholder="Year Built"
                min="1800"
                max={new Date().getFullYear()}
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
              />
            </div>
  
            <input
              type="number"
              name="parking"
              value={formData.parking}
              onChange={handleChange}
              placeholder="Parking Spaces"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
            />
          </section>
  
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-600">Property Description</h2>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a detailed description of the property"
              rows="5"
              required
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
            />
          </section>
  
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-600">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                placeholder="Owner's Name"
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
              />
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Phone / Email"
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
              />
            </div>
          </section>
  
          {/* ✅ Image Upload Section with icon */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 text-emerald-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-8 w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                />
              </svg>
              <h2 className="text-2xl font-bold">Upload Property Image</h2>
            </div>
  
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors duration-200">
              <label
                htmlFor="image-upload"
                className="block text-gray-500 font-semibold cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-11 w-11 mx-auto text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                  />
                </svg>
                Click or drag to upload image
              </label>
              <input
                id="image-upload"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                required
              />
              {formData.image && (
                <p className="mt-4 text-sm text-emerald-600 font-semibold">
                  Selected file: {formData.image.name}
                </p>
              )}
            </div>
          </section>
  
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 rounded-xl hover:bg-emerald-700 transition-all duration-300 font-bold text-lg shadow-lg"
          >
            Submit Property Listing
          </button>
        </form>
      </div>
    );
  };
  

// Paste your full RentForm code here
const RentForm = ({ setUserProperties }) => {
    const [formData, setFormData] = useState({
  // your full Rent const [formData, setFormData] = useState({
      title: "",
      location: "",
      rent: "",
      propertyType: "",
      bedrooms: "",
      bathrooms: "",
      area: "",
      description: "",
      owner: "",
      contact: "",
      furnishing: "",
      floor: "",
      leaseDuration: "",
      availableFrom: "",
      maintenance: "",
      deposit: "",
      image: null,
      yearBuilt: "",
      parking: false,
      balcony: false,
      petFriendly: false,
      laundryInUnit: false,
      dishwasher: false,
      airConditioning: false,
      heating: false,
      swimmingPool: false,
      gym: false,
      security24_7: false,
      gatedCommunity: false,
      nearbySchools: "",
      nearbyHospitals: "",
      nearbyShopping: "",
      publicTransportAccess: false,
    });
  
    const handleChange = (e) => {
      const { name, value, type, checked, files } = e.target;
      setFormData({
        ...formData,
        [name]:
          type === "checkbox" ? checked : name === "image" ? files[0] : value,
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const newProperty = {
        id: Date.now(),
        ...formData,
        image: formData.image ? URL.createObjectURL(formData.image) : null,
        listingType: "rent",
      };
      setUserProperties((prev) => [...prev, newProperty]);
      alert("Rental listing submitted successfully!");
      setFormData({
        title: "",
        location: "",
        rent: "",
        propertyType: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
        description: "",
        owner: "",
        contact: "",
        furnishing: "",
        floor: "",
        leaseDuration: "",
        availableFrom: "",
        maintenance: "",
        deposit: "",
        image: null,
        yearBuilt: "",
        parking: false,
        balcony: false,
        petFriendly: false,
        laundryInUnit: false,
        dishwasher: false,
        airConditioning: false,
        heating: false,
        swimmingPool: false,
        gym: false,
        security24_7: false,
        gatedCommunity: false,
        nearbySchools: "",
        nearbyHospitals: "",
        nearbyShopping: "",
        publicTransportAccess: false,
      });
    };
  
    return (
      <div className="pt-4 pb-2 px-4 container mx-auto bg-gray-50 min-h-screen">
        
  
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-2xl space-y-8"
          encType="multipart/form-data"
        >
          {/* Basic Property Information */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 text-emerald-600">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-8 w-8"
              >
              <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              <h2 className="text-2xl font-bold">Property Details</h2>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Property Title (e.g., Spacious 3-Bed Apartment)"
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-colors duration-200"
                required
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location (e.g., DHA Phase 6, Karachi)"
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-colors duration-200"
              />
            </div>
  
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">PKR</span>
                <input
                  type="number"
                  name="rent"
                  value={formData.rent}
                  onChange={handleChange}
                  placeholder="Monthly Rent"
                  required
                  min="0"
                  className="w-full pl-16 pr-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-colors duration-200"
                />
              </div>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 appearance-none transition-colors duration-200"
              >
                <option value="">Property Type</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Room">Room</option>
                <option value="Commercial">Commercial</option>
                <option value="Office">Office Space</option>
                <option value="Shop">Shop</option>
                <option value="Warehouse">Warehouse</option>
              </select>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="Bedrooms"
                min="0"
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-colors duration-200"
              />
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="Bathrooms"
                min="0"
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-colors duration-200"
              />
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="Area (e.g., 1200 sq ft or 10 Marla)"
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-colors duration-200"
              />
              <input
                type="number"
                name="yearBuilt"
                value={formData.yearBuilt}
                onChange={handleChange}
                placeholder="Year Built (Optional)"
                min="1800"
                max={new Date().getFullYear()}
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-colors duration-200"
              />
            </div>
          </section>
  
          <hr className="border-gray-200" />
  
          {/* Description & Terms */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 text-emerald-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M14 2H6c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V8l-6-6zM6 4h7v4h4v12H6V4z" />
              </svg>
              <h2 className="text-2xl font-bold">Listing Details</h2>
            </div>
  
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of the property, its features, neighborhood highlights, and any specific terms."
              rows="6"
              required
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-colors duration-200"
            />
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <select
                name="furnishing"
                value={formData.furnishing}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 appearance-none transition-colors duration-200"
              >
                <option value="">Furnishing Status</option>
                <option value="Furnished">Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
              </select>
              <input
                type="text"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                placeholder="Floor Level (e.g., Ground, 2nd, Penthouse)"
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-colors duration-200"
              />
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="leaseDuration"
                value={formData.leaseDuration}
                onChange={handleChange}
                placeholder="Min. Lease Duration (e.g., 12 Months)"
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-colors duration-200"
              />
              <div className="relative">
                <label className="absolute -top-3 left-3 text-sm text-gray-500 bg-white px-1">
                  Available From
                </label>
                <input
                  type="date"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-colors duration-200"
                />
              </div>
            </div>
          </section>
  
          <hr className="border-gray-200" />
  
          {/* Amenities & Features */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 text-emerald-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                <path d="M12 10.75a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75zM12 14.25a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75zM12 17.75a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z" />
              </svg>
              <h2 className="text-2xl font-bold">Amenities & Features</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.keys(formData).filter(key => typeof formData[key] === 'boolean').map(key => (
                <label
                  key={key}
                  className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-emerald-50 transition-colors duration-200"
                >
                  <input
                    type="checkbox"
                    name={key}
                    checked={formData[key]}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-emerald-600 rounded-md transition-transform duration-200 transform checked:scale-110 focus:ring-0"
                  />
                  <span className="ml-3 text-gray-700 font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
          </section>
  
          <hr className="border-gray-200" />
  
          {/* Contact Information */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 text-emerald-600">
               <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-8 w-8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              <h2 className="text-2xl font-bold">Contact Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                placeholder="Owner's Name / Property Manager's Name"
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-colors duration-200"
              />
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Contact Info (Phone Number and/or Email)"
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-colors duration-200"
              />
            </div>
          </section>
  
          <hr className="border-gray-200" />
  
          {/* Image Upload */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 text-emerald-600">
             <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-8 w-8" 
              >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
              </svg>
              <h2 className="text-2xl font-bold">Property Images</h2>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-500 transition-colors duration-200">
              <label htmlFor="image-upload" className="block text-gray-500 font-semibold cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-11 w-11 mx-auto text-gray-400" 
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                Click or drag to upload image
              </label>
              <input
                id="image-upload"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                required
              />
              {formData.image && (
                <p className="mt-4 text-sm text-emerald-600 font-semibold">
                  Selected file: {formData.image.name}
                </p>
              )}
            </div>
          </section>
  
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 rounded-xl hover:bg-emerald-700 transition-all duration-300 font-bold text-lg shadow-lg"
          >
            Submit Rental Property Listing
          </button>
        </form>
      </div>
    );

};
export default SellPage;
