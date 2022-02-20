import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import logo from "../../images/icon-above-font.svg";
import { isLogged, login } from "../../_utils/auth/auth.functions";
import { userConnected } from "../../_utils/toasts/users";

const LoginForm = ({ onLogin }) => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const history = useHistory();
  const Error = document.querySelector(".error");

  useEffect(() => {
    if (history && isLogged()) {
      history.push("/");
    }
  }, [history]);

  const sendData = async (e) => {
    e.preventDefault();
    const response = await login(emailValue, passwordValue);

    if (response.status === 401) {
      Error.innerHTML =
        '<div class="alert alert-danger"> Email ou mot de passe incorrect </div>';
    }
    if (response.status === 400) {
      Error.innerHTML =
        '<div class="alert alert-danger"> Renseigner tout les champs </div>';
    }
    if (response.status === 402) {
      Error.innerHTML =
        '<div class="alert alert-danger"> Compte bloqué, revenez dans 15 min </div>';
    }

    if (response.status === 401) {
      Error.innerHTML =
        '<div class="alert alert-danger"> Email ou mot de passe incorrect </div>';
    }
    if (response.status === 200) {
      history.push("/");

      onLogin();
      userConnected();
    }
  };

  return (
    <div className="row mx-auto justify-content-center w-50 h-100">
      <form
        action=""
        onSubmit={sendData}
        id="login-form"
        className="mx-auto justify-content-center w-50 h-100"
      >
        <img src={logo} alt="" className=" img-fluid rounded mx-auto" />

        <div className="error"></div>

        <div className="">
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
        <div className="email error"></div>
        <div className="">
          <label htmlFor="exampleInputPassword1" className="form-label mb-3">
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
        <div className="password error"></div>

        <div className="d-flex justify-content-between flex-wrap mt-2">
          <button type="submit" className="btn btn-primary">
            Connexion
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
