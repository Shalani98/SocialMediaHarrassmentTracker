import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function ModeratorDashboard() {
  const [complains, setComplains] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptStatus, setAcceptStatus] = useState(false);

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

  useEffect(() => {
    fetchComplains();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Moderator Dashboard</h2>

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" onClick={fetchComplains}>
          Refresh
        </button>
      </div>

      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : complains.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover">
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
                          : item.status === "Rejected"
                          ? "bg-danger"
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
                          onClick={
                            () => handleApproval(item.complain_Id, "Accepted") // match backend
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
  );
}

export default ModeratorDashboard;
