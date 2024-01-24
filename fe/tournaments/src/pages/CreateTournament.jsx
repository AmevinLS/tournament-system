import { useState } from "react";
import { useSessionStorage } from "usehooks-ts";
import { Alert } from "react-bootstrap";
import TournamentForm from "../components/TournamentForm";
import PageContainer from "../components/PageContainer";
import { backendUrl } from "../components/common";

function CreateTournament() {
    const [loginData, setLoginData] = useSessionStorage("loginData", sessionStorage.getItem("loginData"));
    const [currAlert, setCurrAlert] = useState(null);

    const handleSubmit = async (newTournament, formikHelpers) => {
        try {
            const requestTournament = {...newTournament};
            const requestOptions = {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${loginData.accessToken}`
                },
                body: JSON.stringify(requestTournament),
            };

            const response = await fetch(`${backendUrl}/tournaments`, requestOptions);
            if (response.ok) {
                setCurrAlert(<Alert variant="success" dismissible>Successfully created tournament</Alert>)
                // formikHelpers.resetForm();
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <PageContainer alert={currAlert}>
            <h1>Create a Tournament</h1>
            <TournamentForm organizerEmail={loginData.loginEmail} submitText={"Create"} onSubmit={handleSubmit}/>
        </PageContainer>
    );
}

export default CreateTournament;