import React, { useState } from "react";

const TaxCalculator: React.FC = () => {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [amountWithoutTax, setAmountWithoutTax] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);

  const calculateTax = () => {
    const taxRate = 18 / 100; // 18% tax rate
    const taxAmount = totalAmount * taxRate;
    const amountExcludingTax = totalAmount - taxAmount;

    setTax(taxAmount);
    setAmountWithoutTax(amountExcludingTax);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translate(-50%, -20%)",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "20px",
        width: "400px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h3 style={{ textAlign: "center", color: "purple", marginBottom: "20px" }}>
        Tax Calculator
      </h3>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Total Amount</label>
        <input
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Amount (Excluding Tax)</label>
        <input
          type="text"
          value={amountWithoutTax.toFixed(2)}
          readOnly
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "#f9f9f9",
          }}
        />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Tax</label>
        <input
          type="text"
          value={tax.toFixed(2)}
          readOnly
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "#f9f9f9",
          }}
        />
      </div>
      <button
        onClick={calculateTax}
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          backgroundColor: "#2485bd",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          fontSize: "15px",
          cursor: "pointer",
        }}
      >
        Calculate Tax
      </button>
    </div>
  );
};

export default TaxCalculator;