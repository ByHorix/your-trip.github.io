import React from 'react';
import LoginPage from "./components/LoginPage/LoginPage";
import './index.scss';
import RegisterPage from "./components/RegisterPage/RegisterPage";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="*" element={<Navigate replace to="/home"/>}/>
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/register" element={<RegisterPage/>}/>
              <Route path="/home" element={<HomePage/>}/>
          </Routes>
      </BrowserRouter>
    // <LoginPage/>
  );

}

export default App;
