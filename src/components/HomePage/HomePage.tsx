import React, {useEffect, useState, createContext, PropsWithChildren, ReactNode} from "react";
import {app} from '../../config/firebaseConfig';
import {doc, getFirestore, getDoc, setDoc} from "firebase/firestore";
import styles from "./HomePage.module.scss"
import {Spinner, Button, Container, Form, Nav, Navbar, NavDropdown, Offcanvas, Row, Col, Stack} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import 'react-calendar/dist/Calendar.css';
import User from "./types";
import {DocumentData} from "./types";
import DriversHomePage from "./DriversPage/DriversHomePage";
import DriversNavBar from "./DriversPage/DriversNavBar";
import HomePageLayer from "./HomePageLayer/HomePageLayer";
import DriversHomePageLayer from "./DriversPage/DriversHomePageLayer";


interface DriverUser extends User {
    workDays: Date[] | undefined;
}

type HomePageProps = {
    currentElement: ReactNode,
};

export const UserContext = createContext<DocumentData | undefined>(undefined);

const HomePage: React.FC = () => {

    const [currentUserRole, setCurrentUserRole] = useState('');
    const [currentUserName, setCurrentUserName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [userData, setUserData] = useState<DocumentData | undefined>();

    const getUserData = async () => {
        const uid = localStorage.getItem('uid');

        if (uid) {
            try {
                const db = getFirestore(app);

                const docRef = doc(db, "users", uid);
                const docSnap = await getDoc(docRef);
                const docData = await docSnap.data();

                setUserData(docData);

                if (docData) {
                    setCurrentUserRole(docData.role);
                    setCurrentUserName(docData.userName);
                    setIsLoading(false);
                }
            }
            catch (e: any) {
                console.log(e.message);
            }
        }
        else {
            navigate('/login');
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    const expand = false;

    const logOut = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        isLoading
            ? <div className={styles.spinner}>
                <Spinner animation="border"/>
            </div>
            : <UserContext.Provider value={userData}>
                <Navbar bg="light" expand={expand} className={styles.navBar}>
                    <Container fluid>
                        <div className={styles.headerContainer}>
                            <div>
                                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`}/>
                                <Navbar.Offcanvas
                                    id={`offcanvasNavbar-expand-${expand}`}
                                    aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                                    placement="start"
                                >
                                    <Offcanvas.Header closeButton>
                                        <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                                            Меню
                                        </Offcanvas.Title>
                                    </Offcanvas.Header>
                                    <Offcanvas.Body>
                                        <hr/>
                                        <DriversNavBar/>
                                        <hr/>
                                        <Button onClick={() => logOut()}>Выйти</Button>
                                    </Offcanvas.Body>
                                </Navbar.Offcanvas>
                            </div>
                            <div>
                                Вы вошли как: {currentUserName}
                            </div>
                        </div>
                    </Container>
                </Navbar>
                <div>
                    <HomePageLayer>
                        <DriversHomePageLayer/>
                    </HomePageLayer>
                </div>
            </UserContext.Provider>
    );
};

export default HomePage;
