import React, {useContext, useState} from "react";
import Calendar from "react-calendar";
import {UserContext} from "../HomePage";
import {DocumentData} from "../types";
import {Card} from "react-bootstrap";
import styles from "./DriversHomePage.module.scss";
import {Route, Routes} from "react-router-dom";

const moment = require('moment');
require('moment/locale/ru');

const DriversHomePage: React.FC = () => {
    const {
        userName,
        workDays,
    } = useContext(UserContext) as DocumentData;

    return (
         <div>
            <Card className="text-center">
                <Card.Header>Ваши поездки</Card.Header>
                <Card.Body>
                    hello
                </Card.Body>
            </Card>
            <Card className="text-center">
                <Card.Header>Рабочие дни</Card.Header>
                <Card.Body>
                    {
                        workDays
                        ? <div className={styles.workDays}>
                                {workDays.map((workDate: number) => (
                                    <div key={workDate} className={styles.workDay}>
                                        {moment(workDate).locale('ru').format('dddd, D MMMM')}
                                    </div>)
                                )}
                            </div>
                        : "Рабочие дни пока не установлены, вы можете сделать это через боковое меню."
                    }
                </Card.Body>
            </Card>
        </div>
    )
};

export default DriversHomePage;
