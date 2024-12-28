import React, { useState } from "react";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface LeadData {
  name: string;
  phoneNumber: string;
  email: string;
  dob: string;
  gender: string;
  occupation: string;
  interested: string;
  planningToJoin: string;
  howYouKnow: string;
  memberAddress: string;
  comment: string;
  status: string;
  communicationMethod: string;
  nextCallDate: string;
  selectTime: string;
}

const AddLead: React.FC = () => {
  const [leadData, setLeadData] = useState<LeadData>({
    name: "",
    phoneNumber: "",
    email: "",
    dob: "",
    gender: "",
    occupation: "",
    interested: "",
    planningToJoin: "",
    howYouKnow: "",
    memberAddress: "",
    comment: "",
    status: "",
    communicationMethod: "",
    nextCallDate: "",
    selectTime: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setLeadData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Lead Data Submitted:", leadData);

    // Insert data into Supabase
    const { data, error } = await supabase
      .from('leads_followups')
      .insert([
        {
          name: leadData.name,
          phone_number: leadData.phoneNumber,
          email: leadData.email,
          dob: leadData.dob,
          gender: leadData.gender,
          occupation: leadData.occupation,
          interested: leadData.interested,
          planning_to_join: leadData.planningToJoin,
          how_you_know: leadData.howYouKnow,
          member_address: leadData.memberAddress,
          comment: leadData.comment,
          status: leadData.status,
          communication_method: leadData.communicationMethod,
          next_call_date: leadData.nextCallDate,
          select_time: leadData.selectTime,
        },
      ]);

    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted successfully:", data);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", padding: 10, marginBottom: "30px", fontWeight: "bold", fontSize: 18, borderBottom: "1px solid #ccc" }}>New Lead</h2>
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
              Name*
            </label>
            <input
              type="text"
              name="name"
              value={leadData.name}
              onChange={handleChange}
              placeholder="Enter Name"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Phone Number*
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={leadData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter Phone Number"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Email*
            </label>
            <input
              type="email"
              name="email"
              value={leadData.email}
              onChange={handleChange}
              placeholder="Enter email"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              DOB
            </label>
            <input
              type="date"
              name="dob"
              value={leadData.dob}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Gender
            </label>
            <select
              name="gender"
              value={leadData.gender}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">-----</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Transgender">Transgender</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Occupation
            </label>
            <input
              type="text"
              name="occupation"
              value={leadData.occupation}
              onChange={handleChange}
              placeholder="Enter occupation"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Interested in
            </label>
            <input
              type="text"
              name="interested"
              value={leadData.interested}
              onChange={handleChange}
              placeholder="Enter your interest"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Planning to join
            </label>
            <select
              name="planningToJoin"
              value={leadData.planningToJoin}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">-----</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Half">Half yearly</option>
              <option value="2 months">2 months</option>
              <option value="4 months">4 months</option>
              <option value="Annual">Annual</option>
              <option value="Black">BLACK FRIDAY</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              How did you come to know about us
            </label>
            <input
              type="text"
              name="howYouKnow"
              value={leadData.howYouKnow}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Member Address
            </label>
            <textarea
              name="memberAddress"
              value={leadData.memberAddress}
              onChange={handleChange}
              placeholder="Enter Address"
              style={{ ...inputStyle, height: "60px" }}
            />
          </div>
        </div>

        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
          <h2 style={{ textAlign: "center", padding: 10, marginBottom: "30px", fontWeight: "bold", fontSize: 18, borderBottom: "1px solid #ccc" }}>Follow-ups</h2>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
            Comment
          </label>
          <textarea
            name="comment"
            value={leadData.comment}
            onChange={handleChange}
            placeholder="Enter comment"
            style={{ ...inputStyle, height: "60px" }}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
            Status*
          </label>
          <select
            name="status"
            value={leadData.status}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">-----</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
            Communication Method*
          </label>
          <select
            name="communicationMethod"
            value={leadData.communicationMethod}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">-----</option>
            <option value="Call">Call</option>
            <option value="SMS">SMS</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
            Next Call Date
          </label>
          <input
            type="date"
            name="nextCallDate"
            value={leadData.nextCallDate}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
            Select a time
          </label>
          <input
            type="time"
            name="selectTime"
            value={leadData.selectTime}
            onChange={handleChange}
            style={inputStyle}
          />
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

export default AddLead;