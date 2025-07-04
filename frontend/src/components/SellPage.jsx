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
      image: URL.createObjectURL(formData.image),
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
    <div className="pt-28 pb-12 px-4 container mx-auto">
      <h1 className="text-3xl font-bold text-emerald-600 mb-6 text-center">
        Post Your Property
      </h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-6"
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Property Title"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price (PKR)"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 font-normal"
            required
          >
            <option value="" className="font-normal">Property Type</option>
            <option value="House" className="font-normal">House</option>
            <option value="Apartment" className="font-normal">Apartment</option>
            <option value="Plot" className="font-normal">Plot</option>
            <option value="Commercial" className="font-normal">Commercial</option>
          </select>

          <input
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            placeholder="Bedrooms"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            min="0"
            required
          />
          <input
            type="number"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            placeholder="Bathrooms"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            min="0"
            required
          />
        </div>

        <input
          type="text"
          name="area"
          value={formData.area}
          onChange={handleChange}
          placeholder="Area (sq ft)"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Property Description"
          rows="4"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
        />

        <input
          type="text"
          name="owner"
          value={formData.owner}
          onChange={handleChange}
          placeholder="Owner Name"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
        />
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          placeholder="Contact Info"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
        />
        <input
          type="number"
          name="yearBuilt"
          value={formData.yearBuilt}
          onChange={handleChange}
          placeholder="Year Built"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="number"
          name="parking"
          value={formData.parking}
          onChange={handleChange}
          placeholder="Parking Spaces"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <div>
          <label className="block mb-2 text-gray-600">Upload Property Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-600 file:text-white hover:file:bg-emerald-700"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition-all"
        >
          Submit Property
        </button>
      </form>
    </div>
  );
};

export default SellPage;
