import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Layout/Header";
import { categoriesData, ImgUrl } from "../../static/data";
import { IoIosArrowForward } from "react-icons/io";
import Footer from "../../components/Layout/Footer";
import styles from "../../styles/styles";

const ShopCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header activeHeading={2} />
      <div className={`${styles.section} py-8 flex-grow`}>
        <h1 className="text-3xl font-bold text-center mb-8 text-[#000000b7]">
          Top Category
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.isArray(categoriesData) ? (
            categoriesData.map((category) => (
              <div
                key={category.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={category.image_Url || ImgUrl} // Fixed fallback syntax
                    alt={category.title}
                    className="w-full h-48 object-contain" // Changed to object-contain
                  />
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className="w-full flex justify-between items-center py-3 px-4 bg-white text-[16px] text-[#000000b7] font-semibold hover:bg-gray-100 border-t border-gray-200"
                  >
                    {category.title || "Unnamed Category"}
                    <IoIosArrowForward size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-[16px] text-[#000000b7]">
              No categories available
            </p>
          )}
        </div>
      </div>

      {/* Modal for Subcategories */}
      {selectedCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-[#000000b7] mb-4">
              {selectedCategory.title}
            </h2>
            <div>
              {Array.isArray(selectedCategory.subcategories) &&
              selectedCategory.subcategories.length > 0 ? (
                selectedCategory.subcategories.map((sub, index) => (
                  <Link
                    key={index}
                    to={`/products?category=${selectedCategory.title}&subcategory=${sub.title}`}
                    className="block py-2 px-3 text-[14px] text-[#00000091] hover:bg-gray-200 rounded-md transition"
                  >
                    {sub.title}
                  </Link>
                ))
              ) : (
                <p className="py-2 px-3 text-[14px] text-[#00000091]">
                  No subcategories available
                </p>
              )}
            </div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ShopCategories;