import React from "react";
import { useDispatch } from "react-redux";
import { updateData } from "../../../store/authSlice";
import { useForm } from "react-hook-form";
import api from "../../../utils/api";

export const ChangeAddress = ({setShowAddressPopup}) => {
  const dispatch = useDispatch();
  const [error, setError] = React.useState("");
  const [loading, setloading] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setloading(true);
    try {
        console.log(data);
        
      const response = await api.post("/api/user/updateaddress", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      dispatch(updateData({ userData: response.data.user }));
      setError(response.data.message);
      setTimeout(() => {
        setShowAddressPopup(false);
      }, 3000);
    } catch (error) {
      console.log(error);
      setError("Error updating address");
    } finally {
      setloading(false);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };
  return (
    <div
      className={`fixed bottom-0 w-full p-10 bg-black text-white bg-opacity-50 flex items-center justify-center z-50`}
    >
      {loading && (
        <img
          src="https://i.gifer.com/ZKZg.gif"
          className="size-12 fixed top-1/2 left-1/2 z-50"
          alt="Loading..."
        />
      )}
      <form
        className="p-6 rounded-lg w-[90%] max-w-md shadow-lg relative"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-lg font-bold mb-4">Enter Your Address </h2>
        <button
          type="button"
          onClick={() => setShowAddressPopup(false)}
          className="absolute top-4 right-4 text-xl font-bold text-gray-600 cursor-pointer"
        >
          ×
        </button>
        <div className="space-y-2">
          <input
            {...register("phone", {
              required: true,
              pattern: { value: /^[0-9]{10}$/ },
            })}
            minLength={10}
            maxLength={10}
            id="phone"
            placeholder="Phone"
            className="w-full p-2 border rounded"
          />
          <input
            {...register("address", { required: true })}
            id="address"
            placeholder="Address"
            className="w-full p-2 border rounded"
          />
          <input
            {...register("city", { required: true })}
            id="city"
            placeholder="City"
            className="w-full p-2 border rounded"
          />
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
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          className={`mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer  ${
            error === "successfully updated" ? "hidden" : ""
          }`}
          disabled={errors.phone || errors.address || errors.city || errors.pin}
          type="submit"
        >
          Save
        </button>

        <h4>
          {(errors.address || errors.city || errors.pin) && (
            <span className="text-red-500 ">Fill all fields</span>
          )}
        </h4>
        <h4>
          {errors.phone && (
            <span className="text-red-500 ">Enter a correct number</span>
          )}
        </h4>
        <div
          className={`text-white p-4 rounded-lg mt-4 ${error ? "" : "hidden"} ${
            error === "successfully updated" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <p>{error}</p>
        </div>
      </form>
    </div>
  );
};
