import React, { useState } from "react";
import img3 from "../img/icon-above-font.svg";
const axios = require ('axios')

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const emailError = document.querySelector(".emailerror");
    const passwordError = document.querySelector(".passworderror");

    axios({
      method: "post",
      url:'http://localhost:8080/api/users/login',

      data:{
        email,
        password,
      }
    })
    .then((res) => {
      console.log(res);
      if (res === 404) {
        emailError.innerHTML = 'email invalide';}
      if (res === 403) {
        passwordError.innerHTML = 'MDP invalide';
     
      } else {
        window.location = "/home";
      }
    })
  };

  return (
    <div>
      <form
        action=""
        onSubmit={handleLogin}
        id="login-form"
        className="w-15 position-absolute top-50 start-50 translate-middle"
      >
        <img src={img3} alt="" className="w-100" />
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Nom d'utilisateur
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />

        </div>
        <div className="emailerror"></div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Mot de passe
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

        </div>

        <div className="passworderror"></div>

        <div className="d-flex justify-content-between flex-wrap mt-5">
          <button type="submit" className="btn btn-primary">
            Connexion
          </button>
          <p>
            <a href="/Signin" className="pe-auto fs-4">
              Inscription
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Home;
