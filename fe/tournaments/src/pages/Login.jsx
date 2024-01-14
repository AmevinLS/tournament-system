import { useSessionStorage } from "usehooks-ts";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

import { backendUrl } from "../components/common";
import "./Login.css";

function Login() {
    const [loginData, setLoginData] = useSessionStorage("loginData", sessionStorage.getItem("loginData"));

    const loginSchema = Yup.object({
        email: Yup.string()
            .email("Not a valid email")
            .required("Required"),
        password: Yup.string()
            .required("Required")
    });
    
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: loginSchema,
        onSubmit: async (values, helpers) => {
            const formData = new URLSearchParams();
            formData.append('username', values.email);
            formData.append('password', values.password);

            const requestOptions = {
                method: "POST",
                mode: "cors",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: formData,
            };

            try {
                const response = await fetch(`${backendUrl}/token`, requestOptions);
                const data = await response.json();

                if (response.ok) {
                    if (data.status_code >= 400)
                        alert(data.detail);
                    else {
                        alert("Successfully logged in as user with email: " + values.email);
                        setLoginData({
                            accessToken: data.access_token,
                            loginEmail: values.email
                        });
                        helpers.resetForm({
                            email: "", password: ""
                        });
                        navigate("/");
                    }
                } else {
                    alert(data.detail);
                }
            } catch (error) {
                alert(error);
            }
        }
    })

    return (
        <Form className="login-form" onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control name="email" type="text" placeholder="Enter email" value={formik.values.email} onChange={formik.handleChange}/>
                <Form.Text className="text-danger">
                    {formik.touched.email && formik.errors.email ? (
                        <div className="text-danger">{formik.errors.email}</div>
                    ) : null}
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control name="password" type="password" placeholder="Enter password" value={formik.values.password} onChange={formik.handleChange}/>
                <Form.Text className="text-danger">
                    {formik.touched.password && formik.errors.password ? (
                        <div className="text-danger">{formik.errors.password}</div>
                    ) : null}
                </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
                Login
            </Button>
        </Form>
    );
}

export default Login;