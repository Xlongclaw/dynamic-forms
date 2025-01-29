"use client";
import React, { useState, FormEvent } from "react";
import axios from "axios";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";

interface SignupResponse {
  message?: string;
  error?: string;
}

const Signup: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleSignup = async (e: FormEvent): Promise<void> => {
    e.preventDefault(); // Prevent form reload
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // API request to signup
      const response = await axios.post<SignupResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signup`,
        {
          name,
          email,
          password,
        }
      );

      // Handle success
      if (response.data.message) {
        setSuccess(response.data.message);
      }
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      // Handle error
      const errorMessage =
        err.response?.data?.error || "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen flex-col bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm">
      <Link href={`/`} className="flex justify-between items-center">
          <BiArrowBack
            size={40}
            className="mb-8 p-2 bg-blue-50 rounded-full hover:bg-blue-600 hover:text-white"
          />
          <p className="mb-8 ">
            {" "}
            <span className="font-bold text-xl mr-1">Ricoz</span>
            <span className="font-medium text-sm">Forms</span>{" "}
          </p>
        </Link>
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        </div>
        <form onSubmit={handleSignup}>
          {/* Name Input */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          {/* Success Message */}
          {success && <p className="text-green-500 text-sm mb-3">{success}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
