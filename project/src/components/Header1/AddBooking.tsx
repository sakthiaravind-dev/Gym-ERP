import React, { useState } from "react";



interface BookingData {
  sno: string;
  date: string;
  id: string;
  name: string;
  phone: string;
  slot: string;
  service: string;
  loginTime: string;
  
 
}

const AddBooking: React.FC = () => {
   
  const [bookingData, setBookingData] = useState<BookingData>({
    sno: "",
    date: "",
    id: "",
    name: "",
    phone: "",
    slot: "",
    service: "",
    loginTime: "",
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Member Data Submitted:", bookingData);
    // Add logic to handle form submission (e.g., API call)
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
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
              type="id"
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
              name="time"
              value={bookingData.loginTime}
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