import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import styles from "../../styles/styles";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Layout/Loader";
import { ImgUrl } from "../../static/data";

const ShopSettings = ({ logoutHandler }) => {
  const { seller } = useSelector((state) => state.seller);
  const [name, setName] = useState(seller?.name || "");
  const [description, setDescription] = useState(seller?.description || "");
  const [address, setAddress] = useState(seller?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(seller?.phoneNumber || "");
  const [zipCode, setZipcode] = useState(seller?.zipCode || "");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const updateHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.put(
        `${server}/shop/update-seller-info`,
        { name, address, zipCode, phoneNumber, description },
        { withCredentials: true }
      );
      toast.success("Shop info updated successfully!");
      dispatch(loadSeller());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update shop info");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full bg-white shadow-md rounded-md p-6">
          {/* Header */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Shop Settings
          </h2>

          {/* Static Avatar Section */}
          <div className="flex justify-center mb-8">
            <img
              src={
               ImgUrl
              }
              alt="Shop Avatar"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
            />
          </div>

          {/* Shop Info Form */}
          <form onSubmit={updateHandler} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Name
              </label>
              <input
                type="text"
                placeholder={seller?.name || "Enter shop name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${styles.input} w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Description
              </label>
              <textarea
                placeholder={
                  seller?.description
                    ? seller.description
                    : "Enter your shop description"
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${styles.input} w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500`}
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Address
              </label>
              <input
                type="text"
                placeholder={seller?.address || "Enter shop address"}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`${styles.input} w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Phone Number
              </label>
              <input
                type="number"
                placeholder={seller?.phoneNumber || "Enter phone number"}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`${styles.input} w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Zip Code
              </label>
              <input
                type="number"
                placeholder={seller?.zipCode || "Enter zip code"}
                value={zipCode}
                onChange={(e) => setZipcode(e.target.value)}
                className={`${styles.input} w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500`}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition font-medium"
            >
              Update Shop
            </button>
          </form>

          {/* Logout Button */}
          <button
            onClick={logoutHandler}
            className="w-full mt-4 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition font-medium"
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
};

export default ShopSettings;