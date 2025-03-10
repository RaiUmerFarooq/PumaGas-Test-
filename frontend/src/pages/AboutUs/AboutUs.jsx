import React, { useState, useEffect } from "react";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";
import Header from "../../components/Layout/Header"; // Adjust path if needed
import Footer from "../../components/Layout/Footer"; // Adjust path if needed
import { MissionImg } from "../../static/data";
import { ProductsImg } from "../../static/data";

const AboutUs = () => {
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
    const message = "Hello, I have a question about Puma Electric & Gas Appliances.";
    const whatsappUrl = `https://wa.me/+92${sellerPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="w-full py-16 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900 tracking-tight">
            About Us
          </h1>

          {/* Intro Section */}
          <div className="bg-white rounded-xl shadow-xl p-8 mb-12 border border-gray-200">
            <p className="text-center text-gray-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              At Puma Electric & Gas Appliances, we are committed to delivering high-quality gas home appliances that cater to the needs of modern households. With over 40 years of industry experience, we have established ourselves as a trusted name, known for our reliability, innovation, and customer satisfaction.
            </p>
          </div>

          {/* Our Mission */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6">
                  Our Mission
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  Our mission is to provide durable and energy-efficient gas appliances that enhance convenience and comfort in every home. We achieve this through:
                </p>
                <ul className="text-gray-600 text-lg leading-relaxed list-disc pl-5">
                  <li><span className="font-semibold">Advanced Technology</span> – Incorporating the latest innovations for efficient and user-friendly appliances.</li>
                  <li><span className="font-semibold">High-Quality Materials</span> – Sourcing premium materials to ensure long-lasting durability.</li>
                  <li><span className="font-semibold">Expert Craftsmanship</span> – Employing skilled professionals to maintain superior product standards.</li>
                  <li><span className="font-semibold">Strict Quality Control</span> – Implementing rigorous testing to meet industry benchmarks.</li>
                </ul>
              </div>
              <div className="w-full">
                <div className="relative w-full h-64 lg:h-80 rounded-lg shadow-md overflow-hidden">
                  <img
                    src={MissionImg}
                    alt="Our Mission"
                    className="w-full h-full object-contain" // Changed to object-contain
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Our Products */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="w-full order-1 lg:order-none">
                <div className="relative w-full h-64 lg:h-80 rounded-lg shadow-md overflow-hidden">
                  <img
                    src={ProductsImg}
                    alt="Our Products"
                    className="w-full h-full object-contain" // Changed to object-contain
                  />
                </div>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6">
                  Our Products
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  We offer a wide range of home appliances, including:
                </p>
                <ul className="text-gray-600 text-lg leading-relaxed list-disc pl-5">
                  <li><span className="font-semibold">Gas Heaters</span> – Designed for maximum warmth and energy efficiency.</li>
                  <li><span className="font-semibold">Gas Stoves</span> – Built for precision cooking and long-term use.</li>
                  <li><span className="font-semibold">Gas Cooking Ranges</span> – Combining functionality and modern design.</li>
                  <li><span className="font-semibold">Gas Water Heaters</span> – Providing reliable and cost-effective hot water solutions.</li>
                </ul>
                <p className="text-gray-600 text-lg leading-relaxed mt-4">
                  All our products are manufactured in our state-of-the-art facility located in Gujranwala, Pakistan, ensuring top-notch quality and performance.
                </p>
              </div>
            </div>
          </section>

          {/* Global Reach */}
          <section className="mb-16">
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6 text-center">
                Global Reach
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto text-center">
                Over the years, we have expanded our presence beyond Pakistan, exporting our products to Europe, Africa, and the Middle East. Our growing global customer base reflects the trust and satisfaction we have built through our dedication to excellence.
              </p>
            </div>
          </section>

          {/* Contact Info */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-xl p-8 text-white text-center">
            <h3 className="text-2xl md:text-3xl font-semibold mb-6">
              Contact Us
            </h3>
            <p className="text-lg mb-4">
              Address: Puma Gas Appliances, Hafizabad Road, Gujranwala, Punjab, Pakistan
            </p>
            <p className="text-lg mb-4">
              Phone: 0307-7255575
            </p>
            <p className="text-lg mb-6">
              Fax: 055-4802131 , 055-4213381
            </p>
            <button
              onClick={handleWhatsAppClick}
              className="bg-white text-[#25D366] px-8 py-3 rounded-full hover:bg-gray-100 transition flex items-center justify-center mx-auto shadow-md"
            >
              Contact via WhatsApp <AiOutlineWhatsApp className="ml-2 text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;