import React, { useState } from "react";

const SellPage = ({ setUserProperties }) => {
  return (
    <div className="pt-24 pb-10 px-4 container mx-auto bg-gray-50 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-extrabold text-emerald-600">
          Post Your Property
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Fill in the details below to create property listing
        </p>
      </div>

  
      <RentForm setUserProperties={setUserProperties} />
    </div>
  );
};

const RentForm = ({ setUserProperties }) => {
  const [formData, setFormData] = useState({
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
    security: false,
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
      security: false,
      gatedCommunity: false,
      nearbySchools: "",
      nearbyHospitals: "",
      nearbyShopping: "",
      publicTransportAccess: false,
    });
  };

  return (
    <form
  onSubmit={handleSubmit}
  className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-2xl space-y-10"
  encType="multipart/form-data"
>
  {/* Property Details Section */}
  <section className="space-y-6">
    <div className="flex items-center space-x-3 text-emerald-600">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
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
        className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
        required
      />
     <div className="relative">
  <select
    name="listingType"
    value={formData.listingType}
    onChange={handleChange}
    required
    className="w-full px-5 py-3 border border-gray-300 rounded-xl text-gray-500 bg-white appearance-none focus:outline-none focus:ring-4 focus:ring-emerald-200"
  >
    <option value="" disabled selected>
      Listing Type
    </option>
    <option value="sell">Sell</option>
    <option value="rent">Rent</option>
  </select>

  {/* Custom Arrow */}
  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  </div>
</div>

      
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Location (e.g., DHA Phase 6, Karachi)"
        className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
        required
      />

      <div className="relative">
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold">PKR</span>
        <input
          type="number"
          name="rent"
          value={formData.rent}
          onChange={handleChange}
          placeholder="Monthly Rent"
          min="0"
          className="w-full pl-16 pr-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
          required
        />
      </div>
    </div>


<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="relative">
    <select
      name="propertyType"
      value={formData.propertyType}
      onChange={handleChange}
      required
      className="w-full px-5 py-3 border border-gray-300 rounded-xl text-gray-500 bg-white appearance-none focus:outline-none focus:ring-4 focus:ring-emerald-200 pr-10"
    >
      <option value="" disabled hidden>Property Type</option>
      <option value="House">House</option>
      <option value="Apartment">Apartment</option>
      <option value="Room">Room</option>
      <option value="Commercial">Commercial</option>
      <option value="Office">Office Space</option>
      <option value="Shop">Shop</option>
      <option value="Warehouse">Warehouse</option>
    </select>

    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>

  <input
    type="text"
    name="area"
    value={formData.area}
    onChange={handleChange}
    placeholder="Area (e.g., 120 sq ft or 10 Marla)"
    required
    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-colors duration-200"
  />
</div>

{/* Bedrooms, Bathrooms, Year Built - all in one line */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
  <input
    type="number"
    name="bedrooms"
    value={formData.bedrooms}
    onChange={handleChange}
    placeholder="Bedrooms"
    min="0"
    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
  />

  <input
    type="number"
    name="bathrooms"
    value={formData.bathrooms}
    onChange={handleChange}
    placeholder="Bathrooms"
    min="0"
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
              <div className="relative">
  <select
    name="furnishing"
    value={formData.furnishing}
    onChange={handleChange}
    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 appearance-none transition-colors duration-200 text-gray-500"
    required
  >
    <option value="" disabled hidden>
      Furnishing Status
    </option>
    <option value="Furnished">Furnished</option>
    <option value="Unfurnished">Unfurnished</option>
    <option value="Semi-Furnished">Semi-Furnished</option>
  </select>

  {/* Optional: Custom Arrow like others */}
  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  </div>
</div>

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
  <label className="absolute -top-3 left-3 text-sm text-gray-400 font-normal bg-white px-1">
    Available From
  </label>
  <input
    type="date"
    name="availableFrom"
    value={formData.availableFrom}
    onChange={handleChange}
    className="w-full px-5 py-3 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-colors duration-200"
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
                placeholder="Contact Info (Phone Number or Email)"
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
            Submit Property 
          </button>
    </form>
  );
};

export default SellPage;

























