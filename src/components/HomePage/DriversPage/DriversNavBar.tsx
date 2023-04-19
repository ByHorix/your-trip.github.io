import {Nav} from "react-bootstrap";
import React from "react";
import {useNavigate} from "react-router-dom";

const DriversNavBar = () => {
    const navigate = useNavigate();

    return (
        <Nav className="justify-content-end flex-grow-1 pe-3">
            <Nav.Link onClick={() => navigate('/trips')}>
                Мои поездки
            </Nav.Link>
            <Nav.Link onClick={() => navigate('/home/workdays')}>
                Выбрать рабочие дни
            </Nav.Link>
        </Nav>
    );
};

export default DriversNavBar;
