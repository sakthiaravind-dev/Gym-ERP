import React, { useState } from "react";

const MemberForm = () => {
  const [formData, setFormData] = useState({
    memberId: "",
    memberName: "",
    billDate: "",
    memberJoiningDate: "",
    memberDob: "",
    memberPhoneNumber: "",
    memberEmail: "",
    gender: "",
    identityDocumentType: "",
    documentIdNumber: "",
    memberAddress: "",
    paymentMode: "",
    referredBy: "",
    selectImage: null,
    memberPack: "",
    packAmount: "",
    discountAmount: "0",
    pendingAmount: "0",
    pendingDate: "",
    selectTrainer: "",
    bloodGroup: "",
    weight: "",
    totalMonthPaid: "",
    billingAmount: "",
    registrationFee: "0",
    totalAmount: "",
    tax: "0",
    selectDiet: "",
    height: "",
    emergencyPhoneNumber: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginBottom: "15px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    fontSize: "13px",
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2
        style={{
          textAlign: "center",
          padding: 10,
          marginBottom: "30px",
          fontWeight: "bold",
          fontSize: 18,
          borderBottom: "1px solid #ccc",
        }}
      >
        Member & Transaction Details
      </h2>
      <form>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {/* Column 1 */}
          <div>
            <label style={labelStyle}>Member ID*</label>
            <input
              type="text"
              name="memberId"
              value={formData.memberId}
              onChange={handleInputChange}
              placeholder="Enter Member ID"
              style={inputStyle}
              required
            />
            <label style={labelStyle}>Member Name*</label>
            <input
              type="text"
              name="memberName"
              value={formData.memberName}
              onChange={handleInputChange}
              placeholder="Enter Member Name"
              style={inputStyle}
              required
            />
            <label style={labelStyle}>Member DOB*</label>
            <input
              type="date"
              name="memberDob"
              value={formData.memberDob}
              onChange={handleInputChange}
              style={inputStyle}
              required
            />
            <label style={labelStyle}>Member Email</label>
            <input
              type="email"
              name="memberEmail"
              value={formData.memberEmail}
              onChange={handleInputChange}
              placeholder="Enter Email"
              style={inputStyle}
            />
             <label style={labelStyle}>Identity document type</label>
            <select
              name="identityDocumentType"
              value={formData.identityDocumentType}
              onChange={handleInputChange}
              style={inputStyle}
            >
              <option value="">----</option>
              <option value="Male">Aadhar card</option>
              <option value="Female">PAN card</option>
              <option value="Other">Electoral Photo Identity card</option>
              <option value="Female">Indian Passport</option>
              <option value="Female">Driving license</option>
            </select>
            <label style={labelStyle}>Member Address</label>
            <textarea
              name="memberAddress"
              value={formData.memberAddress}
              onChange={handleInputChange}
              placeholder="Enter Address"
              rows={4}
              style={{ ...inputStyle, resize: "none" }}
            ></textarea>
            <label style={labelStyle}>Referred By</label>
            <input
              type="text"
              name="referredBy"
              value={formData.referredBy}
              onChange={handleInputChange}
              placeholder="Referred By"
              style={inputStyle}
            />
            <label style={labelStyle}>Upload Image</label>
            <input type="file" name="selectImage" onChange={handleInputChange} style={inputStyle} />
          </div>

          {/* Column 2 */}
          <div>
            <label style={labelStyle}>Bill Date*</label>
            <input
              type="date"
              name="billDate"
              value={formData.billDate}
              onChange={handleInputChange}
              style={inputStyle}
              required
            />
            <label style={labelStyle}>Joining Date*</label>
            <input
              type="date"
              name="memberJoiningDate"
              value={formData.memberJoiningDate}
              onChange={handleInputChange}
              style={inputStyle}
              required
            />
            <label style={labelStyle}>Phone Number*</label>
            <input
              type="tel"
              name="memberPhoneNumber"
              value={formData.memberPhoneNumber}
              onChange={handleInputChange}
              placeholder="Enter Phone Number"
              style={inputStyle}
              required
            />
            <label style={labelStyle}>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              style={inputStyle}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Transgender</option>
            </select>
            <label style={labelStyle}>Document ID Number</label>
            <input
              type="text"
              name="documentIdNumber"
              value={formData.documentIdNumber}
              onChange={handleInputChange}
              placeholder="Enter Document ID Number"
              style={inputStyle}
            />
            <label style={labelStyle}>Payment Mode*</label>
            <select
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleInputChange}
              style={inputStyle}
              required
            >
              <option value="">----</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Online">POS</option>
              <option value="Card">Gpay</option>
              <option value="Card">Paytm</option>
              <option value="Card">Amazon Pay</option>
              <option value="Card">Netbanking</option>
            </select>

            <label style={labelStyle}>Blood Group</label>
            <input
              type="text"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleInputChange}
              placeholder="Enter Blood Group"
              style={inputStyle}
            />
          </div>

          {/* Column 3 */}
          <div>
          <label style={labelStyle}>Member Pack*</label>
            <select
              name="memberPack"
              value={formData.memberPack}
              onChange={handleInputChange}
              style={inputStyle}
              required
            >
              <option value="">----</option>
              <option value="Quaterly">Quaterly</option>
              <option value="Half">Half-yearly</option>
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
              <option value="two">2 Months</option>
              <option value="four">4 Months</option>
              <option value="fourteen">12 + 2 Months</option>
              <option value="seven">6 + 1 Month</option>
            </select>
            
            <label style={labelStyle}>Pack Amount*</label>
            <input
              type="number"
              name="packAmount"
              value={formData.packAmount}
              onChange={handleInputChange}
              placeholder="Enter Pack Amount"
              style={inputStyle}
              required
            />
            <label style={labelStyle}>Discount Amount*</label>
            <input
              type="number"
              name="discountAmount"
              value={formData.discountAmount}
              onChange={handleInputChange}
              placeholder="Enter Discount Amount"
              style={inputStyle}
              required
            />
            <label style={labelStyle}>Pending Amount</label>
            <input
              type="number"
              name="pendingAmount"
              value={formData.pendingAmount}
              onChange={handleInputChange}
              placeholder="Pending Amount"
              style={inputStyle}
            />
            <label style={labelStyle}>Pending Date</label>
            <input
              type="date"
              name="pendingDate"
              value={formData.pendingDate}
              onChange={handleInputChange}
              style={inputStyle}
            />
            <label style={labelStyle}>Select Trainer</label>
            <input
              type="text"
              name="selectTrainer"
              value={formData.selectTrainer}
              onChange={handleInputChange}
              placeholder="Select Trainer"
              style={inputStyle}
            />
            <label style={labelStyle}>Weight</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              placeholder="Enter Weight"
              style={inputStyle}
            />
          </div>

          {/* Column 4 */}
          <div>
            <label style={labelStyle}>Total Months Paid*</label>
            <input
              type="number"
              name="totalMonthPaid"
              value={formData.totalMonthPaid}
              onChange={handleInputChange}
              placeholder="Total Months Paid"
              style={inputStyle}
              required
            />
            <label style={labelStyle}>Billing Amount*</label>
            <input
              type="number"
              name="billingAmount"
              value={formData.billingAmount}
              onChange={handleInputChange}
              placeholder="Enter Billing Amount"
              style={inputStyle}
              required
            />
            <label style={labelStyle}>Registration Fee</label>
            <input
              type="number"
              name="registrationFee"
              value={formData.registrationFee}
              onChange={handleInputChange}
              placeholder="Enter Registration Fee"
              style={inputStyle}
            />
            <label style={labelStyle}>Total Amount</label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleInputChange}
              placeholder="Enter Total Amount"
              style={inputStyle}
            />
            <label style={labelStyle}>Tax (%)</label>
            <input
              type="number"
              name="tax"
              value={formData.tax}
              onChange={handleInputChange}
              placeholder="Enter Tax (%)"
              style={inputStyle}
            />
            <label style={labelStyle}>Select Diet</label>
            <select
              name="selectDiet"
              value={formData.selectDiet}
              onChange={handleInputChange}
              style={inputStyle}
            >
              <option value="">Select Diet</option>
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
              <option value="Vegan">Vegan</option>
            </select>
            <label style={labelStyle}>Height</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              placeholder="Enter Height"
              style={inputStyle}
            />
            <label style={labelStyle}>Emergency Phone Number*</label>
            <input
              type="tel"
              name="emergencyPhoneNumber"
              value={formData.emergencyPhoneNumber}
              onChange={handleInputChange}
              placeholder="Enter Emergency Phone Number"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
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

export default MemberForm;