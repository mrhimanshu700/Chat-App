import React, { useState, useEffect } from "react";
import UserContext from "./UserContext";
import { useHistory } from "react-router-dom";

function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
   const [notification, setNotification] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    // Only redirect if no user AND not already on login page
    if (!userInfo && history.location.pathname !== "/") {
      history.push("/");
    }
  }, [history]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
