import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export const AddProduct = () => {
  const navigate = useNavigate();
  const isAdmin = useSelector((state) => state?.auth?.userData?.admin);
  const [loading, setloading] = useState(true);
  const [productImage, setproductImage] = useState("");
  const [productPreviewImage, setproductPreviewImage] = useState("");

  const fileSubmit = async () => {
    try {
      setloading(true);
      const file = document.getElementById("file").files[0];
      setproductImage(file);
      setproductPreviewImage(URL.createObjectURL(file));
      setloading(false);
    } catch (error) {
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    setloading(false);
    if (!isAdmin) {
      navigate("/adminlogin");
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, seterror] = useState("");
  const onSubmit = async (data) => {
    setloading(true);
    const file = document.getElementById("file").files[0];
    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("company", data.company);
    formData.append("category", data.category);
    formData.append("items", data.items);

    try {
      const response = await api.post(
        "/api/product/createproduct",
        formData,
        {
          withCredentials: true,
        },
      );
      seterror(response.data.message);
      fileSubmit();
    } catch (error) {
      console.error("Error updating profile:", error);
      seterror(error.response.data.message);
    } finally {
      setloading(false);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center px-4 py-6 bg-zinc-50 dark:bg-zinc-900 min-h-screen">
      {loading && (
        <img
          src="https://i.gifer.com/ZKZg.gif"
          className="size-12 fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
          alt="Loading..."
        />
      )}

      <div className="mb-8 flex flex-col items-center gap-4">
        <img
          src={`${productPreviewImage}`}
          alt=""
          className={`rounded-lg size-28 object-cover ${
            productImage ? "" : "hidden"
          }`}
        />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="file"
          name="image"
          onChange={fileSubmit}
        />
        <label
          htmlFor="file"
          className="cursor-pointer text-lg font-semibold bg-neutral-700 hover:bg-neutral-500 text-white px-6 py-2 rounded-lg transition-all duration-200"
        >
          Upload Product Image
        </label>
      </div>

      <form
        className="w-full max-w-xl bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-md space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {[
          {
            label: "Items",
            id: "items",
            type: "number",
            required: true,
            rules: { required: true, valueAsNumber: true },
          },
          {
            label: "Product Name",
            id: "name",
            type: "text",
            required: true,
            rules: { required: true },
          },
          {
            label: "Description",
            id: "description",
            type: "text",
            required: true,
            rules: { required: true, minLength: 10 },
          },
          {
            label: "Company",
            id: "company",
            type: "text",
            required: true,
            rules: { required: true },
          },
          {
            label: "Price",
            id: "price",
            type: "number",
            required: true,
            rules: { required: true, valueAsNumber: true, min: 50 },
          },
          {
            label: "Category",
            id: "category",
            type: "text",
            required: true,
          },
        ].map(({ label, id, type, required, rules }) => (
          <div className="space-y-1" key={id}>
            <label
              htmlFor={id}
              className="block text-xl font-semibold text-gray-700 dark:text-gray-200"
            >
              {label}
            </label>
            <input
              {...register(id, rules)}
              id={id}
              type={type}
              className="bg-gray-100 dark:bg-zinc-700 text-gray-800 dark:text-white border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors[id] && (
              <p className="text-sm text-red-500">
                {id === "description"
                  ? "This field is required. Description should be longer."
                  : id === "price"
                    ? "Price should be at least 50"
                    : "This field is required"}
              </p>
            )}
          </div>
        ))}

        <div className="text-center">
          <button
            className="bg-purple-600 hover:bg-purple-500 text-white text-lg font-semibold px-6 py-3 rounded-lg shadow transition-all disabled:opacity-50"
            disabled={
              errors.name ||
              errors.company ||
              errors.description ||
              errors.price ||
              errors.category ||
              errors.items
            }
            type="submit"
          >
            Add Product
          </button>
        </div>
      </form>

      {error && (
        <div
          className={`text-white px-6 py-3 rounded-lg mt-6 text-center max-w-md ${
            error === "product is created successfully"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};
