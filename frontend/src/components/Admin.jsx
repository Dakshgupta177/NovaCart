import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const Admin = () => {
  const [data, setData] = React.useState([]);
  const navigate = useNavigate();
  const isAdmin = async () => {
    try {
      const response = await api.get("/api/request/getdata", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(response.data);
      setData(response.data.data);
    } catch (error) {
      navigate("/admin-request");
      console.log(error);
    }
  };
  const handleClick = async (userId, accept) => {
    try {
      console.log(userId, accept);
      const response = await api.post(
        "/api/request/acceptorreject",
        { userId, accept },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      console.log(response.data);
      setData((prevRequests) =>
        prevRequests.filter((request) => request.userId !== userId),
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    isAdmin();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Seller Access Requests</h1>
      {data.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No requests found.</p>
      ) : (
        <div className="space-y-4">
          {data.map((request) => (
            <div
              key={request.userId}
              className="rounded-xl border p-5 shadow-sm"
            >
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">
                  {request.businessName}
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Email:</span> {request.email}
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">User ID:</span> {request.userId}
                </p>

                <div className="mt-3">
                  <p className="font-medium mb-1">Message</p>

                  <p className="text-gray-700 dark:text-gray-300 p-3 rounded-lg">
                    {request.message}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  onClick={() => handleClick(request.userId, true)}
                >
                  Accept
                </button>

                <button
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  onClick={() => handleClick(request.userId, false)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
