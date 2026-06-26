import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FcSearch } from "react-icons/fc";
import { increment } from "./store/cartSlice";
import { storeProducts } from "./store/productSlice";
import Card from "./components/Card";
import api from "./utils/api";
import { toast } from "react-toastify";

function App() {
  const [heroProducts, setHeroProducts] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [load, setLoad] = useState(true);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const Products = useSelector((state) => state.products);

  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/product/getheroproducts", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const heroProducts = response.data.products;
      dispatch(storeProducts({ heroProducts, suggestedProducts: [] }));
      setHeroProducts(heroProducts);
      const res = await api.get("/api/ai/getsuggestions", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const suggestedProducts = res.data.suggestedProducts;
      dispatch(storeProducts({ heroProducts, suggestedProducts }));
      setSuggestedProducts(suggestedProducts);
      toast.success("Products fetched successfully");
      console.log(res.headers);
    } catch (error) {
      console.log(error || "Products not found");
    } finally {
      setLoad(false);
      setLoading(false);
    }
  };

  const handleSearchbar = (e) => {
    if (e.key == "Enter") {
      navigate(`/search/${query}`);
    }
  };
  const handleSearchLogo = () => {
    if (query.length > 0) {
      navigate(`/search/${query}`);
    }
  };
  useEffect(() => {
    if (
      Products?.heroProducts?.length > 0 ||
      Products?.suggestedProducts?.length > 0
    ) {
      setHeroProducts(Products.heroProducts);
      setSuggestedProducts(Products.suggestedProducts);
      setLoad(false);
    } else {
      getProducts();
    }
  }, []);

  return (
    <>
      {loading && (
        <img
          src="https://i.gifer.com/ZKZg.gif"
          className="size-12 fixed top-1/2 left-1/2 z-50"
          alt="Loading..."
        />
      )}
      {!load ? (
        <div className="flex flex-col flex-wrap mx-auto overflow-hidden min-h-screen ">
          <div className="max-w-md mx-auto my-8 flex gap-2">
            <input
              type="text"
              placeholder="Search products..."
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              onKeyDown={handleSearchbar}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black min-w-48 sm:min-w-96 "
            />
            <FcSearch
              className="size-14 max-sm:size-10 cursor-pointer"
              onClick={handleSearchLogo}
            />
          </div>
          <section className=" w-full py-16 px-6 md:px-12 ">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10">
              <div className="space-y-6 text-center md:text-left ">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  Big Savings on{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    Top Products
                  </span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Shop the latest gadgets, fashion, home essentials and more —
                  all in one place.
                </p>

                <Link
                  to={"/explore"}
                  className="bg-blue-600 p-4 text-white text-xl font-bold rounded-2xl mt-10 cursor-pointer hover:bg-blue-700"
                >
                  Explore More
                </Link>
              </div>
              <img
                src="/dark.jpg"
                alt="Shopping Illustration"
                className="w-full max-w-md rounded-xl shadow-md contrast-[1.2] max-sm:mx-auto hidden dark:block mx-auto"
              />
              <img
                src="/light.jpg"
                alt="Shopping Illustration"
                className="w-full max-w-md rounded-xl shadow-md contrast-[1.2] max-sm:mx-auto dark:hidden mx-auto"
              />
            </div>
          </section>
          <div className="flex flex-wrap mx-auto overflow-hidden">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-300 w-full px-4 mb-6">
              Top Selling Products
            </h2>
            {heroProducts.map((item) => {
              return <Card item={item} key={item._id} />;
            })}
          </div>
          <div className="flex flex-wrap mx-auto overflow-hidden mt-10">
            {suggestedProducts.length > 0 && (
              <>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-300 w-full px-4 mb-6">
                  Recommended for You
                </h2>
                {suggestedProducts.map((item) => {
                  return <Card item={item} key={item._id} />;
                })}
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default App;
