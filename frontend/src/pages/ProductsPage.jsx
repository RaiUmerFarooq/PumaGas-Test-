import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { server } from "../server";

// New CategoryBannerContent component for the overlay
const CategoryBannerContent = ({ category, subCategory }) => {
  const categoryName = category ? category : "Products";
  const subCategoryName = subCategory ? subCategory : "";

  return (
    <div className={`${styles.section} w-[90%] 800px:w-[60%] text-center`}>
      <h1 className="text-[35px] leading-[1.2] 800px:text-[60px] text-white font-[600] capitalize">
        Explore {categoryName} {subCategoryName ? `- ${subCategoryName}` : ""}
      </h1>
      <p className="pt-5 text-[16px] font-[Poppins] font-[400] text-white">
        Discover our curated selection of {categoryName}{" "}
        {subCategoryName ? subCategoryName : ""} products.
      </p>
      <a href="#products-grid" className="inline-block">
        <div className="mt-5 px-6 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg">
          View Products
        </div>
      </a>
    </div>
  );
};

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const subCategoryData = searchParams.get("subcategory");
  const categoryData = searchParams.get("category");
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [data, setData] = useState([]);
  const [banners, setBanners] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // Fetch category banners from API
  useEffect(() => {
    if (categoryData && subCategoryData) {
      fetchCategoryBanners(categoryData, subCategoryData);
    }
  }, [categoryData, subCategoryData]);

  const fetchCategoryBanners = async (category, subCategory) => {
    try {
      const response = await axios.get(
        `${server}/product-banner/get-product-banners?category=${category}&subCategory=${subCategory}`
      );

      if (response.data.success && response.data.productBanners.length > 0) {
        setBanners(response.data.productBanners[0].banners || []);
      } else {
        setBanners([]);
      }
    } catch (error) {
      console.error("Failed to fetch category banners:", error);
      setBanners([]);
    }
  };

  // Filter and sort products
  useEffect(() => {
    let filteredProducts = [...allProducts];

    if (subCategoryData) {
      filteredProducts = filteredProducts.filter(
        (i) => i.subCategory === subCategoryData
      );
    }
    if (minPrice !== "") {
      filteredProducts = filteredProducts.filter(
        (i) => Number(i.originalPrice) >= Number(minPrice)
      );
    }
    if (maxPrice !== "") {
      filteredProducts = filteredProducts.filter(
        (i) => Number(i.originalPrice) <= Number(maxPrice)
      );
    }
    if (sortOrder === "lowToHigh") {
      filteredProducts.sort(
        (a, b) => Number(a.originalPrice) - Number(b.originalPrice)
      );
    } else if (sortOrder === "highToLow") {
      filteredProducts.sort(
        (a, b) => Number(b.originalPrice) - Number(a.originalPrice)
      );
    }

    setData(filteredProducts);
  }, [allProducts, subCategoryData, minPrice, maxPrice, sortOrder]);

  // Slider settings (used for category banners)
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    arrows: false,
  };

  // Filter out null or empty banners
  const validBanners = banners.filter((banner) => banner !== null && banner !== "");

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />

          {/* Banner Section - Only render if valid banners exist */}
          {validBanners.length > 0 && (
            <div className="relative w-full min-h-[70vh] 800px:min-h-[80vh] mt-4">
              {validBanners.length === 1 ? (
                <div className="relative w-full h-[70vh] 800px:h-[80vh]">
                  <img
                    src={validBanners[0]}
                    alt="Banner"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                  {/* <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40">
                    <CategoryBannerContent
                      category={categoryData}
                      subCategory={subCategoryData}
                    />
                  </div> */}
                </div>
              ) : validBanners.length >= 2 ? (
                <Slider {...sliderSettings} className="w-full h-full">
                  {validBanners.map((banner, index) => (
                    <div
                      key={index}
                      className="relative w-full h-[70vh] 800px:h-[80vh]"
                    >
                      <img
                        src={banner}
                        alt={`Banner ${index + 1}`}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                      />
                      {/* <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40">
                        <CategoryBannerContent
                          category={categoryData}
                          subCategory={subCategoryData}
                        />
                      </div> */}
                    </div>
                  ))}
                </Slider>
              ) : null}
            </div>
          )}

          {/* Product Section with ID for anchor link */}
          <div className={`${styles.section} mt-5`} id="products-grid">
            {/* Sorting and Filters */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="border border-gray-300 rounded-md p-2"
                >
                  <option value="">Sort By</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-12">
              {data.length > 0 ? (
                data.map((i, index) => <ProductCard data={i} key={index} />)
              ) : (
                <div className="w-full flex justify-center items-center mt-10">
                  <h1 className="text-center text-[20px] font-semibold text-gray-600">
                    Coming Soon...
                  </h1>
                </div>
              )}
            </div>
          </div>

          <Footer />
        </div>
      )}
    </>
  );
};

export default ProductsPage;