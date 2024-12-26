import React, { useState } from "react";

interface RenewalData {
  expiredDate: string;
  pendingAmount: string;
  memberId: string;
}

const RenewalForm: React.FC = () => {

    const [renewalData, setRenewalData] = useState<RenewalData>({
        expiredDate: "",
        pendingAmount: "",
        memberId: "",
      
      });
    
  // State for left form
  const [leftForm, setLeftForm] = useState({
    billDate: "2024-12-23",
    memberName: "Dinesh D",
    totalMonthPaid: "",
    billingAmount: 3500,
    discountAmount: 0,
    pendingAmount: 0,
    totalAmount: 3500,
  });

  // State for right form
  const [rightForm, setRightForm] = useState({
    startDate: "2024-12-23",
    memberPack: "",
    packAmount: "",
    tax: 0,
    paymentMode: "",
    pendingDate: "",
    billState: "Renewal",
  });

  const handleRenewalFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRenewalData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  

  // Handle changes in the left form
  const handleLeftFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLeftForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle changes in the right form
  const handleRightFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRightForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTaxCalculator = () => {
    alert("Tax Calculator clicked!"); // Replace with actual tax calculation logic
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
      {/* Header with Tax Calculator Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "20px" }}>
          <h3>
            Expired Date: <span style={{ color: "purple" }}>{
            <input
            type="text"
            name="expiredDate"
            value={renewalData.expiredDate}
            onChange={handleRenewalFormChange}
            style={inputStyle}
          /> 
          }</span>
          </h3>
          <h3>
            Pending Amount: <span style={{ color: "purple" }}>{
                <input
                type="text"
                name="pendingAmount"
                value={renewalData.pendingAmount}
                onChange={handleRenewalFormChange}
                style={inputStyle}
              /> 
              }</span>
          </h3>
          <h3>
            Member ID: <span style={{ color: "purple" }}>{
                <input
                type="text"
                name="memberId"
                value={renewalData.memberId}
                onChange={handleRenewalFormChange}
                style={inputStyle}
              /> 
              }</span>
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
          <div style={{ marginBottom: "10px" }}>
            <label style={{color: "#71045f"}}>Bill Date*</label>
            <input
              type="date"
              name="billDate"
              value={leftForm.billDate}
              onChange={handleLeftFormChange}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "10px"}}>
            <label style={{color: "#71045f"}}>Member Name</label>
            <input
              type="text"
              name="memberName"
              value={leftForm.memberName}
              onChange={handleLeftFormChange}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{color: "#71045f"}}>Total Month Paid*</label>
            <input
              type="text"
              name="totalMonthPaid"
              value={leftForm.totalMonthPaid}
              onChange={handleLeftFormChange}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{color: "#71045f"}}>Billing Amount*</label>
            <input
              type="number"
              name="billingAmount"
              value={leftForm.billingAmount}
              onChange={handleLeftFormChange}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{color: "#71045f"}}>Discount Amount*</label>
            <input
              type="number"
              name="discountAmount"
              value={leftForm.discountAmount}
              onChange={handleLeftFormChange}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{color: "#71045f"}} >Pending Amount</label>
            <input
              type="number"
              name="pendingAmount"
              value={leftForm.pendingAmount}
              onChange={handleLeftFormChange}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{color: "#71045f"}}>Total Amount</label>
            <input
              type="number"
              name="totalAmount"
              value={leftForm.totalAmount}
              onChange={handleLeftFormChange}
              style={inputStyle}
            />
          </div>
        </form>

        {/* Right Form */}
        <form style={{ flex: 1, border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
          <div style={{ marginBottom: "10px" }}>
            <label style={{color: "#71045f"}}>Start Date*</label>
            <input
              type="date"
              name="startDate"
              value={rightForm.startDate}
              onChange={handleRightFormChange}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{color: "#71045f"}}>Member Pack</label>
            <input
              type="text"
              name="memberPack"
              value={rightForm.memberPack}
              onChange={handleRightFormChange}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{color: "#71045f"}}>Pack Amount*</label>
            <input
              type="text"
              name="packAmount"
              value={rightForm.packAmount}
              onChange={handleRightFormChange}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{color: "#71045f"}}>Tax*</label>
            <input
              type="number"
              name="tax"
              value={rightForm.tax}
              onChange={handleRightFormChange}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{color: "#71045f"}}>Payment Mode*</label>
            <input
              type="text"
              name="paymentMode"
              value={rightForm.paymentMode}
              onChange={handleRightFormChange}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{color: "#71045f"}}>Pending Date</label>
            <input
              type="date"
              name="pendingDate"
              value={rightForm.pendingDate}
              onChange={handleRightFormChange}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{color: "#71045f"}}>Bill State*</label>
            <input
              type="text"
              name="billState"
              value={rightForm.billState}
              onChange={handleRightFormChange}
              style={inputStyle}
            />
          </div>
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