import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../store/authSlice";
import api from "../../../utils/api";

export const ChangeAvatar = () => {
  const user = useSelector((state) => state.auth);
  const [message, setMessage] = useState("");
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();

  const fileSubmit = async () => {
    setloading(true);
    try {
      const file = document.getElementById("file").files[0];
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await api.post("/api/user/edituseravatar", formData, {
        withCredentials: true,
      });

      console.log(response);
      dispatch(login({ userData: response.data.data }));
      setMessage(response?.data?.message);
    } catch (error) {
      setMessage(error.response.data.message || "Error uploading avatar");
      console.log(error);
    } finally {
      setloading(false);
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  return (
    <>
      <div className="flex items-center mb-6 min-h-40 gap-4">
        {loading ? (
          <img
            src="https://i.gifer.com/ZKZg.gif"
            className="size-12 fixed top-1/2 left-1/2 "
            alt="Loading..."
          />
        ) : null}
        <img
          src={`${user.userData?.avatar}`}
          alt=""
          className="rounded-lg size-28"
        />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="file"
          name="avatar"
          onChange={fileSubmit}
        />
        <label
          className="font-semibold text-xl cursor-pointer bg-neutral-600 text-white hover:bg-neutral-400 p-4 py-2 rounded-lg max-sm:text-lg h-12"
          htmlFor="file"
        >
          Change Avatar
        </label>
      </div>
      {message && (
        <div
          className={`p-4 mb-4 text-sm ${
            message.includes("not")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          } rounded-lg`}
        >
          {message}
        </div>
      )}
    </>
  );
};
