import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAuthCheck() {
  const navigate = useNavigate();

  useEffect(() => {
    const localStorageUserStatus = window.localStorage.getItem("loginStatus");
    if (localStorageUserStatus === "false" || localStorageUserStatus === null) {
      navigate("/");
    }
  }, [navigate]);
}
