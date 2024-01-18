import { useFormik } from "formik";
import { Form, Button } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { backendUrl } from "../components/common";

function ResetPassword() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const resetSchema = Yup.object({
        new_password: Yup.string()
            .required("Cannot be empty")
    });
    
    const formik = useFormik({
        initialValues: {
            new_password: ""
        },
        validationSchema: resetSchema,
        onSubmit: (values) => {
            fetchUpdatePassword(values.new_password);
        }
    });

    const fetchUpdatePassword = async (newPassword) => {
        const requestOptions = {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                reset_token: searchParams.get("reset_token"),
                new_password: newPassword
            }),
        };

        try {
            const response = await fetch(`${backendUrl}/reset_pass`, requestOptions);
            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                navigate("/");
            } else {
                alert(data.detail);
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <>
            <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3" controlId="new_password">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control 
                        name="new_password" 
                        type="password" 
                        value={formik.values.new_password} 
                        onChange={formik.handleChange} 
                        isInvalid={formik.touched.new_password && !!formik.errors.new_password}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.new_password}</Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit">Change password</Button>
            </Form>
        </>
    );
}

export default ResetPassword;