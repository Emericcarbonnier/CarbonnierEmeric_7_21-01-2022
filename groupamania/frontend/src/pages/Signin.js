import React from "react";
import img2 from "../img/icon-left-font-monochrome-black.svg";


const Signin = () => {
  return (
    <div>
        
      <form class="w-25 m-auto mh-100 position-absolute top-50 start-50 translate-middle">
      <img src={img2} alt="" className='w-100 d-inline-block mb-5 mt-5'/>
        <div class="mb-3">
          <label for="validationServer01" class="form-label">
            Prénom
          </label>
          <input
            type="text"
            class="form-control"
            placeholder="Prénom"
            aria-label="Prénom"
            aria-describedby="basic-addon1"
            required
          />
        </div>
        <div class="mb-3">
          <label for="validationServer02" class="form-label">
            Nom
          </label>
          <input
            type="text"
            class="form-control"
            placeholder="Nom"
            aria-label="LastName"
            aria-describedby="basic-addon1"
            required
          />
        </div>
        <div class="mb-3">
          <label for="validationServerUsername" class="form-label">
            Nom d'utilisateur
          </label>
          <div class="input-group has-validation">
            <input
              type="text"
              class="form-control"
              placeholder="Nom d'utilisateur"
              aria-label="Username"
              aria-describedby="basic-addon1"
              required
            />
            <div id="validationServerUsernameFeedback" class="invalid-feedback">
              Please choose a username.
            </div>
          </div>
        </div>
        <div>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">
             Adresse e-mail
            </label>
            <input
              type="email"
              class="form-control"
              id="exampleInputEmail1"
              placeholder="Email@exemple.com"
              aria-describedby="emailHelp"
              required
            />
            <div id="emailHelp" class="form-text">
            Nous ne partagerons jamais votre e-mail avec quelqu'un d'autre.
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label for="inputPassword5" class="form-label">
            Mot de passe
          </label>
          <input
            type="password"
            id="inputPassword5"
            class="form-control"
            aria-describedby="passwordHelpBlock"
            required
          />
          <div id="passwordHelpBlock" class="form-text">
          Votre mot de passe doit être composé de 8 à 20 caractères, contenir des lettres et chiffres et ne doivent pas contenir d'espaces, de caractères spéciaux .
          </div>
        </div>
        <div class="d-flex justify-content-between flex-wrap">
          <button class="btn btn-primary" type="submit">
            S'inscrire
          </button>
          <p class='fs-5'>Vous avez déjà un compte ? <a href='/' class="pe-auto fs-5">Connexion</a></p>
        </div>
      </form>
    </div>
  );
};

export default Signin;
