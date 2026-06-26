import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../utils/api";

const Signup = () => {
  const [submit, setsubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState("something went wrong");
  const [isSignin, setisSignin] = useState(false);
  const navigate = useNavigate();
  const isLogined = useSelector((state) => state.auth.status);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const closePopup = () => {
    setsubmit(false);
  };

  const fields = [
    {
      name: "fullName",
      title: "Full Name",
      errors: errors.fullName,
      placeholder: "eg. John Doe",
      errorMessage: "Should be at least 3 characters",
    },
    {
      name: "username",
      title: "Username",
      errors: errors.username,
      placeholder: "eg. johndoe123",
      errorMessage: "Should be at least 3 characters",
    },
    {
      name: "email",
      title: "Email",
      errors: errors.email,
      placeholder: "eg. example@gmail.com",
      errorMessage: "Should be a valid email",
    },
    {
      name: "password",
      title: "Password",
      errors: errors.password,
      placeholder: "********",
      errorMessage: "Should be at least 8 characters",
    },
  ];

  useEffect(() => {
    if (isLogined) {
      navigate("/");
    }
  }, [isLogined]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const dat = await api.post("/api/user/signup", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      seterror(dat.data.message);
      setisSignin(true);
      setsubmit(true);
      setLoading(false);
    } catch (error) {
      setsubmit(true);
      setLoading(false);
      console.log("Response", error.response.data);
      seterror(error.response.data.message || "something went wrong");
    }
  };

  return submit ? (
    <div className="h-[90vh] flex items-center justify-center dark:bg-zinc-950">
      {loading && (
        <img
          src="https://i.gifer.com/ZKZg.gif"
          className="size-12 fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
          alt="Loading..."
        />
      )}
      <div className="h-96 max-sm:h-60 w-[60vw] bg-neutral-800 flex justify-around items-center flex-col rounded-2xl text-white">
        <h4 className="font-bold text-4xl text-center max-sm:text-2xl">
          {error}
        </h4>
        <div className="flex gap-12">
          <button
            className={`font-bold max-sm:text-lg text-2xl bg-green-500 p-4 py-2 rounded-full ${
              isSignin ? "" : "hidden"
            }`}
          >
            <Link to={"/user/login"}>Login</Link>
          </button>
          <button
            onClick={closePopup}
            className="font-bold text-2xl bg-green-500 p-4 py-2 rounded-full max-sm:text-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-[90vh] dark:bg-zinc-950 flex flex-col items-center">
      <h1 className="text-4xl my-16 font-extrabold text-zinc-800 dark:text-white">
        Signup User
      </h1>
      <form
        className="w-full max-w-sm mx-auto flex flex-col px-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        {fields.map((i) => (
          <div key={i.name}>
            <div className="md:flex md:items-center mt-6">
              <div className="md:w-1/3 ">
                <label
                  className="block text-gray-600 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor={i.name}
                >
                  {i.title}
                </label>
              </div>
              <div className="md:w-2/3 flex flex-col">
                <input
                  {...register(i.name, {
                    minLength: i.name === "password" ? 8 : 3,
                    pattern: i.name === "email" ? /^\S+@\S+$/i : undefined,
                    required: true,
                  })}
                  placeholder={i.placeholder}
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id={i.name}
                  type={i.name == "password" ? "password" : "text"}
                />
              </div>
            </div>
            <h4 className="mt-1 text-center">
              {i.errors && (
                <span className="text-red-500 ">{i.errorMessage}</span>
              )}
            </h4>
          </div>
        ))}
        <div className="flex items-center justify-center mt-6">
          <button
            className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
