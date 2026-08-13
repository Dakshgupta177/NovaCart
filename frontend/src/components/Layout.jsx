import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { login, stopLoading } from "../store/authSlice";
import ScrollToTop from "./ScrollToTop";
import { fetchWishlist } from "../store/cartSlice";
import api from "../utils/api";

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const isLogin = useSelector((state) => state.auth.status);
  const loadingState = useSelector((state) => state.auth.isLoading);
  const getUser = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/user/userprofile", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      await api.post(
        "/api/user/refresh/token",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      dispatch(login({ userData: response?.data?.data }));
    } catch (error) {
      navigate("/user/signup");
      console.log(error);
    } finally {
      dispatch(stopLoading());
      setLoading(false);
    }
  };

  const getWishlistDetails = async () => {
    try {
      const response = await api.get("/api/wishlist/wishlistdetails", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      dispatch(fetchWishlist({ WishlistItems: response.data.data }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isLogin) {
      getUser();
      getWishlistDetails();
    }
  }, [isLogin]);

  return (
    <div>
      <ScrollToTop />
      <>
        <Navbar />
        <main className="bg-[#f9f9f9] dark:bg-zinc-950 text-black dark:text-white min-h-screen">
          {!loadingState ? (
            <Outlet />
          ) : (
            loading && (
              <img
                src="https://i.gifer.com/ZKZg.gif"
                className="size-12 fixed top-1/2 left-1/2 z-50"
                alt="Loading..."
              />
            )
          )}
        </main>
        <Footer />
      </>
    </div>
  );
};

export default Layout;
