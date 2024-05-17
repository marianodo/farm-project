import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import { Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import CreateField from "./components/Forms/CreateField/CreateField";
import CreatePen from "./components/Forms/CreatePen/CreatePen";
import NavBar from "./components/NavBar/NavBar";
import NewPen from "./components/Forms/NewPen/NewPen";
import NewReport from "./components/Forms/NewReport/NewReport";
import ReportDetail from "./components/Forms/ReportDetail/ReportDetail";
import Reports from "./components/Forms/Reports/Reports";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const messageToast = (message, type, redirection) => {
    if (type === "success") {
      toast.success(message, {
        position: "top-right",
        autoClose: 1200,
      });
      if (redirection !== "" && redirection !== undefined) {
        return navigate(redirection);
      }
    } else {
      toast.error(message, {
        position: "top-right",
        autoClose: 1200,
      });
    }
  };

  return (
    <div className="container p-4">
      <NavBar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<CreateField messageToast={messageToast} />} />
        <Route exact path="/pen" element={<CreatePen />} />
        <Route
          exact
          path="/newPen/:field/:id"
          element={<NewPen messageToast={messageToast} />}
        />
        <Route
          exact
          path="/reportMeasurement/:fieldId/:reportId"
          element={<NewReport messageToast={messageToast} />}
        />
        <Route
          exact
          path="/reports/:fieldId"
          element={<Reports messageToast={messageToast} />}
        />
        <Route
          exact
          path="/reportDetail/:fieldId/:reportId"
          element={<ReportDetail messageToast={messageToast} />}
        />
      </Routes>
    </div>
  );
}

export default App;
