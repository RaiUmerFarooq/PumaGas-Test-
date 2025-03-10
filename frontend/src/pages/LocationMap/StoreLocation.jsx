// StoreLocation.js
import React, { useState, useEffect } from "react";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";
import Header from "../../components/Layout/Header"; // Adjust path if needed
import Footer from "../../components/Layout/Footer"; // Adjust path if needed

const StoreLocation = () => {
  const [sellerPhone, setSellerPhone] = useState("");

  useEffect(() => {
    const fetchSellerPhone = async () => {
      try {
        const response = await axios.get(`${server}/shop/get-first-seller-phone`);
        if (response.data.success && response.data.phoneNumber) {
          setSellerPhone(response.data.phoneNumber);
        } else {
          toast.error("Unable to retrieve contact phone number!");
        }
      } catch (error) {
        console.error("Error fetching seller phone number:", error);
        toast.error("Failed to load contact number. Please try again later.");
      }
    };
    fetchSellerPhone();
  }, []);

  const handleWhatsAppClick = () => {
    if (!sellerPhone) {
      toast.error("Contact phone number not available!");
      return;
    }
    const message = "Hello, I have a question about your store location.";
    const whatsappUrl = `https://wa.me/+92${sellerPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // Updated Google Maps Embed URL for Alam Chowk, Gujranwala
  const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2075.4186763007788!2d74.14568981094946!3d32.15615449842269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f2be08ca2d57b%3A0x251a78fa15205e74!2sAlam%20Chowk%2C%20Gujranwala!5e0!3m2!1sen!2s!4v1741397360078!5m2!1sen!2s";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <Header /> {/* Adjust activeHeading for "Store Location" */}

      {/* Main Content */}
      <div className="w-full py-16 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900 tracking-tight">
            Store Location
          </h1>

          {/* Intro Section */}
          <div className="bg-white rounded-xl shadow-xl p-8 mb-12 border border-gray-200">
            <p className="text-center text-gray-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              Visit us at Puma Electric & Gas Appliances in Gujranwala, Pakistan. Find our location near Alam Chowk below and get in touch for any inquiries!
            </p>
          </div>

          {/* Map and Details Section */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Google Maps Embed */}
              <div className="w-full h-[400px] lg:h-[500px]">
                <iframe
                  src={googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg shadow-md"
                  title="Puma Electric & Gas Appliances Location - Alam Chowk"
                ></iframe>
              </div>

              {/* Store Details */}
              <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6">
                  Our Store
                </h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    <span className="font-semibold">Address:</span> Puma Gas Appliances, Hafizabad Road, Gujranwala, Punjab, Pakistan
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span> 0307-7255575
                  </p>
                  <p>
                    <span className="font-semibold">Factory Number:</span> 055-4802131 , 055-4213381
                  </p>
                  <p>
                    <span className="font-semibold">Hours:</span> Saturday - Thursday, 9:00 AM - 5:00 PM
                  </p>
                </div>
                <button
                  onClick={handleWhatsAppClick}
                  className="mt-6 bg-[#25D366] text-white px-8 py-3 rounded-full hover:bg-[#1ebd56] transition flex items-center justify-center mx-auto shadow-md"
                >
                  Contact via WhatsApp <AiOutlineWhatsApp className="ml-2 text-xl" />
                </button>
              </div>
            </div>
          </section>

          {/* Directions Note */}
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <p className="text-gray-600 text-lg leading-relaxed">
              Need help finding us? Use the map above or contact us for directions. We’re located near Alam Chowk, easily accessible in Gujranwala!
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default StoreLocation;