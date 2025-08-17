import React, { useContext, useEffect, useState, useRef } from "react";
import UserContext from "../../context/UserContext";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import ProfileModel from "../ProfileModel";
import io from "socket.io-client";
import UpdateGroupChatModel from "./UpdateGroupChatModel";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
const ENDPOINT = "https://chat-app-akyx.onrender.com";
const API_URL = import.meta.env.VITE_API_URL;
var socket, selectedChatCompare;
function SingleChat({ fetchAgain, setFetchAgain }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    useContext(UserContext);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      const { data } = await axios.get(
        `${API_URL}/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
   console.log(notification,"----------");
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

   useEffect(() => {
     socket.on("message recieved", (newMessageRecieved) => {
       if (
         !selectedChatCompare || // if chat is not selected or doesn't match current chat
         selectedChatCompare._id !== newMessageRecieved.chat._id
       ) {
         if (!notification.includes(newMessageRecieved)) {
           setNotification([newMessageRecieved, ...notification]);
           setFetchAgain(!fetchAgain);
         }
       } else {
         setMessages([...messages, newMessageRecieved]);
       }
     });
   });

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `${API_URL}/message`,
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        setMessages([...messages, data]);
        socket.emit("new message", data);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
     if (!socketConnected) return;

     if (!typing) {
       setTyping(true);
       socket.emit("typing", selectedChat._id);
     }
     let lastTypingTime = new Date().getTime();
     var timerLength = 3000;
     setTimeout(() => {
       var timeNow = new Date().getTime();
       var timeDiff = timeNow - lastTypingTime;
       if (timeDiff >= timerLength && typing) {
         socket.emit("stop typing", selectedChat._id);
         setTyping(false);
       }
     }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col w-full h-[calc(100vh-60px)]">
          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b">
            <div className="flex items-center">
              <IconButton
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
                variant="ghost"
                mr={2}
              />
              <Text fontSize="lg" fontWeight="semibold">
                {!selectedChat.isGroupChat
                  ? getSender(user, selectedChat.users)
                  : selectedChat.chatName}
              </Text>
            </div>
            {!selectedChat.isGroupChat ? (
              <ProfileModel user={getSenderFull(user, selectedChat.users)} />
            ) : (
              <UpdateGroupChatModel
                fetchMessages={fetchMessages}
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
              />
            )}
          </div>

          {/* Messages Area - Scrollable but without visible scrollbar */}
          <div
            className="flex-1 p-3 overflow-y-auto"
            style={{
              scrollbarWidth: "none" /* Firefox */,
              msOverflowStyle: "none" /* IE/Edge */,
            }}
          >
            <style>{`
              .overflow-y-auto::-webkit-scrollbar {
                display: none; /* Chrome/Safari/Webkit */
              }
            `}</style>
            {loading ? (
              <Spinner size="xl" w={20} h={20} className="mx-auto my-auto" />
            ) : (
              <>
                <ScrollableChat messages={messages} />
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Elevated Message Input */}
          <div className="p-3 border-t bg-white shadow-up">
            <FormControl onKeyDown={sendMessage}>
              {istyping ? (
                <div>
                  {" "}
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{
                      marginBottom: 15,
                      marginLeft: 0,
                      backgroundColor: "#90EE90",
                    }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="outline"
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typingHandler}
                className="bg-gray-50 focus:bg-white"
                size="lg"
              />
            </FormControl>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <Text fontSize="lg" fontWeight="semibold" color="gray.500">
            Click a user to start chatting
          </Text>
        </div>
      )}
    </>
  );
}

export default SingleChat;
