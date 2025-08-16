import React, { useState } from "react";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useHistory } from "react-router";
const API_URL = import.meta.env.VITE_API_URL;

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    conPassword: "",
    image: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { username, email, password, conPassword } = formData;

    // Validation
    if (!username || !email || !password || !conPassword) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setIsSubmitting(false);
      return;
    }

    if (password !== conPassword) {
      toast({
        title: "Passwords do not match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${API_URL}/user`,
        {
          username,
          email,
          password,
          image: formData.image,
        },
        config
      );

      // Store user data immediately
      localStorage.setItem("userInfo", JSON.stringify(data));

      // Force reload to ensure all components get the updated user state
      window.location.href = "/Chat";
    } catch (error) {
      toast({
        title: "Error occurred!",
        description: error.response?.data?.message || "Registration failed",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadImg = async (file) => {
    if (!file) {
      toast({
        title: "Please select an image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast({
        title: "Please select a JPEG or PNG image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "chat_app");
      data.append("cloud_name", "dq8iol6rl");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dq8iol6rl/image/upload",
        {
          method: "post",
          body: data,
        }
      );

      const result = await response.json();
      setFormData((prev) => ({ ...prev, image: result.url.toString() }));
    } catch (err) {
      console.error("Upload error:", err);
      toast({
        title: "Image upload failed",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form className="w-64" onSubmit={submitRegister}>
      <h1 className="text-center mb-4 font-extrabold text-xl h-[40px] text-gray-500">
        Sign Up
      </h1>

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="focus:outline-none block w-full my-2 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="focus:outline-none block w-full my-2 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
      />

      <input
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="focus:outline-none block w-full my-2 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
      />

      <input
        type={showPassword ? "text" : "password"}
        name="conPassword"
        placeholder="Confirm password"
        value={formData.conPassword}
        onChange={handleChange}
        className="focus:outline-none block w-full my-2 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
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

      <input
        type="file"
        accept="image/jpeg, image/png"
        onChange={(e) => uploadImg(e.target.files[0])}
        className="focus:outline-none block w-full my-2 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className={`block text-white text-center font-bold w-full p-2 rounded-md 
          ${
            isSubmitting
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-800"
          }`}
      >
        {isSubmitting ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
}

export default SignUp;
