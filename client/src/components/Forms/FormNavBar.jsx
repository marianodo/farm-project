import { Link } from 'react-router-dom';

const FormNavBar = () => {
  return (
    <div className="container mb-3">
      <h1>Formularios</h1>
      {/* <!-- Enlaces a los diferentes formularios --> */}
      <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
        <Link to="/field" className="btn btn-primary">
          Create field
        </Link>
        <Link to="/variable" className="btn btn-primary">
          Create Variable
        </Link>
        <Link to="/pen" className="btn btn-primary">
          Create Pen
        </Link>
        <Link to="/measurement" className="btn btn-primary">
          Generate Medicion
        </Link>
      </div>
    </div>
  );
};

export default FormNavBar;
