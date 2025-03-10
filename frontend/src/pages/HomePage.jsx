import React, { useState, useEffect } from 'react';
import Header from "../components/Layout/Header";
import Hero from "../components/Route/Hero/Hero";
import BestDeals from "../components/Route/BestDeals/BestDeals";
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct";
import Events from "../components/Events/Events";
import Footer from "../components/Layout/Footer"; // Replace with your actual image path
import { ImgUrl } from '../static/data';

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-screen bg-white">
          <img
            src={ImgUrl}
            alt="Loading..."
            className="animate-zoom"
          />
        </div>
      ) : (
        <>
          <Header activeHeading={1} />
          <Hero />
          <BestDeals />
          <Events />
          <FeaturedProduct />
          <Footer />
        </>
      )}
    </div>
  );
};

export default HomePage;
