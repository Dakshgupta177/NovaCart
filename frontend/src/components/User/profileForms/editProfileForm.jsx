import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../store/authSlice";
import api from "../../../utils/api";

export const FormOne = () => {
  let user = useSelector((state) => state.auth);
  const [loading, setloading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const [edit, setedit] = useState(false);
  const [error, seterror] = useState("");
  const onSubmit = async (data) => {
    setloading(true);
    try {
      const response = await api.post("/api/user/editUserProfile", {data, id: user.userData._id}, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      seterror(response.data.message);
      dispatch(login({ userData: response.data.data }));
      setedit(false);
      reset();
    } catch (error) {
      console.error("Error updating profile:", error);
      seterror(error.response.data.message);
    } finally {
      setloading(false);
      setTimeout(() => {
        seterror("");
      }, 3000);
    }
  };
  const editProfile = () => {
    setedit(true);
  };
  return (
    <div>
      {loading ? (
        <img
          src="https://i.gifer.com/ZKZg.gif"
          className="size-12 fixed top-1/2 left-1/2 "
          alt="Loading..."
        />
      ) : null}
      <form
        className="w-full max-w-sm mx-auto flex flex-col "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 text-2xl"
              htmlFor="fullName"
            >
              FullName
            </label>
          </div>
          <div className="md:w-2/3 flex flex-col">
            <input
              {...register("fullName", { required: true, minLength: 3})}
              className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${
                !edit ? "hidden" : ""
              }`}
              placeholder="Full Name"
              id="fullName"
              type="text"
            />
            <div
              className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full min-w-60 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${
                edit ? "hidden" : ""
              }`}
            >
              {user.userData?.fullName}
            </div>
            <h4>
              {errors.fullName && (
                <span className="text-red-500 ">This field is required</span>
              )}
            </h4>
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 text-2xl"
              htmlFor="username"
            >
              Username
            </label>
          </div>
          <div className="md:w-2/3 flex flex-col">
            <input
              {...register("username", { required: true, minLength: 3 })}
              placeholder="Username"
              className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${
                !edit ? "hidden" : ""
              }`}
              id="username"
              type="text"
            />
            <div
              className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full min-w-60 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${
                edit ? "hidden" : ""
              }`}
            >
              {user.userData?.username}
            </div>
            <h4>
              {errors.username && (
                <span className="text-red-500">This field is required</span>
              )}
            </h4>
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 text-2xl"
              htmlFor="email"
            >
              Email
            </label>
          </div>
          <div className="md:w-2/3 flex flex-col">
            <input
              {...register("email", {
                required: true,
                pattern: /^\S+@\S+$/i,
                minLength: 3,
              })}
              placeholder="Email"
              className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${
                !edit ? "hidden" : ""
              }`}
              id="email"
              type="text"
            />
            <div
              className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full min-w-60 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${
                edit ? "hidden" : ""
              }`}
            >
              {user.userData?.email}
            </div>
            <h4>
              {errors.email && (
                <span className="text-red-500 ">
                  This field is required and should use special char
                </span>
              )}
            </h4>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button
            className={`shadow bg-purple-500 hover:bg-purple-400 cursor-pointer focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded ${
              !edit ? "hidden" : ""
            } disabled:opacity-50 disabled:hover:bg-purple-500`}
            disabled={errors.fullName || errors.username || errors.email}
            type="submit"
          >
            <h3>Save</h3>
          </button>
          <div
            className={`shadow bg-purple-500 hover:bg-purple-400 cursor-pointer focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded ${
              edit ? "hidden" : ""
            }`}
            onClick={editProfile}
          >
            <h3>Edit Profile</h3>
          </div>
        </div>
      </form>
      {error && (
        <div
          className={`text-white p-4 rounded-lg mt-4 ${
            error === "User profile updated successfully"
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
