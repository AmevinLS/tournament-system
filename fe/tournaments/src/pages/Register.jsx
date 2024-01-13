import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useFormik, Formik } from "formik";
import * as Yup from "yup";

import "./Register.css";


const registerSchema = Yup.object({
    fname: Yup.string()
        .required("Required"),
    lname: Yup.string()
        .required("Required"),
    email: Yup.string()
        .email("Not a valid email")
        .required("Required"),
    password: Yup.string()
        .required("Required")
});

function Register() {
    const formik = useFormik({
        initialValues: {
            fname: "",
            lname: "",
            email: "",
            password: "",
        },
        validationSchema: registerSchema,
        onSubmit: async (values, helpers) => {
            console.log(values);
            const requestOptions = {
                method: "POST",
                mode: "cors",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(values)
            };
            try {
                const response = await fetch("http://127.0.0.1:8000/users", requestOptions)
                const data = await response.json();
                if (response.ok) {
                    if (data.status_code >= 400)
                        alert(data.detail);
                    else
                        alert("Successfully registered user with email: " + data.email);
                        helpers.resetForm({
                            fname: "", lname: "", email: "", password: ""
                        });
                } else {
                    alert(data.detail)
                }
            } catch (error) {
                alert(error);
            }
        }
    });

    return (
        <Form className="register-form" onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3" controlId="fname">
                <Form.Label>First name</Form.Label>
                <Form.Control name="fname" type="text" placeholder="Enter first name" value={formik.values.fname} onChange={formik.handleChange}/>
                <Form.Text className="text-danger">
                    {formik.touched.fname && formik.errors.fname ? (
                        <div className="text-danger">{formik.errors.fname}</div>
                    ) : null}
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="lname">
                <Form.Label>Last name</Form.Label>
                <Form.Control name="lname" type="text" placeholder="Enter last name" value={formik.values.lname} onChange={formik.handleChange}/>
                <Form.Text className="text-danger">
                    {formik.touched.lname && formik.errors.lname ? (
                        <div className="text-danger">{formik.errors.lname}</div>
                    ) : null}
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control name="email" type="email" placeholder="Enter email" value={formik.values.email} onChange={formik.handleChange}/>
                <Form.Text className="text-danger">
                    {formik.touched.email && formik.errors.email ? (
                        <div className="text-danger">{formik.errors.email}</div>
                    ) : null}
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control name="password" type="password" placeholder="Password" value={formik.values.password} onChange={formik.handleChange}/>
                <Form.Text className="text-danger">
                    {formik.touched.password && formik.errors.password ? (
                        <div className="text-danger">{formik.errors.password}</div>
                    ) : null}
                </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
                Register
            </Button>
        </Form>
    );
}

export default Register;