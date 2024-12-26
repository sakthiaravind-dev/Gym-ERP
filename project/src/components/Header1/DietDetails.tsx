import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const DietDetailsPage: React.FC = () => {
  const [dietDetails, setDietDetails] = useState("");

  const handleSave = () => {
    alert("Diet details saved!");
    console.log("Diet Details:", dietDetails);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "25px" }}>
      <h1 style={{ textAlign: "center", padding: 10, marginBottom: "30px", fontWeight: "bold", fontSize: 18, borderBottom: "1px solid #ccc" }}>Diet Details</h1>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "10px",
          minHeight: "500px",
          backgroundColor: "#fff",
        }}
      >
        <ReactQuill
          value={dietDetails}
          onChange={setDietDetails}
          style={{ height: "500px" }}
          placeholder="Enter diet details here..."
        />
      </div>
      <button
        onClick={handleSave}
        style={{
          display: "flex",
          margin: "20px",
          marginTop: "40px",
          padding: "5px 15px",
          fontSize: "16px",
          backgroundColor: "#2485bd",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Save
      </button>
    </div>
  );
};

export default DietDetailsPage;