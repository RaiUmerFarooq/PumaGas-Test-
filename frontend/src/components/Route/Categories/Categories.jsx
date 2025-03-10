import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../../static/data";
import styles from "../../../styles/styles";

const Categories = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    setExpandedCategory(expandedCategory === category.id ? null : category.id);
  };

  return (
    <>
      <div className={`${styles.section} hidden sm:block`}>
        <div className="my-12 w-full shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-lg">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white uppercase tracking-wide drop-shadow-lg">
            Categories
          </h2>
          <div className="h-1 w-20 bg-white mx-auto mt-2 rounded-full"></div>
        </div>
      </div>

      <div className={`${styles.section} bg-white p-6 rounded-lg mb-12`} id="categories">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {categoriesData.map((category) => (
            <div key={category.id} className="border rounded-lg shadow-md bg-white">
              {/* Category Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-all"
                onClick={() => handleCategoryClick(category)}
              >
                <h5 className="text-lg font-semibold">{category.title}</h5>
                <img src={category.image_Url} className="w-16 h-16 object-cover rounded-md" alt={category.title} />
              </div>

              {/* Subcategories */}
              <div className={`overflow-hidden transition-all ${expandedCategory === category.id ? "max-h-96" : "max-h-0"}`}>
                <div className="bg-gray-50 p-4 rounded-b-lg border-t">
                  {category.subcategories.map((sub) => (
                    <div
                      key={sub.id}
                      className="py-2 px-3 text-gray-700 font-medium cursor-pointer hover:bg-gray-100 rounded-md transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products?category=${category.title}&subcategory=${sub.title}`);
                      }}
                    >
                      • {sub.title}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Categories;
