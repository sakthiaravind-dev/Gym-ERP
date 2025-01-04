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
  MenuItem,
  FormControl,
  InputLabel,
  Modal,
  IconButton,
  Menu,
} from "@mui/material";
import { createClient } from "@supabase/supabase-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />
/// <reference types="vite/client" />

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Offer {
  id: number;
  name: string;
  date: string;
  time: string;
  description: string;
  status: string;
}

const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null);
  const [newOffer, setNewOffer] = useState<Omit<Offer, "id">>({
    name: "",
    date: "",
    time: "",
    description: "",
    status: "",
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    const { data, error } = await supabase.from("offers").select("*");
    if (error) {
      toast.error("Failed to fetch offers: " + error.message);
    } else {
      setOffers(data);
    }
  };

  const handleAddOffer = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase.from("offers").insert([newOffer]);
    if (error) {
      toast.error("Failed to add offer: " + error.message);
    } else {
      toast.success("Offer added successfully!");
      fetchOffers();
      setOpenAddModal(false);
      setNewOffer({
        name: "",
        date: "",
        time: "",
        description: "",
        status: "",
      });
    }
  };

  const handleEditOffer = async () => {
    if (currentOffer) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error } = await supabase
        .from("offers")
        .update(currentOffer)
        .eq("id", currentOffer.id);
      if (error) {
        toast.error("Failed to update offer: " + error.message);
      } else {
        toast.success("Offer updated successfully!");
        fetchOffers();
        setOpenEditModal(false);
        setCurrentOffer(null);
      }
    }
  };

  const handleDeleteOffer = async (id: number) => {
    const { error } = await supabase.from("offers").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete offer: " + error.message);
    } else {
      toast.success("Offer deleted successfully!");
      fetchOffers();
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, offer: Offer) => {
    setAnchorEl(event.currentTarget);
    setCurrentOffer(offer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const filteredOffers = offers.filter(
    (offer) =>
      offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.date.includes(searchTerm) ||
      offer.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const csvData = [
      ["ID", "Name", "Date", "Time", "Description", "Status"],
      ...offers.map((offer) => [
        offer.id,
        offer.name,
        offer.date,
        offer.time,
        offer.description,
        offer.status,
      ]),
    ];
    const csvContent = `data:text/csv;charset=utf-8,${csvData
      .map((e) => e.join(","))
      .join("\n")}`;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "offers.csv");
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
          Add Offer
        </Button>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: "bold", color: "#71045F" }}
        >
          Offers Dashboard
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
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOffers.slice(0, entriesPerPage).map((offer) => (
              <TableRow key={offer.id}>
                <TableCell>{offer.id}</TableCell>
                <TableCell>{offer.name}</TableCell>
                <TableCell>{offer.date}</TableCell>
                <TableCell>{offer.time}</TableCell>
                <TableCell>{offer.description}</TableCell>
                <TableCell>{offer.status}</TableCell>
                <TableCell>
                  <IconButton
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={(e) => handleMenuClick(e, offer)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
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
                        handleDeleteOffer(offer.id);
                        handleMenuClose();
                      }}
                    >
                      Delete
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <Typography>
          Showing 1 to {Math.min(entriesPerPage, filteredOffers.length)} of{" "}
          {filteredOffers.length} entries
        </Typography>
        <Button
          onClick={handleExport}
          variant="contained"
          sx={{ backgroundColor: "#2485bd", color: "white", padding: "5px 15px" }}
        >
          Export Data
        </Button>
      </Box>

      {/* Add Offer Modal */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box sx={modalStyle}>
          <IconButton
            sx={{ position: "absolute", top: 10, right: 10 }}
            onClick={() => setOpenAddModal(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Add New Offer
          </Typography>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={newOffer.name}
            onChange={(e) => setNewOffer({ ...newOffer, name: e.target.value })}
          />
          <TextField
            label="Date"
            type="date"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={newOffer.date}
            onChange={(e) => setNewOffer({ ...newOffer, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Time"
            type="time"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={newOffer.time}
            onChange={(e) => setNewOffer({ ...newOffer, time: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={newOffer.description}
            onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
          />
          <TextField
            label="Status"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={newOffer.status}
            onChange={(e) => setNewOffer({ ...newOffer, status: e.target.value })}
          />
          <Button variant="contained" sx={{ backgroundColor: "#2485bd" }} onClick={handleAddOffer}>
            Add Offer
          </Button>
        </Box>
      </Modal>

      {/* Edit Offer Modal */}
      {currentOffer && (
        <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
          <Box sx={modalStyle}>
            <IconButton
              sx={{ position: "absolute", top: 10, right: 10 }}
              onClick={() => setOpenEditModal(false)}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Edit Offer
            </Typography>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={currentOffer.name}
              onChange={(e) => setCurrentOffer({ ...currentOffer, name: e.target.value })}
            />
            <TextField
              label="Date"
              type="date"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={currentOffer.date}
              onChange={(e) => setCurrentOffer({ ...currentOffer, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Time"
              type="time"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={currentOffer.time}
              onChange={(e) => setCurrentOffer({ ...currentOffer, time: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={currentOffer.description}
              onChange={(e) => setCurrentOffer({ ...currentOffer, description: e.target.value })}
            />
            <TextField
              label="Status"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={currentOffer.status}
              onChange={(e) => setCurrentOffer({ ...currentOffer, status: e.target.value })}
            />
            <Button variant="contained" sx={{ backgroundColor: "#2485bd" }} onClick={handleEditOffer}>
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

export default OffersPage;