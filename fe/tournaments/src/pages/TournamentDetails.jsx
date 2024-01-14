import { useState, useEffect } from "react";
import { Card, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { backendUrl } from "../components/common";
import "./TournamentDetails.css";

function TournamentDetails() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [tournament, setTournament] = useState(null);

    useEffect(() => {
        fetchTournament(searchParams.get("tourn_id"));
    }, [searchParams]);

    const fetchTournament = async (tourn_id) => {
        try {
            const response = await fetch(`${backendUrl}/tournaments?tourn_id=${tourn_id}`);
            const data = await response.json();
            if (response.ok) {
                setTournament(data);
            }
        } catch (error) {
            alert(error);
        }
    };

    const handleApplyClick = (e) => {
        // TODO
    };

    const handleEditClick = (e) => {
        // TODO
    };

    return (
        <>
            <h1>Tournament Details</h1>
            {tournament ? (
                <Card style={{width: "70%"}}>
                    <Card.Body className="card-body">
                        <Card.Title><b>{tournament.name}</b></Card.Title>
                        {sessionStorage.loginEmail == tournament.organizer_email ? (
                            <Button variant="primary" onClick={handleEditClick}>Edit data</Button>
                        ) : null}
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroupItem><i>Organizer:</i> {tournament.organizer_email}</ListGroupItem>
                        <ListGroupItem><i>Time:</i> {tournament.time}</ListGroupItem>
                        <ListGroupItem><i>Max participants:</i> {tournament.max_participants}</ListGroupItem>
                        <ListGroupItem><i>Apply deadline:</i> {tournament.apply_deadline}</ListGroupItem>
                        <ListGroupItem><i>Location:</i> ({tournament.loc_latitude}, {tournament.loc_longitude})</ListGroupItem>
                    </ListGroup>
                </Card>
            ) : null}
            <Button variant="primary" onClick={handleApplyClick}>Apply to tournament</Button>
            
            <div>{searchParams.get("tourn_id")}</div>
        </>
    );
}

export default TournamentDetails;