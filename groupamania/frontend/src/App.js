import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/signin" exact element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;