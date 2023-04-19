import React, {useContext, useState} from "react";
import Calendar from "react-calendar";
import {doc, getFirestore, setDoc, Timestamp} from "firebase/firestore";
import {app} from "../../../config/firebaseConfig";
import {ListGroup, Spinner} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useNavigate} from "react-router-dom";
import styles from './SetWorkDays.module.scss';

const moment = require('moment');
require('moment/locale/ru');

const SetWorkDays: React.FC = () => {
    const currentUid = localStorage.getItem('uid');

    const [dates, setDates] = useState<number[] | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);

    const handleClickDates = (value: Date) => {
        if (!dates?.includes(Date.parse(value.toString()))){
            setDates((prevState) => prevState
                ? [...prevState, Date.parse(value.toString())]
                : [Date.parse(value.toString())]);
        } else {
            handleRemoveDates(Date.parse(value.toString()));
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
                <Calendar activeStartDate={new Date()} tileDisabled={disabledDates} onClickDay={handleClickDates}/>
            </div>
            <div className={styles.rightSide}>
                <div>
                    Вы выбрали дни:
                    {dates && (
                        <ListGroup>
                            {dates.map((workDate: number) => (
                                <ListGroup.Item
                                    key={Date.parse(workDate.toString())}
                                    onClick={() => {handleRemoveDates(workDate)}}>
                                    {moment(workDate).locale('ru').format('dddd, D MMMM')}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </div>
                <Button disabled={!dates || isLoading} type={'button'} onClick={handleSubmit}>
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
            </div>
        </div>
    );
}

export default SetWorkDays;
