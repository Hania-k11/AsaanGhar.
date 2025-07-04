import React, { useState } from "react";
import house1 from "../assets/house1.jpg";
import house2 from "../assets/house2.jpg";
import house3 from "../assets/house3.jpg";
import house4 from "../assets/house4.jpg";
import house5 from "../assets/house5.jpg";
import house6 from "../assets/house6.jpg";

const properties = [
  { id: 1, title: "Modern Family House", location: "DHA Phase 6, Karachi", price: "PKR 3.2 Crore", image: house1 },
  { id: 2, title: "Luxury Apartment", location: "Clifton, Karachi", price: "PKR 1.5 Crore", image: house2 },
  { id: 3, title: "Commercial Plot", location: "Gulistan-e-Johar", price: "PKR 5.0 Crore", image: house3 },
  { id: 4, title: "Elegant Villa", location: "PECHS Block 2", price: "PKR 6.5 Crore", image: house4 },
  { id: 5, title: "Studio Flat", location: "Bahadurabad", price: "PKR 90 Lakh", image: house5 },
  { id: 6, title: "Townhouse", location: "North Nazimabad", price: "PKR 2.8 Crore", image: house6 },
  { id: 7, title: "Corner Plot", location: "Scheme 33", price: "PKR 3.1 Crore", image: house1 },
  { id: 8, title: "Duplex House", location: "Nazimabad", price: "PKR 4.2 Crore", image: house2 },
  { id: 9, title: "Farmhouse", location: "Gadap Town", price: "PKR 12.0 Crore", image: house3 },
  { id: 10, title: "Penthouse", location: "Sea View", price: "PKR 8.9 Crore", image: house4 },
  { id: 11, title: "Cottage", location: "Malir Cantt", price: "PKR 1.2 Crore", image: house5 },
  { id: 12, title: "Bungalow", location: "Defence Phase 8", price: "PKR 7.5 Crore", image: house6 },
  { id: 13, title: "Apartment", location: "Tariq Road", price: "PKR 1.8 Crore", image: house1 },
  { id: 14, title: "House with Basement", location: "Gulshan-e-Iqbal", price: "PKR 6.0 Crore", image: house2 },
  { id: 15, title: "Brand New Home", location: "Shah Faisal Colony", price: "PKR 3.6 Crore", image: house3 },
];

const BuyPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = currentPage === 3 ? 3 : 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProperties = properties.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = 3;

  return (
    <div className="container mx-auto px-4 pt-24 pb-10">
      <h1 className="text-3xl font-bold text-emerald-600 mb-6">Properties for Sale</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentProperties.map((property) => (
          <div key={property.id} className="border rounded-lg shadow-lg overflow-hidden">
            <img src={property.image} alt={property.title} className="w-full h-56 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{property.title}</h2>
              <p className="text-gray-600">{property.location}</p>
              <p className="text-emerald-600 font-bold">{property.price}</p>
              <button className="mt-3 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 space-x-2">
        {[1, 2, 3].map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`px-4 py-2 rounded ${
              pageNum === currentPage
                ? "bg-emerald-600 text-white"
                : "bg-white text-emerald-600 border border-emerald-600"
            } hover:bg-emerald-700 hover:text-white`}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BuyPage;
