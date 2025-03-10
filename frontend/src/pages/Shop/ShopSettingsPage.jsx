import React from "react";
import axios from "axios";
import { server } from "../../server";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import ShopSettings from "../../components/Shop/ShopSettings";

const ShopSettingsPage = () => {
  const logoutHandler = async () => {
    try {
      await axios.get(`${server}/shop/logout`, {
        withCredentials: true,
      });
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <DashboardHeader />
      <div className="flex flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-[80px] 800px:w-[330px] flex-shrink-0">
          <DashboardSideBar active={11} />
        </div>
        <div className="flex-1 py-6">
          <ShopSettings logoutHandler={logoutHandler} />
        </div>
      </div>
    </div>
  );
};

export default ShopSettingsPage;