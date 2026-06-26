import React, { useState, useEffect } from "react";
import { login, logout } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PiShoppingCart } from "react-icons/pi";
import { fetchWishlist, totalAmount } from "../store/cartSlice";
import api from "../utils/api";

const Navbar = () => {
  const dispatch = useDispatch();
  const [showdropdown, setshowdropdown] = useState(false);
  const [loading, setloading] = useState(true);
  let isLogined = useSelector((state) => state.auth.status);
  let totalQuantity = useSelector((state) => state.cart.totalAmount);
  let user = useSelector((state) => state.auth.userData);

  const getCartItems = async () => {
    setloading(true);
    try {
      const response = await api.get("/api/cart/getcartdetails", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const totalQuantity = response?.data?.Data?.totalQuantity || 0;
      dispatch(totalAmount(totalQuantity));
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const handleLogout = async () => {
    setloading(true);
    try {
      await api.post(
        "/api/user/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      dispatch(logout());
      setshowdropdown(false);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    getCartItems();
  }, [isLogined]);

  return (
    <div className="py-2 bg-gray-800 dark:bg-gray-900 text-white">
      <nav>
        {loading ? (
          <img
            src="https://i.gifer.com/ZKZg.gif"
            className="size-12 fixed top-1/2 left-1/2 "
            alt="Loading..."
          />
        ) : null}
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div>
              <Link to={"/"}>
                <img src={"/logo.png"} className="size-12 rounded" />
              </Link>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <Link
                    to="/explore"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Explore
                  </Link>
                  <Link
                    to="/orders"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/smart-search"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Smart Search
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="relative ml-3">
                <div
                  onBlur={() => {
                    setTimeout(() => {
                      setshowdropdown(false);
                    }, 300);
                  }}
                >
                  {isLogined ? (
                    <div className="flex gap-10">
                      <Link
                        to={`/cart`}
                        className="font-bold text-5xl text-gray-300"
                      >
                        <PiShoppingCart />
                      </Link>
                      <div
                        className={`size-4 rounded-full bg-red-500 text-white text-center my-auto absolute z-20 left-9 top-1 text-xs ${
                          totalQuantity == 0 ? "hidden" : ""
                        }`}
                      >
                        {totalQuantity}
                      </div>
                      <button
                        type="button"
                        className="relative flex rounded-full cursor-pointer bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                        id="user-menu-button"
                        aria-expanded="false"
                        aria-haspopup="true"
                        onClick={() => {
                          setshowdropdown((prev) => !prev);
                        }}
                      >
                        <img
                          className="size-12 rounded-full "
                          src={`${user?.avatar}`}
                          alt=""
                        />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <button className="font-semibold text-lg bg-green-500 p-4 py-2 rounded-full text-white">
                        <Link to="/user/signup">Signup</Link>
                      </button>
                      <button className="font-semibold text-lg bg-green-500 p-4 py-2 rounded-full text-white">
                        <Link to="/user/login">Login</Link>
                      </button>
                    </div>
                  )}
                </div>

                <div
                  className={`absolute ${
                    showdropdown ? "" : "hidden"
                  } right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 focus:outline-hidden`}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex="-1"
                >
                  <Link
                    to="/user/profile"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-0"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-0"
                  >
                    Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-0"
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/smart-search"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-0"
                  >
                    Smart Search
                  </Link>
                  {!user?.admin ? (
                    <Link
                      to="/admin-request"
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      tabIndex="-1"
                      id="user-menu-item-0"
                    >
                      Request Admin Access
                    </Link>
                  ) : (
                    <Link
                      to="/products/addproduct"
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      tabIndex="-1"
                      id="user-menu-item-0"
                    >
                      Add Product
                    </Link>
                  )}
                  <button
                    className="block px-4 py-2 cursor-pointer text-sm text-gray-700 w-full text-left"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
