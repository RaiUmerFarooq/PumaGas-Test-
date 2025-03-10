import React from "react";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineEye, AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  };

  const addToCartHandler = (data) => {
    const newData = { ...data, qty: 1 };
    dispatch(addTocart(newData));
    setOpenWishlist(false);
  };

  return (
    <div className="relative w-full bg-white rounded-xl p-6 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <AiOutlineHeart size={24} className="text-red-500 mr-2" />
          Your Wishlist ({wishlist.length})
        </h2>
        <button
          className="text-gray-600 hover:text-red-500 transition-colors duration-200"
          onClick={() => setOpenWishlist(false)}
        >
          <RxCross1 size={24} />
        </button>
      </div>

      {/* Wishlist Content */}
      {wishlist && wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full py-10">
          <AiOutlineHeart size={40} className="text-gray-400 mb-4" />
          <h5 className="text-lg text-gray-600">Your wishlist is empty!</h5>
        </div>
      ) : (
        <div className="space-y-4">
          {wishlist.map((item, index) => (
            <CartSingle
              key={index}
              data={item}
              removeFromWishlistHandler={removeFromWishlistHandler}
              addToCartHandler={addToCartHandler}
              navigate={navigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CartSingle = ({ data, removeFromWishlistHandler, addToCartHandler, navigate }) => {
  return (
    <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <img
        src={`${data?.images[0]?.url}`}
        alt={data.name}
        className="w-[80px] h-[80px] object-cover rounded-md mr-4"
      />
      <div className="flex-1">
        <h1 className="text-base font-medium text-gray-800 truncate">{data.name}</h1>
        <h4 className="text-sm font-semibold text-[#d02222] mt-1">Rs {data.discountPrice}</h4>
      </div>
      <div className="flex items-center space-x-3">
        <AiOutlineEye
          size={22}
          className="cursor-pointer text-gray-600 hover:text-blue-500 transition-colors duration-200"
          title="View Details"
          onClick={() => {
            navigate(`/product/${data._id}`);
            console.log(data);
          }}
        />
        {/* <AiOutlineShoppingCart
          size={22}
          className="cursor-pointer text-gray-600 hover:text-green-500 transition-colors duration-200"
          title="Add to Cart"
          onClick={() => addToCartHandler(data)}
        /> */}
        <RxCross1
          size={22}
          className="cursor-pointer text-gray-600 hover:text-red-500 transition-colors duration-200"
          title="Remove from Wishlist"
          onClick={() => removeFromWishlistHandler(data)}
        />
      </div>
    </div>
  );
};

export default Wishlist;