import React, { useState } from "react";
import { Container, Button, Card, Row, Col, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

function VictimDashboard() {
  const [active, setActive] = useState("Create Complain");
  const [complain, setComplain] = useState({
    description: "",
    status: "Pending",
    imageFile: "",
  });
  const [complains, setComplains] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplain((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (active === "Create Complain") {
      if (!complain.description.trim() || !complain.imageUrl.trim()) {
        alert("Please fill out all required fields.");
        return;
      }

      setIsLoading(true);
      console.log("Sending POST payload:", complain);
      axios
        .post("https://localhost:7245/api/complain/create", complain, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          alert("Complain Created Successfully");
          setComplain({ description: "", status: "Pending", imageUrl: "" });
          setActive("View Complains");
        })
        .catch((error) => {
          console.error("Complain Creation Error:", error.response?.data);
          alert(
            "Complain Creation Failed: " +
              (error.response?.data?.message || error.message)
          );
        })
        .finally(() => setIsLoading(false));
    } else if (active === "View Complains") {
      setIsLoading(true);
      axios
        .get("https://localhost:7245/api/complain/GetAll", {
          headers: {
            // Add Authorization if needed
          },
        })
        .then((response) => {
          console.log("Fetched complaints:", response.data);
          setComplains(response.data); // Adjust if nested: response.data.data
        })
        .catch((error) => {
          console.error("Fetch Complaints Error:", error.response?.data);
          alert(
            "Failed to fetch complaints: " +
              (error.response?.data?.message || error.message)
          );
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="bg-light text-dark" style={{ minHeight: "100vh" }}>
      <section className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={7}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <h2 className="text-center mb-4">{active}</h2>
                  <div className="d-flex justify-content-center mb-4">
                    <Button
                      variant={
                        active === "Create Complain"
                          ? "primary"
                          : "outline-primary"
                      }
                      className="me-2"
                      onClick={() => {
                        console.log("Switching to Create Complain");
                        setActive("Create Complain");
                      }}
                    >
                      Create Complain
                    </Button>
                    <Button
                      variant={
                        active === "View Complains"
                          ? "primary"
                          : "outline-primary"
                      }
                      onClick={() => {
                        console.log("Switching to View Complains");
                        setActive("View Complains");
                      }}
                    >
                      View Complains
                    </Button>
                  </div>

                  <Form onSubmit={handleSubmit}>
                    {active === "Create Complain" && (
                      <>
                        <Form.Group className="mb-3" controlId="description">
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="description"
                            placeholder="Enter description"
                            rows={3}
                            value={complain.description}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="imageFile">
                          <Form.Label>Image File</Form.Label>
                          <Form.Control
                            type="file"
                            name="imageFile"
                            placeholder="Enter image File"
                            value={complain.imageFile}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </>
                    )}

                    <Button
                      variant={
                        active === "Create Complain" ? "primary" : "success"
                      }
                      type="submit"
                      className="w-100"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? "Loading..."
                        : active === "Create Complain"
                        ? "Submit Complain"
                        : "Refresh Complains"}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
              {active === "View Complains" && (
                <>
                  {isLoading && <p className="text-center mt-4">Loading...</p>}
                  <table className="table table-bordered mt-4">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Image URL</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complains.length > 0 ? (
                        complains.map((item, index) => (
                          <tr key={index}>
                            <td>{item.description}</td>
                            <td>
                              {item.imageUrl ? (
                                <a
                                  href={item.imageUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View Image
                                </a>
                              ) : (
                                "No Image"
                              )}
                            </td>
                            <td>{item.status}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center">
                            No complaints found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default VictimDashboard;
