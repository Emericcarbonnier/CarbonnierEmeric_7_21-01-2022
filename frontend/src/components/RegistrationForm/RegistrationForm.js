import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import logo from "../../images/icon-left-font-monochrome-white.png";
import { userRegistered } from "../../_utils/toasts/users";
import { REGEX, signup } from "../../_utils/auth/auth.functions";

const RegistrationForm = () => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [firstnameValue, setFirstnameValue] = useState("");
  const [surnameValue, setSurnameValue] = useState("");
  const history = useHistory();

  const SendData = async (e) => {
    e.preventDefault();

    const response = await signup(
      firstnameValue,
      surnameValue,
      emailValue,
      passwordValue
    );
    if (response.ok) {
      // Redirection
      userRegistered();
      history.push("/");
    }
  };

  return (
    <section className="row mx-auto justify-content-center w-50">
      <div className="card col-11 bg-secondary">
        <img
          className="mx-auto mt-0 w-50"
          src={logo}
          alt="logo of the company Groupomania"
        />
        <div className="card-body">
          <h1 className="h5 card-title text-center mb-4 fw-bold text-white">Créer un compte</h1>

          <form onSubmit={SendData}>
            <div className="form-group">
              <label className='fw-bold mb-2' htmlFor="nom">Nom</label>
              <input
                id="nom"
                name="nom"
                type="text"
                className="form-control mb-3"
                placeholder="Nom"
                value={firstnameValue}
                required
                pattern={REGEX.NAME_REGEX}
                onChange={(event) => setFirstnameValue(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label className='fw-bold mb-2' htmlFor="prenom">Prénom</label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                className="form-control mb-3"
                placeholder="Prénom"
                value={surnameValue}
                required
                pattern={REGEX.SURNAME_REGEX}
                onChange={(event) => setSurnameValue(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label className='fw-bold mb-2' htmlFor="email">Adresse email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control mb-3"
                aria-describedby="emailHelp"
                placeholder="email@exemple.com"
                value={emailValue}
                required
                onChange={(event) => setEmailValue(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label className='fw-bold mb-2' htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control mb-3"
                placeholder="Password"
                value={passwordValue}
                required
                pattern={REGEX.PASSWORD_REGEX}
                onChange={(event) => setPasswordValue(event.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
