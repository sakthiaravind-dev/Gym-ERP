import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or anon key");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface RenewalData {
  verifier: string;
  member_name: string;
  expiry_date: string;
  extend_to: string;
  phone_number: string;
  pack_amount: string;
  total_amount: string;
  start_date: string;
}

const AddRenewal: React.FC = () => {
  const [renewalData, setRenewalData] = useState<RenewalData>({
    verifier: "",
    member_name: "",
    expiry_date: "",
    extend_to: "",
    phone_number: "",
    pack_amount: "",
    total_amount: "",
    start_date: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const verifier = queryParams.get("verifier");

    if (verifier) {
      setRenewalData((prev) => ({ ...prev, verifier }));

      const fetchRenewalData = async () => {
        const { data, error } = await supabase
          .from("renewals")
          .select("*")
          .eq("verifier", verifier)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching renewal data:", error);
          return;
        }

        if (data) {
          setRenewalData({
            verifier: data.verifier ?? "",
            member_name: data.member_name ?? "",
            expiry_date: data.expiry_date ?? "",
            extend_to: data.extend_to ?? "",
            phone_number: data.phone_number ?? "",
            pack_amount: data.pack_amount ?? "",
            total_amount: data.total_amount ?? "",
            start_date: data.start_date ?? "",
          });
          setIsEditMode(true);
        }
      };

      fetchRenewalData();
    }
  }, [location.search]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRenewalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { error } = await supabase
      .from("renewals")
      .upsert(renewalData, { onConflict: "verifier" });

    if (error) {
      console.error("Error submitting renewal data:", error);
      toast.error("Error submitting renewal data");
      return;
    }

    toast.success("Renewal data submitted successfully!");
    navigate("/renewal");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    const { error } = await supabase
      .from("renewals")
      .upsert(renewalData, { onConflict: "verifier" });

    if (error) {
      console.error("Error saving renewal data:", error);
      toast.error("Error saving renewal data");
      return;
    }

    toast.success("Renewal data updated successfully!");
    setIsEditing(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <ToastContainer />
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
        {isEditMode ? "Edit Renewal Info" : "Add Renewal Info"}
      </h2>

      <form onSubmit={isEditing ? handleSave : handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
                fontSize: 13,
                color: "#71045f",
              }}
            >
              Verifier (User ID)
            </label>
            <input
              type="text"
              name="verifier"
              value={renewalData.verifier}
              onChange={handleChange}
              placeholder="Verifier ID"
              readOnly={isEditMode && !isEditing}
              style={inputStyle}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
                fontSize: 13,
                color: "#71045f",
              }}
            >
              Member Name
            </label>
            <input
              type="text"
              name="member_name"
              value={renewalData.member_name}
              onChange={handleChange}
              placeholder="Name"
              readOnly={!isEditing}
              style={inputStyle}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
                fontSize: 13,
                color: "#71045f",
              }}
            >
              Expiry Date
            </label>
            <input
              type="date"
              name="expiry_date"
              value={renewalData.expiry_date}
              onChange={handleChange}
              placeholder="Expiry Date"
              readOnly={!isEditing}
              style={inputStyle}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
                fontSize: 13,
                color: "#71045f",
              }}
            >
              Extend To
            </label>
            <input
              type="date"
              name="extend_to"
              value={renewalData.extend_to}
              onChange={handleChange}
              placeholder="Extend To"
              readOnly={!isEditing}
              style={inputStyle}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
                fontSize: 13,
                color: "#71045f",
              }}
            >
              Phone Number
            </label>
            <input
              type="text"
              name="phone_number"
              value={renewalData.phone_number}
              onChange={handleChange}
              placeholder="Phone Number"
              readOnly={!isEditing}
              style={inputStyle}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
                fontSize: 13,
                color: "#71045f",
              }}
            >
              Pack Amount
            </label>
            <input
              type="text"
              name="pack_amount"
              value={renewalData.pack_amount}
              onChange={handleChange}
              placeholder="Pack Amount"
              readOnly={!isEditing}
              style={inputStyle}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
                fontSize: 13,
                color: "#71045f",
              }}
            >
              Total Amount
            </label>
            <input
              type="text"
              name="total_amount"
              value={renewalData.total_amount}
              onChange={handleChange}
              placeholder="Total Amount"
              readOnly={!isEditing}
              style={inputStyle}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
                fontSize: 13,
                color: "#71045f",
              }}
            >
              Start Date
            </label>
            <input
              type="date"
              name="start_date"
              value={renewalData.start_date}
              onChange={handleChange}
              placeholder="Start Date"
              readOnly={!isEditing}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          {isEditMode && !isEditing && (
            <button
              type="button"
              onClick={handleEdit}
              style={{
                padding: "5px 15px",
                backgroundColor: "#2485bd",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Edit
            </button>
          )}
          {isEditing && (
            <button
              type="submit"
              style={{
                padding: "5px 15px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
          )}
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