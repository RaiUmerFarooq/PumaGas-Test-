import React, { useEffect } from "react";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { MdBorderClear } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  console.log("orders", orders);

  useEffect(() => {
    if (seller && seller._id) {
      dispatch(getAllOrdersOfShop(seller._id));
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller]);

  const availableBalance = seller?.availableBalance?.toFixed(2);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${server}/order/update-order-status/${orderId}`,
        { status: newStatus },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      toast.success("Order status updated successfully!");
      dispatch(getAllOrdersOfShop(seller._id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order status");
    }
  };

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    { field: "customerName", headerName: "Customer Name", minWidth: 150, flex: 1 },
    { field: "email", headerName: "Email", minWidth: 180, flex: 1.5 },
    { field: "phoneNumber", headerName: "Phone Number", minWidth: 150, flex: 1 }, // Added new column
    { field: "address", headerName: "Address", minWidth: 200, flex: 1.5 },
    { field: "productName", headerName: "Product Name", minWidth: 200, flex: 1.2 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered" ? "greenColor" : "redColor";
      },
    },
    { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 130, flex: 0.7 },
    { field: "total", headerName: "Total", type: "number", minWidth: 130, flex: 0.8 },
    {
      field: "updateStatus",
      headerName: "Update Status",
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const orderId = params.id;
        const currentStatus = params.getValue(params.id, "status");
        const statusOptions = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

        return (
          <select
            value={currentStatus}
            onChange={(e) => handleStatusChange(orderId, e.target.value)}
            className="w-full p-1 border rounded"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        customerName: item.customerName || "N/A",
        email: item.customerEmail || "N/A",
        phoneNumber: item.customerPhoneNumber || "N/A", // Added new field
        address: item.location || "N/A",
        productName: item.orderDetails.productName || "N/A",
        itemsQty: item.orderDetails.quantity,
        total: "Rs " + item.orderDetails.totalAmount,
        status: item.status,
      });
    });

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
      <div className="w-full block 800px:flex items-center justify-between">
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <MdBorderClear size={30} className="mr-2" fill="#00000085" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              All Orders
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
            {orders && orders.length}
          </h5>
          <Link to="/dashboard-orders">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect size={30} className="mr-2" fill="#00000085" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              All Products
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
            {products && products.length}
          </h5>
          <Link to="/dashboard-products">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Products</h5>
          </Link>
        </div>
      </div>
      <br />
      <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>
      <div className="w-full min-h-[45vh] bg-white rounded">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
    </div>
  );
};

export default DashboardHero;