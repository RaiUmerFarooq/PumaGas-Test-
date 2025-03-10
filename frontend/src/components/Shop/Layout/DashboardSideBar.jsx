import React from "react";
import { AiOutlineFolderAdd, AiOutlineGift, AiOutlinePicture } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import { CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";

const DashboardSideBar = ({ active }) => {
  return (
    <div className="w-full h-[90vh] bg-white shadow-sm overflow-y-scroll sticky top-0 left-0 z-10">
      {/* Dashboard */}
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard" className="w-full flex items-center">
          <RxDashboard size={30} color={active === 1 ? "crimson" : "#555"} />
          <h5 className={`hidden 800px:block pl-2 text-[18px] font-[400] ${active === 1 ? "text-[crimson]" : "text-[#555]"}`}>
            Dashboard
          </h5>
        </Link>
      </div>

      {/* Orders */}
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-orders" className="w-full flex items-center">
          <FiShoppingBag size={30} color={active === 2 ? "crimson" : "#555"} />
          <h5 className={`hidden 800px:block pl-2 text-[18px] font-[400] ${active === 2 ? "text-[crimson]" : "text-[#555]"}`}>
            All Orders
          </h5>
        </Link>
      </div>

      {/* Products */}
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-products" className="w-full flex items-center">
          <FiPackage size={30} color={active === 3 ? "crimson" : "#555"} />
          <h5 className={`hidden 800px:block pl-2 text-[18px] font-[400] ${active === 3 ? "text-[crimson]" : "text-[#555]"}`}>
            All Products
          </h5>
        </Link>
      </div>

      {/* Create Product */}
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-create-product" className="w-full flex items-center">
          <AiOutlineFolderAdd size={30} color={active === 4 ? "crimson" : "#555"} />
          <h5 className={`hidden 800px:block pl-2 text-[18px] font-[400] ${active === 4 ? "text-[crimson]" : "text-[#555]"}`}>
            Create Product
          </h5>
        </Link>
      </div>

      {/* Events */}
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-events" className="w-full flex items-center">
          <MdOutlineLocalOffer size={30} color={active === 5 ? "crimson" : "#555"} />
          <h5 className={`hidden 800px:block pl-2 text-[18px] font-[400] ${active === 5 ? "text-[crimson]" : "text-[#555]"}`}>
            Combo
          </h5>
        </Link>
      </div>

      {/* Create Event */}
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-create-event" className="w-full flex items-center">
          <VscNewFile size={30} color={active === 6 ? "crimson" : "#555"} />
          <h5 className={`hidden 800px:block pl-2 text-[18px] font-[400] ${active === 6 ? "text-[crimson]" : "text-[#555]"}`}>
            Create Combo Deals
          </h5>
        </Link>
      </div>

      {/* NEW: Update Home Page Banner */}
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-update-home-banner" className="w-full flex items-center">
          <AiOutlinePicture size={30} color={active === 12 ? "crimson" : "#555"} />
          <h5 className={`hidden 800px:block pl-2 text-[18px] font-[400] ${active === 12 ? "text-[crimson]" : "text-[#555]"}`}>
            Update Home Banner
          </h5>
        </Link>
      </div>

      {/* NEW: Update Category Banner */}
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-update-category-banner" className="w-full flex items-center">
          <AiOutlinePicture size={30} color={active === 13 ? "crimson" : "#555"} />
          <h5 className={`hidden 800px:block pl-2 text-[18px] font-[400] ${active === 13 ? "text-[crimson]" : "text-[#555]"}`}>
            Update Category Banner
          </h5>
        </Link>
      </div>

      {/* Settings */}
      <div className="w-full flex items-center p-4">
        <Link to="/settings" className="w-full flex items-center">
          <CiSettings size={30} color={active === 11 ? "crimson" : "#555"} />
          <h5 className={`hidden 800px:block pl-2 text-[18px] font-[400] ${active === 11 ? "text-[crimson]" : "text-[#555]"}`}>
            Settings
          </h5>
        </Link>
      </div>
    </div>
  );
};

export default DashboardSideBar;
