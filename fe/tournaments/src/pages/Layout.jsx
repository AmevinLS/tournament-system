import { useSessionStorage } from "usehooks-ts";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import "./Layout.css";
import ConfirmButton from "../components/ConfirmButton";

function Layout() {
    const [loginData, setLoginData] = useSessionStorage("loginData", sessionStorage.getItem("loginData"));
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogoutClick = (e) => {
        if (location.pathname == "/account") {
            navigate("/");
        }
        setLoginData(null);
    };

    const handleAccountClick = (e) => {
        navigate("/account");
    }

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand>Tournaments!</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link to="/" className="navlink">Home</Link>
                            <Link to="/tournaments" className="navlink">Tournaments</Link>
                            {!loginData ? (
                                <>
                                    <Link to="/register" className="navlink">Register</Link>
                                    <Link to="/login" className="navlink">Login</Link>
                                </>
                            ) : null}
                        </Nav>
                        {loginData ? (
                            <div className="account-info">
                                <Button variant="outline-info" size="sm" onClick={handleAccountClick}>{loginData.loginEmail}</Button>
                                <ConfirmButton variant="outline-danger" size="sm" onClick={handleLogoutClick}>Logout</ConfirmButton>
                            </div>
                        ) : null}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet />
        </>
    );
}

export default Layout;