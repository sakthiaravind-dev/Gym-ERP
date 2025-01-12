import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createClient } from "@supabase/supabase-js";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DietDetailsPage: React.FC = () => {
  const [dietDetails, setDietDetails] = useState("");
  interface DietDetail {
    sno: number;
    description: string;
  }

  const [history, setHistory] = useState<DietDetail[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState("");

  useEffect(() => {
    fetchDietDetails();
  }, []);

  const fetchDietDetails = async () => {
    const { data, error } = await supabase.from("diet_details_para").select("*");
    if (error) console.error("Error fetching diet details:", error);
    else setHistory(data);
  };

  const handleSave = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase.from("diet_details_para").insert([{ description: dietDetails }]);
    if (error) console.error("Error saving diet details:", error);
    else {
      alert("Diet details saved!");
      setDietDetails("");
      fetchDietDetails();
    }
  };

  const handleDelete = async (sno: number) => {
    const { error } = await supabase.from("diet_details_para").delete().eq("sno", sno);
    if (error) console.error("Error deleting diet detail:", error);
    else fetchDietDetails();
  };

  const openModal = (description: string) => {
    setSelectedDetail(description);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedDetail("");
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "25px" }}>
      <h1 style={{ textAlign: "center", padding: 10, marginBottom: "30px", fontWeight: "bold", fontSize: 18, borderBottom: "1px solid #ccc" }}>Diet Details</h1>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "10px",
          minHeight: "500px",
          backgroundColor: "#fff",
        }}
      >
        <ReactQuill
          value={dietDetails}
          onChange={setDietDetails}
          style={{ height: "500px" }}
          placeholder="Enter diet details here..."
        />
      </div>
      <button
        onClick={handleSave}
        style={{
          display: "flex",
          margin: "20px",
          marginTop: "40px",
          padding: "5px 15px",
          fontSize: "16px",
          backgroundColor: "#2485bd",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Save
      </button>

      <h2 style={{ textAlign: "center", padding: 10, marginTop: "30px", fontWeight: "bold", fontSize: 18, borderBottom: "1px solid #ccc" }}>History</h2>
      <div>
        {history.map((item: DietDetail) => (
          <div key={item.sno} style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "10px", margin: "10px 0" }}>
            <div dangerouslySetInnerHTML={{ __html: item.description }} />
            <button onClick={() => openModal(item.description)} style={{ margin: "10px", padding: "5px 10px", backgroundColor: "#2485bd", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              View
            </button>
            <button onClick={() => handleDelete(item.sno)} style={{ margin: "10px", padding: "5px 10px", backgroundColor: "#d9534f", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <Dialog open={modalIsOpen} onClose={closeModal} maxWidth="sm" fullWidth>
        <DialogTitle>Diet Detail</DialogTitle>
        <DialogContent>
          <div dangerouslySetInnerHTML={{ __html: selectedDetail }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DietDetailsPage;