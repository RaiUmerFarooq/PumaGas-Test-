import React, { useEffect } from "react";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import styles from "../../styles/styles";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { AiOutlineEye } from "react-icons/ai"; // Added preview icon
import { Link } from "react-router-dom";

const AllOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  console.log("orders", orders);

  useEffect(() => {
    if (seller && seller._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `${server}/order/update-order-status/${orderId}`,
        { status: newStatus },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success("Order status updated successfully!");
      dispatch(getAllOrdersOfShop(seller._id));
    } catch (error) {
      console.error("Status Update Error:", error);
      toast.error(error.response?.data?.message || "Failed to update order status");
    }
  };

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    { field: "customerName", headerName: "Customer Name", minWidth: 150, flex: 1 },
    { field: "email", headerName: "Email", minWidth: 180, flex: 1.5 },
    { field: "address", headerName: "Address", minWidth: 200, flex: 1.5 },
    { field: "productName", headerName: "Product Name", minWidth: 200, flex: 1.2 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.getValue(params.id, "status") === "Delivered" ? "greenColor" : "redColor",
    },
    { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 130, flex: 0.7 },
    { field: "total", headerName: "Total", type: "number", minWidth: 130, flex: 0.8 },
    {
      field: "preview",
      headerName: "Preview Product",
      minWidth: 100,
      flex: 0.6,
      sortable: false,
      renderCell: (params) => {
        const productId = params.getValue(params.id, "productId");
        return (
          <Link to={`/product/${productId}`}>
            <Button>
              <AiOutlineEye size={20} />
            </Button>
          </Link>
        );
      },
    },
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
        address: item.location || "N/A",
        productName: item.orderDetails.productName || "N/A",
        productId: item.orderDetails.productId, // Added productId for preview
        itemsQty: item.orderDetails.quantity,
        total: "Rs " + item.orderDetails.totalAmount,
        status: item.status,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllOrders;