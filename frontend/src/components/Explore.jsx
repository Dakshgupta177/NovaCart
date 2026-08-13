import React, { useEffect, useMemo, useState } from "react";
import Card from "./Card";
import { useDispatch, useSelector } from "react-redux";
import { storeExploreProducts } from "../store/productSlice";
import api from "../utils/api";
import { toast } from "react-toastify";

const categories = {
  Electronics: "📱",
  Fashion: "👕",
  Grocery: "🛒",
  Kitchen: "🍳",
};

const sections = [
  "🔥 Top Trending",
  "⭐ Best Selling",
  "🆕 New Arrivals",
  "💰 Top Deals",
];

const Explore = () => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState("Electronics");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [load, setLoad] = useState(false);
  const Products = useSelector((state) => state.products.exploreProducts);

  const fetchExploreProducts = async () => {
    try {
      setLoad(true);
      const { data } = await api.get("/api/product/exploreproducts");
      dispatch(storeExploreProducts({ exploreProducts: data.products }));
      filterProducts();
      toast.success("Products fetched successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  };

  const filterProducts = () => {
    if (selected === "Electronics") {
      setFilteredProducts(Products.electronics || []);
    } else if (selected === "Fashion") {
      setFilteredProducts(Products.fashion || []);
    } else if (selected === "Grocery") {
      setFilteredProducts(Products.grocery || []);
    } else if (selected === "Kitchen") {
      setFilteredProducts(Products.kitchen || []);
    } else {
      return [];
    }
  };

  const sectionProducts = {
    "🔥 Top Trending": [
      ...filteredProducts.slice(0, 2),
      ...filteredProducts.slice(8, 10),
      ...filteredProducts.slice(16, 20),
    ],
    "⭐ Best Selling": [
      ...filteredProducts.slice(2, 4),
      ...filteredProducts.slice(10, 12),
      ...filteredProducts.slice(20, 24),
    ],
    "🆕 New Arrivals": [
      ...filteredProducts.slice(4, 6),
      ...filteredProducts.slice(12, 14),
      ...filteredProducts.slice(24, 28),
    ],
    "💰 Top Deals": [
      ...filteredProducts.slice(6, 8),
      ...filteredProducts.slice(14, 16),
      ...filteredProducts.slice(28, 32),
    ],
  };
  useEffect(() => {
    if (Products) {
      filterProducts();
    } else {
      fetchExploreProducts();
    }
  }, [Products, selected]);

  return load ? (
    <div className="min-h-screen px-4 py-8">
      {/* Category Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-10">
        {Object.entries(categories).map(([name, emoji]) => (
          <button
            key={name}
            onClick={() => setSelected(name)}
            className={`p-5 max-sm:p-2 rounded-2xl max-sm: transition-all duration-300 ${
              selected === name
                ? "bg-blue-600 text-white scale-105"
                : "bg-white dark:bg-zinc-800 dark:text-white hover:scale-105"
            }`}
          >
            <div className="text-4xl">{emoji}</div>
            <p className="mt-2 font-semibold">{name}</p>
          </button>
        ))}
      </div>

      {/* Selected Category */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-4xl">{categories[selected]}</span>

          <h2 className="text-3xl font-bold dark:text-white">{selected}</h2>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section) => (
            <div key={section}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-2xl font-semibold dark:text-white">
                  {section}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {sectionProducts[section].map((product) => {
                  return <Card key={product._id} item={product} />;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
      <img
        src="https://i.gifer.com/ZKZg.gif"
        className="size-12 fixed top-1/2 left-1/2 z-50"
        alt="Loading..."
      />
  );
};

export default Explore;
