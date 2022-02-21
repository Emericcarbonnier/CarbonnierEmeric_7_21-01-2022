import React from "react";
import {
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header/Header";
import LoggedHeader from "./components/Header/LoggedHeader";
import LoginForm from "./components/LoginForm/LoginForm";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
import {isLogged} from "./_utils/auth/auth.functions";
import MessagesContainer from "./components/Messages/MessagesContainer";
import { ToastContainer} from 'react-toastify';
import AccountContainer from "./components/Account/AccountContainer";
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(isLogged())
  

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  return (
    
    <React.Fragment>

    <ToastContainer position="top-center"/>
    

    {isLoggedIn ? <LoggedHeader onLogout={handleLogout} /> : <Header />}
 
    <Switch>


      <Route path="/" exact>
      {isLoggedIn ? <MessagesContainer messageQuery="getMessages" postMessage={true} />  : <Redirect to="/login" />}
      </Route>


      <Route path="/login">
        <LoginForm onLogin={handleLogin} />
      </Route>

 
      <Route path="/signup" component={RegistrationForm} />

      <Route path="/account/:id" exact>
      {isLoggedIn ? <AccountContainer onLogout={handleLogout} />: <Redirect to="/login" />}
      </Route>


      <Route path="/account/:id/edit" exact>
      {isLoggedIn ? <AccountContainer onLogout={handleLogout} editor={true} />: <Redirect to="/login" />}
      </Route>


      <Route path="/messages/:id" exact>
      {isLoggedIn ? <MessagesContainer messageQuery="getOneMessage" />  : <Redirect to="/login" />}
      </Route>

    </Switch>
  </React.Fragment>
  );
};

export default App;
