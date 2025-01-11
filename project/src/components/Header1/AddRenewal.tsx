import React, { useState } from "react";



interface RenewalData {
  memberId: string
  memberName: string;
  expiryDate: string;
  extendTo: string;
  phoneNumber: string;
  packAmount: string;
  totalAmount: string;
  startDate: string;
  

}

const AddRenewal: React.FC = () => {
   
  const [renewalData, setRenewalData] = useState<RenewalData>({
  memberId: "",
  memberName: "",
  expiryDate: "",
  extendTo: "",
  phoneNumber: "",
  packAmount: "",
  totalAmount: "",
  startDate: "",
  });

 


  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setRenewalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Transaction Data Submitted:", renewalData);
    // Add logic to handle form submission (e.g., API call)
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", padding: 10, marginBottom: "30px", fontWeight: "bold", fontSize: 18, borderBottom: "1px solid #ccc" }}>Add Renewal Info</h2>
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
              Member ID
            </label>
            <input
              type="text"
              name="memberID"
              value={renewalData.memberId}
              onChange={handleChange}
              placeholder="dd-mm-yyyy"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13,color: "#71045f" }}>
              Member Name
            </label>
            <input
              type="text"
              name="name"
              value={renewalData.memberName}
              onChange={handleChange}
               placeholder="Name"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13, color: "#71045f"}}>
              Expiry date
            </label>
            <input
              type="date"
              name="Expirtdate"
              value={renewalData.expiryDate}
              onChange={handleChange}
              placeholder="Expiry date"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13, color: "#71045f" }}>
              Extend To
            </label>
            <input
              type="date"
              name="ExtendTo"
              value={renewalData.extendTo}
              onChange={handleChange}
              placeholder="Extend to"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13, color: "#71045f" }}>
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={renewalData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13, color: "#71045f" }}>
              Total Amount
            </label>
            <input
              type="text"
              name="Totalamount"
              value={renewalData.totalAmount}
              onChange={handleChange}
              placeholder="Total Amount"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13, color: "#71045f" }}>
              Start date
            </label>
            <input
              type="date"
              name="startDate"
              value={renewalData.startDate}
              onChange={handleChange}
              placeholder="start date"
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

export default AddRenewal;