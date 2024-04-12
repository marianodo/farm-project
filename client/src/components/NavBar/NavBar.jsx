import { Link } from 'react-router-dom';
import './navBar.css';

const NavBar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg bg-primary mb-3"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        {/* <!-- Logo a la izquierda --> */}
        <Link className="navbar-brand" to="/">
          <img src="ruta-al-logo.png" alt="Logo" />
        </Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* <!-- Items a la derecha --> */}
            <li className="nav-item">
              <Link className="nav-link" to="/register">
                Register
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
