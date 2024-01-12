import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./Register.css";

function Register() {
    const [regInfo, setRegInfo] = useState({
        fname: "", lname: "", email: "", password: ""
    });

    const [regErrors, setRegErrors] = useState({
        fname: false, lname: false, email: false, password: false 
    });

    const updateErrors = (currRegInfo) => {
        
    }

    const handleChange = (e) => {
        const {id, value} = e.target;
        setRegInfo(oldRegInfo => {
            const newRegInfo = {...oldRegInfo, [id]: value};
            return newRegInfo;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(regInfo);
        const requestOptions = {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(regInfo)
        };
        const response = await fetch("http://127.0.0.1:8000/users", requestOptions)
        const data = await response.json();

        if (response.ok) {
            if (data.status_code >= 400)
                alert(data.detail);
            else
                alert("Successfully registered user with email: " + data.email);
        } else {
            alert(data.detail)
        }
    }

    return (
        <Form className="register-form" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="fname">
                <Form.Label>First name</Form.Label>
                <Form.Control type="text" placeholder="Enter first name" value={regInfo.fname} onChange={handleChange}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="lname">
                <Form.Label>Last name</Form.Label>
                <Form.Control type="text" placeholder="Enter last name" value={regInfo.lname} onChange={handleChange}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={regInfo.email} onChange={handleChange}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={regInfo.password} onChange={handleChange}/>
            </Form.Group>
            <Button variant="primary" type="submit">
                Register
            </Button>
        </Form>
    );
}

export default Register;