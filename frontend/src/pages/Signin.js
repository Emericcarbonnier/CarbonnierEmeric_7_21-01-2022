import axios from "axios";
import React, { useState } from "react";
import img2 from "../img/icon-left-font-monochrome-black.svg";
import Login from "./Login";


const Signin = () => {

  const [formSubmit, setFormSubmit] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleRegister = async (e) => {
    e.preventDefault();
    await axios(
      {method: 'post',
      url: 'http://localhost:8080/api/users/register',
      data:{
      firstname,
      lastname,
      username,
      email,
      password,
    }
    }
    )
    .then((res) => {
      console.log(res);
      if (res.data.errors) {

      } else {
        setFormSubmit(true);
      }
    })
    .catch((err) => console.log(err));
};

  return (
    <div>
     {formSubmit ? (
       <>
          <Login />
          <h4 className="success">
            Enregistrement réussi,connecter-vous !
          </h4>
        </>
      ) :( 
    
      <form action='' onSubmit={handleRegister} className="w-25 m-auto mh-100 position-absolute top-50 start-50 translate-middle">
      <img src={img2} alt="" className='w-100 d-inline-block mb-5 mt-5'/>
        <div className="mb-3">
          <label htmlFor="validationServer01" className="form-label">
            Prénom
          </label>
          <input
            name="firstname"
            type="text"
            className="form-control"
            placeholder="Prénom"
            aria-label="Prénom"
            aria-describedby="basic-addon1"
            onChange={(e) => setFirstname(e.target.value)}
            value={firstname}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="validationServer02" className="form-label">
            Nom
          </label>
          <input
          name="lastname"
            type="text"
            className="form-control"
            placeholder="Nom"
            aria-label="LastName"
            aria-describedby="basic-addon1"
            onChange={(e) => setLastname(e.target.value)}
            value={lastname}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="validationServerUsername" className="form-label">
            Nom d'utilisateur
          </label>
          <div className="input-group has-validation">
            <input
            name="username"
              type="text"
              className="form-control"
              placeholder="Nom d'utilisateur"
              aria-label="Username"
              aria-describedby="basic-addon1"
              onChange={(e) => setUsername(e.target.value)}
            value={username}
              required
            />
            <div id="validationServerUsernameFeedback" className="invalid-feedback">
              Please choose a username.
            </div>
          </div>
        </div>
        <div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
             Adresse e-mail
            </label>
            <input
            name="email"
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Email@exemple.com"
              aria-describedby="emailHelp"
              onChange={(e) => setEmail(e.target.value)}
            value={email}
              required
            />
            <div id="emailHelp" className="form-text">
            Nous ne partagerons jamais votre e-mail avec quelqu'un d'autre.
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="inputPassword5" className="form-label">
            Mot de passe
          </label>
          <input
          name="password"
            type="password"
            id="inputPassword5"
            className="form-control"
            aria-describedby="passwordHelpBlock"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <div id="passwordHelpBlock" className="form-text">
          Votre mot de passe doit être composé de 8 à 20 caractères, contenir des lettres et chiffres et ne doivent pas contenir d'espaces, de caractères spéciaux .
          </div>
        </div>
        <div className="d-flex justify-content-between flex-wrap">
          <button className="btn btn-primary" type="submit">
            S'inscrire
          </button>
          <p className='fs-5'>Vous avez déjà un compte ? <a href='/' className="pe-auto fs-5">Connexion</a></p>
        </div>
      </form>)
    };
    </div>
  );
};

export default Signin;
