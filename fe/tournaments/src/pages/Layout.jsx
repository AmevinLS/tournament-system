import { Outlet, Link } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import "./Layout.css";

function Layout() {
    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand>Tournaments!</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link to="/" className="navlink">Home</Link>
                            <Link to="/register" className="navlink">Register</Link>
                            <Link to="/login" className="navlink">Login</Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet />
        </>
    );
}

export default Layout;