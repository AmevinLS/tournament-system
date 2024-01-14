import { useSessionStorage } from "usehooks-ts";
import { Outlet, Link } from "react-router-dom";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import "./Layout.css";

function Layout() {
    const [loginData, setLoginData] = useSessionStorage("loginData", sessionStorage.getItem("loginData"));

    const handleLogoutClick = (e) => {
        setLoginData(null);
    };

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
                            <Link to="/register" className="navlink">Register</Link>
                            <Link to="/login" className="navlink">Login</Link>
                        </Nav>
                        {loginData ? (
                            <div className="account-info">
                                <p>{loginData.loginEmail}</p>
                                <Button variant="secondary" size="sm" onClick={handleLogoutClick}>Logout</Button>
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