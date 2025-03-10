import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineWhatsApp,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import styles from "../../styles/styles";
import { addToWishlist, removeFromWishlist } from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "./Ratings";
import axios from "axios";
import { server } from "../../server";
import { ImgUrl } from "../../static/data";

const ProductDetails = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhoneNumber: "+92", // Prefill with +92
    location: "",
    quantity: 1,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(data && data?.shop._id));
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [data, wishlist, dispatch]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const avg = totalRatings / totalReviewsLength || 0;
  const averageRating = avg.toFixed(2);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${server}/shop/get-first-seller-phone`);
      console.log("API Response:", response.data);

      if (!response.data.success || !response.data.phoneNumber) {
        toast.error("Unable to retrieve seller phone number!");
        return;
      }

      const phoneNumber = response.data.phoneNumber;
      console.log("Fetched Phone Number:", phoneNumber);

      const message = `Hello, I am interested in your product: ${data.name}. Here is the image: ${data.images[0]?.url} \n Price: ${data.originalPrice}Rs`;
      const whatsappUrl = `https://wa.me/+92${phoneNumber}?text=${encodeURIComponent(message)}`;
      console.log("Generated WhatsApp URL:", whatsappUrl);

      const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
        toast.info("Opening WhatsApp in current tab...");
        window.location.href = whatsappUrl;
      }
    } catch (error) {
      console.error("Error fetching seller phone number:", error);
      toast.error("Failed to send message. Please try again later.");
    }
  };

  const toggleOrderForm = () => {
    setShowOrderForm(!showOrderForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "customerPhoneNumber") {
      const cleanedValue = value.replace(/[^0-9+]/g, ""); // Remove non-numeric except +
      if (
        cleanedValue === "" || // Allow empty input
        (cleanedValue.startsWith("+92") && cleanedValue.length <= 13) // +92 + 10 digits = 13 chars
      ) {
        setOrderData({ ...orderData, [name]: cleanedValue });
      }
    } else {
      setOrderData({ ...orderData, [name]: value });
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+923[0-4][0-9]{8}$/; // Matches +923XXXXXXXXXX (10 digits after +923)
    return phoneRegex.test(phoneNumber);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number
    if (!validatePhoneNumber(orderData.customerPhoneNumber)) {
      toast.error("Please enter a valid Pakistani phone number (e.g., +923001234567)");
      return;
    }

    const payload = {
      customerEmail: orderData.customerEmail,
      customerName: orderData.customerName,
      customerPhoneNumber: orderData.customerPhoneNumber,
      location: orderData.location,
      orderDetails: {
        productId: data._id,
        productName: data.name,
        quantity: parseInt(orderData.quantity, 10),
        price: data.originalPrice,
      },
      orderStock: data.stock || 10,
      sellerId: data.shop._id,
    };

    console.log("Order Payload:", payload);

    try {
      const response = await axios.post(
        `${server}/order/create-order`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Order Response:", response.data);
      toast.success("Order placed successfully! Check your email.");
      setShowOrderForm(false);
      setOrderData({
        customerName: "",
        customerEmail: "",
        customerPhoneNumber: "+92", // Reset to +92
        location: "",
        quantity: 1,
      });
    } catch (error) {
      console.error("Order Error:", error.response?.data || error.message);
      toast.error(
        "Failed to place order: " +
          (error.response?.data?.message || "Server error")
      );
    }
  };

  return (
    <div className="bg-white">
      {data ? (
        <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
          <div className="w-full py-5">
            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img
                  src={`${data && data.images[select]?.url}`}
                  alt=""
                  className="w-[80%]"
                />
                <div className="w-full flex">
                  {data &&
                    data.images.map((i, index) => (
                      <div
                        key={index}
                        className={`${select === index ? "border" : ""} cursor-pointer`}
                      >
                        <img
                          src={`${i?.url}`}
                          alt=""
                          className="h-[200px] overflow-hidden mr-3 mt-3"
                          onClick={() => setSelect(index)}
                        />
                      </div>
                    ))}
                </div>
              </div>
              <div className="w-full 800px:w-[50%] pt-5">
                <h1 className={`${styles.productTitle}`}>{data.name}</h1>
                <p>{data.description}</p>
                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {data.originalPrice} Rs
                  </h4>
                </div>

                <div className="flex items-center mt-12 justify-between pr-3">
                  <div>
                    {data.stock > 0 ? (
                      <span className="text-green-500 font-medium">In Stock</span>
                    ) : (
                      <span className="text-red-500 font-medium">Out of Stock</span>
                    )}
                  </div>
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => removeFromWishlistHandler(data)}
                        color="red"
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => addToWishlistHandler(data)}
                        color="#333"
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <div
                    className={`${styles.button} !h-11 rounded flex items-center`}
                    onClick={toggleOrderForm}
                  >
                    <span className="text-white flex items-center">
                      Place Order <AiOutlineShoppingCart className="ml-1" />
                    </span>
                  </div>
                  <div
                    className={`${styles.button} bg-[#128C7E] !h-11 rounded flex items-center`}
                    onClick={handleMessageSubmit}
                  >
                    <span className="text-[#fff] flex items-center">
                      Send Message <AiOutlineWhatsApp className="ml-1" />
                    </span>
                  </div>
                </div>

                <div className="flex items-center pt-8">
                  <Link to={`/shop/preview/${data?.shop._id}`}>
                    <img
                      src={data?.shop?.avatar?.url ? data.shop.avatar.url : ImgUrl}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2"
                    />
                  </Link>
                  <div className="pr-8">
                    <Link to={`/shop/preview/${data?.shop._id}`}>
                      <h3 className={`${styles.shop_name} pb-1 pt-1`}>
                        {data.shop.name}
                      </h3>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Form Modal */}
          {showOrderForm && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
                <h2 className="text-xl font-bold mb-4">Place Your Order</h2>
                <form onSubmit={handleOrderSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                      type="text"
                      name="customerName"
                      placeholder="Your Name"
                      value={orderData.customerName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                      type="email"
                      name="customerEmail"
                      placeholder="Your Email"
                      value={orderData.customerEmail}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Phone Number</label>
                    <input
                      type="text"
                      name="customerPhoneNumber"
                      placeholder="+923001234567"
                      value={orderData.customerPhoneNumber}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                      pattern="^\+923[0-4][0-9]{8}$"
                      title="Please enter a valid Pakistani phone number (e.g., +923001234567)"
                    />
                    <p className="text-gray-500 text-sm mt-1">
                      Format: +923XXXXXXXXXX (e.g., +923001234567)
                    </p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      placeholder="Quantity"
                      value={orderData.quantity}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      min="1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Location</label>
                    <input
                      type="text"
                      name="location"
                      placeholder="Delivery Location"
                      value={orderData.location}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={toggleOrderForm}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
                    >
                      Submit Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <ProductDetailsInfo
            data={data}
            products={products}
            totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
          />
          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
};

// ProductDetailsInfo component remains unchanged
const ProductDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);

  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(2)}
          >
            Product Reviews
          </h5>
          {active === 2 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(3)}
          >
            Seller Information
          </h5>
          {active === 3 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
      </div>
      {active === 1 ? (
        <>
          <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">
            {data.description}
          </p>
        </>
      ) : null}

      {active === 2 ? (
        <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll">
          {data &&
            data.reviews.map((item, index) => (
              <div className="w-full flex my-2" key={index}>
                <img
                  src={`${item.user.avatar?.url}`}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full"
                />
                <div className="pl-2">
                  <div className="w-full flex items-center">
                    <h1 className="font-[500] mr-3">{item.user.name}</h1>
                    <Ratings rating={item.rating} />
                  </div>
                  <p>{item.comment}</p>
                </div>
              </div>
            ))}

          <div className="w-full flex justify-center">
            {data && data.reviews.length === 0 && (
              <h5>No Reviews yet!</h5>
            )}
          </div>
        </div>
      ) : null}

      {active === 3 && (
        <div className="w-full block 800px:flex p-5">
          <div className="w-full 800px:w-[50%]">
            <Link to={`/shop/preview/${data.shop._id}`}>
              <div className="flex items-center">
                <img
                  src={`${data?.shop?.avatar?.url}`}
                  className="w-[50px] h-[50px] rounded-full"
                  alt=""
                />
                <div className="pl-3">
                  <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                  <h5 className="pb-2 text-[15px]">
                    ({averageRating}/5) Ratings
                  </h5>
                </div>
              </div>
            </Link>
            <p className="pt-2">{data.shop.description}</p>
          </div>
          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600]">
                Joined on:{" "}
                <span className="font-[500]">
                  {data.shop?.createdAt?.slice(0, 10)}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Products:{" "}
                <span className="font-[500]">
                  {products && products.length}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Reviews:{" "}
                <span className="font-[500]">{totalReviewsLength}</span>
              </h5>
              <Link to={`/shop/preview/${data.shop._id}`}>
                <div
                  className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}
                >
                  <h4 className="text-white">Visit Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;