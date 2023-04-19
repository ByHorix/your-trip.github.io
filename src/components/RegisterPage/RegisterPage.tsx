import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from './RegisterPage.module.scss';
import {app} from '../../config/firebaseConfig';
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import {ButtonGroup, FloatingLabel, FormControl, Spinner} from "react-bootstrap";
import {FormEventHandler} from "react";
import {useNavigate} from "react-router-dom";
import {doc, setDoc, getFirestore} from "firebase/firestore";

const RegisterPage: React.FC = () => {
    const auth = getAuth(app);

    const [formData, setFormData] = useState({
        email: '',
        userName: '',
        password: '',
        repeatPassword: '',
        role: 'passenger',
    });
    const [isMatchesPassword, setIsMatchesPassword] = useState(false);
    const [isCheckedPasswords, setIsCheckedPasswords] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const showPasswordError = !isMatchesPassword && isCheckedPasswords;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {target} = e;

        setFormData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };

    const handleRoleSelect = (e: React.FormEvent<HTMLSelectElement>) => {
        const {currentTarget: {value}} = e;

        setFormData((prevState) => ({
            ...prevState,
            role: value
        }));
    }

    const addUser = async (uid: string) => {
        const db = getFirestore(app);
        const {userName, email, role} = formData;

        const isAdmin = email === 'real.horix@gmail.com';

        if (isAdmin) {
            return await setDoc(doc(db, 'users', uid), {
                email,
                userName,
                isAdmin,
                uid,
            });
        }

        return await setDoc(doc(db, 'users', uid), {
            email,
            userName,
            role,
            isAdmin,
            uid,
        });
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setIsMatchesPassword(formData.password === formData.repeatPassword);
        setIsCheckedPasswords(true);

        if (!showPasswordError) {
            try {
                const response = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                const uid = response.user.uid;

                await addUser(response.user.uid);

                localStorage.setItem('uid', uid);

                navigate('/home');
            } catch (e: any) {
                alert(e.message);
            }
            finally {
                setIsLoading(false);
            }
        }
    };

    const navigate = useNavigate();

    return (
        <>
            <div className={styles.background}/>
                <div className={styles.formContainer}>
                    <Form onSubmit={handleSubmit} className={styles.form}>
                        <h3>
                            Пожалуйста, введите данные для регистрации
                        </h3>
                        <Form.Group className="mb-3">
                            <Form.Control
                                required
                                name="email"
                                type="email"
                                placeholder="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                required
                                name="userName"
                                type="text"
                                placeholder="имя"
                                value={formData.userName}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FormControl
                                required
                                name="password"
                                type="password"
                                placeholder="пароль"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FormControl
                                required
                                onFocus={() => setIsCheckedPasswords(false)}
                                isInvalid={showPasswordError}
                                name="repeatPassword"
                                type="password"
                                placeholder="повторите пароль"
                                value={formData.repeatPassword}
                                onChange={handleInputChange}
                            />
                            <Form.Control.Feedback type={showPasswordError ? "invalid" : "valid"}>
                                Пароли должны совпадать
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Выберите тип аккаунта">
                                <Form.Select onChange={handleRoleSelect}>
                                    <option value="passenger">Пассажир</option>
                                    <option value="driver">Водитель</option>
                                    <option value="manager">Диспетчер</option>
                                </Form.Select>
                            </FloatingLabel>
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {
                                isLoading
                                    ? <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        <span>Отправить</span>
                                    </>
                                    : 'Отправить'
                            }
                        </Button>
                        <hr/>
                        <div className={styles.btnGroup}>
                            <ButtonGroup className={styles.btnGroup}>
                                <Button onClick={() => navigate('/login')} className={styles.login}>
                                    Вход
                                </Button>
                                <Button
                                    disabled
                                    variant="outline-primary"
                                    className={styles.register}
                                >
                                    Регистрация
                                </Button>
                            </ButtonGroup>
                        </div>
                    </Form>
                </div>
        </>
    );
};

export default RegisterPage;
