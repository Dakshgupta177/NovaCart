import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateData } from "../store/authSlice";
import api from "../utils/api";

export const AdminRequest = () => {
  const [loading, setLoading] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [reason, setReason] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res = await api.post(
        "/api/user/adminaccess",
        {email, message: reason, businessName, userId: user._id},
        {
          withCredentials: true,
        },
      );
      setMessage("Request submitted successfully!");
      setEmail("");
      setBusinessName("");
      setReason("");
    } catch (error) {
      console.log(error);
      setMessage("Error submitting request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 p-6">
      {loading && (
        <img
          src="https://i.gifer.com/ZKZg.gif"
          className="size-12 fixed top-1/2 left-1/2 z-50"
          alt="Loading..."
        />
      )}

      <h3 className="text-2xl text-center text-red-600">
        After logging in as admin, you can add products and connect with buyers.
      </h3>
      <h1 className="text-4xl text-center my-6 font-bold text-yellow-500">
        Admin Access Request
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center"
      >
        <input
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white text-gray-800 font-semibold m-3 w-full max-w-lg p-3 rounded shadow"
        />

        <input
          type="text"
          placeholder="Business Name"
          required
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="bg-white text-gray-800 font-semibold m-3 w-full max-w-lg p-3 rounded shadow"
        />

        <textarea
          placeholder="Why do you want to become a seller?"
          required
          minLength={10}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="bg-white text-gray-800 font-semibold m-3 w-full max-w-lg min-h-[120px] p-3 rounded shadow"
        />

        <button
          type="submit"
          className="bg-blue-700 text-yellow-300 hover:text-orange-400 p-4 rounded-2xl font-semibold m-5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Request Access
        </button>

        {message && (
          <p className="text-lg font-medium text-center text-green-500 mt-2">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

