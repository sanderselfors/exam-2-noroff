import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    venueManager: false, 
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleVenueManager = () => {
    setFormData((prevData) => ({
      ...prevData,
      venueManager: !prevData.venueManager,
    }));
  };

  const navigateToHome = () => {
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  const handleRegistration = async () => {
    setIsLoading(true);
    setMessage("");

    if (
      !formData.email.endsWith("@noroff.no") &&
      !formData.email.endsWith("@stud.noroff.no")
    ) {
      setMessage("Email must be from @noroff.no or @stud.noroff.no");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://v2.api.noroff.dev/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
        }
        setMessage("Registration successful! Welcome aboard.");
        navigateToHome();
      } else {
        setMessage("Registration failed. Please try again later.");
      }
    } catch (error) {
      setMessage("Registration failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen p-5 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="w-full max-w-xl p-5 m-auto bg-white shadow-xl rounded-xl py-28"
      >
        <h1 className="text-3xl font-normal text-center text-gray-700">
          Register
        </h1>
        {message && (
          <p
            className={`text-center ${
              message.includes("failed") || message.includes("Email")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
        <form className="max-w-sm m-auto mt-6">
          <div className="py-1 mb-2">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-2 bg-white border rounded-md text-primary focus:border-primary focus:ring-primary focus:outline-none focus:ring focus:ring-opacity-40"
              required
            />
          </div>
          <div className="py-1 mb-2">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-2 bg-white border rounded-md text-primary focus:border-primary focus:ring-primary focus:outline-none focus:ring focus:ring-opacity-40"
              required
            />
          </div>
          <div className="py-3 mb-2">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-2 bg-white border rounded-md text-primary focus:border-primary focus:ring-primary focus:outline-none focus:ring focus:ring-opacity-40"
              required
            />
          </div>
          <div className="flex items-center py-1 mb-2">
            <input
              type="checkbox"
              id="venueManager"
              name="venueManager"
              checked={formData.venueManager}
              onChange={toggleVenueManager}
              className="mr-2"
            />
            <label htmlFor="venueManager" className="text-gray-700">
              Register as Venue Manager
            </label>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-center mt-6"
          >
            <button
              type="button"
              onClick={handleRegistration}
              className="w-full px-4 py-2 tracking-wide text-center text-white transition-colors duration-200 transform bg-primary rounded-3xl hover:bg-primary-dark focus:outline-none focus:bg-primary-dark"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </motion.div>
        </form>
        <p className="mt-8 text-xs font-light text-center text-gray-700">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default RegisterForm;
