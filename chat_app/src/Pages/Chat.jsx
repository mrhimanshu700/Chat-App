import React, { useContext, useState, useEffect } from "react";
import UserContext from "../context/UserContext";
import SlidDrawer from "../component/SlidDrawer";
import MyChats from "../component/MyChats";
import ChatBox from "../component/ChatBox/ChatBox";
import { useHistory } from "react-router-dom";

function Chat() {
  const { user, setUser } = useContext(UserContext);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    // Check for user in context first
    if (user) {
      setIsLoading(false);
      return;
    }

    // If no user in context, check localStorage
    const userData = localStorage.getItem("userInfo");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser); // Update context if user exists in localStorage
        setIsLoading(false);
      } catch (error) {
        console.error("Error parsing user data:", error);
        history.push("/"); // Redirect to login if data is corrupted
      }
    } else {
      // If no user data at all, redirect to login
      history.push("/");
    }
  }, [user, setUser, history]);

  if (isLoading) {
    return (
      <div className="bg-blue-50 w-full h-screen flex justify-center items-center">
        <div className="text-xl font-semibold text-gray-600">
          Loading chats...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 w-full h-screen">
      <SlidDrawer />
      <div className="flex justify-between">
        <MyChats fetchAgain={fetchAgain} />
        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </div>
    </div>
  );
}

export default Chat;
