import { useSearchParams, useNavigate } from "react-router-dom";
import { useSessionStorage } from "usehooks-ts";
import { backendUrl } from "../components/common";
import ParticipationForm from "../components/ParticipationForm";
import PageContainer from "../components/PageContainer";


function ApplyToTournament() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loginData, setLoginData] = useSessionStorage("loginData", sessionStorage.getItem("loginData"));
    const navigate = useNavigate();

    const handleSubmit = async (participation, formikHelpers) => {
        try {
            const requestOptions = {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${loginData.accessToken}`
                },
                body: JSON.stringify(participation),
            };

            const response = await fetch(`${backendUrl}/participations`, requestOptions);
            if (response.ok) {
                alert("Successfully applied to tournament");
                navigate("/");
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <PageContainer>
            <h1>Apply to tournament</h1>
            {loginData ? (
                <ParticipationForm 
                    userEmail={loginData.loginEmail} 
                    tournId={searchParams.get("tourn_id")} 
                    onSubmit={handleSubmit}
                />
            ) : null}
        </PageContainer>
    );
}

export default ApplyToTournament;