import React from "react";
import {Route, Routes} from "react-router-dom";
import DriversHomePage from "./DriversHomePage";
import SetWorkDays from "./SetWorkDays";

const DriversHomePageLayer: React.FC = () => {
    return (<Routes>
        <Route path="/" element={<DriversHomePage/>}/>
        <Route path="/workdays" element={<SetWorkDays/>}/>
    </Routes>)
}

export default DriversHomePageLayer;
