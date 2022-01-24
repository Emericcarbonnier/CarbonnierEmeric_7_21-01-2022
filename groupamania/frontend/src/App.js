import React from 'react';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import Error from "./pages/Error"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/home" element={<Home />} />
        <Route path ='*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;