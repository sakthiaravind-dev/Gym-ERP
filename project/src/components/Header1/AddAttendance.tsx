/// <reference types="vite/client" />
import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Initialize Supabase client using environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

interface AttendanceData {
  mem_id: string;
  mem_name: string;
  date: string;
  login_time: string;
  logout_time: string;
}

const AddAttendance: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({
    mem_id: "",
    mem_name: "",
    date: "",
    login_time: "",
    logout_time: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setAttendanceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { mem_id, mem_name, date, login_time, logout_time } = attendanceData;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase
      .from("attendance")
      .insert([
        {
          mem_id,
          mem_name,
          date,
          login_time,
          logout_time,
        },
      ]);

    if (error) {
      toast.error("Failed to add attendance: " + error.message);
    } else {
      toast.success("Attendance added successfully!");
      setAttendanceData({
        mem_id: "",
        mem_name: "",
        date: "",
        login_time: "",
        logout_time: "",
      });
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      
      <ToastContainer />
      
      <h2 style={{ textAlign: "center", padding: 10, marginBottom: "30px", fontWeight: "bold", fontSize: 18, borderBottom: "1px solid #ccc" }}>
        Add Attendance
      </h2>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <label style={labelStyle}>Member ID*</label>
            <input
              type="text"
              name="mem_id"
              value={attendanceData.mem_id}
              onChange={handleChange}
              placeholder="Member ID"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Member Name*</label>
            <input
              type="text"
              name="mem_name"
              value={attendanceData.mem_name}
              onChange={handleChange}
              placeholder="Member Name"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Date*</label>
            <input
              type="date"
              name="date"
              value={attendanceData.date}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Login Time*</label>
            <input
              type="time"
              name="login_time"
              value={attendanceData.login_time}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Logout Time*</label>
            <input
              type="time"
              name="logout_time"
              value={attendanceData.logout_time}
              onChange={handleChange}
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
            Add Attendance
          </button>
        </div>
      </form>
    </div>
  );
};

const labelStyle = {
  display: "block",
  marginBottom: "5px",
  fontWeight: "bold",
  fontSize: 13,
  color: "#71045f",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

export default AddAttendance;