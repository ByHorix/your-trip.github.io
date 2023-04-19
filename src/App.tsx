import React from 'react';
import LoginPage from "./components/LoginPage/LoginPage";
import './index.scss';
import RegisterPage from "./components/RegisterPage/RegisterPage";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import SetWorkDays from "./components/HomePage/DriversPage/SetWorkDays";
import HomePageLayer from "./components/HomePage/HomePageLayer/HomePageLayer";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<Navigate replace to="/home"/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/home/*" element={<HomePage/>}/>
            </Routes>
        </BrowserRouter>
    );

}

export default App;
