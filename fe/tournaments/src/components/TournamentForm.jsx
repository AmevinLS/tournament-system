import { useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

function TournamentForm({ tournamentData, organizerEmail, submitText, onSubmit }) {
    const tournamentSchema = Yup.object({
        name: Yup.string()
            .required("Cannot be empty"),
        organizer_email: Yup.string()
            .email()
            .required("Cannot be empty"),
        time: Yup.date()
            .required("Cannot be empty"),
        loc_latitude: Yup.number()
            .required("Cannot be empty"),
        loc_longitude: Yup.number()
            .required("Cannot be empty"),
        max_participants: Yup.number()
            .required("Cannot be empty")
            .positive("Must be positive")
            .integer(),
        apply_deadline: Yup.date()
            .required("Cannot be empty")
    });

    const formik = useFormik({
        initialValues: (tournamentData) ? {
                name: tournamentData.name,
                organizer_email: tournamentData.organizer_email,
                time: tournamentData.time,
                loc_latitude: tournamentData.loc_latitude,
                loc_longitude: tournamentData.loc_longitude,
                max_participants: tournamentData.max_participants,
                apply_deadline: tournamentData.apply_deadline
            }
            : {
                name: "",
                organizer_email: organizerEmail,
                time: "",
                loc_latitude: 0.0,
                loc_longitude: 0.0,
                max_participants: 2,
                apply_deadline: ""
            },
        validationSchema: tournamentSchema,
        onSubmit: async (values, helpers) => {
            onSubmit(values, helpers);
        }
    });

    return (
        <>
            <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control name="name" type="text" value={formik.values.name} onChange={formik.handleChange}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="organizer_email">
                    <Form.Label>Organizer</Form.Label>
                    <Form.Control name="organizer_email" type="text" value={formik.values.organizer_email} onChange={formik.handleChange} disabled/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="time">
                    <Form.Label>Time</Form.Label>
                    <Form.Control name="time" type="datetime-local" value={formik.values.time} onChange={formik.handleChange}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="apply_deadline">
                    <Form.Label>Apply deadline</Form.Label>
                    <Form.Control name="apply_deadline" type="datetime-local" value={formik.values.apply_deadline} onChange={formik.handleChange}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="max_participants">
                    <Form.Label>Max Participants</Form.Label>
                    <Form.Control name="max_participants" type="text" value={formik.values.max_participants} onChange={formik.handleChange}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="loc_latitude">
                    <Form.Label>Loc Latitude</Form.Label>
                    <Form.Control name="loc_latitude" type="text" value={formik.values.loc_latitude} onChange={formik.handleChange}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="loc_longitude">
                    <Form.Label>Loc Longitude</Form.Label>
                    <Form.Control name="loc_longitude" type="text" value={formik.values.loc_longitude} onChange={formik.handleChange}/>
                </Form.Group>
                <Button variant="primary" type="submit">{submitText}</Button>
            </Form>
        </>
    );
}

export default TournamentForm;