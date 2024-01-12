import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import "./Login.css";


function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: "", password: ""
    });

    const [loginErrors, setLoginErrors] = useState({
        email: false, password: false
    });

    useEffect(() => {
        let emailBad = false;
        if (!loginInfo.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)) {
            emailBad = true;
        }
        if (loginInfo.email.length == 0) {
            emailBad = false;
        }
        setLoginErrors(oldLoginErrors => {
            const newLoginErrors = {...oldLoginErrors, email: emailBad};
            return newLoginErrors;
        })
    }, [loginInfo]);

    const handleChange = (e) => {
        const {id, value} = e.target;
        setLoginInfo(oldLoginInfo => {
            const newLoginInfo = {...oldLoginInfo, [id]: value};
            return newLoginInfo;
        });
    };

    const login = (e) => {
        e.preventDefault();
        console.log("loginInfo: ", loginInfo);

        const formData = new URLSearchParams();
        formData.append('username', loginInfo.email);
        formData.append('password', loginInfo.password);

        const requestOptions = {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: formData,
        };

        fetch("http://127.0.0.1:8000/token", requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json().then(
                        data => {
                            console.log("response data: ", data);
                            if (data.status_code >= 400)
                                alert(data.detail);
                            else {
                                alert("Successfully logged in as user with email: " + data.email);
                                sessionStorage.setItem("accessToken", data.access_token);
                            }
                        }
                    );
                }
                else {
                    alert("Something went wrong");
                }
            })
            .catch((reason) => {
                alert(reason);
            });
    }



    return (
        <Form className="login-form" onSubmit={login}>
            <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={loginInfo.email} onChange={handleChange} isInvalid={loginErrors.email} required/>
                <Form.Control.Feedback type="invalid">Please enter valid email</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" value={loginInfo.password} onChange={handleChange} required/>
            </Form.Group>
            <Button variant="primary" type="submit">
                Login
            </Button>
        </Form>
    );
}

export default Login;