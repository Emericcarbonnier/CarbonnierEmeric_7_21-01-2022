import { useHistory } from "react-router-dom";
import logo from "../../images/icon.png";
import { logout } from "../../_utils/auth/auth.functions";
import {getIdFromCookie} from "../../_utils/auth/auth.functions";

const LoggedHeader = ({ onLogout }) => {
  const idFromCookie = getIdFromCookie();
  let history = useHistory();

  const onClickLogout = (e) => {
    e.preventDefault();
    logout();
    onLogout();
    history.push("/");
  };

  return (
    <header className="container-fluid p-0">
      <nav className="d-flex align-items-center navbar-light bg-light navbar-expand-lg justify-content-between px-5">
        <a className="navbar-brand" href="/">
          <img
            src={logo}
            width={80}
            height={80}
            alt="logo of the company Groupomania"
          />
        </a>

        <div>
          <a className="navbar-brand" href={"/account/" + idFromCookie}>
            Compte
          </a>
          <a className="navbar-brand" href="/login" onClick={onClickLogout}>
            Déconnexion
          </a>
        </div>
      </nav>
    </header>
  );
};

export default LoggedHeader;
