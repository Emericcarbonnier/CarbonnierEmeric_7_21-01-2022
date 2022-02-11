import logo from "../../images/icon.png";

const Header = () => {
  return (
    <header className="container-fluid p-0">
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand" href="/">
          <img
            src={logo}
            width={80}
            height={80}
            alt="logo of the company Groupomania"
            className="d-inline-block align-text"
          />
          Groupomania
        </a>
        <ul className="nav justify-content-end">
          <li className="nav-item fs-1">
            <a className="nav-link" aria-current="page" href="/signup">
              Créer un compte
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/login">
              Connexion
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
