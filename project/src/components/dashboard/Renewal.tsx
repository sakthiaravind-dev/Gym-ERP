import React, { useState, useEffect } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or anon key");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const tableHeaders = [
  "EXPIRY DATE",
  "EXTEND TO",
  "MEMBER ID",
  "MEMBER NAME",
  "PHONE NUMBER",
  "PACK AMOUNT",
  "TOTAL AMOUNT",
  "START DATE",
  "ACTIONS",
];

const MembershipRenewal = () => {
  interface Renewal {
    expiry_date: string;
    extend_to: string;
    member_id: string;
    member_name: string;
    phone_number: string;
    pack_amount: number;
    total_amount: number;
    start_date: string;
  }
  
  const [renewals, setRenewals] = useState<Renewal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedRenewal, setSelectedRenewal] = useState<Renewal | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRenewals = async () => {
      const { data, error: fetchError } = await supabase.from("renewals").select("*");
      if (fetchError) {
        console.error("Error fetching renewals:", fetchError);
      } else {
        setRenewals(data);
      }
    };

    fetchRenewals();
  }, []);

  const handleAddRenewal = () => {
    navigate("/renewal");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleEditClick = (renewal: Renewal) => {
    setSelectedRenewal(renewal);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRenewal(null);
  };

  const handleSave = async () => {
    if (selectedRenewal) {
      const { error: saveError } = await supabase
        .from("renewals")
        .upsert(selectedRenewal, { onConflict: "member_id" });

      if (saveError) {
        console.error("Error saving renewal data:", saveError);
        alert("Error saving renewal data");
        return;
      }

      setOpen(false);
      setSelectedRenewal(null);
      const { data, error: fetchError } = await supabase.from("renewals").select("*");
      if (fetchError) {
        console.error("Error fetching renewals:", fetchError);
      } else {
        setRenewals(data);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedRenewal((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const filteredRenewals = renewals.filter((renewal) =>
    renewal.member_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <Box sx={{ marginBottom: 3, display: "flex", gap: 1 }}>
        <Button variant="contained" color="primary">
          Show Filter
        </Button>
        <Button variant="contained" color="primary" onClick={handleAddRenewal}>
          Add Renewal Info
        </Button>
        <Button variant="contained" color="primary">
          Export Data
        </Button>
      </Box>

      <div className="flex-row justify-center text-center bg-white p-6 border-gray-300 border">
        <Typography
          variant="h5"
          style={{ marginBottom: "20px", color: "#71045F", fontWeight: "bold" }}
        >
          Renewal Details
        </Typography>

        <div className="w-1/4">
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {tableHeaders.map((header, index) => (
                  <TableCell
                    key={index}
                    align="center"
                    sx={{ backgroundColor: "#F7EEF9", fontWeight: "700" }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRenewals.length > 0 ? (
                filteredRenewals.map((renewal) => (
                  <TableRow key={renewal.member_id}>
                    <TableCell align="center">{renewal.expiry_date}</TableCell>
                    <TableCell align="center">{renewal.extend_to}</TableCell>
                    <TableCell align="center">{renewal.member_id}</TableCell>
                    <TableCell align="center">{renewal.member_name}</TableCell>
                    <TableCell align="center">{renewal.phone_number}</TableCell>
                    <TableCell align="center">{renewal.pack_amount}</TableCell>
                    <TableCell align="center">{renewal.total_amount}</TableCell>
                    <TableCell align="center">{renewal.start_date}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEditClick(renewal)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No data available in table
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit Renewal
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedRenewal && (
            <form>
              <TextField
                margin="dense"
                label="Member Name"
                type="text"
                fullWidth
                name="member_name"
                value={selectedRenewal.member_name}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                label="Expiry Date"
                type="date"
                fullWidth
                name="expiry_date"
                value={selectedRenewal.expiry_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                margin="dense"
                label="Extend To"
                type="date"
                fullWidth
                name="extend_to"
                value={selectedRenewal.extend_to}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                margin="dense"
                label="Phone Number"
                type="text"
                fullWidth
                name="phone_number"
                value={selectedRenewal.phone_number}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                label="Pack Amount"
                type="number"
                fullWidth
                name="pack_amount"
                value={selectedRenewal.pack_amount}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                label="Total Amount"
                type="number"
                fullWidth
                name="total_amount"
                value={selectedRenewal.total_amount}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                label="Start Date"
                type="date"
                fullWidth
                name="start_date"
                value={selectedRenewal.start_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </form>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MembershipRenewal;