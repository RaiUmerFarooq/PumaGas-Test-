import React, { useState, useEffect } from "react";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";
import styles from "../../styles/styles";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";

const ContactUs = () => {
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const [sellerPhone, setSellerPhone] = useState("");

  // Fetch the first seller's phone number on mount
  useEffect(() => {
    const fetchSellerPhone = async () => {
      try {
        const response = await axios.get(`${server}/shop/get-first-seller-phone`, {
          withCredentials: true, // Include credentials (cookies)
        });
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

  const handleInputChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${server}/send-email`,
        contactData,
        {
          headers: {
            "Content-Type": "application/json", // Explicitly set Content-Type
          },
          withCredentials: true, // Include credentials (cookies)
        }
      );
      if (response.data.success) {
        toast.success("Your message has been sent successfully!");
        setContactData({
          name: "",
          email: "",
          phoneNumber: "",
          message: "",
        });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const handleWhatsAppMessage = () => {
    if (!sellerPhone) {
      toast.error("Contact phone number not available!");
      return;
    }
    const message = `Hello, I have a query from the Contact Us page. Name: ${contactData.name},\n Email: ${contactData.email},\n Phone: ${contactData.phoneNumber},\n ${contactData.message}`;
    const whatsappUrl = `https://wa.me/+92${sellerPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <Header activeHeading={6} />

      {/* Main Content */}
      <div className={`${styles.section} py-12 px-4 md:px-8 flex-grow`}>
        <h1 className="text-3xl font-bold text-center mb-8 text-[#000000b7]">
          Contact Us
        </h1>
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <p className="text-center text-gray-600 mb-6">
            We’d love to hear from you! Fill out the form below or reach out via WhatsApp.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={contactData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={contactData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Your Phone Number"
                value={contactData.phoneNumber}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Message
              </label>
              <textarea
                name="message"
                placeholder="Your Message"
                value={contactData.message}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                required
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition w-full md:w-auto"
              >
                Send Message
              </button>
              <button
                type="button"
                onClick={handleWhatsAppMessage}
                className="bg-[#25D366] text-white px-6 py-2 rounded hover:bg-[#1ebd56] transition w-full md:w-auto flex items-center justify-center"
              >
                WhatsApp <AiOutlineWhatsApp className="ml-2" />
              </button>
            </div>
          </form>

          {/* Contact Info */}
          <div className="mt-8 text-center text-gray-600">
            <p>Or contact us directly:</p>
            <p className="mt-2">
              Phone: {sellerPhone ? sellerPhone : "Loading..."}
            </p>
            <p>Factory Phone: 055-4802131 , 055-4213381</p>
            <p>Email: pumagas30@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactUs;