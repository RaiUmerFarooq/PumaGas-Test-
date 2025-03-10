import React, { useEffect } from "react";
import { BsFillBagFill } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/styles";
import { getAllOrdersOfUser } from "../redux/actions/order";

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    if (user && user._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user]);

  const data = orders && orders.find((item) => item._id === id);

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Order Details</h1>
        </div>
      </div>

      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000084]">
          Order ID: <span>#{data?._id?.slice(0, 8)}</span>
        </h5>
        <h5 className="text-[#00000084]">
          Placed on: <span>{data?.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      {/* Order Items */}
      <br />
      <br />
      {data && (
        <div className="w-full flex items-start mb-5">
          <img
            src={`${data.orderDetails?.productImage || "default-image-url"}`}
            alt=""
            className="w-[80px] h-[80px]"
          />
          <div className="w-full">
            <h5 className="pl-3 text-[20px]">{data.orderDetails?.productName}</h5>
            <h5 className="pl-3 text-[18px] text-[#00000091]">
              US${data.orderDetails?.price} x {data.orderDetails?.quantity}
            </h5>
            <p className="pl-3 text-[16px] text-[#00000084]">
              Description: {data?.description || "No description available"}
            </p>
          </div>
        </div>
      )}

      <div className="border-t w-full text-right">
        <h5 className="pt-3 text-[18px]">
          Total Price: <strong>US${data?.orderDetails?.totalAmount}</strong>
        </h5>
      </div>

      <br />
      <br />
      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-3 text-[20px] font-[600]">Shipping Address:</h4>
          <h4 className="pt-3 text-[18px]">{data?.location}</h4>
          <h4 className="text-[18px]">{data?.customerEmail}</h4>
        </div>
        <div className="w-full 800px:w-[40%]">
          <h4 className="pt-3 text-[20px] font-[600]">Order Status:</h4>
          <h4 className="text-[18px]">Status: {data?.status}</h4>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
};

export default UserOrderDetails;