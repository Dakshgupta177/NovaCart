import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import api from "../utils/api";
import { toast } from "react-toastify";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setloading] = useState(false);
  const getPaymentDetails = async () => {
    setloading(true);
    try {
      const response = await api.post("/api/stripe/verifypayment", {
        sessionId,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    toast.info("Order Might take some time to reflect in your order history. Please check after a few minutes.");
    getPaymentDetails();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-green-600 bg-gray-100">
      {loading && (
        <img
          src="https://i.gifer.com/ZKZg.gif"
          className="size-12 fixed top-1/2 left-1/2 z-50"
          alt="Loading..."
        />
      )}
      <FaCheckCircle size={80} />
      <h1 className="text-3xl font-bold mt-4">Payment Successful!</h1>
      <p className="text-lg mt-2 text-gray-700">Thank you for your purchase.</p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default Success;
