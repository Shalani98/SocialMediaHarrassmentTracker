import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "../ModeratorDashboard.css";

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
    navigate("/logregister");
  };

  useEffect(() => {
    fetchComplains();
  }, []);

  return (
    <div className="moderator-bg">
      {/* HEADER */}
      <div className="m-header">
        <h2 className="m-title">Moderator Dashboard</h2>
        <button className="m-btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* REFRESH */}
      <div className="d-flex justify-content-end mb-3">
        <button className="m-btn-refresh" onClick={fetchComplains}>
          Refresh
        </button>
      </div>

      {/* TABLE */}
      {isLoading ? (
        <p className="m-nodata">Loading...</p>
      ) : complains.length === 0 ? (
        <p className="m-nodata">No complaints found.</p>
      ) : (
        <div className="m-card-table">
          <table className="m-table">
            <thead>
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
                        style={{
                          color: "#33e1ff",
                          textDecoration: "underline",
                        }}
                      >
                        View Image
                      </a>
                    ) : (
                      "No Image"
                    )}
                  </td>

                  <td>
                    <span
                      className={
                        item.status === "Pending"
                          ? "badge-pending"
                          : item.status === "Accepted"
                          ? "badge-accepted"
                          : "badge-rejected"
                      }
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    {item.status === "Pending" ? (
                      <>
                        <button
                          className="m-btn-action m-btn-accept me-2"
                          onClick={() =>
                            handleApproval(item.complain_Id, "Accepted")
                          }
                          disabled={acceptStatus}
                        >
                          Accept
                        </button>

                        <button
                          className="m-btn-action m-btn-reject"
                          onClick={() =>
                            handleApproval(item.complain_Id, "Rejected")
                          }
                          disabled={acceptStatus}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <em style={{ color: "#999" }}>No Action</em>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ModeratorDashboard;
