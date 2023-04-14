import React from "react";
import {app} from '../../config/firebaseConfig';
import {getAuth} from "firebase/auth";

const HomePage: React.FC = () => {
    const auth = getAuth(app);
    console.log(auth);
    return (
        <div>HELLO</div>
    );
};

export default HomePage;
