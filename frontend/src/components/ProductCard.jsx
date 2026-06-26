import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaBolt } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { increment } from "../store/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { updateData } from "../store/authSlice";
import { ChangeAddress } from "./User/profileForms/ChangeAddress";
import api from "../utils/api";
import { toast } from "react-toastify";

const productCard = () => {
  const params = useParams();
  const dispatch = useDispatch();
  let user = useSelector((state) => state.auth.userData);
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(true);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [error, setError] = useState(null);
  const [curr, setCurr] = useState(0);
  const [prod, setProd] = useState(null);
  const [available, setAvailable] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewed, setReviewed] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const editReview = async () => {
    try {
      setLoading(true);
      const response = await api.post(
        "/api/product/editreviews",
        {
          productId: prod._id,
          comment: review,
          rating,
          reviewerName: user.fullName,
          reviewerEmail: user.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      setProd(response?.data?.product);
      toast.success("Review updated successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    try {
      setLoading(true);
      const response = await api.post(
        "/api/product/addreviews",
        {
          productId: prod._id,
          comment: review,
          rating,
          reviewerName: user.fullName,
          reviewerEmail: user.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      setProd(response?.data?.product);
      toast.success("Review submitted successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const makePayment = async () => {
    if (!user.address) {
      return setShowAddressPopup(true);
    }
    try {
      setLoading(true);
      const stripe = await loadStripe(
        "pk_test_51RbeO8Q3LuoRWPJrOKfyCRgDIU3qnlXvtAv4PAti59rtupo2kJ1YD7r9dgvo9Zk2bnxI42CW8f7oOMxM4L1BEoS7000cnGswbe",
      );
      const response = await api.post(
        "/api/stripe/checkout",
        {
          product: {
            name: prod.name,
            price: prod.price,
            image: prod.images[0],
            _id: prod._id,
            description: prod.description,
          },
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
        console.error(result.error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleproduct = async () => {
    setLoading(true);
    try {
      const response = await api.post(
        "/api/cart/addtocart",
        { productId: prod._id },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      dispatch(increment({ _id: prod._id }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const prevSlide = () => {
    setCurr((curr) => (curr == 0 ? prod.images.length - 1 : curr - 1));
  };

  const nextSlide = () => {
    setCurr((curr) => (curr == prod.images.length - 1 ? 0 : curr + 1));
  };

  const getTheProduct = async () => {
    setLoading(true);
    setLoad(true);
    try {
      const Product = await api.post(
        `/api/product/getaproduct?productId=${params.title}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      setProd(Product?.data?.product);
      if (Product?.data?.product?.items > 0) setAvailable(true);
      const reviewed = Product?.data?.product?.reviews?.find(
        (item) => {
          return item.reviewerEmail === user.email
        },
      );
      setReviewed(reviewed);
      setReview(reviewed?.comment || "");
      setRating(reviewed?.rating || 5);
      toast.success("Product fetched successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setLoad(false);
    }
  };

  useEffect(() => {
    getTheProduct();
  }, []);

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
        params.title && prod ? (
          <div>
            <div className="md:flex gap-10 px-4 md:px-10 py-8 min-h-screen">
              <div className="md:w-1/2 w-screen">
                <div className="h-96 overflow-hidden rounded-2xl shadow-lg bg-white dark:bg-zinc-900 relative">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${curr * 100}%)` }}
                  >
                    {prod.images.map((item, index) => (
                      <img
                        key={index}
                        src={item}
                        alt=""
                        className="w-screen h-96 object-contain flex-shrink-0 dark:bg-white"
                      />
                    ))}
                  </div>
                  <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-5 -translate-y-1/2 cursor-pointer bg-black/60 text-white rounded-full p-3 hover:bg-black transition"
                  >
                    <FaChevronLeft />
                  </button>

                  <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer bg-black/60 text-white rounded-full p-3 hover:bg-black transition"
                  >
                    <FaChevronRight />
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-5 justify-center flex-wrap">
                  {prod.images.map((item, index) => (
                    <img
                      key={index}
                      src={item}
                      alt=""
                      onMouseEnter={() => setCurr(index)}
                      className={`size-20 max-sm:size-16 object-cover rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                        curr === index
                          ? "border-orange-500"
                          : "border-gray-300 dark:border-zinc-700"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-4 mt-8 justify-center items-center flex-wrap">
                  <button
                    className="flex items-center gap-2 cursor-pointer disabled:bg-orange-300 disabled:cursor-not-allowed bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition"
                    onClick={handleproduct}
                    disabled={!available}
                  >
                    <FaShoppingCart />
                    ADD TO CART
                  </button>

                  <button
                    className="flex items-center gap-2 cursor-pointer disabled:bg-orange-300 disabled:cursor-not-allowed bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition"
                    onClick={makePayment}
                    disabled={!available}
                  >
                    <FaBolt />
                    BUY NOW
                  </button>
                </div>
              </div>
              <div className="md:w-1/2 mt-10 md:mt-0">
                <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg p-6 space-y-5">
                  <div>
                    <h1 className="text-4xl font-bold text-zinc-800 dark:text-white">
                      {prod.name}
                    </h1>

                    <p className="text-gray-500 mt-2 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-lg text-gray-400 line-through">
                      ₹
                      {(Number(prod.price) * 80).toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}
                    </p>

                    <div className="flex items-center gap-3">
                      <p className="text-4xl font-bold text-green-600">
                        ₹
                        {(Number(prod.price) * 0.8 * 80).toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 0,
                          },
                        )}
                      </p>

                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                        20% OFF
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl">
                      <p className="text-gray-500">Category</p>
                      <p className="font-semibold">{prod.category}</p>
                    </div>

                    <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl">
                      <p className="text-gray-500">Brand</p>
                      <p className="font-semibold">{prod.company}</p>
                    </div>

                    <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl">
                      <p className="text-gray-500">Stock Left</p>
                      <p className="font-semibold">{prod.items} Items</p>
                    </div>

                    <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl">
                      <p className="text-gray-500">Availability</p>
                      <p
                        className={`${available ? "text-green-500" : "text-red-500"} font-semibold`}
                      >
                        {available ? "" : "Not "}In Stock
                      </p>
                    </div>
                  </div>
                  <div className="bg-zinc-100 dark:bg-zinc-800 p-5 rounded-2xl">
                    <h2 className="font-bold text-lg mb-3">Dimensions</h2>

                    <div className="flex gap-6 text-sm">
                      <div>
                        <p className="text-gray-500">Width</p>
                        <p className="font-semibold">{prod.sizes.width} in</p>
                      </div>

                      <div>
                        <p className="text-gray-500">Height</p>
                        <p className="font-semibold">{prod.sizes.height} in</p>
                      </div>

                      <div>
                        <p className="text-gray-500">Depth</p>
                        <p className="font-semibold">{prod.sizes.depth} in</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="font-bold text-lg mb-3">Tags</h2>

                    <div className="flex flex-wrap gap-3">
                      {prod.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-zinc-800 p-4 rounded-2xl">
                    <p className="font-semibold text-blue-600 dark:text-blue-400">
                      Free Delivery Available
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Delivery within 2-3 business days.
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-3 ${prod.rating == 0 ? "hidden" : ""}`}
                  >
                    <div className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-lg">
                      <span className="font-semibold">{prod.rating}</span>
                      <FaStar className="size-4" />
                    </div>

                    <p className="text-gray-500">Reviews & Ratings</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-5xl mx-auto px-4 py-12">
              <h1 className="text-4xl font-bold text-center mb-10">
                Reviews & Ratings
              </h1>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 mb-10">
                <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>

                <textarea
                  placeholder="Share your experience about this product..."
                  className="w-full h-32 border dark:border-zinc-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-400 bg-transparent"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-gray-500">Your Rating:</span>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="border dark:border-zinc-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-orange-400 bg-transparent"
                  >
                    <option className="dark:bg-zinc-900" value={5}>
                      5 - Excellent
                    </option>
                    <option className="dark:bg-zinc-900" value={4}>
                      4 - Good
                    </option>
                    <option className="dark:bg-zinc-900" value={3}>
                      3 - Average
                    </option>
                    <option className="dark:bg-zinc-900" value={2}>
                      2 - Poor
                    </option>
                    <option className="dark:bg-zinc-900" value={1}>
                      1 - Terrible
                    </option>
                  </select>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-white px-6 py-3 rounded-xl font-semibold transition"
                    onClick={() => {!reviewed ?  submitReview() : editReview()}}
                  >
                    {!reviewed ? "Submit Review" : "Edit Review"}
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                {prod.reviews.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div
                        className={`flex items-center gap-2 ${item.rating > 3 ? "bg-green-600" : item.rating < 3 ? "bg-red-600" : "bg-yellow-600"} text-white px-3 py-1 rounded-lg`}
                      >
                        <span className="font-semibold">{item.rating}</span>
                        <FaStar className="size-4" />
                      </div>

                      <span className="text-sm text-gray-400">
                        Verified Purchase
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                      {item.comment}
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold uppercase">
                        {item.reviewerName?.charAt(0)}
                      </div>

                      <div>
                        <p className="font-semibold">{item.reviewerName}</p>
                        <p className="text-sm text-gray-500">Certified Buyer</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="text-2xl text-white">No Product Found</div>
          </>
        )
      ) : null}
    </>
  );
};

export default productCard;
