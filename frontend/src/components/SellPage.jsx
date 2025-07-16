import React, { useState } from "react";

const SellPage = ({ setUserProperties }) => {
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
    <div className="pt-28 pb-16 px-4 container mx-auto bg-gray-50 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-emerald-600">
          Post Your Property for Sale
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Fill in the details below to create an eye-catching property listing.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-2xl space-y-8"
        encType="multipart/form-data"
      >
        <section className="space-y-6">
          <div className="flex items-center space-x-3 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12" />
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

export default SellPage;
