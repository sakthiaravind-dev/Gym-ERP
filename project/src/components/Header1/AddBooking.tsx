import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/// <reference types="vite/client" />
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface BookingData {
  date: string;
  id: string;
  name: string;
  phone: string;
  slot: string;
  service: string;
  login_time: string;
}

const AddBooking: React.FC = () => {
  const [bookingData, setBookingData] = useState<BookingData>({
    date: "",
    id: "",
    name: "",
    phone: "",
    slot: "",
    service: "",
    login_time: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setBookingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Booking Data Submitted:", bookingData);

    try {
      const { date, id, name, phone, slot, service, login_time } = bookingData;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error } = await supabase
        .from('bookings')
        .insert([{ date, id, name, phone, slot, service, login_time }]);

      if (error) {
        throw error;
      }

      toast.success("Booking added successfully!");
      setBookingData({
        date: "",
        id: "",
        name: "",
        phone: "",
        slot: "",
        service: "",
        login_time: "",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Failed to add booking: " + error.message);
      } else {
        toast.error("Failed to add booking");
      }
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <ToastContainer />
      <h2 style={{ textAlign: "center", padding: 10, marginBottom: "30px", fontWeight: "bold", fontSize: 18, borderBottom: "1px solid #ccc" }}>Add Booking Slot</h2>
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
              Date
            </label>
            <input
              type="date"
              name="date"
              value={bookingData.date}
              onChange={handleChange}
              placeholder="Date"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              ID
            </label>
            <input
              type="text"
              name="id"
              value={bookingData.id}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Name
            </label>
            <input
              type="text"
              name="name"
              value={bookingData.name}
              onChange={handleChange}
              placeholder="Name"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Phone number
            </label>
            <input
              type="text"
              name="phone"
              value={bookingData.phone}
              onChange={handleChange}
              placeholder="Phone number"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Slot
            </label>
            <input
              type="text"
              name="slot"
              value={bookingData.slot}
              onChange={handleChange}
              placeholder="Slot"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Service
            </label>
            <input
              type="text"
              name="service"
              value={bookingData.service}
              onChange={handleChange}
              placeholder="Service"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13 }}>
              Login Time
            </label>
            <input
              type="time"
              name="login_time"
              value={bookingData.login_time}
              onChange={handleChange}
              placeholder="Enter time"
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

export default AddBooking;