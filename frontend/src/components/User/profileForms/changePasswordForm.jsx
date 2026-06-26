import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../utils/api";

export const FormTwo = () => {
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setloading(true);
    try {
      const response = await api.post("/api/user/changepassword", data, {
        withCredentials: true,
      });
      console.log(response.data);
      seterror(response.data.message);
    } catch (error) {
      console.log(error);
      seterror(error.response.data.message);
    } finally {
      setloading(false);
      setTimeout(() => {
        seterror("");
      }, 3000);
    }
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
              htmlFor="oldpassword"
            >
              Current Password
            </label>
          </div>
          <div className="md:w-2/3 flex flex-col">
            <input
              {...register("oldpassword", { required: true, minLength: 8 })}
              className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 `}
              id="oldpassword"
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
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 text-2xl"
              htmlFor="newpassword"
            >
              New Password
            </label>
          </div>
          <div className="md:w-2/3 flex flex-col">
            <input
              {...register("newpassword", { required: true })}
              className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500`}
              id="new password"
              placeholder="********"
              type="password"
            />
            <h4>
              {errors.newpassword && (
                <span className="text-red-500">This field is required</span>
              )}
            </h4>
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 text-2xl"
              htmlFor="confirmpassword"
            >
              Confirm Password
            </label>
          </div>
          <div className="md:w-2/3 flex flex-col">
            <input
              {...register("confirmpassword", {
                required: true,
                minLength: 8,
              })}
              className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 `}
              id="confirmpassword"
              placeholder="********"
              type="password"
            />
            <h4>
              {errors.confirmpassword && (
                <span className="text-red-500 ">This field is required</span>
              )}
            </h4>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button
            className={`shadow bg-purple-500 cursor-pointer hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:hover:bg-purple-500`}
            disabled={
              errors.oldpassword || errors.newpassword || errors.confirmpassword
            }
            type="submit"
          >
            <h3>Save</h3>
          </button>
        </div>
      </form>
      {error && (
        <div
          className={`text-white p-4 rounded-lg mt-4 ${
            error === "Password changed successfully"
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
