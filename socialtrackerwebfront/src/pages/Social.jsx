import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function Social() {
  const navigate = useNavigate();

  return (
    <div className="hero-section d-flex align-items-center justify-content-center text-center text-white">
      <div>
        <h1 className="display-3 fw-bold">ProtectPulse</h1>
        <button
          className="btn btn-primary btn-lg mt-4"
          onClick={() => navigate("/LogRegister")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Social;
