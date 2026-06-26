import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  heroProducts: [],
  suggestedProducts: [],
  searchResults: [],
  exploreProducts: null
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    storeProducts: (state, action) => {
      state.heroProducts = action.payload.heroProducts;
      state.suggestedProducts = action.payload.suggestedProducts;
    },
    storeSearchResults: (state, action) => {
      state.searchResults = action.payload.searchResults;
    },
    storeExploreProducts: (state, action) => {
      state.exploreProducts = action.payload.exploreProducts;
    },
  },
});

export const { storeProducts, storeSearchResults, storeExploreProducts } = productSlice.actions;
export default productSlice.reducer;