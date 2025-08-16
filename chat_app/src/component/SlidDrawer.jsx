import {
  Avatar,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import ProfileModel from "./ProfileModel";
import { useHistory } from "react-router-dom";
import ChatLoading from "./ChatLoading";
import axios from "axios";
import UserListItem from "./UserAvatar/UserListItem";
import { getSender } from "../config/ChatLogics";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
const API_URL = import.meta.env.VITE_API_URL;

function SlidDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    setUser,
    notification,
    setNotification,
  } = useContext(UserContext);

  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const logoutHandler = async () => {
    try {
      localStorage.removeItem("userInfo");
      setUser(null);
      setSelectedChat(null);
      setChats([]);
      setSearchResult([]);
      await new Promise((resolve) => setTimeout(resolve, 0));
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/";
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`${API_URL}/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${API_URL}/user?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <div className="w-full h-[60px] flex flex-row justify-between items-center px-2 sm:px-4 bg-blue-300">
      {/* Left: Search Button */}
      <div className="flex-shrink-0">
        <button
          className="flex items-center bg-white px-2 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-slate-200 text-sm sm:text-base"
          onClick={onOpen}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
          <h3 className="mx-1 hidden sm:block">Search User</h3>
        </button>
      </div>

      {/* Center: Title */}
      <div className="flex-1 flex justify-center">
        <h1 className="font-extrabold text-gray-500 text-base sm:text-xl md:text-2xl lg:text-3xl font-sans truncate">
          CHAT WITH FRIENDS
        </h1>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center space-x-1 sm:space-x-4 flex-shrink-0">
        <Menu>
          <MenuButton p={1}>
            <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}
            />
            <BellIcon fontSize="xl" sm="2xl" m={2} />
          </MenuButton>
          <MenuList pl={2}>
            {!notification.length && "no new messages"}
            {notification.map((notif) => (
              <MenuItem
                key={notif._id}
                onClick={() => {
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((n) => n !== notif));
                }}
              >
                {notif.chat.isGroupChat
                  ? `New Message in ${notif.chat.chatName}`
                  : `New Message from ${getSender(user, notif.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
            bg="white"
            as={Button}
            rightIcon={<ChevronDownIcon />}
            className="px-2 sm:px-4"
          >
            <Avatar
              size="sm"
              cursor="pointer"
              name={user.username}
              src={user.image}
            />
          </MenuButton>
          <MenuList>
            <ProfileModel user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModel>
            <MenuDivider />
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>

      {/* Drawer */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Search User</DrawerHeader>
          <DrawerBody>
            <div className="flex flex-col sm:flex-row">
              <input
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full sm:w-auto"
              />
              <button
                onClick={handleSearch}
                className="mt-2 sm:mt-0 sm:ml-2 p-2 bg-blue-500 text-white rounded"
              >
                Go
              </button>
            </div>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );

}

export default SlidDrawer;
