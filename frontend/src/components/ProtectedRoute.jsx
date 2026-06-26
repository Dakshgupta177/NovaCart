import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = () => {
    const isAuthenticated = useSelector((state) => state.auth.status);
    const isLogined = useSelector((state) => state.auth.isLoading);
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthenticated && !isLogined) {
            navigate("/user/signup");
        }
    },[isAuthenticated, isLogined]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default ProtectedRoute;
