import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TournamentForm from "../components/TournamentForm";
import { backendUrl } from "../components/common";
import { useSessionStorage } from "usehooks-ts";
import "./EditTournament.css";
import PageContainer from "../components/PageContainer";

function EditTournament() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loginData, setLoginData] = useSessionStorage("loginData", sessionStorage.getItem("loginData"));
    const [tournament, setTournament] = useState(null);

    useEffect(() => {
        fetchTournament(searchParams.get("tourn_id"))
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
    }

    const handleSubmit = async (newTournament, formikHelpers) => {
        try {
            const requestTournament = {...newTournament, tourn_id: tournament.tourn_id};
            const requestOptions = {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${loginData.accessToken}`
                },
                body: JSON.stringify(requestTournament),
            };

            const response = await fetch(`${backendUrl}/tournaments/update`, requestOptions);
            if (response.ok) {
                setTournament({...newTournament, tourn_id: tournament.tourn_id});
                alert("Tournament successfully updated");
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <PageContainer>
            <h1>Edit Tournament</h1>
            {tournament ? (
                <div className="edit-tournament-form">
                    <TournamentForm 
                        tournamentData={tournament}
                        organizerEmail={loginData.loginEmail} 
                        submitText="Save" 
                        onSubmit={handleSubmit}
                    />
                </div>
            ): null}            
        </PageContainer>
    );
}

export default EditTournament;