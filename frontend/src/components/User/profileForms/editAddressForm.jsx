import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { login, updateData } from "../../../store/authSlice";
import api from "../../../utils/api";

export const EditAddressForm = () => {
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
  const [error, setError] = useState("");
  const onSubmit = async (data) => {
    setloading(true);
    try {
      const response = await api.post("/api/user/updateaddress", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      dispatch(updateData({ userData: response.data.user }));
      setError(response.data.message);
      setedit(false);
      reset();
    } catch (error) {
      console.log("Error updating profile");
      setError("Error updating profile");
    } finally {
      setloading(false);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };
  const editAddress = () => {
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
              htmlFor="phone"
            >
              Phone
            </label>
          </div>
          <div className="md:w-2/3 flex flex-col">
            <input
              {...register("phone", {
                required: true,
                pattern: { value: /^[0-9]{10}$/ },
              })}
              minLength={10}
              maxLength={10}
              id="phone"
              placeholder="Phone"
              className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${
                !edit ? "hidden" : ""
              }`}
            />
            <div
              className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full min-w-60 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${
                edit ? "hidden" : ""
              }`}
            >
              {user.userData?.phone}
            </div>
            <h4>
              {errors.phone && (
                <span className="text-red-500 ">This field is required</span>
              )}
            </h4>
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 text-2xl"
              htmlFor="address"
            >
              Address
            </label>
          </div>
          <div className="md:w-2/3 flex flex-col">
            <input
              {...register("address", { required: true })}
              id="address"
              placeholder="Address"
              className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${
                !edit ? "hidden" : ""
              }`}
            />
            <div
              className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full min-w-60 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${
                edit ? "hidden" : ""
              }`}
            >
              {user.userData?.address}
            </div>
            <h4>
              {errors.address && (
                <span className="text-red-500">This field is required</span>
              )}
            </h4>
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 text-2xl"
              htmlFor="city"
            >
              City
            </label>
          </div>
          <div className="md:w-2/3 flex flex-col">
            <input
              {...register("city", { required: true })}
              id="city"
              placeholder="City"
              className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${
                !edit ? "hidden" : ""
              }`}
            />
            <div
              className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full min-w-60 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${
                edit ? "hidden" : ""
              }`}
            >
              {user.userData?.city}
            </div>
            <h4>
              {errors.city && (
                <span className="text-red-500 ">
                  This field is required and should use special char
                </span>
              )}
            </h4>
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 text-2xl"
              htmlFor="pin"
            >
              PIN
            </label>
          </div>
          <div className="md:w-2/3 flex flex-col">
            <input
              {...register("pin", {
                required: true,
                pattern: {
                  value: /^[1-9][0-9]{5}$/,
                  message: "Enter a valid 6-digit PIN code",
                },
              })}
              maxLength={6}
              inputMode="numeric"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
              id="pin"
              placeholder="PIN Code"
              className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${
                !edit ? "hidden" : ""
              }`}
            />
            <div
              className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full min-w-60 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${
                edit ? "hidden" : ""
              }`}
            >
              {user.userData?.pin}
            </div>
            <h4>
              {errors.pin && (
                <span className="text-red-500 ">This field is required</span>
              )}
            </h4>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button
            className={`shadow bg-purple-500 hover:bg-purple-400 cursor-pointer focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded ${
              !edit ? "hidden" : ""
            } disabled:opacity-50 disabled:hover:bg-purple-500`}
            disabled={
              errors.phone || errors.address || errors.city || errors.pin
            }
            type="submit"
          >
            <h3>Save</h3>
          </button>
          <div
            className={`shadow bg-purple-500 hover:bg-purple-400 cursor-pointer focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded ${
              edit ? "hidden" : ""
            }`}
            onClick={editAddress}
          >
            <h3>Edit Address</h3>
          </div>
        </div>
      </form>
      {error && (
        <div
          className={`text-white p-4 rounded-lg mt-4 ${
            error === "successfully updated"
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
