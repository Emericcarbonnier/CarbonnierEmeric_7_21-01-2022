import React from 'react';
import img3 from '../img/icon-above-font.svg'



const Home = () => {
    return (
        <div>
             <form className='w-15 position-absolute top-50 start-50 translate-middle'>
             <img src={img3} alt="" className='w-100'/>
  <div className="mb-3">
    <label htmlFor="exampleInputEmail1" className="form-label">Nom d'utilisateur</label>
    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputPassword1" className="form-label">Mot de passe</label>
    <input type="password" className="form-control" id="exampleInputPassword1" />
  </div>
  <div className="mb-3 form-check">
    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
    <label className="form-check-label" htmlFor="exampleCheck1">Rester connecté</label>
  </div>
  <div className='d-flex justify-content-between flex-wrap mt-5'>

  <button type="submit" className="btn btn-primary">Connexion</button>
  <p><a href='/Signin' className="pe-auto fs-4">Inscription</a></p>
  </div>

</form>
           
        </div>
    );
};

export default Home;
