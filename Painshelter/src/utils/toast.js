import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const toastAlert = (status, text, time) => {
  toast[status](text, {
    position: "top-center",
    autoClose: time,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};
