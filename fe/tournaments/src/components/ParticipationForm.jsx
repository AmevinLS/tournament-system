import { Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

function ParticipationForm({ userEmail, tournId, onSubmit }) {
    const participationSchema = Yup.object({
        user_email: Yup.string()
            .email()
            .required("Cannot be empty"),
        tourn_id: Yup.string()
            .required("Cannot be empty"),
        license_number: Yup.string()
            .length(6, "Must be 6 characters long")
            .required("Cannot be empty"),
        elo: Yup.number()
            .positive("Must be positive")
            .integer("Must be an integer")
            .min(2, "Should be greater than 0")
            .max(10000, "Can't be greater than 10000")
            .required("Cannot be empty")
    });

    const formik = useFormik({
        initialValues: {
            user_email: userEmail,
            tourn_id: tournId,
            license_number: "",
            elo: ""
        },
        validationSchema: participationSchema,
        onSubmit: async (values, helpers) => {
            onSubmit(values, helpers);
        }
    });

    return (
        <>
            <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3" controlId="user_email">
                    <Form.Label>Your email</Form.Label>
                    <Form.Control name="user_email" type="email" value={formik.values.user_email} onChange={formik.handleChange} disabled/>
                    <Form.Text className="text-danger">
                        {formik.touched.user_email && formik.errors.user_email ? (
                            <div className="text-danger">{formik.errors.user_email}</div>
                        ) : null}
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="tourn_id">
                    <Form.Label>Tournament ID</Form.Label>
                    <Form.Control name="tourn_id" type="text" value={formik.values.tourn_id} onChange={formik.handleChange} disabled/>
                    <Form.Text className="text-danger">
                        {formik.touched.tourn_id && formik.errors.tourn_id ? (
                            <div className="text-danger">{formik.errors.tourn_id}</div>
                        ) : null}
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="license_number">
                    <Form.Label>License Number</Form.Label>
                    <Form.Control name="license_number" type="text" value={formik.values.license_number} onChange={formik.handleChange}/>
                    <Form.Text className="text-danger">
                        {formik.touched.license_number && formik.errors.license_number ? (
                            <div className="text-danger">{formik.errors.license_number}</div>
                        ) : null}
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="elo">
                    <Form.Label>Elo</Form.Label>
                    <Form.Control name="elo" type="text" value={formik.values.elo} onChange={formik.handleChange}/>
                    <Form.Text className="text-danger">
                        {formik.touched.elo && formik.errors.elo ? (
                            <div className="text-danger">{formik.errors.elo}</div>
                        ) : null}
                    </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">Apply To Tournament</Button>
            </Form>
        </>
    );
}

export default ParticipationForm;