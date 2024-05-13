import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 自定义钩子用于检查用户认证状态
export function useAuthCheck() {
  const navigate = useNavigate();

  useEffect(() => {
    const localStorageUserStatus = window.localStorage.getItem("loginStatus");
    if (localStorageUserStatus === "false" || localStorageUserStatus === null) {
      navigate("/");
    }
  }, [navigate]); // 依赖于 navigate 函数
}
