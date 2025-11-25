import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom"; // assuming react-router is used

function ModeratorDashboard() {
  const [complains, setComplains] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptStatus, setAcceptStatus] = useState(false);
  const navigate = useNavigate();

  const fetchComplains = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("https://localhost:7245/api/complain/GetAll");
      setComplains(res.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      alert("Failed to fetch complaints.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (complain_Id, newStatus) => {
    if (!window.confirm(`Are you sure you want to accept this complain?`))
      return;

    setAcceptStatus(true);
    try {
      await axios.post(
        `https://localhost:7245/api/complain/Approve/${complain_Id}`,
        { status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );
      alert(`Complain ${newStatus} successfully!`);
      fetchComplains();
    } catch (error) {
      console.error("Error updating complaint:", error);
      alert("Failed to update complaint status.");
    } finally {
      setAcceptStatus(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    // Redirect to login page
    navigate("/logregister");
  };

  useEffect(() => {
    fetchComplains();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Moderator Dashboard</h2>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-primary" onClick={fetchComplains}>
            Refresh
          </button>
        </div>

        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : complains.length === 0 ? (
          <p className="text-center">No complaints found.</p>
        ) : (
          <div
            className="table-responsive p-3"
            style={{
              background: "rgba(255,255,255,0.9)",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <table className="table table-bordered table-striped table-hover mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complains.map((item, index) => (
                  <tr key={item.complain_Id}>
                    <td>{index + 1}</td>
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
                    <td>
                      <span
                        className={`badge ${
                          item.status === "Pending"
                            ? "bg-warning text-dark"
                            : item.status === "Accepted"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.status === "Pending" ? (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() =>
                              handleApproval(item.complain_Id, "Accepted")
                            }
                            disabled={acceptStatus}
                          >
                            Accept
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              handleApproval(item.complain_Id, "Rejected")
                            }
                            disabled={acceptStatus}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <em>No Action</em>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModeratorDashboard;
