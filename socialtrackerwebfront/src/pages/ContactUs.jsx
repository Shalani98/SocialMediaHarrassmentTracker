import React, { useRef, useState } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import emailjs from "@emailjs/browser";
import "bootstrap/dist/css/bootstrap.min.css";

export const ContactUs = () => {
  const form = useRef();
  const [status, setStatus] = useState(null); // null, "success", "error"

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_v3gkox4", "template_o4sbksu", form.current, {
        publicKey: "rrS0TgWyuA78OekYC",
      })
      .then(
        () => {
          console.log("SUCCESS!");
          setStatus("success");
          form.current.reset();
        },
        (error) => {
          console.log("FAILED...", error.text);
          setStatus("error");
        }
      );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f4ff, #d9f0ff)",
        paddingTop: "60px",
        paddingBottom: "60px",
      }}
    >
      <Container style={{ maxWidth: "700px" }}>
        <Row className="justify-content-center">
          <Col>
            <h2
              className="mb-4 text-center fw-bold"
              style={{ color: "#003366" }}
            >
              Contact Us
            </h2>

            {status === "success" && (
              <Alert variant="success">Your message has been sent!</Alert>
            )}
            {status === "error" && (
              <Alert variant="danger">
                Failed to send message. Please try again.
              </Alert>
            )}

            <Form
              ref={form}
              onSubmit={sendEmail}
              className="p-5 shadow-lg rounded-4 bg-white"
            >
              <Form.Group className="mb-4" controlId="formName">
                <Form.Label className="fw-semibold">Name</Form.Label>
                <Form.Control
                  type="text"
                  name="user_name"
                  placeholder="Enter your name"
                  required
                  style={{ borderRadius: "8px" }}
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formEmail">
                <Form.Label className="fw-semibold">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="user_email"
                  placeholder="Enter your email"
                  required
                  style={{ borderRadius: "8px" }}
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formMessage">
                <Form.Label className="fw-semibold">Message</Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  rows={6}
                  placeholder="Type your message..."
                  required
                  style={{ borderRadius: "8px" }}
                />
              </Form.Group>

              <div className="d-grid">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  style={{ borderRadius: "10px" }}
                >
                  Send Message
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactUs;
