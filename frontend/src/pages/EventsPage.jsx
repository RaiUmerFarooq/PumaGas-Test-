import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import { getAllEvents } from "../redux/actions/event"; // Adjust path
import Footer from "../components/Layout/Footer";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllEvents()); // Fetch events on mount
  }, [dispatch]);

  console.log("isLoading:", isLoading, "allEvents:", allEvents);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={5} />
          {allEvents && allEvents.length > 0 ? (
            allEvents.map((event, index) => (
              <EventCard key={index} active={true} data={event} />
            ))
          ) : (
            <p className="text-center py-10">No events available</p>
          )}
          <Footer></Footer>
        </div>
      )}
    </>
  );
};

export default EventsPage;