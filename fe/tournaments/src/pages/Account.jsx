import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Tabs, Tab } from "react-bootstrap";
import { useSessionStorage } from "usehooks-ts";
import { backendUrl } from "../components/common";
import TournamentsTable from "../components/TournamentsTable";

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

    return (
        <>
            {user ? (
                <h1>Your account, {user.fname} {user.lname}</h1>
            ): null}
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
            {/* <Table>
                <thead>
                    <tr>
                        <th>Tournaments you've applied to</th>
                        <th>Tournaments you've created</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{"width": "50%"}}>
                            {appliedTournaments ? (
                                <TournamentsTable tournaments={appliedTournaments} onTournamentClick={handleTournamentClick}/>
                            ) : null}
                        </td>
                        <td style={{"width": "50%"}}>
                            {createdTournaments ? (
                                <TournamentsTable tournaments={createdTournaments} onTournamentClick={handleTournamentClick}/>
                            ) : null}
                        </td>
                    </tr>
                </tbody>
            </Table> */}
        </>
    );
}

export default Account;