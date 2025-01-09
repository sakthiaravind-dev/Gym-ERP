import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ProfileData {
  id?: number;
  name: string;
  email: string;
  company_billing_name: string;
  branch_billing_name: string;
  branch_billing_address: string;
}

const ProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    company_billing_name: "",
    branch_billing_name: "",
    branch_billing_address: "",
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const { data, error } = await supabase.from("profile_data").select("*").single();
    if (error) {
      toast.error("Failed to fetch profile data: " + error.message);
    } else {
      setProfileData(data);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (profileData.id) {
      const { error } = await supabase
        .from("profile_data")
        .update(profileData)
        .eq("id", profileData.id);
      if (error) {
        toast.error("Failed to update profile data: " + error.message);
      } else {
        toast.success("Profile data updated successfully!");
        setIsEditing(false);
      }
    } else {
      const { error } = await supabase.from("profile_data").insert([profileData]);
      if (error) {
        toast.error("Failed to add profile data: " + error.message);
      } else {
        toast.success("Profile data added successfully!");
        fetchProfileData();
      }
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <ToastContainer />
      <section style={{ marginBottom: "3px", borderBottom: "1px solid #ccc", paddingBottom: "20px" }}>
        <h2>Profile</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", marginTop: "18px", color: "#71045f", fontSize: 13 }}>Name</label>
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
              disabled={!isEditing}
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
              disabled={!isEditing}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#71045f", fontSize: 13 }}>Company Billing Name</label>
            <input
              type="text"
              name="company_billing_name"
              value={profileData.company_billing_name}
              onChange={handleChange}
              placeholder="Enter company billing name"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              disabled={!isEditing}
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
              fontSize: 15,
              display: isEditing ? "inline-block" : "none",
            }}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            style={{
              padding: "5px 15px",
              backgroundColor: "#2485bd",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: 15,
              display: isEditing ? "none" : "inline-block",
            }}
          >
            Edit
          </button>
        </form>
      </section>

      <section>
        <h2>Branch Info</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", marginTop: "18px", color: "#71045f", fontSize: 13 }}>Branch Billing Name</label>
            <input
              type="text"
              name="branch_billing_name"
              value={profileData.branch_billing_name}
              onChange={handleChange}
              placeholder="Enter branch billing name"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              disabled={!isEditing}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#71045f", fontSize: 13 }}>Branch Billing Address</label>
            <input
              type="text"
              name="branch_billing_address"
              value={profileData.branch_billing_address}
              onChange={handleChange}
              placeholder="Enter branch billing address"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              disabled={!isEditing}
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
              fontSize: 15,
              display: isEditing ? "inline-block" : "none",
            }}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            style={{
              padding: "5px 15px",
              backgroundColor: "#2485bd",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: 15,
              display: isEditing ? "none" : "inline-block",
            }}
          >
            Edit
          </button>
        </form>
      </section>
    </div>
  );
};

export default ProfilePage;