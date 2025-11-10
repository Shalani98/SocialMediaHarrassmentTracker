import React, { useRef, useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
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
    <Container
      style={{ maxWidth: "600px", marginTop: "80px", marginBottom: "50px" }}
    >
      <h2 className="mb-4 text-center">Contact Us</h2>

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
        className="p-4 border rounded shadow-sm bg-light"
      >
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="user_name"
            placeholder="Enter your name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="user_email"
            placeholder="Enter your email"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formMessage">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            name="message"
            rows={5}
            placeholder="Type your message..."
            required
          />
        </Form.Group>

        <div className="d-grid">
          <Button type="submit" variant="primary" size="lg">
            Send Message
          </Button>
        </div>
      </Form>
    </Container>
  );
};
export default ContactUs;
