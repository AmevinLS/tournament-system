import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TournamentForm from "../components/TournamentForm";
import { backendUrl } from "../components/common";
import { useSessionStorage } from "usehooks-ts";

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

    const handleSubmit = async (newTournament) => {
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
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <>
            <h1>{searchParams.tourn_id ? "Edit Tournament" : "Create Tournament"}</h1>
            {tournament ? (
                <TournamentForm 
                    tournamentData={tournament}
                    organizerEmail={loginData.loginEmail} 
                    submitText={searchParams.tourn_id ? "Save" : "Create"} 
                    onSubmit={handleSubmit}
                />
            ): null}            
        </>
    );
}

export default EditTournament;