import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decrement, increment, storeCartItems } from "../store/cartSlice";
import { loadStripe } from "@stripe/stripe-js";
import { updateData } from "../store/authSlice";
import { ChangeAddress } from "./User/profileForms/ChangeAddress";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

const Cart = () => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [load, setLoad] = useState(false);
  const [loading, setloading] = useState(false);
  const Day = days[new Date().getDay()];
  const Month = months[new Date().getMonth()];
  const date = new Date().getDate() + 2;

  const makePayment = async () => {
    if (!user.address) {
      return setShowAddressPopup(true);
    }
    try {
      setloading(true);
      const stripe = await loadStripe(
        "pk_test_51RbeO8Q3LuoRWPJrOKfyCRgDIU3qnlXvtAv4PAti59rtupo2kJ1YD7r9dgvo9Zk2bnxI42CW8f7oOMxM4L1BEoS7000cnGswbe",
      );
      const response = await api.post(
        "/api/stripe/checkout",
        {
          product: cartItems,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      const sessionId = response.data.id;
      const result = await stripe.redirectToCheckout({ sessionId });
      if (result.error) {
        console.log(result.error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const getCartItems = async () => {
    setLoad(true);
    setloading(true);
    try {
      const response = await api.get("/api/cart/getcartdetails", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      dispatch(
        storeCartItems({ cartItems: response?.data?.Data?.Products || [] }),
      );
      toast.success("Cart Items fetched successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
      setloading(false);
    }
  };

  const handleIncrement = async (id) => {
    setloading(true);
    try {
      await api.post(
        "/api/cart/addtocart",
        { productId: id },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      dispatch(increment({ _id: id }));
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const handleDecrement = async (id) => {
    setloading(true);
    try {
      await api.post(
        "/api/cart/minuscart",
        { productId: id },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      dispatch(decrement({ _id: id }));
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (cartItems.length == 0) {
      getCartItems();
    }
  }, []);

  useEffect(() => {
    if (cartItems) {
      let totalDiscount = 0;
      let totalPrice = 0;
      cartItems.forEach((item) => {
        totalPrice += item.price * 80 * 0.8 * item.quantity;
      });
      totalDiscount = totalPrice / 4;
      const TotalDiscount = Number(totalDiscount).toLocaleString("en-IN", {
        maximumFractionDigits: 0,
      });
      const TotalPrice = Number(totalPrice).toLocaleString("en-IN", {
        maximumFractionDigits: 0,
      });
      setTotalDiscount(TotalDiscount);
      setTotalPrice(TotalPrice);
    }
  }, [cartItems]);

  return (
    <>
      {showAddressPopup && (
        <ChangeAddress setShowAddressPopup={setShowAddressPopup} />
      )}
      {loading && (
        <img
          src="https://i.gifer.com/ZKZg.gif"
          className="size-12 fixed top-1/2 left-1/2 z-50"
          alt="Loading..."
        />
      )}
      {!load ? (
        cartItems.length > 0 ? (
          <div className="flex flex-col justify-center bg-gray-100 dark:bg-zinc-950">
            {cartItems.map((item) => {
              return (
                <div
                  className="bg-gray-100 dark:bg-zinc-950 p-4 md:p-8 text-sm"
                  key={item.name}
                >
                  <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <Link
                            to={`/product/${item._id}`}
                            className="w-full md:w-28"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-28 w-full object-contain rounded border"
                            />
                          </Link>

                          <div className="flex-1">
                            <h2 className="text-base font-medium text-gray-900 dark:text-white">
                              {item.name}
                            </h2>
                            <p className="text-xs text-gray-500">
                              {item.description}
                            </p>

                            <span className="ml-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-medium">
                              Assured
                            </span>

                            <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                              ₹
                              {Number(item.price * 80 * 0.8).toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                },
                              )}
                              <span className="line-through text-sm text-gray-500 ml-2">
                                ₹
                                {Number(item.price * 80).toLocaleString(
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

                            <p className="text-xs text-green-600 mt-1">
                              Delivery by {date} {Month}, {Day}
                            </p>

                            <div className="mt-4 flex gap-4 items-center flex-wrap">
                              <div className="flex items-center border rounded overflow-hidden">
                                <button
                                  onClick={(e) => {
                                    handleDecrement(item._id);
                                  }}
                                  className="px-3 py-1 cursor-pointer bg-gray-100 hover:bg-gray-200 font-bold text-black text-xl"
                                >
                                  -
                                </button>
                                <span className="px-4">{item.quantity}</span>
                                <button
                                  onClick={(e) => {
                                    handleIncrement(item._id);
                                  }}
                                  className="px-3 py-1 cursor-pointer bg-gray-100 hover:bg-gray-200 font-bold text-black text-xl"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800 rounded-md shadow-sm h-fit">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                PRICE DETAILS
              </h3>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {cartItems.map((item, index) => {
                  return (
                    <div className="flex justify-between" key={index}>
                      <span>Price ({index + 1} item)</span>
                      <span>
                        ₹
                        {Number(item.price * 80 * 0.8).toLocaleString("en-IN", {
                          maximumFractionDigits: 0,
                        })}
                        X {item.quantity} = ₹
                        {Number(
                          item.price * 80 * 0.8 * item.quantity,
                        ).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  );
                })}
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-600">− ₹{totalDiscount}</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                  <span>Total Amount</span>
                  <span>₹{totalPrice}</span>
                </div>
                <p className="text-green-600 text-sm mt-2">
                  You will save ₹{totalDiscount} on this order
                </p>
                <button
                  className="w-full mt-4 cursor-pointer bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
                  onClick={makePayment}
                >
                  PLACE ORDER
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-screen">
            <h1 className="font-bold text-4xl">No Items in the Cart</h1>
          </div>
        )
      ) : null}
    </>
  );
};

export default Cart;
