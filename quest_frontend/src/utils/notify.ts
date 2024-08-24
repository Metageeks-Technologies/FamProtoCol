import { toast,Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Initialize the toast container, typically at the root of your app
type NotifyType = "default" | "success" | "error" | "warn" | "info" | "custom";
type NotifyMessage = string;

export const notify = (type: NotifyType, message: NotifyMessage) => {
  switch (type) {
    case "default":
      toast(message,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      break;
    case "success":
      toast.success(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      break;
    case "error":
      toast.error(message, {
        position: "top-center",
      });
      break;
    case "warn":
      toast.warn(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
      });
      break;
    case "info":
      toast.info(message, {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      break;
    case "custom":
      toast(message, {
        position: "bottom-right",
        className: 'foo-bar'
      });
      break;
    default:
      toast(message);
  }
};
