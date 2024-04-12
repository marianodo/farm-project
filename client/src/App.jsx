import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './views/Home/Home';
import NavBar from './components/NavBar/NavBar';
// import FormNavBar from './components/Forms/FormNavBar';
import CreateField from './components/Forms/CreateField/CreateField';
import CreateVariable from './components/Forms/CreateVariable/CreateVariable';
import CreatePen from './components/Forms/CreatePen/CreatePen';
import CreateMeasurement from './components/Forms/CreateMeasurement/CreateMeasurement';
import NewPen from './components/Forms/NewPen/NewPen';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const messageToast = (message, type) => {
    if (type === 'success') {
      toast.success(message, {
        position: 'top-right',
        autoClose: 1200,
      });
    } else {
      toast.error(message, {
        position: 'top-right',
        autoClose: 1200,
      });
    }
  };

  return (
    <div className="container p-4">
      <NavBar />
      {/* <FormNavBar /> */}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          exact
          path="/field"
          element={<CreateField messageToast={messageToast} />}
        />
        <Route exact path="/variable" element={<CreateVariable />} />
        <Route exact path="/pen" element={<CreatePen />} />
        <Route
          exact
          path="/newPen/:field/:id"
          element={<NewPen messageToast={messageToast} />}
        />
        <Route exact path="/measurement/:id" element={<CreateMeasurement />} />
      </Routes>
    </div>
  );
}

export default App;
