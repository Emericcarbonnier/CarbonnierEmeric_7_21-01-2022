import React from 'react';
import img1 from '../img/icon-left-font-monochrome-black.svg'



const Home = () => {
    return (
        <div>
             <form className='w-25 mx-auto position-absolute top-50 start-50 translate-middle'>
             <img src={img1} alt="" className='w-100 mb-5'/>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Nom d'utilisateur</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Mot de passe</label>
    <input type="password" class="form-control" id="exampleInputPassword1" />
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1" />
    <label class="form-check-label" for="exampleCheck1">Rester connecté</label>
  </div>
  <div className='d-flex justify-content-between flex-wrap mt-5'>

  <button type="submit" class="btn btn-primary">Connexion</button>
  <p><a href='/Signin' class="pe-auto fs-4">Inscription</a></p>
  </div>

</form>
           
        </div>
    );
};

export default Home;
