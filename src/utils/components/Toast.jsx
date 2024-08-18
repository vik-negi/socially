import { toast } from "react-toastify";

class CToast {
  static success = (text) =>
    toast.success(text, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      pauseOnHover: true,
      progress: undefined,
      theme: "light",
    });
  static error = (text) =>
    toast.error(text, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      pauseOnHover: true,
      progress: undefined,
      theme: "light",
    });
}

export default CToast;
