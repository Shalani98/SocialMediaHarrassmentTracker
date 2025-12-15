import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "../AdminDashboard.css"; // Make sure your enhanced CSS is imported

function AdminDashboard() {
  const [complains, setComplains] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentTime, setCurrentTime] = useState(new Date());

  const navigate = useNavigate();

  // Fetch complaints
  useEffect(() => {
    const fetchComplains = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          "https://localhost:7245/api/complain/GetAll"
        );
        setComplains(res.data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComplains();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter complaints
  const filteredComplains =
    filterStatus === "All"
      ? complains
      : complains.filter((c) => c.status === filterStatus);

  // PDF generation
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Social Media Complaints Report", 14, 22);

    const tableColumn = ["ID", "Description", "Image URL", "Status"];
    const tableRows = filteredComplains.map((c) => [
      c.complain_Id,
      c.description,
      c.imageUrl,
      c.status,
    ]);

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 30 });
    doc.save("complaints_report.pdf");
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/logregister");
  };

  // Compute summary counts
  const total = complains.length;
  const pending = complains.filter((c) => c.status === "Pending").length;
  const accepted = complains.filter((c) => c.status === "Accepted").length;
  const rejected = complains.filter((c) => c.status === "Rejected").length;

  return (
    <div className="admin-bg">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <button className="admin-btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Summary Cards */}
        <div className="admin-summary">
          <div className="summary-card">
            <h3>Total Complaints</h3>
            <p>{total}</p>
          </div>
          <div className="summary-card">
            <h3>Pending</h3>
            <p>{pending}</p>
          </div>
          <div className="summary-card">
            <h3>Accepted</h3>
            <p>{accepted}</p>
          </div>
          <div className="summary-card">
            <h3>Rejected</h3>
            <p>{rejected}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="admin-controls">
          <div className="d-flex align-items-center gap-2">
            <label className="fw-semibold mb-0">Status Filter:</label>
            <select
              className="admin-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <button
            className="admin-btn-action admin-btn-pdf"
            onClick={generatePDF}
          >
            Generate PDF Report
          </button>
        </div>
        <div className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <div className="clock">
            {currentTime.toLocaleTimeString()} {/* Shows HH:MM:SS */}
          </div>
          <button className="admin-btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Table */}
        <div className="table-card">
          {isLoading ? (
            <p className="admin-nodata">Loading complaints...</p>
          ) : filteredComplains.length === 0 ? (
            <p className="admin-nodata">No complaints found.</p>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Description</th>
                    <th>Image</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplains.map((item, index) => (
                    <tr key={item.complain_Id}>
                      <td>{index + 1}</td>
                      <td>{item.description}</td>
                      <td>
                        {item.imageUrl ? (
                          <a
                            href={item.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-info"
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
