import { useSessionStorage } from "usehooks-ts";
import TournamentForm from "../components/TournamentForm";
import PageContainer from "../components/PageContainer";

function CreateTournament() {
    const [loginData, setLoginData] = useSessionStorage("loginData", sessionStorage.getItem("loginData"));
    
    const handleSubmit = (newTournament, formikHelpers) => {
        console.log(newTournament);
    };

    return (
        <PageContainer>
            <h1>Create a Tournament</h1>
            <TournamentForm organizerEmail={loginData.loginEmail} submitText={"Create"} onSubmit={handleSubmit}/>
        </PageContainer>
    );
}

export default CreateTournament;