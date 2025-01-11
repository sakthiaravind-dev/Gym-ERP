import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Modal,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { createClient } from "@supabase/supabase-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

/// <reference types="vite/client" />
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or anon key");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Lead {
  id: number;
  name: string;
  contact: string;
  follow_up: string;
  status: string;
  comment: string;
}

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [entriesPerPage, setEntriesPerPage] = useState<number>(5);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [newLead, setNewLead] = useState<Omit<Lead, "id">>({
    name: "",
    contact: "",
    follow_up: "",
    status: "",
    comment: "",
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data, error } = await supabase.from("leads").select("*");
    if (error) {
      toast.error("Failed to fetch leads: " + error.message);
    } else {
      setLeads(data);
    }
  };

  const handleAddLead = async () => {
    const { error } = await supabase.from("leads").insert([newLead]);
    if (error) {
      toast.error("Failed to add lead: " + error.message);
    } else {
      toast.success("Lead added successfully!");
      fetchLeads();
      setOpenAddModal(false);
      setNewLead({
        name: "",
        contact: "",
        follow_up: "",
        status: "",
        comment: "",
      });
    }
  };

  const handleEditLead = async () => {
    if (currentLead) {
      const { error } = await supabase
        .from("leads")
        .update(currentLead)
        .eq("id", currentLead.id);
      if (error) {
        toast.error("Failed to update lead: " + error.message);
      } else {
        toast.success("Lead updated successfully!");
        fetchLeads();
        setOpenEditModal(false);
        setCurrentLead(null);
      }
    }
  };

  const handleDeleteLead = async (id: number) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete lead: " + error.message);
    } else {
      toast.success("Lead deleted successfully!");
      fetchLeads();
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, lead: Lead) => {
    setAnchorEl(event.currentTarget);
    setCurrentLead(lead);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contact.includes(searchTerm) ||
      lead.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const csvData = [
      ["ID", "Name", "Contact", "Follow-Up", "Status", "Comment"],
      ...leads.map((lead) => [
        lead.id,
        lead.name,
        lead.contact,
        lead.follow_up,
        lead.status,
        lead.comment,
      ]),
    ];
    const csvContent = `data:text/csv;charset=utf-8,${csvData
      .map((e) => e.join(","))
      .join("\n")}`;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#2485bd",
            color: "white",
            padding: "5px 15px",
          }}
          onClick={() => setOpenAddModal(true)}
        >
          Add Lead
        </Button>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: "bold", color: "#71045F" }}
        >
          Leads Dashboard
        </Typography>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ backgroundColor: "white" }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120, marginRight: "15px" }}>
          <InputLabel>Show</InputLabel>
          <Select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            label="Show"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
        <Typography>entries</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F7EEF9" }}>
              <TableCell>S.No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Follow-Up On</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads.slice(0, entriesPerPage).map((lead, index) => (
              <TableRow key={lead.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.contact}</TableCell>
                <TableCell>{lead.follow_up}</TableCell>
                <TableCell>{lead.status}</TableCell>
                <TableCell>{lead.comment}</TableCell>
                <TableCell>
                  <Box>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#2485bd",
                        color: "white",
                        
                        fontSize: "12px",
                        fontWeight: "bold",
                        ":hover": { backgroundColor: "#2485bd" },
                      }}
                      onClick={(e) => handleMenuClick(e, lead)}
                      endIcon={<ArrowDropDownIcon />}
                    >
                      Action
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && currentLead?.id === lead.id}
                      onClose={handleMenuClose}
                      PaperProps={{
                        style: { minWidth: "150px" },
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          setOpenEditModal(true);
                          handleMenuClose();
                        }}
                      >
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleDeleteLead(lead.id);
                          handleMenuClose();
                        }}
                      >
                        Delete
                      </MenuItem>
                    </Menu>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <Typography>
          Showing 1 to {Math.min(entriesPerPage, filteredLeads.length)} of{" "}
          {filteredLeads.length} entries
        </Typography>
        <Button
          onClick={handleExport}
          variant="contained"
          sx={{ backgroundColor: "#2485bd", color: "white", padding: "5px 15px" }}
        >
          Export Data
        </Button>
      </Box>

      {/* Add Lead Modal */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box sx={modalStyle}>
          <IconButton
            sx={{ position: "absolute", top: 10, right: 10 }}
            onClick={() => setOpenAddModal(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Add New Lead
          </Typography>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={newLead.name}
            onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
          />
          <TextField
            label="Contact"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={newLead.contact}
            onChange={(e) => setNewLead({ ...newLead, contact: e.target.value })}
          />
          <TextField
            label="Follow-Up On"
            type="date"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={newLead.follow_up}
            onChange={(e) => setNewLead({ ...newLead, follow_up: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Status"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={newLead.status}
            onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
          />
          <TextField
            label="Comment"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={newLead.comment}
            onChange={(e) => setNewLead({ ...newLead, comment: e.target.value })}
          />
          <Button variant="contained" sx={{ backgroundColor: "#2485bd" }} onClick={handleAddLead}>
            Add Lead
          </Button>
        </Box>
      </Modal>

      {/* Edit Lead Modal */}
      {currentLead && (
        <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
          <Box sx={modalStyle}>
            <IconButton
              sx={{ position: "absolute", top: 10, right: 10 }}
              onClick={() => setOpenEditModal(false)}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Edit Lead
            </Typography>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={currentLead.name}
              onChange={(e) => setCurrentLead({ ...currentLead, name: e.target.value })}
            />
            <TextField
              label="Contact"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={currentLead.contact}
              onChange={(e) => setCurrentLead({ ...currentLead, contact: e.target.value })}
            />
            <TextField
              label="Follow-Up On"
              type="date"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={currentLead.follow_up}
              onChange={(e) => setCurrentLead({ ...currentLead, follow_up: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Status"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={currentLead.status}
              onChange={(e) => setCurrentLead({ ...currentLead, status: e.target.value })}
            />
            <TextField
              label="Comment"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={currentLead.comment}
              onChange={(e) => setCurrentLead({ ...currentLead, comment: e.target.value })}
            />
            <Button variant="contained" sx={{ backgroundColor: "#2485bd" }} onClick={handleEditLead}>
              Save Changes
            </Button>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default Leads;