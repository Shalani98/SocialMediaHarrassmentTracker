import React, { useState, useEffect } from "react";
import { FiHome, FiMessageCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../VictimDashboard.css";
import logVideo from "../video/log.mp4";

function VictimDashboard() {
  const navigate = useNavigate();

  // ACTIVE TAB
  const [active, setActive] = useState("Create Complain");

  // SINGLE COMPLAINT (FORM)
  const [complain, setComplain] = useState({
    description: "",
    status: "Pending",
    imageFile: "",
  });

  // LIST OF COMPLAINTS
  const [complains, setComplains] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  //List of users
  const [user, setUser] = useState(null);

  //const [user, setUsers] = useState([]);
  // USER FROM LOCAL STORAGE

  // COUNT VALUES
  const totalComplains = complains.length;
  const pendingCount = complains.filter((c) => c.status === "Pending").length;
  const acceptedCount = complains.filter((c) => c.status === "Accepted").length;
  const rejectedCount = complains.filter((c) => c.status === "Rejected").length;

  // FETCH WHEN TAB CHANGES
  useEffect(() => {
    fetchComplains();
  }, []);

  // API – GET ALL COMPLAINS
  const fetchComplains = () => {
    setIsLoading(true);
    axios
      .get("https://localhost:7245/api/complain/GetAll")
      .then((response) => {
        setComplains(response.data);
      })
      .catch((error) => {
        alert(
          "Failed to fetch complaints: " +
            (error.response?.data?.message || error.message)
        );
      })
      .finally(() => setIsLoading(false));
  };

  // HANDLE INPUT CHANGES
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imageFile") {
      setComplain((prev) => ({
        ...prev,
        imageFile: files[0], // store actual file
      }));
    } else {
      setComplain((prev) => ({ ...prev, [name]: value }));
    }
  };

  // SUBMIT FORM
  const handleSubmit = (e) => {
    e.preventDefault();

    if (active === "Create Complain") {
      if (!complain.description.trim() || !complain.imageFile) {
        alert("Please fill out all required fields.");
        return;
      }

      setIsLoading(true);

      console.log("Sending  POST payload:", complain);

      axios
        .post("https://localhost:7245/api/complain/create", complain, {
          headers: { "Content-Type": "application/json" },
        })
        .then(() => {
          alert("Complain Created Successfully");
          setComplain({
            description: "",
            status: "Pending",
            imageUrl: "",
          });
          setActive("View Complains");
        })
        .catch((error) => {
          alert(
            "Complain Creation Failed: " +
              (error.response?.data?.message || error.message)
          );
        })
        .finally(() => setIsLoading(false));
    } else if (active === "View Complains") {
      setIsLoading(true);
      axios
        .get("https://localhost:7245/api/complain/GetAll")
        .then((response) => {
          setComplains(response.data);
        })
        .catch((error) => {
          alert(
            "Failed to fetch complaints: " +
              (error.response?.data?.message || error.message)
          );
        })
        .finally(() => setIsLoading(false));
    }
  };

  // LOAD USER FROM LOCAL STORAGE ON MOUNT
  useEffect(() => {
    const stored = localStorage.getItem("User");
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);
        console.log("Loaded user from localStorage:", parsedUser); // For debugging
      } catch (err) {
        console.error("Corrupted user data in localStorage", err);
        localStorage.removeItem("User");
        setUser(null);
      }
    } else {
      console.log("No user data in localStorage - user not logged in");
      setUser(null);
    }
  }, []);

  // LOGOUT
  const handleLogout = () => {
    navigate("/LogRegister");
  };

  return (
    <div>
      <video className="video-bg" autoPlay loop muted playsInline>
        <source src={logVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="dashboard-container">
        {/* SIDEBAR */}
        <div className="sidebar">
          <ul className="menu-list">
            <div className="dashboard-header"></div>
            <h2>Welcome </h2>
            <li onClick={() => setActive("View Complains")}>
              <FiMessageCircle /> Complaints
            </li>

            <li
              onClick={handleLogout}
              style={{ color: "red", cursor: "pointer" }}
            >
              Logout
            </li>
          </ul>
        </div>

        {/* MAIN CONTENT */}
        <div className="main-content">
          {/* TOP BAR */}

          {/* CARDS */}
          <div className="cards-row">
            <div className="card">
              <h3>Total Complaints</h3>
              <div className="circle-value">{totalComplains}</div>
            </div>

            <div className="card">
              <h3>Pending</h3>
              <div className="circle-value">{pendingCount}</div>
            </div>

            <div className="card">
              <h3>Accepted</h3>
              <div className="circle-value">{acceptedCount}</div>
            </div>

            <div className="card">
              <h3>Rejected</h3>
              <div className="circle-value">{rejectedCount}</div>
            </div>
          </div>

          {/* FORM AREA */}
          <div className="form-area">
            <h2 className="form-title">{active}</h2>
            {active !== "Home" && (
              <div className="form-buttons">
                <button
                  className={active === "Create Complain" ? "btn-active" : ""}
                  onClick={() => setActive("Create Complain")}
                >
                  ➕ Create Complain
                </button>

                <button
                  className={active === "View Complains" ? "btn-active" : ""}
                  onClick={() => setActive("View Complains")}
                >
                  📄 View Complains
                </button>
              </div>
            )}

            {/* CREATE COMPLAIN FORM */}
            {active === "Create Complain" && (
              <form onSubmit={handleSubmit}>
                <label>Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={complain.description}
                  onChange={handleChange}
                  required
                />

                <label>Image File</label>
                <input
                  type="file"
                  name="imageFile"
                  onChange={handleChange}
                  required
                />

                <button
                  className="submit-btn"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Submit Complaint"}
                </button>
              </form>
            )}

            {/* TABLE – VIEW COMPLAINS */}
            {active === "View Complains" && (
              <>
                {isLoading && <p>Loading...</p>}

                <table className="complain-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Image</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complains.length > 0 ? (
                      complains.map((item, i) => (
                        <tr key={i}>
                          <td>{item.description}</td>
                          <td>
                            {item.imageUrl ? (
                              <a
                                href={item.imageUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                View
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default VictimDashboard;
