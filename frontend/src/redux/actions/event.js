import axios from "axios";
import { server } from "../../server";

// create event
export const createevent = (data) => async (dispatch) => {
  try {
    dispatch({
      type: "eventCreateRequest",
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // If authentication is required
    };

    const { data: responseData } = await axios.post(
      `${server}/event/create-event`,
      data,
      config
    );
    dispatch({
      type: "eventCreateSuccess",
      payload: responseData.event, // Adjusted to match response structure
    });
  } catch (error) {
    dispatch({
      type: "eventCreateFail",
      payload: error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message, // Fallback to error.message if response is undefined
    });
  }
};

// get all events of a shop
export const getAllEventsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAlleventsShopRequest",
    });

    const { data } = await axios.get(`${server}/event/get-all-events/${id}`);
    dispatch({
      type: "getAlleventsShopSuccess",
      payload: data.events,
    });
  } catch (error) {
    dispatch({
      type: "getAlleventsShopFailed",
      payload: error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

// delete event of a shop
export const deleteEvent = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteeventRequest" });

    const { data } = await axios.delete(`${server}/event/delete-shop-event/${id}`, {
      withCredentials: true, // If authentication is required
    });

    dispatch({ type: "deleteeventSuccess", payload: id });

    return { success: true, message: data.message }; // ✅ Return response for UI handling
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    
    dispatch({ type: "deleteeventFailed", payload: errorMessage });

    return { success: false, message: errorMessage }; // ✅ Return error response for UI handling
  }
};


// get all events
export const getAllEvents = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAlleventsRequest",
    });

    const { data } = await axios.get(`${server}/event/get-all-events`);
    dispatch({
      type: "getAlleventsSuccess",
      payload: data.events,
    });
  } catch (error) {
    dispatch({
      type: "getAlleventsFailed",
      payload: error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};