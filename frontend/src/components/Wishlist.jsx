import React, { useEffect } from "react";
import Card from "./Card";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "../store/cartSlice";

export const Wishlist = () => {
  const dispatch = useDispatch();
  let wishlistItems = useSelector((state) => state.cart.WishlistItems);
  console.log(wishlistItems);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-4xl text-bold text-center pt-8 bg-gray-100 dark:bg-zinc-950">
          Wishlist
        </div>
        {wishlistItems?.length > 0 && (
          <div className="text-center my-8">
            <span className="dark:text-gray-300 text-gray-700">
              {wishlistItems.length} item{wishlistItems.length > 1 ? "s" : ""}
            </span>
          </div>
        )}

        {wishlistItems?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">❤️</div>

            <h2 className="text-xl font-semibold mb-2">
              Your wishlist is empty
            </h2>

            <p className="text-gray-500 text-center max-w-md">
              Save products you love and easily find them later.
            </p>
          </div>
        ) : (
          <div className="flex gap-6 flex-wrap justify-start">
            {wishlistItems.map((item) => (
              <Card key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
