import React, { useState } from "react";

interface ProfileData {
  name: string;
  email: string;
  companyBillingName: string;
  branchBillingName: string;
  branchBillingAddress: string;
}

const ProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    companyBillingName: "",
    branchBillingName: "",
    branchBillingAddress: "",
  });

  // Handle input changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Profile Data Submitted:", profileData);
    // Perform additional actions, such as sending data to a backend API
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Profile Section */}
      <section style={{ marginBottom: "3px", borderBottom: "1px solid #ccc", paddingBottom: "20px" }}>
        <h2>Profile</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", marginTop: "18px", color: "#71045f", fontSize: 13}}>Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#71045f", fontSize: 13 }}>Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#71045f", fontSize: 13}}>Company Billing Name</label>
            <input
              type="text"
              name="companyBillingName"
              value={profileData.companyBillingName}
              onChange={handleChange}
              placeholder="Enter company billing name"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "5px 15px",
              backgroundColor: "#2485bd",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: 15
            }}
          >
            Proceed
          </button>
        </form>
      </section>

      {/* Branch Info Section */}
      <section>
        <h2>Branch Info</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", marginTop: "18px", color: "#71045f", fontSize: 13 }}>Company Billing Name</label>
            <input
              type="text"
              name="branchBillingName"
              value={profileData.branchBillingName}
              onChange={handleChange}
              placeholder="Enter company billing name"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#71045f", fontSize: 13 }}>Company Billing Address</label>
            <input
              type="text"
              name="branchBillingAddress"
              value={profileData.branchBillingAddress}
              onChange={handleChange}
              placeholder="Enter company billing address"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "5px 15px",
              backgroundColor: "#2485bd",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: 15
            }}
          >
            Proceed
          </button>
        </form>
      </section>
    </div>
  );
};

export default ProfilePage;
