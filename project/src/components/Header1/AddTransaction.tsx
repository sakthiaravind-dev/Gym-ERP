import React, { useState } from "react";



interface TransactionData {
  memberPack: string;
  packAmount: string;
  pendingDate: string;
  pendingAmount: string;
  discountAmount: string;
  bloodGroup: string;
  selectTrainer: string;
  weight: string;
  totalMonthPaid: string;
  billingAmount: string;
  registrationFee: string;
  totalAmount: string;
  tax: string;
  selectDiet: string;
  height: string;
  emergencyPhoneNumber: string;
}

const AddTranscation: React.FC = () => {
   
  const [transactionData, setTransactioData] = useState<TransactionData>({
  memberPack: "",
  packAmount: "",
  pendingDate: "",
  pendingAmount: "",
  discountAmount: "",
  bloodGroup: "",
  selectTrainer: "",
  weight: "",
  totalMonthPaid: "",
  billingAmount: "",
  registrationFee: "",
  totalAmount: "",
  tax: "",
  selectDiet: "",
  height: "",
  emergencyPhoneNumber: "",
  });

 


  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setTransactioData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Transaction Data Submitted:", transactionData);
    // Add logic to handle form submission (e.g., API call)
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", padding: 10, marginBottom: "30px", fontWeight: "bold", fontSize: 18, borderBottom: "1px solid #ccc" }}>Transaction Details</h2>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {/* Column 1 */}
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Member Pack
            </label>
            <input
              type="text"
              name="memberPack"
              value={transactionData.memberPack}
              onChange={handleChange}
              placeholder="Member Pack"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Total Mont Paid*
            </label>
            <input
              type="text"
              name="totalMonthPaid"
              value={transactionData.totalMonthPaid}
              onChange={handleChange}
               placeholder="Total Month"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Pack Amount*
            </label>
            <input
              type="text"
              name="packAmount"
              value={transactionData.packAmount}
              onChange={handleChange}
              placeholder="Member Amount"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Billing Amount*
            </label>
            <input
              type="text"
              name="billingAmount"
              value={transactionData.billingAmount}
              onChange={handleChange}
              placeholder="Bill amount"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Discount Amount*
            </label>
            <input
              type="text"
              name="discountAmount"
              value={transactionData.discountAmount}
              onChange={handleChange}
              placeholder="NaN"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Registration Fee
            </label>
            <input
              type="text"
              name="registrationFee"
              value={transactionData.registrationFee}
              onChange={handleChange}
              placeholder="0"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Pending Amount
            </label>
            <input
              type="text"
              name="pendingAmount"
              value={transactionData.pendingAmount}
              onChange={handleChange}
              placeholder="NaN"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Select Trainer
            </label>
            <select
              name="selectTrainer"
              value={transactionData.selectTrainer}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">-----</option>
              <option value="Lokesh">Lokesh Raj R</option>
              <option value="praveen">Praveen</option>
              
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Select Diet
            </label>
            <select
             
              name="selectDiet"
              value={transactionData.selectDiet}
              onChange={handleChange}
              style={inputStyle}
            >
                 <option value="">-----</option>
             
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Total Amount
            </label>
            <input
              type="text"
              name="totalAmount"
              value={transactionData.totalAmount}
              onChange={handleChange}
              placeholder="NaN"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Pending date
            </label>
            <input
              type="date"
              name="pendingDate"
              value={transactionData.pendingDate}
              onChange={handleChange}
              placeholder="dd-mm-yyyy"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Tax(%)
            </label>
            <input
              name="tax"
              value={transactionData.tax}
              onChange={handleChange}
              style={inputStyle}
            >
              
            </input>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Height
            </label>
            <input
              type="text"
              name="height"
              value={transactionData.height}
              onChange={handleChange}
              placeholder="Height"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Weight
            </label>
            <input
              type="text"
              name="weight"
              value={transactionData.weight}
              onChange={handleChange}
              placeholder="Weight"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Emergency Phone Number*
            </label>
            <input
              type="text"
              name="emergencyPhoneNumber"
              value={transactionData.emergencyPhoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              style={inputStyle}
            />
          </div>
          </div>
          
            
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            type="submit"
            style={{
              padding: "5px 15px",
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
      </form>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

export default AddTranscation;