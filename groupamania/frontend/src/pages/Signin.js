import React from "react";
import img2 from "../img/icon-left-font-monochrome-black.svg";


const Signin = () => {
  return (
    <div>
        
      <form className="w-25 m-auto mh-100 position-absolute top-50 start-50 translate-middle">
      <img src={img2} alt="" className='w-100 d-inline-block mb-5 mt-5'/>
        <div className="mb-3">
          <label htmlFor="validationServer01" className="form-label">
            Prénom
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Prénom"
            aria-label="Prénom"
            aria-describedby="basic-addon1"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="validationServer02" className="form-label">
            Nom
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Nom"
            aria-label="LastName"
            aria-describedby="basic-addon1"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="validationServerUsername" className="form-label">
            Nom d'utilisateur
          </label>
          <div className="input-group has-validation">
            <input
              type="text"
              className="form-control"
              placeholder="Nom d'utilisateur"
              aria-label="Username"
              aria-describedby="basic-addon1"
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
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Email@exemple.com"
              aria-describedby="emailHelp"
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
            type="password"
            id="inputPassword5"
            className="form-control"
            aria-describedby="passwordHelpBlock"
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
      </form>
    </div>
  );
};

export default Signin;
