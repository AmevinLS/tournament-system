import { useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

import ConfirmButton from "./ConfirmButton";
import LocationMap from "./LocationMap";

function TournamentForm({ tournamentData, organizerEmail, submitText, onSubmit }) {
    const tournamentSchema = Yup.object({
        name: Yup.string()
            .required("Cannot be empty"),
        organizer_email: Yup.string()
            .email()
            .required("Cannot be empty"),
        time: Yup.date()
            .min(Date(), "Cannot be in the past")
            .required("Cannot be empty"),
        loc_latitude: Yup.number()
            .min(-90, "Must be in range [-90, 90]").max(90, "Must be in range [-90, 90]")
            .required("Cannot be empty"),
        loc_longitude: Yup.number()
            .min(-180, "Must be in range [-180, 180]").max(180, "Must be in range [-180, 180]")
            .required("Cannot be empty"),
        max_participants: Yup.number()
            .required("Cannot be empty")
            .min(2, "Must be at least 2")
            .integer(),
        apply_deadline: Yup.date()
            .min(Date(), "Cannot be in the past")
            .required("Cannot be empty")
            .when(["time"], (time) => {
                if (time) {
                    return Yup.date()
                        .max(time, "Apply date must be earlier than Time of tournament");
                        // .typeError('Apply Deadline is required');
                }
            })
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
                    <Form.Control name="name" type="text" value={formik.values.name} onChange={formik.handleChange} isInvalid={formik.touched.name && !!formik.errors.name}/>
                    <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="organizer_email">
                    <Form.Label>Organizer</Form.Label>
                    <Form.Control name="organizer_email" type="text" value={formik.values.organizer_email} onChange={formik.handleChange} isInvalid={formik.touched.organizer_email && !!formik.errors.organizer_email} disabled/>
                    <Form.Control.Feedback type="invalid">{formik.errors.organizer_email}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="time">
                    <Form.Label>Time</Form.Label>
                    <Form.Control name="time" type="datetime-local" value={formik.values.time} onChange={formik.handleChange} isInvalid={formik.touched.time && !!formik.errors.time}/>
                    <Form.Control.Feedback type="invalid">{formik.errors.time}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="apply_deadline">
                    <Form.Label>Apply deadline</Form.Label>
                    <Form.Control name="apply_deadline" type="datetime-local" value={formik.values.apply_deadline} onChange={formik.handleChange} isInvalid={formik.touched.apply_deadline && !!formik.errors.apply_deadline}/>
                    <Form.Control.Feedback type="invalid">{formik.errors.apply_deadline}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="max_participants">
                    <Form.Label>Max Participants</Form.Label>
                    <Form.Control name="max_participants" type="text" value={formik.values.max_participants} onChange={formik.handleChange} isInvalid={formik.touched.max_participants && !!formik.errors.max_participants}/>
                    <Form.Control.Feedback type="invalid">{formik.errors.max_participants}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="loc_latitude">
                    <Form.Label>Loc Latitude</Form.Label>
                    <Form.Control name="loc_latitude" type="text" value={formik.values.loc_latitude} onChange={formik.handleChange} isInvalid={formik.touched.loc_latitude && !!formik.errors.loc_latitude}/>
                    <Form.Control.Feedback type="invalid">{formik.errors.loc_latitude}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="loc_longitude">
                    <Form.Label>Loc Longitude</Form.Label>
                    <Form.Control name="loc_longitude" type="text" value={formik.values.loc_longitude} onChange={formik.handleChange} isInvalid={formik.touched.loc_longitude && !!formik.errors.loc_longitude}/>
                    <Form.Control.Feedback type="invalid">{formik.errors.loc_longitude}</Form.Control.Feedback>
                </Form.Group>
                <LocationMap 
                    latitude={!!Number(formik.values.loc_latitude) ? formik.values.loc_latitude : 0} 
                    longitude={!!Number(formik.values.loc_longitude) ? formik.values.loc_longitude : 0} 
                    markerText="Pog"
                />
                <Button variant="primary" type="submit">{submitText}</Button>
            </Form>
        </>
    );
}

export default TournamentForm;