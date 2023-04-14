import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from './RegisterPage.module.scss';
import {app} from '../../config/firebaseConfig';
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import {ButtonGroup, FloatingLabel, FormControl} from "react-bootstrap";
import {FormEventHandler} from "react";
import {useNavigate} from "react-router-dom";
import {collection, addDoc, getFirestore} from "firebase/firestore";

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
    const [emailError, setEmailError] = useState(false);

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

    const addUser = async (uid: string, idToken: string) => {
        const db = getFirestore(app);
        const {userName, email, role} = formData;

        return await addDoc(collection(db, 'users'), {
            email,
            userName,
            role,
            uid,
            idToken,
        });
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        setIsMatchesPassword(formData.password === formData.repeatPassword);
        setIsCheckedPasswords(true);

        if (!showPasswordError) {
            try {
                const response = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                const idToken = await  response.user.getIdToken();

                await addUser(response.user.uid, idToken);
                // const docId = docRef.id;
                localStorage.setItem('token', idToken);

                navigate('/home');
            }
            catch(e: any) {
                alert(e.message);
            }
        }
    };

    const navigate = useNavigate();

    return (
        <div className={styles.background}>
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
                        <Form.Control.Feedback type={emailError ? "invalid" : "valid"}>
                            Аккаунт с таким email уже существует
                        </Form.Control.Feedback>
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
                                <option value="driver">Водитель</option>
                                <option value="passenger">Пассажир</option>
                                <option value="manager">Диспетчер</option>
                            </Form.Select>
                        </FloatingLabel>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Далее
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
        </div>
    );
};

export default RegisterPage;
