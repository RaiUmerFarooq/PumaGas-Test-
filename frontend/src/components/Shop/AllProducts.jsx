import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye, AiOutlineStar, AiFillStar } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop, deleteProduct } from "../../redux/actions/product"; // Import deleteProduct
import Loader from "../Layout/Loader";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";
const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch, seller._id]);

  const handleListProduct = async (id) => {
    try {
      const response = await axios.put(
        `${server}/product/increment-stock/${id}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("✅ API Response:", response.data);
      dispatch(getAllProductsShop(seller._id));
      toast.success("Product stock updated successfully!");
    } catch (error) {
      console.error("❌ Error listing the product:", error);
      toast.error(error.response?.data?.message || "Failed to update stock.");
    }
  };

  const handleDropProduct = async (id) => {
    try {
      await axios.put(`${server}/product/set-stock-zero/${id}`, {}, { withCredentials: true });
      dispatch(getAllProductsShop(seller._id));
      console.log(`Drop the Product with id: ${id}`);
      toast.success("Product stock set to zero!");
    } catch (error) {
      console.error("Error dropping the product:", error);
      toast.error(error.response?.data?.message || "Failed to drop product.");
    }
  };

  const handleToggleRecommended = async (id, currentStatus) => {
    try {
      await axios.put(
        `${server}/product/update-product/${id}`,
        { recommended: !currentStatus }, // Toggle the current status
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      toast.success(`Product ${!currentStatus ? "marked as" : "unmarked from"} recommended!`);
      dispatch(getAllProductsShop(seller._id)); // Refresh products
    } catch (error) {
      console.error("Error toggling recommended status:", error);
      toast.error(error.response?.data?.message || "Failed to update recommended status.");
    }
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id))
        .then(() => {
          toast.success("Product deleted successfully!");
          dispatch(getAllProductsShop(seller._id)); // Refresh the product list
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
          toast.error("Failed to delete product.");
        });
    }
  };

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1.4 },
    { field: "price", headerName: "Price", minWidth: 100, flex: 0.6 },
    { field: "Stock", headerName: "Stock", type: "number", minWidth: 80, flex: 0.5 },
    { field: "sold", headerName: "Sold out", type: "number", minWidth: 130, flex: 0.6 },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/product/${params.id}`}>
          <Button>
            <AiOutlineEye size={20} />
          </Button>
        </Link>
      ),
    },
    {
      field: "recommended",
      headerName: "Recommended",
      minWidth: 120,
      flex: 0.8,
      sortable: false,
      renderCell: (params) => {
        const isRecommended = params.getValue(params.id, "recommended");
        return (
          <Button
            onClick={() => handleToggleRecommended(params.id, isRecommended)}
            title={isRecommended ? "Unmark as Recommended" : "Mark as Recommended"}
          >
            {isRecommended ? (
              <AiFillStar size={20} color="#FFD700" /> // Filled star for recommended
            ) : (
              <AiOutlineStar size={20} color="#000" /> // Outline star for not recommended
            )}
          </Button>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 250,
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleListProduct(params.id)}
          >
            Available
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDropProduct(params.id)}
            style={{ marginLeft: "10px" }}
          >
            Discard
          </Button>
        </div>
      ),
    },
    {
      field: "delete",
      headerName: "",
      flex: 0.8,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <Button
          onClick={() => handleDeleteProduct(params.id)}
          title="Delete Product"
        >
          <AiOutlineDelete size={20} color="#FF0000" />
        </Button>
      ),
    },
  ];

  const row = [];
  products &&
    products.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "Rs " + item.discountPrice,
        Stock: item.stock,
        sold: item?.sold_out,
        recommended: item.recommended,
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

export default AllProducts;