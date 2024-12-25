import React, { useState } from "react";



interface BillData {
  billDate: string;
  id: string;
  contact: string;
  amount: string;
  paymentMode: string;
  memberName: string;
  productName: string;
  pendingAmount: string;

}

const AddBill: React.FC = () => {
   
  const [billData, setBillData] = useState<BillData>({
    billDate: "",
    id: "",
    contact: "",
    amount: "",
    paymentMode: "",
    memberName: "",
    productName: "",
    pendingAmount: "",
  });

 


  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setBillData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Transaction Data Submitted:", billData);
    // Add logic to handle form submission (e.g., API call)
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", padding: 10, marginBottom: "30px", fontWeight: "bold", fontSize: 18, borderBottom: "1px solid #ccc" }}>Add Bill</h2>
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
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13, color: "#71045f" }}>
              Bill Date*
            </label>
            <input
              type="date"
              name="billDate"
              value={billData.billDate}
              onChange={handleChange}
              placeholder="dd-mm-yyyy"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13,color: "#71045f" }}>
              ID*
            </label>
            <input
              type="text"
              name="id"
              value={billData.id}
              onChange={handleChange}
               placeholder="ID"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13, color: "#71045f"}}>
              Contact
            </label>
            <input
              type="text"
              name="contact"
              value={billData.contact}
              onChange={handleChange}
              placeholder="Member Contact"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13, color: "#71045f" }}>
              Amount*
            </label>
            <input
              type="text"
              name="amount"
              value={billData.amount}
              onChange={handleChange}
              placeholder="Amount"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13, color: "#71045f" }}>
              Payment Mode
            </label>
            <select
              name="paymentMode"
              value={billData.paymentMode}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">-----</option>
              <option value="Cash">Cash</option>
              <option value="Credit">Card</option>
              <option value="POS">POS</option>
              <option value="Google pay">Google pay</option>
              <option value="Paytm">Paytm</option>
              <option value="Amazon pay">Amazon pay</option>
              <option value="Netbanking">Netbanking</option>
            </select>
          </div>


          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13, color: "#71045f" }}>
              Member Name
            </label>
            <input
              type="text"
              name="memberName"
              value={billData.memberName}
              onChange={handleChange}
              placeholder="Member Name"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13, color: "#71045f" }}>
             Product Name
            </label>
            <input
              type="text"
              name="productName"
              value={billData.productName}
              onChange={handleChange}
              placeholder="Product Name"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13, color: "#71045f" }}>
              Pending Amount*
            </label>
            <input
              type="text"
              name="pendingAmount"
              value={billData.pendingAmount}
              onChange={handleChange}
              placeholder="Pending Name"
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
            Add to List
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

export default AddBill;