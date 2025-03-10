import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { ImgUrl } from "../../../static/data";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  return (
    <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
      <div>
        <Link to="/dashboard">
        <img
  src={ImgUrl}
  alt="Logo"
  className="w-[60px] h-[60px] object-contain rounded-full ml-[70%]"
/>
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
         
          <Link to="/dashboard-products" className="800px:block hidden">
            <FiShoppingBag
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/dashboard-orders" className="800px:block hidden">
            <FiPackage color="#555" size={30} className="mx-5 cursor-pointer" />
          </Link>
          <Link to={`/shop/${seller._id}`}>
            <img
              src={ImgUrl}
              alt=""
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
