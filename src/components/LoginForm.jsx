import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://v2.api.noroff.dev/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("username", data.data.name); 

        // Create API Key
        const apiKeyResponse = await fetch(
          "https://v2.api.noroff.dev/auth/create-api-key",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.data.accessToken}`,
            },
            body: JSON.stringify({ name: "My API Key" }),
          }
        );

        if (apiKeyResponse.ok) {
          const apiKeyData = await apiKeyResponse.json();
          localStorage.setItem("apiKey", apiKeyData.data.key);
        } else {
          const errorMessage = await apiKeyResponse.text();
          setError(`Error creating API Key: ${errorMessage}`);
          console.error("Error creating API Key:", errorMessage);
        }

        // Redirect to home page
        navigate(`/`);
      } else {
        setError("Invalid credentials. Please check your email and password.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      console.error("Login error: ", error);
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
        className="w-full max-w-xl p-5 m-auto bg-white py-28 rounded-xl"
      >
        <h1 className="text-3xl font-normal text-center text-gray-700">
          Login
        </h1>
        {error && (
          <div className="mt-2 text-center text-red-600">{error}</div>
        )}
        <form className="max-w-sm m-auto mt-6" onSubmit={handleLogin}>
          <div className="py-1 mb-2">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="block w-full px-4 py-2 mt-2 text-blue-500 bg-white border rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring focus:ring-opacity-40"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username" 
            />
          </div>
          <div className="py-3 mb-2">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="block w-full px-4 py-2 mt-2 text-blue-500 bg-white border rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring focus:ring-opacity-40"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password" 
            />
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-center mt-6"
          >
            <button
              type="submit"
              className={`w-full px-4 py-2 tracking-wide text-center text-white transition-colors duration-200 transform bg-blue-500 rounded-xl hover:bg-blue-700 focus:outline-none focus:bg-blue-500`}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </motion.div>
        </form>
        <a
          href="#"
          className="flex justify-center pt-10 text-xs text-blue-500 hover:underline"
        >
          Forgot your password?
        </a>
        <p className="mt-8 text-xs font-light text-center text-gray-700">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-500 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
