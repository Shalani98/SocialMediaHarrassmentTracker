import React from "react";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaShieldAlt } from "react-icons/fa"; // Import shield icon
import "./styles.css";

const features = [
  {
    title: "Report Harassment",
    description:
      "Quickly report harassment on social media platforms with ease and security.",
  },
  {
    title: "Analyze Messages",
    description:
      "AI-powered analysis of messages and comments to detect harmful content.",
  },
  {
    title: "Track Progress",
    description:
      "Monitor the status of your reports and get insights on actions taken.",
  },
];

const Main = () => {
  return (
    <div className="bg-light text-dark">
      {/* Hero Section with Background Image */}
      <section className="hero-section text-center py-5">
        <Container>
          <h2 className="display-4 fw-bold mb-3">
            Protect Yourself from Online Harassment
          </h2>
          <p className="lead mb-4 mx-auto" style={{ maxWidth: "600px" }}>
            Social Media Harassment Tracker helps you report, track, and prevent
            online harassment with ease and security.
          </p>
          <Button href="/LogRegister" variant="primary" size="lg">
            Report Harassment
          </Button>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <Container>
          <h3 className="text-center mb-5 display-6 fw-bold">Features</h3>
          <Row xs={1} md={3} className="g-4">
            {features.map((feature, index) => (
              <Col key={index}>
                <Card className="h-100 shadow-sm border-0 hover-lift">
                  <Card.Body>
                    <Card.Title className="text-primary fw-bold">
                      {feature.title}
                    </Card.Title>
                    <Card.Text>{feature.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-light text-center py-3 border-top">
        <Container>
          <p className="mb-0 text-muted">
            © 2025 ProtectPulse. All rights reserved.
          </p>
        </Container>
      </footer>
    </div>
  );
};

export default Main;
