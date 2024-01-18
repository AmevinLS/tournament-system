import { Route, Navigate, Outlet } from "react-router-dom";
import { useSessionStorage } from "usehooks-ts";


function ProtectedRoute() {
    const [loginData, setLoginData] = useSessionStorage("loginData", sessionStorage.getItem("loginData"));
    return loginData ? <Outlet /> : <Navigate to="/login" />;
}
  
export default ProtectedRoute;