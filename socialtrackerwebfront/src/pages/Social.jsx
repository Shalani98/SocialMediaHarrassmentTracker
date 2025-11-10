import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // make sure Bootstrap CSS is imported (usually in index.js)
import "../index.css";

function Social() {
  const navigate = useNavigate();

  return (
    <>
      {/* ---------- NAVBAR ---------- */}
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand href="/">ProtectPulse</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/ContactUs">Contact Us</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ---------- HERO SECTION ---------- */}
      <div
        className="hero-section d-flex align-items-center justify-content-center text-center text-white"
        style={{ minHeight: "100vh", paddingTop: "80px" }} // offset for fixed navbar
      >
        <div>
          <h1 className="display-3 fw-bold">ProtectPulse</h1>
          <button
            className="btn btn-primary btn-lg mt-4"
            onClick={() => navigate("/LogRegister")}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* ---------- FOOTER ---------- */}
      <footer className="bg-light text-center py-3 border-top">
        <Container>
          <p className="mb-0 text-muted">
            © 2025 ProtectPulse. All rights reserved.
          </p>
        </Container>
      </footer>
    </>
  );
}

export default Social;
