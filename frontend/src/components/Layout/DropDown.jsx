import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();
  const [openCategoryId, setOpenCategoryId] = useState(null);

  const submitHandle = (category, subcategory = null) => {
    const queryParams = new URLSearchParams();
    queryParams.append("category", category.title);
    if (subcategory) {
      queryParams.append("subcategory", subcategory);
    }
    navigate(`/products?${queryParams.toString()}`);
    console.log(queryParams.toString());
    setDropDown(false);
  };

  return (
    <div className="pb-4 w-[270px] bg-white absolute z-30 rounded-b-md shadow-sm">
      {categoriesData &&
        categoriesData.map((category) => (
          <div key={category.id} className="relative group">
            {/* Main Category */}
            <div
              className={`${styles.noramlFlex} px-4 py-2 hover:bg-gray-100 cursor-pointer`}
              onClick={() => {
                if (openCategoryId === category.id) {
                  setOpenCategoryId(null);
                } else {
                  setOpenCategoryId(category.id);
                }
              }}
            >
              {category.image_Url && (
                <img
                  src={category.image_Url}
                  alt=""
                  className="w-[25px] h-[25px] object-contain mr-3"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <h3 className="select-none">{category.title}</h3>
            </div>

            {/* Subcategories (if any) */}
            {category.subcategories?.length > 0 && openCategoryId === category.id && (
              <div className="absolute left-[100%] top-0 bg-white shadow-md w-[200px] rounded-md border">
                {category.subcategories.map((subcategory, subIndex) => (
                  <div
                    key={subIndex}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => submitHandle(category, subcategory.title)}
                  >
                    {subcategory.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default DropDown;