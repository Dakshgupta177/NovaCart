import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalAmount: 0,
  WishlistItems: [],
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    storeCartItems: (state, action) => {
      state.cartItems = action.payload.cartItems;
    },
    totalAmount: (state, action) => {
      state.totalAmount = action.payload;
    },
    increment: (state, action) => {
      state.totalAmount = state.totalAmount + 1;
      const item = state.cartItems.find(
        (item) => item._id === action.payload._id,
      );
      if (item) {
        item.quantity++;
      }
    },
    decrement: (state, action) => {
      state.totalAmount = state.totalAmount - 1;
      const item = state.cartItems.find(
        (item) => item._id === action.payload._id,
      );
      if (item) {
        item.quantity--;
      }
      state.cartItems = state.cartItems.filter((item) => item.quantity > 0);
      if (state.totalAmount == 0) {
        state.totalAmount = 0;
      }
    },
    fetchWishlist: (state, action) => {
      state.WishlistItems = action.payload.WishlistItems;
    },
    addToWishlist: (state, action) => {
      const item = state.WishlistItems.find(
        (items) => items._id === action.payload.product._id,
      );
      if (!item) {
        state.WishlistItems.push(action.payload.product);
      } else {
        state.WishlistItems = state.WishlistItems.filter(
          (items) => items._id !== action.payload.product._id,
        );
      }
    },
  },
});
export const { totalAmount, increment, decrement, storeCartItems, addToWishlist, fetchWishlist } = cartSlice.actions;
export default cartSlice.reducer;
