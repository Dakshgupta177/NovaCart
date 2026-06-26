import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToWishlist, increment } from "../store/cartSlice";
import { FaHeart } from "react-icons/fa";
import api from "../utils/api";
import { toast } from "react-toastify";

const Card = ({ item }) => {
  const wishlistItems = useSelector((state) => state.cart.WishlistItems);
  const dispatch = useDispatch();
  const [inWishlist, setInWishlist] = React.useState(false);
  const checkWishlist = () => {
    const itemInWishlist = wishlistItems.find(
      (wishlistItem) => wishlistItem._id === item._id,
    );
    setInWishlist(!!itemInWishlist);
  };

  const handleClick = async () => {
    try {
      const response = await api.post(
        "/api/wishlist/togglewishlist",
        { productId: item._id },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      dispatch(addToWishlist({ product: item }));
      toast.success(response?.data?.message || "Wishlist updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleproduct = async (id) => {
    try {
      const response = await api.post(
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
      toast.success("Product added to cart successfully");
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    checkWishlist();
  }, [wishlistItems, item._id]);

  return (
    <div
      key={item._id}
      className="max-w-90 min-w-60 m-4 mx-auto bg-white rounded-lg shadow-md p-5 w-full transition-transform transform hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex flex-row-reverse items-center justify-between mb-4">
        <span
          className={`text-sm cursor-pointer text-gray-500 ${inWishlist ? "hidden" : ""}`}
          onClick={handleClick}
        >
          <FaHeart className="size-6" />
        </span>
        <span
          className={`text-sm cursor-pointer text-pink-500 ${!inWishlist ? "hidden" : ""}`}
          onClick={handleClick}
        >
          <FaHeart className="size-6" />
        </span>
      </div>
      <Link to={`/product/${item._id}`}>
        <img
          className="h-48 mx-auto object-cover"
          src={item.image}
          alt="Product Image"
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
          <p className="text-sm text-gray-600 mt-1 max-sm:hidden">
            {item.description}
          </p>
        </div>
      </Link>

      <div className="mt-4 flex items-center justify-between px-4">
        <span className="text-green-600 font-bold text-lg flex flex-wrap gap-2 items-center">
          <span>
            ₹
            {(Number(item.price) * 80 * 0.8).toLocaleString("en-IN", {
              maximumFractionDigits: 0,
            })}{" "}
          </span>
          <span className="text-sm max-sm:block">(20% off)</span>
        </span>
        <button
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition hover:cursor-pointer w-28"
          onClick={(e) => handleproduct(item._id)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Card;
