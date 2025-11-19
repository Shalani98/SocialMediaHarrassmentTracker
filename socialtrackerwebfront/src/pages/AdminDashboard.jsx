import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminDashboard() {
  const [complains, setComplains] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");

  // Fetch complaints from API
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

  // Filter complaints based on status
  const filteredComplains =
    filterStatus === "All"
      ? complains
      : complains.filter((c) => c.status === filterStatus);

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Social Media Complaints Report", 14, 22);

    const tableColumn = ["ID", "Description", "ImageUrl", "Status"];
    const tableRows = [];

    filteredComplains.forEach((c) => {
      tableRows.push([c.complain_Id, c.description, c.imageUrl, c.status]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save("complaints_report.pdf");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f7fa, #e1bee7)",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >
      <div className="container">
        <h2 className="mb-4 text-center fw-bold">Admin Dashboard</h2>

        {/* Controls */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div className="d-flex align-items-center">
            <label className="me-2 fw-semibold">Status Filter:</label>
            <select
              className="form-select d-inline-block w-auto"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={generatePDF}>
            Generate PDF Report
          </button>
        </div>

        {/* Table */}
        {isLoading ? (
          <p className="text-center">Loading complaints...</p>
        ) : filteredComplains.length === 0 ? (
          <p className="text-center">No complaints found.</p>
        ) : (
          <div
            className="table-responsive p-3"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <table className="table table-bordered table-striped table-hover mb-0">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th>Image URL</th>
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

export default AdminDashboard;
