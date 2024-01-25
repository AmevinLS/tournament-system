import { useSessionStorage } from "usehooks-ts";
import { useState, useEffect } from "react";
import { Card, ListGroup, ListGroupItem, Button, Table } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { backendUrl } from "../components/common";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./TournamentDetails.css";
import LocationMap from "../components/LocationMap";
import PageContainer from "../components/PageContainer";

function TournamentDetails() {
    const [loginData, setLoginData] = useSessionStorage("loginData", sessionStorage.getItem("loginData"));
    const [searchParams, setSearchParams] = useSearchParams();
    const [tournament, setTournament] = useState(null);
    const navigate = useNavigate();

    const [isRegistered, setIsRegistered] = useState(false);
    const [participations, setParticipations] = useState([]);

    useEffect(() => {
        fetchTournament(searchParams.get("tourn_id"));
        fetchParticipations(searchParams.get("tourn_id"));
    }, [searchParams]);

    useEffect(() => {
        if (loginData) {
            fetchParticipation(searchParams.get("tourn_id"), loginData.loginEmail);
        } else {
            setIsRegistered(false);
        }
    }, [searchParams, loginData]);

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

    const fetchParticipation = async (tourn_id, user_email) => {
        try {
            const response = await fetch(`${backendUrl}/participations?tourn_id=${tourn_id}&user_email=${user_email}`);
            const data = await response.json();
            if (response.ok) {
                setIsRegistered(!!data);
            }
        } catch (error) {
            alert(error);
        }
    };

    const fetchParticipations = async (tourn_id) => {
        try {
            const response = await fetch(`${backendUrl}/participations?tourn_id=${tourn_id}`);
            const data = await response.json();
            if (response.ok) {
                setParticipations(data);
            }
        } catch (error) {
            alert(error);
        }
    }

    const handleApplyClick = (e) => {
        navigate(`/tournament_apply?tourn_id=${tournament.tourn_id}`);
    };

    const handleEditClick = (e) => {
        navigate(`/tournament_edit?tourn_id=${tournament.tourn_id}`);
    };

    return (
        <PageContainer>
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
                        <LocationMap latitude={tournament.loc_latitude} longitude={tournament.loc_longitude} markerText={tournament.name}/>
                    </ListGroup>
                </Card>
            ) : null}
            <Button variant="primary" onClick={handleApplyClick} disabled={isRegistered || (!!tournament && tournament.started)}>
                {!isRegistered ? "Apply to tournament" : "Already applied"}
            </Button>
            <hr/>
            {!!tournament && tournament.started ? (
                <Table style={{width: "50%"}}>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Match Index</th>
                        </tr>
                    </thead>
                    <tbody>
                        {participations.map(participation => (
                            <tr>
                                <td>{participation.user_email}</td>
                                <td>{participation.match_ind}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : null}
        </PageContainer>
    );
}

export default TournamentDetails;