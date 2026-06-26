import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import { logout } from "../../../store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

export const DeleteProfile = () => {
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setloading(true);
    try {
      const response = await api.post("/api/user/deleteuser", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      dispatch(logout());
      seterror(response.data.message);
      Navigate("/user/login");
    } catch (error) {
      seterror(error.response.data.message);
    } finally {
      setloading(false);
      setTimeout(() => {
        seterror("");
      }, 3000);
    }
  };
  return (
    <div className="flex items-center mb-6 min-h-40 gap-4 flex-col">
      {loading ? (
        <img
          src="https://i.gifer.com/ZKZg.gif"
          className="size-12 fixed top-1/2 left-1/2 "
          alt="Loading..."
        />
      ) : null}
      <h2 className="font-bold text-3xl ">Delete Account</h2>
      <p className="font-medium text-xl dark:text-gray-100 text-center">
        Once you delete your account, there is no going back. Please be certain.
      </p>
      <form
        className="w-full max-w-sm mx-auto flex flex-col justify-center items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 text-2xl"
              htmlFor="password"
            >
              Password
            </label>
          </div>
          <div className="md:w-2/3 flex flex-col">
            <input
              {...register("password", { required: true })}
              className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 `}
              id="password"
              placeholder="********"
              type="password"
            />
            <h4>
              {errors.oldpassword && (
                <span className="text-red-500 ">This field is required</span>
              )}
            </h4>
          </div>
        </div>
        <button
          className="bg-red-600 cursor-pointer hover:bg-red-700 my-4 text-white font-bold py-2 px-4 w-48 rounded focus:outline-none focus:shadow-outline"
          onClick={onSubmit}
        >
          Delete Account
        </button>
      </form>
      {error && (
        <div
          className={`text-white p-4 rounded-lg mt-4 ${
            error === "User deleted successfully"
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
