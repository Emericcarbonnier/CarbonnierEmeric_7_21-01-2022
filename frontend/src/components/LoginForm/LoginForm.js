import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import logo from "../../images/icon-left-font-monochrome-white.png";
import { isLogged, login } from "../../_utils/auth/auth.functions";
import { userConnected } from "../../_utils/toasts/users";

const LoginForm = ({ onLogin }) => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (history && isLogged()) {
      history.push("/");
    }
  }, [history]);

  const sendData = async (e) => {
    e.preventDefault();
    const response = await login(emailValue, passwordValue);
    if (response.status === 401) {
      setErrorMessage("Email ou mot de passe incorrect");
    }
    if (response.status === 400) {
      setErrorMessage("Renseigner tout les champs");
    }
    if (response.status === 200) {
      history.push("/");
      onLogin();
      userConnected();
    }
  };

  return (
    <section className="row mx-auto justify-content-center w-50">
      <div className="card col-11 bg-secondary">
        <img src={logo} alt="" className="mx-auto w-50" />
        <div className="card-body">
        <h1 className="h5 card-title text-center mb-4 text-white fw-bold">Connexion</h1>
          <form
            action=""
            onSubmit={sendData}
            id="login-form"
            className="mx-auto"
          >
            {errorMessage !== "" ? (
              <div className="alert alert-danger">{errorMessage}</div>
            ) : (
              ""
            )}
            <div className="fw-bold">
              <label htmlFor="exampleInputEmail1" className="form-label mb-3">
                Email
              </label>
              <input
                type="email"
                className="form-control mb-3"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                value={emailValue}
                onChange={(event) => setEmailValue(event.target.value)}
              />
            </div>
            <div className="fw-bold">
              <label
                htmlFor="exampleInputPassword1"
                className="form-label mb-3"
              >
                Mot de passe
              </label>
              <input
                type="password"
                className="form-control mb-5"
                id="exampleInputPassword1"
                value={passwordValue}
                onChange={(event) => setPasswordValue(event.target.value)}
              />
            </div>
            <div className="d-flex justify-content-between flex-wrap">
              <button type="submit" className="btn btn-primary">
                Connexion
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
