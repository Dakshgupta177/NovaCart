import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setloading] = useState(false);
  const [load, setLoad] = useState(true);
  const getOrderDetails = async () => {
    setloading(true);
    try {
      const response = await api.post(
        "/api/stripe/getpaymentdetails",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      console.log(response.data.Data);

      const filteredData = response.data.Data.filter(
        (item) => item.payment_status !== "unpaid",
      );
      setOrders(filteredData);
      toast.success("Orders fetched successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
      setloading(false);
    }
  };
  useEffect(() => {
    getOrderDetails();
  }, []);

  return (
    <div>
      {loading && (
        <img
          src="https://i.gifer.com/ZKZg.gif"
          className="size-12 fixed top-1/2 left-1/2 z-50"
          alt="Loading..."
        />
      )}
      {!load ? (
        orders.length > 0 ? (
          <>
            <div className="text-4xl text-bold text-center pt-8 bg-gray-100 dark:bg-zinc-950">
              Orders
            </div>
            {orders.map((item) => {
              return item.productDetails.map((prod) => {
                return (
                  <div
                    className="bg-gray-100 dark:bg-zinc-950 p-4 md:p-8 text-sm"
                    key={prod._id}
                  >
                    <div className="max-w-6xl mx-auto">
                      <div className="md:col-span-2">
                        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md p-4 mb-6">
                          <Link
                            className="flex flex-col md:flex-row gap-4"
                            to={`/product/${prod._id}`}
                          >
                            <div className="w-full md:w-28">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="h-28 w-full object-contain rounded border"
                              />
                            </div>

                            <div className="flex-1">
                              <h2 className="text-base font-medium text-gray-900 dark:text-white">
                                {prod.name}
                                <span className="ml-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-medium">
                                  Assured
                                </span>
                              </h2>

                              <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                                ₹
                                {Number(prod.price * 80 * 0.8).toLocaleString(
                                  "en-IN",
                                  {
                                    maximumFractionDigits: 0,
                                  },
                                )}
                                <span className="line-through text-sm text-gray-500 ml-2">
                                  ₹
                                  {Number(prod.price * 80).toLocaleString(
                                    "en-IN",
                                    {
                                      maximumFractionDigits: 0,
                                    },
                                  )}
                                </span>
                                <span className="text-green-600 text-sm font-medium ml-2">
                                  20% Off
                                </span>
                              </p>

                              <div className="flex justify-between items-center">
                                {(() => {
                                  const now = new Date();
                                  const date = new Date(item.updatedAt);
                                  date.setDate(date.getDate());
                                  const shippedDate = new Date(item.updatedAt);
                                  shippedDate.setDate(
                                    shippedDate.getDate() + 1,
                                  );
                                  const deliveryDate = new Date(item.updatedAt);
                                  deliveryDate.setDate(
                                    deliveryDate.getDate() + 2,
                                  );

                                  const dayName = date.toLocaleDateString(
                                    "en-IN",
                                    {
                                      weekday: "short",
                                    },
                                  );
                                  const monthName = date.toLocaleDateString(
                                    "en-IN",
                                    {
                                      month: "short",
                                    },
                                  );
                                  const day = date.getDate();
                                  const dayNameShi =
                                    shippedDate.toLocaleDateString("en-IN", {
                                      weekday: "short",
                                    });
                                  const monthNameShi =
                                    shippedDate.toLocaleDateString("en-IN", {
                                      month: "short",
                                    });
                                  const dayShi = shippedDate.getDate();
                                  const dayNameDel =
                                    deliveryDate.toLocaleDateString("en-IN", {
                                      weekday: "short",
                                    });
                                  const monthNameDel =
                                    deliveryDate.toLocaleDateString("en-IN", {
                                      month: "short",
                                    });
                                  const dayDel = deliveryDate.getDate();
                                  return (
                                    <div>
                                      <p className="text-xs text-green-600 mt-1">
                                        Placed on : {day} {monthName} ,{" "}
                                        {dayName}
                                        <span className="m-4 text-green-500">
                                          Complete
                                        </span>
                                      </p>
                                      <p className="text-xs text-green-600 mt-1">
                                        Shipped by : {dayShi} {monthNameShi} ,{" "}
                                        {dayNameShi}
                                        <span
                                          className={`m-4 text-red-500 ${
                                            now > shippedDate ? "hidden" : ""
                                          }`}
                                        >
                                          Incomplete
                                        </span>
                                        <span
                                          className={`m-4 text-green-500 ${
                                            now < shippedDate ? "hidden" : ""
                                          }`}
                                        >
                                          Complete
                                        </span>
                                      </p>
                                      <p className="text-xs text-green-600 mt-1">
                                        Delivery by : {dayDel} {monthNameDel} ,{" "}
                                        {dayNameDel}
                                        <span
                                          className={`m-4 text-red-500 ${
                                            now > deliveryDate ? "hidden" : ""
                                          }`}
                                        >
                                          Incomplete
                                        </span>
                                        <span
                                          className={`m-4 text-green-500 ${
                                            now < deliveryDate ? "hidden" : ""
                                          }`}
                                        >
                                          Complete
                                        </span>
                                      </p>
                                    </div>
                                  );
                                })()}
                                <p className="text-xl text-green-600 mt-1 font-bold">
                                  {prod.quantity || 1}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              });
            })}
          </>
        ) : (
          <div className="flex justify-center items-center h-screen">
            <h1 className="font-bold text-6xl max-sm:text-3xl">
              No Orders To Display
            </h1>
          </div>
        )
      ) : null}
    </div>
  );
};

export default Order;
