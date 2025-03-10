import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { deleteProduct } from "../../redux/actions/product";

const AllProducts = () => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${server}/product/admin-all-products`, { withCredentials: true })
      .then((res) => {
        setData(res.data.products);
      });
  }, []);

  const handleListProduct = (id) => {
    // Implement the functionality for listing the product
    console.log(`List the Product with id: ${id}`);
  };

  const handleDropProduct = (id) => {
    // Implement the functionality for dropping the product
    dispatch(deleteProduct(id));
    setData(data.filter((item) => item._id !== id));
    console.log(`Drop the Product with id: ${id}`);
  };

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 250,
      sortable: false,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleListProduct(params.id)}
            >
              List the Product
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDropProduct(params.id)}
              style={{ marginLeft: "10px" }}
            >
              Drop the Product
            </Button>
          </div>
        );
      },
    },
  ];

  const row = [];

  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "US$ " + item.discountPrice,
        Stock: item.stock,
        sold: item?.sold_out,
      });
    });

  return (
    <>
      <div className="w-full mx-8 pt-1 mt-10 bg-white">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
    </>
  );
};

export default AllProducts;