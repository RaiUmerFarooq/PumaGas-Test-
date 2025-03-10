import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import { categoriesData } from "../../static/data";
import { AiOutlineHeart, AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import Wishlist from "../Wishlist/Wishlist";
import { RxCross1 } from "react-icons/rx";
import { ImgUrl } from "../../static/data";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { allProducts } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedDesktopCategory, setExpandedDesktopCategory] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    console.log("categoriesData:", categoriesData);
    if (!Array.isArray(categoriesData)) {
      console.error("categoriesData is not an array:", categoriesData);
    }
    return () => {
      setIsMounted(false);
      setDropDown(false);
    };
  }, []);

  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      const context = this;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const handleSearchChange = useCallback(
    debounce((term) => {
      if (!allProducts) return;

      const recommendedProducts = allProducts.filter((product) => product.recommended);
      const filteredProducts = term
        ? allProducts.filter((product) =>
            product.name.toLowerCase().includes(term.toLowerCase())
          )
        : [];

      setSearchData({
        filtered: filteredProducts,
        recommended: recommendedProducts,
      });
    }, 300),
    [allProducts]
  );

  const onSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    handleSearchChange(term);
  };

  const onSearchFocus = () => {
    // Always show recommended products on focus
    handleSearchChange(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchData(null);
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });

  const toggleCategory = (categoryId, isDesktop = false) => {
    console.log(`Toggling ${isDesktop ? "desktop" : "mobile"} category:`, categoryId);
    if (isDesktop) {
      setExpandedDesktopCategory(expandedDesktopCategory === categoryId ? null : categoryId);
    } else {
      setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    }
  };

  const renderSearchItem = (item, index) => (
    <Link
      key={index}
      to={`/product/${item._id}`}
      onClick={() => console.log("Navigating to:", `/product/${item._id}`)}
      className="block"
    >
      <div className="w-full flex items-center py-2 border-b hover:bg-gray-100 transition cursor-pointer">
        <img
          src={`${item.images && item.images[0]?.url ? item.images[0].url : "default-image.jpg"}`}
          alt={item.name}
          className="w-[40px] h-[40px] mr-[10px] object-cover rounded"
        />
        <div className="flex items-center w-full">
          <h1 className="text-sm">{item.name}</h1>
          {item.recommended }
        </div>
      </div>
    </Link>
  );

  return (
    <>
      {/* Desktop Header */}
      <div className={`${styles.section}`}>
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
          <div>
            <Link to="/">
              <img
                src={ImgUrl}
                alt="Logo"
                className="w-[60px] h-[60px] object-contain rounded-full"
              />
            </Link>
          </div>
          <div className="w-[50%] relative mx-auto" ref={searchRef}>
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={onSearchChange}
              onFocus={onSearchFocus}
              className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
            />
            <AiOutlineSearch
              size={30}
              className="absolute right-2 top-1.5 cursor-pointer"
            />
            {searchData && (
              <div className="absolute min-h-[30vh] max-h-[50vh] overflow-y-auto bg-white shadow-lg z-[10] p-4 w-full mt-1 rounded-md border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">Search Result</span>
                  <AiOutlineClose
                    size={20}
                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={clearSearch}
                  />
                </div>

                {/* Search Results Section */}
                {searchTerm && searchData.filtered.length > 0 && (
                  <div className="mb-4">
                    {/* <h3 className="text-sm font-semibold text-gray-700 mb-2">Search Results</h3> */}
                    {searchData.filtered.map((item, index) => renderSearchItem(item, index))}
                  </div>
                )}

                {/* Recommended Products Section */}
                {searchData.recommended.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Top Search</h3>
                    {searchData.recommended.map((item, index) => renderSearchItem(item, index))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`${
          active ? "shadow-sm fixed top-0 left-0 z-10" : null
        } transition hidden 800px:flex items-center justify-between w-full bg-[rgb(53,50,117)] h-[70px]`}
      >
        <div className={`${styles.section} relative ${styles.noramlFlex} justify-between`}>
          {/* Desktop Categories Dropdown */}
          <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
            <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
            <button
              className="h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md"
              onClick={() => setDropDown(!dropDown)}
            >
              All Categories
              <IoIosArrowDown size={20} className="mr-2" />
            </button>
            {isMounted && dropDown && (
              <div className="absolute mt-1 w-full bg-white shadow-lg rounded-md z-10 max-h-[50vh] overflow-y-auto">
                {Array.isArray(categoriesData) ? (
                  categoriesData.map((category) => (
                    <div key={category.id} className="border-b border-gray-200">
                      <button
                        className="w-full flex items-center justify-between py-2 px-4 text-[16px] text-[#000000b7] hover:bg-gray-100"
                        onClick={() => toggleCategory(category.id, true)}
                      >
                        <div className="flex items-center">
                          <img
                            src={category.image_Url || "https://via.placeholder.com/24"}
                            alt={category.title}
                            className="w-6 h-6 mr-2 object-cover rounded"
                          />
                          {category.title || "Unnamed Category"}
                        </div>
                        <IoIosArrowForward
                          size={16}
                          className={`transition-transform ${
                            expandedDesktopCategory === category.id ? "rotate-90" : ""
                          }`}
                        />
                      </button>
                      {expandedDesktopCategory === category.id && Array.isArray(category.subcategories) && (
                        <div className="pl-6 bg-gray-50">
                          {category.subcategories.length > 0 ? (
                            category.subcategories.map((sub, index) => (
                              <Link
                                key={index}
                                to={`/products?category=${category.title}&subcategory=${sub.title}`}
                                className="block py-1.5 px-4 text-[14px] text-[#00000091] hover:bg-gray-200"
                              >
                                {sub.title}
                              </Link>
                            ))
                          ) : (
                            <p className="py-1.5 px-4 text-[14px] text-[#00000091]">
                              No subcategories available
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="py-2 px-4 text-[16px] text-[#000000b7]">
                    Invalid categories data: {JSON.stringify(categoriesData)}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Navbar Items */}
          <div className={`${styles.noramlFlex}`}>
            <Navbar active={activeHeading} />
          </div>

          <div className="flex">
            {/* Wishlist */}
            <div className={`${styles.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px] p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-full transition-colors duration-200"
                onClick={() => setOpenWishlist(true)}
              >
                <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 flex items-center justify-center text-white font-mono text-[12px]">
                  {wishlist && wishlist.length}
                </span>
              </div>
            </div>

            {/* Admin Link */}
            <div className={`${styles.noramlFlex}`}>
              <Link to="/shop-login" className="text-[18px] text-[#fff] hover:text-gray-300 transition-colors duration-200">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div
        className={`${active ? "shadow-sm fixed top-0 left-0 z-10" : null} w-full h-[70px] bg-[#fff] z-50 top-0 left-0 shadow-sm 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between px-4 py-2">
          <div>
            <BiMenuAltLeft
              size={40}
              className="text-gray-700 hover:text-blue-500 transition-colors duration-200"
              onClick={() => setOpen(true)}
            />
          </div>
          <div className="relative w-[50%] flex items-center">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={onSearchChange}
              onFocus={onSearchFocus}
              className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md text-sm focus:ring-2 focus:ring-blue-300"
            />
            <AiOutlineSearch
              size={24}
              className="absolute right-2 top-2.5 cursor-pointer text-gray-600 hover:text-blue-500 transition-colors duration-200"
            />
            {searchData && (
              <div className="absolute top-[45px] left-0 min-h-[20vh] max-h-[40vh] overflow-y-auto bg-white shadow-xl z-[10] p-4 w-full rounded-md border border-gray-200 transition-all duration-300 ease-in-out">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-800">Search</span>
                  <AiOutlineClose
                    size={18}
                    className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    onClick={clearSearch}
                  />
                </div>

                {/* Search Results Section */}
                {searchTerm && searchData.filtered.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Search Results</h3>
                    {searchData.filtered.map((item, index) => renderSearchItem(item, index))}
                  </div>
                )}

                {/* Recommended Products Section */}
                {searchData.recommended.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Recommended Products</h3>
                    {searchData.recommended.map((item, index) => renderSearchItem(item, index))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div>
            <Link to="/">
              <img
                src={ImgUrl}
                alt="Logo"
                className="max-w-[40px] max-h-[40px] object-contain cursor-pointer rounded-full hover:opacity-80 transition-opacity duration-200"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {open && (
        <div className="fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0 transition-opacity duration-300">
          <div className="fixed w-[75%] bg-white h-screen top-0 left-0 z-30 overflow-y-auto shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="w-full flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
              <div
                className="relative cursor-pointer hover:bg-gray-200 p-2 rounded-full transition-colors duration-200"
                onClick={() => {
                  setOpenWishlist(true);
                  setOpen(false);
                }}
              >
                <AiOutlineHeart size={36} className="text-red-500" />
                <span className="absolute -right-1 -top-1 rounded-full bg-[#3bc177] w-5 h-5 flex items-center justify-center text-white font-mono text-[12px]">
                  {wishlist && wishlist.length}
                </span>
              </div>
              <RxCross1
                size={30}
                className="text-gray-700 hover:text-red-500 cursor-pointer transition-colors duration-200"
                onClick={() => setOpen(false)}
              />
            </div>

            {/* Categories in Sidebar */}
            <div className="w-[90%] mx-auto mt-4">
              <button
                className="h-[45px] w-full flex justify-between items-center pl-4 bg-white font-sans text-lg font-[500] border-[#3957db] border-[2px] rounded-md hover:bg-blue-50 transition-colors duration-200"
                onClick={() => setDropDown(!dropDown)}
              >
                All Categories
                <IoIosArrowDown size={22} className="mr-2 text-gray-600" />
              </button>
              {isMounted && dropDown && (
                <div className="mt-2 max-h-[40vh] overflow-y-auto bg-white shadow-lg rounded-md border border-gray-100">
                  {Array.isArray(categoriesData) ? (
                    categoriesData.map((category) => (
                      <div key={category.id} className="border-b border-gray-200">
                        <button
                          className="w-full flex items-center justify-between py-3 px-4 text-[16px] text-[#000000b7] hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => toggleCategory(category.id)}
                        >
                          <div className="flex items-center">
                            <img
                              src={category.image_Url || "https://via.placeholder.com/24"}
                              alt={category.title}
                              className="w-6 h-6 mr-2 object-cover rounded"
                            />
                            <span className="text-gray-800">{category.title || "Unnamed Category"}</span>
                          </div>
                          <IoIosArrowForward
                            size={16}
                            className={`text-gray-600 transition-transform duration-200 ${
                              expandedCategory === category.id ? "rotate-90" : ""
                            }`}
                          />
                        </button>
                        {expandedCategory === category.id && Array.isArray(category.subcategories) && (
                          <div className="pl-6 bg-gray-50">
                            {category.subcategories.length > 0 ? (
                              category.subcategories.map((sub, index) => (
                                <Link
                                  key={index}
                                  to={`/products?category=${category.title}&subcategory=${sub.title}`}
                                  onClick={() => setOpen(false)}
                                  className="block py-2 px-4 text-[14px] text-[#00000091] hover:bg-gray-200 transition-colors duration-200"
                                >
                                  {sub.title}
                                </Link>
                              ))
                            ) : (
                              <p className="py-2 px-4 text-[14px] text-[#00000091]">
                                No subcategories available
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="py-2 px-4 text-[16px] text-[#000000b7]">
                      Invalid categories data: {JSON.stringify(categoriesData)}
                    </p>
                  )}
                </div>
              )}
            </div>

            <Navbar active={activeHeading} />
            <div className="flex w-full justify-center py-6">
              {isAuthenticated ? (
                <div>
                  <Link to="/profile" onClick={() => setOpen(false)}>
                    <img
                      src={`${user.avatar?.url}`}
                      alt=""
                      className="w-[60px] h-[60px] rounded-full border-[3px] border-[#0eae88] hover:opacity-80 transition-opacity duration-200"
                    />
                  </Link>
                </div>
              ) : (
                <Link
                  to="/shop-login"
                  className="text-[18px] text-[#000000b7] font-semibold hover:text-blue-500 transition-colors duration-200"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Popup */}
      {openWishlist && (
        <div className="fixed inset-0 bg-[#00000080] z-50 flex items-center justify-center transition-opacity duration-300">
          <Wishlist setOpenWishlist={setOpenWishlist} />
        </div>
      )}
    </>
  );
};

export default Header;