import React from "react";
import haniaImage from "../assets/hania.jpg"; 
import faizImage from "../assets/faiz2.jpg";
import zainabImage from "../assets/zainab2.jpg";

const teamMembers = [
  {
    name: "Hania Khan",
    role: "Lead Frontend Engineer",
    image: haniaImage,
    bio: "Leads UI development with passion for modern, fast, and user-friendly interfaces. Expert in React and Tailwind.",
  },
  {
    name: "M.Faiz Tanveer",
    role: "Backend & Database Engineer",
    image: faizImage,
    bio: "Handles secure backend systems and data architecture. Skilled in Node.js, Express, and MongoDB.",
  },
  {
    name: "Zainab Rauf",
    role: "Product Designer & UX Lead",
    image: zainabImage,
    bio: "Designs elegant user journeys and visual interfaces. Driven by empathy and a love for pixel-perfect design.",
  },
];

const AboutPage = () => {
  return (
    <div className="pt-28 pb-20 px-4 container mx-auto">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-emerald-600 mb-6">About AsaanGhar</h1>

        <p className="text-gray-600 text-lg mb-4">
          <strong>Asaan Ghar</strong> is a next-generation real estate platform designed to simplify property
          discovery and management across Pakistan. Whether you're looking to rent an apartment in Scheme 33 Karachi, buy your dream home, or sell a commercial plot — we make it fast, secure, and stress-free.
        </p>

        <p className="text-gray-600 text-lg mb-6">
          Founded by a dedicated team of tech-savvy property enthusiasts, we blend modern technology with market expertise to bring verified listings, responsive design, and real-time support to our users. Our platform empowers both property seekers and owners to take control with trust and transparency.
        </p>

        {/* Mission / Vision / Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-left">
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all animate-float">
            <h2 className="text-xl font-semibold text-emerald-600 mb-2">🏠 Our Mission</h2>
            <p className="text-gray-700">
              To empower users with seamless digital tools for renting, buying, or selling property — no matter where they are in Pakistan.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all animate-float delay-100">
            <h2 className="text-xl font-semibold text-emerald-600 mb-2">🌍 Our Vision</h2>
            <p className="text-gray-700">
              To become Pakistan’s most trusted prop-tech platform by fostering a real estate ecosystem rooted in transparency and innovation.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all animate-float delay-200">
            <h2 className="text-xl font-semibold text-emerald-600 mb-2">💎 Our Values</h2>
            <p className="text-gray-700">
              Integrity, innovation, user empowerment, and data transparency form the backbone of everything we do.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <h2 className="text-3xl font-bold text-emerald-600 mb-4">Why Choose AsaanGhar?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 text-left max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg">
            <h3 className="text-lg font-semibold mb-2 text-emerald-600">✔ Verified Listings</h3>
            <p className="text-gray-700">Every property is reviewed and authenticated to ensure you browse only real, accurate, and scam-free listings.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg">
            <h3 className="text-lg font-semibold mb-2 text-emerald-600">✔ Local Market Expertise</h3>
            <p className="text-gray-700">With a strong presence in Karachi, especially Scheme 33, we understand local trends and connect you with the best options fast.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg">
            <h3 className="text-lg font-semibold mb-2 text-emerald-600">✔ Easy Submission Process</h3>
            <p className="text-gray-700">List your property in just a few clicks. Add images, pricing, and get discovered by serious buyers and renters.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg">
            <h3 className="text-lg font-semibold mb-2 text-emerald-600">✔ Built for Everyone</h3>
            <p className="text-gray-700">Whether you're a landlord, tenant, investor, or agency — our platform serves all with simplicity and performance.</p>
          </div>
        </div>

        {/* Meet Our Team */}
        <h2 className="text-3xl font-bold text-emerald-600 mb-6">Meet the Team</h2>
        <p className="text-gray-600 text-md mb-12 max-w-2xl mx-auto">
          We’re a passionate team of developers and designers committed to reshaping the real estate experience in Pakistan.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition-all"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-emerald-500 mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
              <p className="text-emerald-600 mb-2">{member.role}</p>
              <p className="text-sm text-gray-600">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
