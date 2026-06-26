import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import Layout from "./components/Layout.jsx";
import App from "./App.jsx";
import Signup from "./components/User/signup.jsx";
import Login from "./components/User/Login.jsx";
import Profile from "./components/User/Profile.jsx";
import { AddProduct } from "./components/AddProduct.jsx";
import Cart from "./components/Cart.jsx";
import SearchProduct from "./components/SearchProduct.jsx";
import ProductCard from "./components/ProductCard.jsx";
import Success from "./components/Success.jsx";
import Failed from "./components/Failed.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import Order from "./components/Order.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { Wishlist } from "./components/Wishlist.jsx";
import { AdminRequest } from "./components/AdminRequest.jsx";
import Admin from "./components/Admin.jsx";
import Explore from "./components/Explore.jsx";
import SmartSearch from "./components/SmartSearch.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/user/signup",
        element: <Signup />,
      },
      {
        path: "/user/login",
        element: <Login />,
      },
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <App></App>,
          },
          {
            path: "/user/profile",
            element: <Profile />,
          },
          {
            path: "/products/addproduct",
            element: <AddProduct />,
          },
          {
            path: "/cart",
            element: <Cart />,
          },
          {
            path: "/Search/:item",
            element: <SearchProduct />,
          },
          {
            path: "/product/:title",
            element: <ProductCard />,
          },
          {
            path: "/wishlist",
            element: <Wishlist />,
          },
          {
            path: "/explore",
            element: <Explore />,
          },
          {
            path: "/success",
            element: <Success />,
          },
          {
            path: "/cancel",
            element: <Failed />,
          },
          {
            path: "/orders",
            element: <Order />,
          },
          {
            path: "/smart-search",
            element: <SmartSearch />,
          },
          {
            path: "/admin-request",
            element: <AdminRequest />,
          },
          {
            path: "/admin",
            element: <Admin />,
          },
        ],
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        limit={2}
      />
    </Provider>
);
