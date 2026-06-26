import React, { useState } from "react";
import { FormOne } from "./profileForms/editProfileForm";
import { FormTwo } from "./profileForms/changePasswordForm";
import { ChangeAvatar } from "./profileForms/changeAvatar";
import { DeleteProfile } from "./profileForms/deleteUserProfile";
import { ChangeAddress } from "./profileForms/ChangeAddress";
import { EditAddressForm } from "./profileForms/editAddressForm";

const Profile = () => {
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  return (
    <div className="flex ">
      {showAddressPopup && <ChangeAddress setShowAddressPopup={setShowAddressPopup} />}
      <div className="min-h-screen w-1/3 bg-gray-400 dark:bg-neutral-900 text-center max-md:hidden lg:flex flex-col justify-center items-center">
        <div className=" h-96 flex justify-center items-center flex-col my-10">
          <h3 className="font-bold text-2xl my-2">Personal Information</h3>
          <p className="font-medium text-xl dark:text-gray-100">
            Use a permanent address where you can receive mail.
          </p>
        </div>
        <div className=" h-96 flex justify-center items-center flex-col mt-30">
          <h3 className="font-bold text-2xl my-2">Change Address</h3>
          <p className="font-medium text-xl dark:text-gray-100">
            Update your address associated with your account.
          </p>
        </div>
        <div className=" h-96 flex justify-center items-center flex-col mt-40">
          <h3 className="font-bold text-2xl my-2">Change Password</h3>
          <p className="font-medium text-xl dark:text-gray-100">
            Update your password associated with your account.
          </p>
        </div>
        <div className=" h-96 flex justify-center items-center flex-col mt-20">
          <h3 className="font-bold text-2xl my-2">Delete Account</h3>
          <p className="font-medium text-xl dark:text-gray-100">
            No longer want to use our service? You can delete your account here.
            This action is not reversible. All information related to this
            account will be deleted permanently.
          </p>
        </div>
      </div>
      <div className="min-h-screen w-2/3 flex justify-center dark:bg-zinc-950 max-md:w-full">
        <div className="min-h-[90vh] w-screen dark:bg-zinc-950 flex flex-col items-center">
          <h2 className="font-bold text-3xl my-6">Personal Information</h2>
          <ChangeAvatar />
          <FormOne />
          <div className="h-px bg-gray-900 z-10 w-full my-20"></div>
           <EditAddressForm/>
            <div className="h-px bg-gray-900 z-10 w-full my-20"></div>
          <div className="flex items-center mb-6 min-h-40 gap-4 flex-col">
            <h2 className="font-bold text-3xl ">Change Password</h2>
            <FormTwo />
          </div>
          <div className="h-px bg-gray-900 z-10 w-full my-20"></div>
          <DeleteProfile />
        </div>
      </div>
    </div>
  );
};

export default Profile;
