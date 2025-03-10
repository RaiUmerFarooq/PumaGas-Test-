import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import { categoriesData } from "../../static/data";

const UpdateCategoryBanner = () => {
  const navigate = useNavigate();

  // Form states
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [existingBanners, setExistingBanners] = useState(["", "", ""]);
  const [newBanners, setNewBanners] = useState(["", "", ""]);
  const [loading, setLoading] = useState(false);

  // Fetch existing category banners when both category and subcategory are selected
  useEffect(() => {
    if (category && subCategory) {
      fetchExistingBanners(category, subCategory);
    }
  }, [category, subCategory]);

  const fetchExistingBanners = async (selectedCategory, selectedSubCategory) => {
    setLoading(true);
    try {
      const response = await axios.get(`${server}/product-banner/get-product-banners`, {
        params: { category: selectedCategory, subCategory: selectedSubCategory },
      });

      if (response.data.success && response.data.productBanners.length > 0) {
        const fetchedBanners = response.data.productBanners[0].banners || [];
        const paddedBanners = [
          fetchedBanners[0] || "",
          fetchedBanners[1] || "",
          fetchedBanners[2] || "",
        ];
        setExistingBanners(paddedBanners);
        setNewBanners(paddedBanners);
      } else {
        setExistingBanners(["", "", ""]);
        setNewBanners(["", "", ""]);
      }
    } catch (error) {
      console.error("Error fetching category banners:", error);
      toast.error("Failed to fetch category banners. Try again.");
    }
    setLoading(false);
  };

  // Handle category change and load subcategories dynamically
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    const categoryData = categoriesData.find((cat) => cat.title === selectedCategory);
    setSubCategories(categoryData ? categoryData.subcategories : []);
    setSubCategory(""); // Reset subcategory selection
  };

  // Handle subcategory selection & immediately fetch banners
  const handleSubCategoryChange = (e) => {
    const selectedSubCategory = e.target.value;
    setSubCategory(selectedSubCategory);
    if (category && selectedSubCategory) {
      fetchExistingBanners(category, selectedSubCategory);
    }
  };

  // Handle banner URL input change
  const handleBannerChange = (index, value) => {
    const updatedBanners = [...newBanners];
    updatedBanners[index] = value || ""; // Store empty string if input is cleared
    setNewBanners(updatedBanners);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use newBanners directly, including empty strings
    const bannersToSubmit = newBanners;

    if (!category || !subCategory) {
      return toast.error("Please select category and subcategory!");
    }

    // Check if all banners are empty
    if (bannersToSubmit.every((banner) => banner.trim() === "")) {
      return toast.error("At least one banner URL is required.");
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${server}/product-banner/create-product-banner`,
        { category, subCategory, banners: bannersToSubmit },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      toast.success(response.data.message || "Category banner updated successfully!");
      // navigate("/dashboard");
      window.location.reload();
    } catch (error) {
      console.error("Error updating category banner:", error);
      toast.error(error.response?.data?.message || "Failed to update the category banner. Try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Dashboard Header */}
      <DashboardHeader />

      {/* Main Content */}
      <div className="flex w-full min-h-screen">
        {/* Sidebar */}
        <div className="w-[80px] 800px:w-[330px] bg-white shadow-md">
          <DashboardSideBar active={13} />
        </div>

        {/* Category Banner Update Section */}
        <div className="flex-1 flex justify-center items-start p-5">
          <div className="w-full max-w-[1200px] bg-white shadow h-auto rounded-[4px] p-5">
            <h5 className="text-[30px] font-Poppins text-center">Update Category Banner</h5>

            {/* Existing Banners Preview */}
            <div className="mt-4">
              <h6 className="text-[18px] font-semibold">Current Banners:</h6>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {existingBanners.map((banner, index) => (
                  banner ? (
                    <img
                      key={index}
                      src={banner}
                      alt={`Banner ${index + 1}`}
                      className="h-[150px] w-full object-cover rounded-md shadow-md"
                    />
                  ) : (
                    <div
                      key={index}
                      className="h-[150px] w-full bg-gray-200 rounded-md flex items-center justify-center text-gray-500"
                    >
                      No Banner
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Upload New Banner URLs */}
            <form onSubmit={handleSubmit} className="mt-6">
              {/* Category Dropdown */}
              <div>
                <label className="pb-2 text-lg font-medium">Category</label>
                <select
                  className="mt-2 block w-full px-4 h-[40px] border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={category}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select Category</option>
                  {categoriesData.map((cat) => (
                    <option key={cat.title} value={cat.title}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Dropdown */}
              {subCategories.length > 0 && (
                <div className="mt-4">
                  <label className="pb-2 text-lg font-medium">Subcategory</label>
                  <select
                    className="mt-2 block w-full px-4 h-[40px] border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={subCategory}
                    onChange={handleSubCategoryChange}
                  >
                    <option value="">Select Subcategory</option>
                    {subCategories.map((sub) => (
                      <option key={sub.id} value={sub.title}>
                        {sub.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Banner URL Inputs */}
              <div className="mt-4">
                <label className="pb-2 text-lg font-medium">Enter Banner URLs (Max 3)</label>
                {newBanners.map((banner, index) => (
                  <input
                    key={index}
                    type="text"
                    value={banner}
                    onChange={(e) => handleBannerChange(index, e.target.value)}
                    placeholder={`Banner ${index + 1} URL`}
                    className="mt-2 block w-full px-4 h-[40px] border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                ))}
              </div>

              <br />
              <button
                type="submit"
                disabled={loading}
                className={`bg-blue-500 text-white text-lg font-semibold rounded-lg px-4 h-[45px] w-full ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"} transition duration-300`}
              >
                {loading ? "Updating..." : "Update Category Banner"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategoryBanner;