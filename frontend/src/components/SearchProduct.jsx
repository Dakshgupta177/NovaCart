import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { FcSearch } from "react-icons/fc";
import { increment } from "../store/cartSlice";
import { storeSearchResults } from "../store/productSlice";
import Card from "./Card";
import api from "../utils/api";
import { toast } from "react-toastify";

const SearchProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let searchProducts = useSelector((state) => state.products.searchResults);
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [loading, setloading] = useState(false);
  const [filteredProd, setFilteredProd] = useState([]);
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [sort, setSort] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const { highestPrice, lowestPrice } = useMemo(() => {
    let highest = 0;
    let lowest = Infinity;

    for (const item of searchProducts || []) {
      const price = item.price * 80 * 0.8;

      highest = Math.max(highest, price);
      lowest = Math.min(lowest, price);
    }
    lowest = Math.floor(lowest / 100) * 100;
    highest = Math.ceil(highest / 100) * 100;
    setMinPrice(lowest === Infinity ? 0 : lowest);
    setMaxPrice(highest);

    return {
      highestPrice: highest,
      lowestPrice: lowest === Infinity ? 0 : lowest,
    };
  }, [searchProducts]);


  const handleproduct = async (id) => {
    setloading(true);
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
    } finally {
      setloading(false);
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

  const getProduct = async () => {
    setloading(true);
    try {
      const Products = await api.get(
        `/api/product/searchproducts?name=${params.item}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      setFilteredProd(Products.data.product);
      dispatch(storeSearchResults({ searchResults: Products.data.product }));
      setQuery(params.item);
      setPage(1);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const applyFilters = () => {
    setSort("default");
    setPage(1);
    let filtered = searchProducts;
    filtered = filtered.filter(
      (item) =>
        item.price * 80 * 0.8 >= minPrice && item.price * 80 * 0.8 <= maxPrice,
    );
    if (ratingFilter) {
      if (ratingFilter === "4andabove") {
        filtered = filtered.filter((item) => item.rating >= 4);
      } else if (ratingFilter === "3.5andabove") {
        filtered = filtered.filter((item) => item.rating >= 3.5);
      } else if (ratingFilter === "3andabove") {
        filtered = filtered.filter((item) => item.rating >= 3);
      }
    }
    if (availabilityFilter) {
      if (availabilityFilter === "instock") {
        filtered = filtered.filter((item) => item.items > 0);
      }
    }
    toast.success("Filters applied successfully");
    setFilteredProd(filtered);
    setShowFilters(false);
  };
  
  useEffect(() => {
    getProduct();
  }, [params.item]);
  
  return (
    <div className="flex flex-col flex-wrap">
      {loading && (
        <img
        src="https://i.gifer.com/ZKZg.gif"
        className="size-12 fixed top-1/2 left-1/2 z-50"
        alt="Loading..."
        />
      )}
      {showFilters && (
        <div className="fixed inset-0 z-50">
          {/* Dark Background */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilters(false)}
          />

          {/* Drawer */}
          <div
            className="
      absolute
      left-0
      top-0
      h-full
      w-72
      bg-zinc-900
      p-5
      overflow-y-auto
      "
          >
            <div className="flex justify-between mb-5">
              <h2 className="font-semibold text-lg">Filters</h2>

              <button onClick={() => setShowFilters(false)}>✕</button>
            </div>

            <div className="rounded-2xl p-5 sticky top-24 border border-zinc-800 dark:text-white text-zinc-700">
              <h2 className="text-lg font-semibold mb-5">Filters</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3 dark:text-gray-300">
                    Price
                  </h3>

                  <div className="space-y-4 dark:text-gray-400 text-sm">
                    <div>
                      <p>Min Price: ₹{minPrice}</p>

                      <input
                        type="range"
                        min={lowestPrice}
                        max={highestPrice}
                        value={minPrice}
                        step={50}
                        onChange={(e) =>
                          setMinPrice(
                            Math.min(Number(e.target.value), maxPrice),
                          )
                        }
                        className="w-full"
                      />
                    </div>

                    <div>
                      <p>Max Price: ₹{maxPrice}</p>

                      <input
                        type="range"
                        min={lowestPrice}
                        max={highestPrice}
                        value={maxPrice}
                        step={50}
                        onChange={(e) =>
                          setMaxPrice(
                            Math.max(Number(e.target.value), minPrice),
                          )
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-3 dark:text-gray-300">
                    Rating
                  </h3>

                  <div className="space-y-2 dark:text-gray-400 text-sm">
                    <label className="flex gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        value="4andabove"
                        checked={ratingFilter === "4andabove"}
                        onChange={(e) => {
                          setRatingFilter(e.target.value);
                        }}
                      />
                      4 Stars & above
                    </label>
                    <label className="flex gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        value="3.5andabove"
                        checked={ratingFilter === "3.5andabove"}
                        onChange={(e) => {
                          setRatingFilter(e.target.value);
                        }}
                      />
                      3.5 Stars & above
                    </label>
                    <label className="flex gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        value="3andabove"
                        checked={ratingFilter == "3andabove"}
                        onChange={(e) => {
                          setRatingFilter(e.target.value);
                        }}
                      />
                      3 Stars & above
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-3 dark:text-gray-300">
                    Availability
                  </h3>

                  <div className="space-y-2 dark:text-gray-400 text-sm">
                    <label className="flex gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        value="instock"
                        checked={availabilityFilter === "instock"}
                        onChange={(e) => {
                          
                          setAvailabilityFilter(e.target.value);
                        }}
                      />
                      In Stock
                    </label>
                  </div>
                </div>
                <button
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => applyFilters()}
                >
                  Apply Filters
                </button>
                <button
                  className="w-full cursor-pointer bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                  onClick={() => {
                    setSort("default");
                    setPage(1);
                    setMinPrice(lowestPrice);
                    setMaxPrice(highestPrice);
                    setRatingFilter("");
                    setAvailabilityFilter("");
                    setFilteredProd(searchProducts);
                    setShowFilters(false);
                    toast.success("Filters removed successfully");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-10 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold">Search Products</h1>

            <p className="dark:text-gray-400 text-gray-700 mt-3">
              Find electronics, fashion, grocery and kitchen products
            </p>

            <div className="max-w-2xl mx-auto mt-8">
              <div className="flex items-center bg-white rounded-full shadow-lg px-5 py-4">
                <input
                  type="text"
                  placeholder={`Search Products...`}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearchbar}
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
                  />

                <FcSearch
                  className="text-2xl cursor-pointer hover:scale-110 transition"
                  onClick={handleSearchLogo}
                  />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 pb-10">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside
              className={`${"open" ? "hidden" : "hidden"} lg:block w-64 shrink-0`}
              >
              <div className="rounded-2xl p-5 sticky top-24 border border-zinc-800 dark:text-white text-zinc-700">
                <h2 className="text-lg font-semibold mb-5">Filters</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3 dark:text-gray-300">
                      Price
                    </h3>

                    <div className="space-y-4 dark:text-gray-400 text-sm">
                      <div>
                        <p>Min Price: ₹{minPrice}</p>

                        <input
                          type="range"
                          min={lowestPrice}
                          max={highestPrice}
                          value={minPrice}
                          step={50}
                          onChange={(e) =>
                            setMinPrice(
                              Math.min(Number(e.target.value), maxPrice),
                            )
                          }
                          className="w-full"
                          />
                      </div>

                      <div>
                        <p>Max Price: ₹{maxPrice}</p>

                        <input
                          type="range"
                          min={lowestPrice}
                          max={highestPrice}
                          value={maxPrice}
                          step={50}
                          onChange={(e) =>
                            setMaxPrice(
                              Math.max(Number(e.target.value), minPrice),
                            )
                          }
                          className="w-full"
                          />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-3 dark:text-gray-300">
                      Rating
                    </h3>

                    <div className="space-y-2 dark:text-gray-400 text-sm">
                      <label className="flex gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          value="4andabove"
                          checked={ratingFilter === "4andabove"}
                          onChange={(e) => {
                            setRatingFilter(e.target.value);
                          }}
                          />
                        4 Stars & above
                      </label>
                      <label className="flex gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          value="3.5andabove"
                          checked={ratingFilter === "3.5andabove"}
                          onChange={(e) => {
                            setRatingFilter(e.target.value);
                          }}
                          />
                        3.5 Stars & above
                      </label>
                      <label className="flex gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          value="3andabove"
                          checked={ratingFilter === "3andabove"}
                          onChange={(e) => {
                            setRatingFilter(e.target.value);
                          }}
                          />
                        3 Stars & above
                      </label>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-3 dark:text-gray-300">
                      Availability
                    </h3>

                    <div className="space-y-2 dark:text-gray-400 text-sm">
                      <label className="flex gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="availability"
                          value="instock"
                          checked={availabilityFilter === "instock"}
                          onChange={(e) => {
                            setAvailabilityFilter(e.target.value);
                          }}
                          />
                        In Stock
                      </label>
                    </div>
                  </div>
                  <button
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    onClick={() => applyFilters()}
                    >
                    Apply Filters
                  </button>
                  <button
                    className="w-full cursor-pointer bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                    onClick={() => {
                      setSort("default");
                      setPage(1);
                      setMinPrice(lowestPrice);
                      setMaxPrice(highestPrice);
                      setRatingFilter("");
                      setAvailabilityFilter("");
                      setFilteredProd(searchProducts);
                      setShowFilters(false);
                      toast.success("Filters removed successfully");
                    }}
                    >
                    Clear Filters
                  </button>
                </div>
              </div>
            </aside>
            <div className="flex-1">
              <div className=" border border-zinc-800 rounded-2xl p-5 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                  <div>
                    <h2 className="text-2xl font-semibold">{query}</h2>

                    <p className="dark:text-gray-400  text-gray-700 mt-1">
                      {filteredProd?.length || 0} products found
                    </p>
                    <p className="dark:text-gray-400  text-gray-700 mt-1">
                      Showing{" "}
                      {Math.min((page - 1) * 10 + 1, filteredProd?.length)} -{" "}
                      {Math.min(page * 10, filteredProd?.length)} products Out
                      of {filteredProd?.length || 0}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                    onClick={() => setShowFilters(true)}
                      className="
                  lg:hidden
                  px-4
                  py-2
                  rounded-lg
                  dark:bg-zinc-800
                  dark:hover:bg-zinc-700
                "
                    >
                      Filters
                    </button>

                    <select
                      value={sort}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSort(value);
                        setPage(1);
                        if (value === "low") {
                          setFilteredProd((prev) =>
                            [...prev].sort((a, b) => a.price - b.price),
                          );
                        }

                        if (value === "high") {
                          setFilteredProd((prev) =>
                            [...prev].sort((a, b) => b.price - a.price),
                          );
                        }
                      }}
                      className="dark:bg-zinc-800 rounded-lg px-4 py-2 outline-none dark:text-white"
                    >
                      <option value="default">Sort By</option>

                      <option value="low">Price: Low to High</option>

                      <option value="high">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>
              {filteredProd.slice((page - 1) * 10, page * 10)?.length > 0 ? (
                <div>
                  <div
                    className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-6
            "
                  >
                    {filteredProd
                      .slice((page - 1) * 10, page * 10)
                      .map((item) => {
                        return (
                          <Card item={item} key={item._id} />
                        );
                      })}
                  </div>
                  <div className="flex justify-center mt-8 gap-4">
                    <button
                      className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition disabled:opacity-50"
                      onClick={() => setPage((prev) => prev - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </button>
                    <button
                      className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition disabled:opacity-50"
                      onClick={() => setPage((prev) => prev + 1)}
                      disabled={page * 10 >= filteredProd.length}
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-24">
                  <div className="text-7xl mb-5">🔍</div>

                  <h2 className="text-3xl font-bold">No Products Found</h2>

                  <p className="dark:text-gray-400 text-gray-700 mt-2">
                    Try another search term
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SearchProduct;
