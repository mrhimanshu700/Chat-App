import React, { useState } from "react";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useHistory } from "react-router";
const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    if (!email || !Password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${API_URL}/user/login`,
        {
          email,
          password: Password,
        },
        config
      );
      console.log(data);
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      history.push("/Chat");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <form className="w-64 ">
      <h1 className="text-center mb-4 font-extrabold text-xl h-[40px] text-gray-500">
        Login User
      </h1>

      <input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="  focus:outline-none block w-full my-2 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
      />
      <input
        type={showPassword ? "text" : "password"}
        placeholder=" password"
        value={Password}
        onChange={(e) => setPassword(e.target.value)}
        className=" focus:outline-none block w-full my-2 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex items-center my-2">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={toggleShowPassword}
          className="mr-2"
        />
        <label className="text-gray-500">Show Password</label>
      </div>
      <button
        onClick={submitLogin}
        className="block text-white text-center font-bold bg-blue-500 hover:bg-blue-800 w-full p-2 rounded-md "
      >
        Login
      </button>
    </form>
  );
}

export default Login;
