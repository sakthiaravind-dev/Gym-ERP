import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or anon key");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Renewal: React.FC = () => {
  const [id, setId] = useState("");
  const navigate = useNavigate();

  const handleAddRenewal = async () => {
    const { data, error } = await supabase
      .from("members")
      .select("member_id")
      .eq("member_id", id)
      .single();

    if (error || !data) {
      alert("Member ID not found");
      return;
    }

    // Add the member ID to the verifier column of the renewals table
    const { error: upsertError } = await supabase
      .from("renewals")
      .upsert({ verifier: id }, { onConflict: "verifier" });

    if (upsertError) {
      console.error("Error adding verifier to renewals:", upsertError);
      alert("Error adding verifier to renewals");
      return;
    }

    navigate(`/addrenewal?verifier=${id}`);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "20vh",
        backgroundColor: "#f6fcf7",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ color: "purple", marginBottom: "20px", fontWeight: "bold" }}>
        Enter ID For Payment
      </h2>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Enter ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            border: "1px solid black",
            borderRadius: "4px",
            width: "600px",
          }}
        />
        <button
          style={{
            padding: "15px 80px",
            backgroundColor: "#56baed",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            cursor: "pointer",
          }}
          onClick={handleAddRenewal}
        >
          Go
        </button>
      </div>
    </div>
  );
};

export default Renewal;