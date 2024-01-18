import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Tabs, Tab, Button } from "react-bootstrap";
import { useSessionStorage } from "usehooks-ts";
import { backendUrl } from "../components/common";
import TournamentsTable from "../components/TournamentsTable";
import "./Account.css";
import ConfirmButton from "../components/ConfirmButton";
import PageContainer from "../components/PageContainer";


function Account() {
    const [loginData, setLoginData] = useSessionStorage("loginData", sessionStorage.getItem("loginData"));
    const [user, setUser] = useState(null);
    const [appliedTournaments, setAppliedTournaments] = useState(null);
    const [createdTournaments, setCreatedTournaments] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser(loginData.loginEmail);
        fetchAppliedTournaments(loginData.loginEmail);
        fetchCreatedTournaments(loginData.loginEmail);
    }, [loginData]);

    const fetchUser = async (userEmail) => {
        try {
            const response = await fetch(`${backendUrl}/users?email=${userEmail}`);
            const data = await response.json();
            if (response.ok) {
                setUser(data);
            }
        } catch (error) {
            alert(error);
        }
    };

    const fetchAppliedTournaments = async (userEmail) => {
        try {
            const requestOptions = {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${loginData.accessToken}`
                }
            };
            const response = await fetch(`${backendUrl}/participations/tourns_applied?user_email=${userEmail}`, requestOptions);
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                setAppliedTournaments(data);
            }
        } catch (error) {
            alert(error);
        }
    };

    const fetchCreatedTournaments = async (userEmail) => {
        try {
            const response = await fetch(`${backendUrl}/tournaments?organizer_email=${userEmail}`);
            const data = await response.json();
            if (response.ok) {
                setCreatedTournaments(data);
            }
        } catch (error) {
            alert(error);
        }
    };

    const handleTournamentClick = (tourn_id) => {
        navigate(`/tournament_details?tourn_id=${tourn_id}`)
    };

    const handleCreateTournamentClick = () => {
        navigate("/tournament_create");
    }

    const handleDeleteAccountClick = () => {
        // TODO
    }

    return (
        <PageContainer>
            {user ? (
                <h1>Your account, {user.fname} {user.lname}</h1>
            ): null}
            <div className="acc-action-buttons">
                <Button variant="light" onClick={handleCreateTournamentClick}>Create Tournament</Button>
                <ConfirmButton variant="danger" onClick={handleDeleteAccountClick}>Delete Account</ConfirmButton>
            </div>
            <Tabs defaultActiveKey="applied_to" className="mb-3">
                <Tab eventKey="applied_to" title="Tournaments You Applied To">
                    {appliedTournaments ? (
                        <TournamentsTable tournaments={appliedTournaments} onTournamentClick={handleTournamentClick}/>
                    ) : null}
                </Tab>
                <Tab eventKey="created" title="Tournaments You Created">
                    {createdTournaments ? (
                        <TournamentsTable tournaments={createdTournaments} onTournamentClick={handleTournamentClick}/>
                    ) : null}
                </Tab>
            </Tabs>
        </PageContainer>
    );
}

export default Account;