import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RenewalForm: React.FC = () => {
  const [renewalData, setRenewalData] = useState({
    expiredDate: "",
    pendingAmount: "",
    memberId: "",
  });

  const [leftForm, setLeftForm] = useState({
    billDate: "2024-12-23",
    memberName: "Dinesh D",
    totalMonthPaid: "",
    billingAmount: 3500,
    discountAmount: 0,
    pendingAmount: 0,
    totalAmount: 3500,
  });

  const [rightForm, setRightForm] = useState({
    startDate: "2024-12-23",
    memberPack: "",
    packAmount: "",
    tax: 0,
    paymentMode: "",
    pendingDate: "",
    billState: "Renewal",
  });

  const navigate = useNavigate();

  const handleRenewalFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRenewalData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLeftFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLeftForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRightFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRightForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTaxCalculator = () => {
    navigate("/taxcalculator");
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
      {/* Header with Tax Calculator Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "20px" }}>
          <h3>
            Expired Date:{" "}
            <span style={{ color: "purple" }}>
              <input
                type="text"
                name="expiredDate"
                value={renewalData.expiredDate}
                onChange={handleRenewalFormChange}
                style={inputStyle}
              />
            </span>
          </h3>
          <h3>
            Pending Amount:{" "}
            <span style={{ color: "purple" }}>
              <input
                type="text"
                name="pendingAmount"
                value={renewalData.pendingAmount}
                onChange={handleRenewalFormChange}
                style={inputStyle}
              />
            </span>
          </h3>
          <h3>
            Member ID:{" "}
            <span style={{ color: "purple" }}>
              <input
                type="text"
                name="memberId"
                value={renewalData.memberId}
                onChange={handleRenewalFormChange}
                style={inputStyle}
              />
            </span>
          </h3>
        </div>
        <button
          onClick={handleTaxCalculator}
          style={{
            backgroundColor: "#2485bd",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          Tax Calculator
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {/* Left Form */}
        <form style={{ flex: 1, border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
          {/* Left Form Inputs */}
          {Object.entries(leftForm).map(([key, value]) => (
            <div key={key} style={{ marginBottom: "10px" }}>
              <label style={{ color: "#71045f" }}>
                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              </label>
              <input
                type="text"
                name={key}
                value={value}
                onChange={handleLeftFormChange}
                style={inputStyle}
              />
            </div>
          ))}
        </form>

        {/* Right Form */}
        <form style={{ flex: 1, border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
          {/* Right Form Inputs */}
          {Object.entries(rightForm).map(([key, value]) => (
            <div key={key} style={{ marginBottom: "10px" }}>
              <label style={{ color: "#71045f" }}>
                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              </label>
              <input
                type="text"
                name={key}
                value={value}
                onChange={handleRightFormChange}
                style={inputStyle}
              />
            </div>
          ))}
        </form>
      </div>

      <button
        style={{
          display: "block",
          margin: "20px auto",
          padding: "5px 10px",
          backgroundColor: "#2485bd",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Proceed
      </button>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "8px",
  marginTop: "5px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

export default RenewalForm;
