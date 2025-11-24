import React, { useState } from "react";
import { Container, Button, Card, Row, Col, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../logregisterStyle.css";
import logVideo from "../video/log.mp4"; // adjust path based on file location

function LogRegister() {
  const [active, setActive] = useState("Register");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phoneNumber: "",
    address: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (active === "Register") {
      axios
        .post("https://localhost:7245/api/user/register", formData)
        .then(() => {
          alert("Registration Successful");
          setActive("Login"); // Switch to Login tab
        })
        .catch((error) => {
          alert("Registration Failed: " + error.response?.data?.message);
        });
    } else if (active === "Login") {
      axios
        .post("https://localhost:7245/api/user/login", {
          email: formData.email,
          role: formData.role,
          password: formData.password,
        })
        .then((res) => {
          alert("Login Successful");
          if (formData.role === "Victim") {
            navigate("/VictimDashboard");
          } else if (formData.role === "Moderator") {
            navigate("/ModeratorDashboard");
          } else if (formData.role === "Admin") {
            navigate("/AdminDashboard");
          }
        })
        .catch((error) => {
          alert("Login Failed: " + error.response?.data?.message);
        });
    }
  };

  return (
    <div>
      {/* Video Background */}
      <video className="video-bg" autoPlay loop muted playsInline>
        <source src={logVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="overlay"></div>
      <div className="bg-light text-dark" style={{ minHeight: "100vh" }}>
        <section className="py-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={7}>
                <Card className="shadow-sm border-0">
                  <Card.Body>
                    <h2 className="text-center mb-4">{active}</h2>

                    {/* Tabs */}
                    <div className="d-flex justify-content-center mb-4">
                      <Button
                        variant={
                          active === "Login" ? "primary" : "outline-primary"
                        }
                        className="me-2"
                        onClick={() => setActive("Login")}
                      >
                        Login
                      </Button>
                      <Button
                        variant={
                          active === "Register" ? "success" : "outline-success"
                        }
                        onClick={() => setActive("Register")}
                      >
                        Register
                      </Button>
                    </div>

                    {/* Form */}
                    <Form onSubmit={handleSubmit}>
                      {active === "Register" && (
                        <>
                          <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              placeholder="Enter full name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              placeholder="Enter email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                              type="password"
                              name="password"
                              placeholder="Enter password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="role">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                              name="role"
                              value={formData.role}
                              onChange={handleChange}
                              required
                            >
                              <option value="Admin">Admin</option>
                              <option value="Moderator">Moderator</option>
                              <option value="Victim">Victim</option>
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="phoneNumber">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                              type="text"
                              name="phoneNumber"
                              placeholder="Enter phone number"
                              value={formData.phoneNumber}
                              onChange={handleChange}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="address">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                              as="textarea"
                              name="address"
                              placeholder="Enter address"
                              rows={3}
                              value={formData.address}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </>
                      )}

                      {active === "Login" && (
                        <>
                          <Form.Group className="mb-3" controlId="role">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                              name="role"
                              value={formData.role}
                              onChange={handleChange}
                              required
                            >
                              <option value="Admin">Admin</option>
                              <option value="Moderator">Moderator</option>
                              <option value="Victim">Victim</option>
                            </Form.Select>
                          </Form.Group>
                          <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              placeholder="Enter email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                              type="password"
                              name="password"
                              placeholder="Enter password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </>
                      )}

                      <Button
                        variant={active === "Login" ? "primary" : "success"}
                        type="submit"
                        className="w-100"
                      >
                        {active}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </div>
  );
}

export default LogRegister;
