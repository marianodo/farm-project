import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import { Route, Routes } from "react-router-dom";

import CreateField from "./components/Forms/CreateField/CreateField";
import EditPen from "./components/Forms/EditPen/EditPen";
import NavBarr from "./components/NavBar/NavBarr";
import NewPen from "./components/Forms/NewPen/NewPen";
import NewReport from "./components/Forms/NewReport/NewReport";
import ReportDetail from "./components/Forms/ReportDetail/ReportDetail";
import Reports from "./components/Forms/Reports/Reports";

// import CreatePen from "./components/Forms/CreatePen/CreatePen";

// import { ToastContainer } from "react-toastify";

// import NavBar from "./components/NavBar/NavBar";

function App() {
  return (
    <div className="container p-4">
      <NavBarr />
      <Routes>
        <Route path="/" element={<CreateField />} />
        {/* <Route exact path="/pen" element={<CreatePen />} /> */}
        <Route exact path="/newPen/:field/:id" element={<NewPen />} />
        <Route
          exact
          path="/reportMeasurement/:fieldId/:reportId"
          element={<NewReport />}
        />
        <Route exact path="/reports/:fieldId" element={<Reports />} />
        <Route
          exact
          path="/reportDetail/:fieldId/:reportId"
          element={<ReportDetail />}
        />
        <Route exact path="/editPen/:penId" element={<EditPen />} />
      </Routes>
    </div>
  );
}

export default App;
