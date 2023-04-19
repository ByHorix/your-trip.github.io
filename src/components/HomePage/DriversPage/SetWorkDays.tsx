import React, {useContext, useState} from "react";
import Calendar from "react-calendar";
import {doc, getFirestore, setDoc} from "firebase/firestore";
import {app} from "../../../config/firebaseConfig";
import {ListGroup, Spinner} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useNavigate} from "react-router-dom";
import styles from './SetWorkDays.module.scss';
import {UserContext} from "../HomePage";
import {DocumentData} from "../types";

const moment = require('moment');
require('moment/locale/ru');

const SetWorkDays: React.FC = () => {
    const currentUid = localStorage.getItem('uid');
    const {workDays} = useContext(UserContext) as DocumentData;

    const [dates, setDates] = useState<number[] | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);

    const handleClickDates = (value: Date) => {
        const now = Date.parse((new Date()).toString());
        const currentDateParsed = Date.parse(value.toString());
        if (currentDateParsed < now || workDays.includes(currentDateParsed)) {
            alert('Вы не можете выбрать эту дату: ');
        }
        else {
            if (!dates?.includes(currentDateParsed)){
                setDates((prevState) => prevState
                    ? [...prevState, currentDateParsed]
                    : [currentDateParsed]);
            } else {
                handleRemoveDates(currentDateParsed);
            }
        }
    };

    const handleRemoveDates = (date: number) => {
        setDates((prevState) => {
            const filteredDates = prevState?.filter((dateFromState) => dateFromState !== date);
            return filteredDates;
        });
    }

    const disabledDates = ({ activeStartDate, date } : { activeStartDate : Date, date: Date }) =>
        date.getDate() <= (new Date()).getDate() || date.getMonth() < activeStartDate.getMonth();

    const navigate = useNavigate();

    const db = getFirestore(app);


    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);

        if (currentUid) {
            try {
                await setDoc(doc(db, 'users', currentUid), {
                    workDays: dates
                }, {merge: true});
                navigate('/home');
            }
            catch (e: any) {
                alert(e.message)
            }
        }
    };

    return (
        <div className={styles.container}>
            <div>
                <Calendar
                    // activeStartDate={new Date()}
                    // tileDisabled={disabledDates}
                    onClickDay={handleClickDates}
                    tileClassName={({date}: {date: Date}) => dates?.includes(Date.parse(date.toString()))
                ? styles.tile
                : null}
                />
            </div>
            <div className={styles.rightSide}>
                <div className={styles.datesList}>
                    Вы выбрали дни:
                    {dates && (
                        <ListGroup>
                            {dates.map((workDate: number) => (
                                <ListGroup.Item
                                    key={workDate.toString()}
                                    onClick={() => {handleRemoveDates(workDate)}}>
                                    {moment(workDate).locale('ru').format('dddd, D MMMM')}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </div>
                <div className={styles.buttons}>
                        <Button
                            disabled={!dates || isLoading}
                            type={'button'}
                            onClick={handleSubmit}
                            className={styles.send}
                            variant="outline-primary"
                        >
                            {isLoading
                                ? <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    <span> Подтвердить</span>
                                </>
                                : 'Подтвердить'}
                        </Button>
                        <Button
                            type={'button'}
                            onClick={() => navigate('/home')}
                            className={styles.home}
                            variant="outline-primary"
                        >
                            На главную
                        </Button>
                </div>
            </div>
        </div>
    );
}

export default SetWorkDays;
