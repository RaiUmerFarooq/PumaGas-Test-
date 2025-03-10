import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { loadSeller } from "../../redux/actions/user";
import axios from "axios";
import { server } from "../../server";
import CountDown from "./CountDown";
import styles from "../../styles/styles";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    customerName: "",
    customerEmail: "",
    customerPhoneNumber: "+92", // Prefill with +92
    location: "",
    quantity: 1,
  });

  const handleMessageSubmit = async () => {
    try {
      const response = await axios.get(`${server}/shop/get-first-seller-phone`);
      console.log("API Response:", response.data);

      if (!response.data.success || !response.data.phoneNumber) {
        toast.error("Unable to retrieve seller phone number!");
        return;
      }

      const phoneNumber = response.data.phoneNumber;
      console.log("Fetched Phone Number:", phoneNumber);

      const message = `Hello, I am interested in your product: ${data.name}. Here is the image: ${data.images[0]?.url} \n Price: ${data.discountPrice}Rs`;
      const whatsappUrl = `https://wa.me/+92${phoneNumber}?text=${encodeURIComponent(message)}`;
      console.log("WhatsApp URL:", whatsappUrl);

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error fetching seller phone number:", error);
      toast.error("Failed to send message. Please try again later.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "customerPhoneNumber") {
      const cleanedValue = value.replace(/[^0-9+]/g, ""); // Remove non-numeric except +
      if (
        cleanedValue === "" || // Allow empty input
        (cleanedValue.startsWith("+92") && cleanedValue.length <= 13) // +92 + 10 digits = 13 chars
      ) {
        setOrderDetails({ ...orderDetails, [name]: cleanedValue });
      }
    } else {
      setOrderDetails({ ...orderDetails, [name]: value });
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+923[0-4][0-9]{8}$/; // Matches +923XXXXXXXXXX (10 digits after +923)
    return phoneRegex.test(phoneNumber);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number
    if (!validatePhoneNumber(orderDetails.customerPhoneNumber)) {
      toast.error("Please enter a valid Pakistani phone number (e.g., +923001234567)");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        `${server}/order/create-order`,
        {
          customerEmail: orderDetails.customerEmail,
          customerName: orderDetails.customerName,
          customerPhoneNumber: orderDetails.customerPhoneNumber,
          location: orderDetails.location,
          orderDetails: {
            productId: data._id,
            productName: data.name,
            quantity: parseInt(orderDetails.quantity, 10),
            price: data.discountPrice,
          },
          orderStock: 10,
          sellerId: data.shop._id,
        },
        config
      );

      console.log("Order Placed:", response.data.order);
      toast.success("Order placed successfully! Check your email.");
      setOrderFormOpen(false);
      setOrderDetails({
        customerName: "",
        customerEmail: "",
        customerPhoneNumber: "+92", // Reset to +92
        location: "",
        quantity: 1,
      });
    } catch (error) {
      console.error("Order Error:", error.response?.data?.message || error.message);
      toast.error("Failed to place order: " + (error.response?.data?.message || "Server error"));
    }
  };

  return (
    <div className={`w-full block bg-white rounded-lg border border-gray-300 ${active ? "unset" : "mb-12"} lg:flex p-2`}>
      <div className="w-full lg:w-[50%] m-auto">
        <img
          src={`${data.images[0]?.url}`}
          alt=""
          className="w-full h-auto max-h-[250px] object-contain m-auto"
        />
      </div>
      <div className="w-full lg:w-[50%] flex flex-col justify-center p-4">
        <h2 className={`${styles.productTitle} text-center lg:text-left`}>{data.name}</h2>
        <p className="text-center lg:text-left">{data.description}</p>
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start py-2 gap-2">
          <h5 className="font-[500] text-[18px] text-[#d55b45] line-through">{data.originalPrice}Rs</h5>
          <h5 className="font-bold text-[20px] text-[#333] font-Roboto">{data.discountPrice}Rs</h5>
        </div>
        <CountDown data={data} />
        <br />
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 w-full">
          <Link to={`/product/${data._id}?isEvent=true`} className="w-full md:w-auto">
            <div className="w-full md:w-auto text-center px-4 py-2 bg-blue-500 text-white rounded-md">
              See Details
            </div>
          </Link>
          <div
            className="w-full md:w-auto flex items-center justify-center bg-[#25D366] text-white px-4 py-2 rounded-md cursor-pointer"
            onClick={handleMessageSubmit}
          >
            <AiOutlineWhatsApp size={20} className="mr-2" /> Send Message
          </div>
          <div
            className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer text-center"
            onClick={() => setOrderFormOpen(true)}
          >
            Place Order
          </div>
        </div>

        {/* Aesthetic Order Form Modal */}
        {orderFormOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[90%] max-w-md relative">
              <h2 className="text-xl font-bold mb-4 text-center">Place Your Order</h2>
              <button
                onClick={() => setOrderFormOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <RxCross1 size={20} />
              </button>
              <form onSubmit={handleOrderSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-1">Name</label>
                  <input
                    type="text"
                    name="customerName"
                    placeholder="Your Name"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleInputChange}
                    value={orderDetails.customerName}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    name="customerEmail"
                    placeholder="Your Email"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleInputChange}
                    value={orderDetails.customerEmail}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="customerPhoneNumber"
                    placeholder="+923001234567"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleInputChange}
                    value={orderDetails.customerPhoneNumber}
                    required
                    pattern="^\+923[0-4][0-9]{8}$"
                    title="Please enter a valid Pakistani phone number (e.g., +923001234567)"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Format: +923XXXXXXXXXX (e.g., +923001234567)
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Your Location"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleInputChange}
                    value={orderDetails.location}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-1">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    placeholder="Quantity"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleInputChange}
                    value={orderDetails.quantity}
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setOrderFormOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Submit Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;