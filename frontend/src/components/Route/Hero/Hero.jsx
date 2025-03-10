import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import styles from "../../../styles/styles";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { server } from "../../../server";

const Hero = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Function to fetch banners
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${server}/banner/get-home-banner`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Sends cookies/auth tokens
        });

        if (response.data.success) {
          setImages(response.data.banners || []);
          console.log("Banners:", response.data.banners);
        } else {
          console.warn("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error(
          "Error fetching banners:",
          error.response ? error.response.data : error.message
        );
      }
    };

    // Function to test API health
    const checkApiHealth = async () => {
      try {
        const response = await axios.get(`${server}/health`);
        console.log("✅ API Health Check:", response.data);
      } catch (error) {
        console.error(
          "❌ API Health Check Failed:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchBanners();
    checkApiHealth();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  // Filter out null or empty banners
  const validImages = images.filter((image) => image !== null && image !== "");

  // If no valid banners, return null to remove the section
  if (validImages.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full min-h-[70vh] 800px:min-h-[80vh]">
      {validImages.length === 1 ? (
        <div className="relative w-full h-[70vh] 800px:h-[80vh] overflow-hidden">
          <img
            src={validImages[0]}
            alt="Banner"
            className="w-full h-full object-cover object-center"
          />
        </div>
      ) : (
        <Slider {...settings} className="w-full h-[70vh] 800px:h-[80vh]">
          {validImages.map((image, index) => (
            <div
              key={index}
              className="relative w-full h-[70vh] 800px:h-[80vh] overflow-hidden"
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

// Separated Hero Content
const HeroContent = () => {
  return (
    <div className={`${styles.section} w-[90%] 800px:w-[60%] text-center`}>
      <h1 className="text-[35px] leading-[1.2] 800px:text-[60px] text-white font-[600] capitalize">
        Best Collection for <br /> Home Decoration
      </h1>
      <p className="pt-5 text-[16px] font-[Poppins] font-[400] text-white">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae,
        assumenda? Quisquam itaque <br /> exercitationem labore vel, dolore
        quidem asperiores, laudantium temporibus soluta optio consequatur{" "}
        <br /> aliquam deserunt officia. Dolorum saepe nulla provident.
      </p>
      <Link to="/products" className="inline-block">
        <div className="mt-5 px-6 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg">
          Shop Now
        </div>
      </Link>
    </div>
  );
};

export default Hero;
