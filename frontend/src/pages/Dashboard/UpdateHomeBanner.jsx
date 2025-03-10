import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";

const UpdateHomeBanner = () => {
  const navigate = useNavigate();

  const [existingBanners, setExistingBanners] = useState(["", "", ""]); // Store existing banners
  const [newBanners, setNewBanners] = useState(["", "", ""]); // Store new banner links

  // Fetch existing banners when component loads
  useEffect(() => {
    fetchExistingBanners();
  }, []);

  const fetchExistingBanners = async () => {
    try {
      const response = await axios.get(`${server}/banner/get-home-banner`);

      if (response.data.success && Array.isArray(response.data.banners)) {
        const fetchedBanners = response.data.banners;
        // Map fetched banners to state, preserving empty or null as ""
        const paddedBanners = [
          fetchedBanners[0] || "",
          fetchedBanners[1] || "",
          fetchedBanners[2] || "",
        ];
        setExistingBanners(paddedBanners);
        setNewBanners(paddedBanners);
      } else {
        console.error("API response does not contain valid banners.");
        toast.error("No banners found.");
        setExistingBanners(["", "", ""]);
        setNewBanners(["", "", ""]);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to fetch banners. Please try again.");
    }
  };

  // Handle input change for new banners
  const handleBannerChange = (index, value) => {
    const updatedBanners = [...newBanners];
    // Store empty string if input is cleared, allowing null/empty to persist
    updatedBanners[index] = value || ""; 
    setNewBanners(updatedBanners);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use newBanners directly, including empty strings
    const bannersToSubmit = newBanners;

    // Check if all banners are empty
    if (bannersToSubmit.every((banner) => banner.trim() === "")) {
      return toast.error("At least one banner URL is required.");
    }

    try {
      console.log("Submitting banners:", bannersToSubmit);
      const response = await axios.post(
        `${server}/banner/update-home-banner`,
        { images: bannersToSubmit }, // Send all values, including empty strings
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      toast.success(response.data.message || "Home banner updated successfully!");
      // navigate("/dashboard");
      window.location.reload();
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error(error.response?.data?.message || "Failed to update the banner. Try again later.");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Dashboard Header */}
      <DashboardHeader />

      {/* Main Content */}
      <div className="flex w-full min-h-screen">
        {/* Sidebar */}
        <div className="w-[80px] 800px:w-[330px] bg-white shadow-md">
          <DashboardSideBar active={12} />
        </div>

        {/* Banner Update Section - Now Occupies Remaining Space */}
        <div className="flex-1 flex justify-center items-start p-5">
          <div className="w-full max-w-[1200px] bg-white shadow h-auto rounded-[4px] p-5">
            <h5 className="text-[30px] font-Poppins text-center">Update Home Banner</h5>

            {/* Existing banners preview */}
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

            {/* Upload new banners */}
            <form onSubmit={handleSubmit} className="mt-6">
              <div>
                <label className="pb-2 text-lg font-medium">Update Banner Links (Max 3)</label>
                {newBanners.map((banner, index) => (
                  <input
                    key={index}
                    type="text"
                    value={banner}
                    onChange={(e) => handleBannerChange(index, e.target.value)}
                    placeholder={`Banner ${index + 1} URL`}
                    className="mt-2 block w-full px-4 h-[40px] border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                ))}
              </div>
              <br />
              <div>
                <input
                  type="submit"
                  value="Update Banner"
                  className="mt-4 cursor-pointer appearance-none text-center block w-full px-4 h-[45px] border border-gray-300 rounded-lg bg-blue-500 text-white text-lg font-semibold shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-300 hover:bg-blue-600"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateHomeBanner;