import React, { useEffect, useState } from "react";
import Login from "../component/authentication/Login";
import SignUp from "../component/authentication/SignUp";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function Home() {
  const [activeTab, setActiveTab] = useState("Login");
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) history.push("/Chat");
  }, [history]);

  return (
    <div className="bg-blue-50 w-full h-screen flex justify-center items-center">
      <div className="w-[40%] h-[80%] flex flex-col items-center bg-gray-400 bg-opacity-10 rounded-lg relative">
        {/* Fixed heading */}
        <h1
          className="
            absolute top-4
            text-center
            font-extrabold
            text-xl
            text-gray-600
          "
        >
          CHAT WITH FRIENDS
        </h1>

        {/* Tabs */}
        <div className="w-64 flex-col justify-center items-center mt-16">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setActiveTab("Login")}
              className={` ${
                activeTab === "Login"
                  ? "border-b-2 border-white text-white bg-blue-500"
                  : "text-black bg-white"
              } hover:bg-blue-400 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 font-bold`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("SignUp")}
              className={`${
                activeTab === "SignUp"
                  ? "border-b-2 border-white bg-blue-500 text-white"
                  : "text-black bg-white"
              } hover:bg-blue-400 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 font-bold`}
            >
              SignUp
            </button>
          </div>
        </div>

        {/* Forms */}
        <div className="flex flex-col w-full items-center">
          {activeTab === "Login" ? <Login /> : <SignUp />}
        </div>
      </div>
    </div>
  );
}

export default Home;
