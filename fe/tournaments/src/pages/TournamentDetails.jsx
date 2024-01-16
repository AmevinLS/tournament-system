import { useSessionStorage } from "usehooks-ts";
import { useState, useEffect } from "react";
import { Card, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { backendUrl } from "../components/common";
import "./TournamentDetails.css";

function TournamentDetails() {
    const [loginData, setLoginData] = useSessionStorage("loginData", sessionStorage.getItem("loginData"));
    const [searchParams, setSearchParams] = useSearchParams();
    const [tournament, setTournament] = useState(null);
    const navigate = useNavigate();

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
        navigate(`/tournament_apply?tourn_id=${tournament.tourn_id}`);
    };

    const handleEditClick = (e) => {
        navigate(`/tournament_edit?tourn_id=${tournament.tourn_id}`);
    };

    return (
        <>
            <h1>Tournament Details</h1>
            {tournament ? (
                <Card style={{width: "70%"}}>
                    <Card.Body className="card-body">
                        <Card.Title><b>{tournament.name}</b></Card.Title>
                        {loginData && (loginData.loginEmail == tournament.organizer_email) ? (
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
        </>
    );
}

export default TournamentDetails;