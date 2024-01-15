import { useState, useEffect } from "react";
import { useSessionStorage } from "usehooks-ts";
import { backendUrl } from "../components/common";

function Account() {
    const [loginData, setLoginData] = useSessionStorage("loginData", sessionStorage.getItem("loginData"));
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUser(loginData.loginEmail);
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

    return (
        <>
            {user ? (
                <h1>Your account, {user.fname} {user.lname}</h1>
            ): null}
        </>
    );
}

export default Account;