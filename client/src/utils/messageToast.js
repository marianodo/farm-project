import { toast } from "react-toastify";

// import { useNavigate } from "react-router-dom";
//   const navigate = useNavigate();

const messageToast = (message, type, redirection, navigate) => {
  if (type === "success") {
    toast.success(message, {
      position: "top-right",
      autoClose: 1200,
    });
    if (redirection !== "" && redirection !== undefined) {
      //   const navigate = useNavigate();
      setTimeout(() => {
        return navigate(redirection);
      }, 1000);
    }
  } else {
    toast.error(message, {
      position: "top-right",
      autoClose: 1200,
    });
  }
};

export default messageToast;
