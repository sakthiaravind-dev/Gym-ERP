import React, { useEffect, useState } from "react";
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
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import StatGroup from "../components/dashboard/StatGroup";
import { Users } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const tableHeaders = [
  "DATE",
  "ID",
  "NAME",
  "PHONE",
  "SLOT",
  "SERVICE",
  "LOGIN TIME",
  "ACTION",
];

const BookingDetails = () => {
  interface Booking {
    sno: number;
    date: string;
    id: string;
    name: string;
    phone: string;
    slot: string;
    service: string;
    login_time: string;
  }
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState<Booking | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const { data, error } = await supabase.from("bookings").select("*");
    if (error) {
      toast.error("Failed to fetch bookings: " + error.message);
    } else {
      setBookings(data);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredBookings = bookings.filter((booking) =>
    Object.values(booking).some((value) =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleExport = () => {
    const csvData = filteredBookings.map((booking) =>
      [
        booking.date,
        booking.id,
        booking.name,
        booking.phone,
        booking.slot,
        booking.service,
        booking.login_time,
      ].join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + csvData.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bookings.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleAddBooking = () => {
    navigate("/addbooking");
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, booking: Booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBooking(null);
  };

  const handleEdit = () => {
    if (selectedBooking) {
      setEditData(selectedBooking);
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedBooking) {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('sno', selectedBooking.sno);

      if (error) {
        toast.error("Failed to delete booking: " + error.message);
      } else {
        toast.success("Booking deleted successfully!");
        fetchBookings();
      }
    }
    handleMenuClose();
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editData) {
      setEditData({
        ...editData,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleEditSubmit = async () => {
    if (editData) {
      const { error } = await supabase
        .from('bookings')
        .update(editData)
        .eq('sno', editData.sno);

      if (error) {
        toast.error("Failed to update booking: " + error.message);
      } else {
        toast.success("Booking updated successfully!");
        fetchBookings();
        setEditDialogOpen(false);
      }
    }
  };

  const cardConfig = [
    { title: "TOTAL BOOKINGS", value: bookings.length.toString(), Icon: Users, path: "/bookings" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <ToastContainer />
      <Box sx={{ marginBottom: 3, display: "flex", gap: 1 }}>
        <Button variant="contained" color="primary" onClick={handleAddBooking}>
          Add Booking Slot
        </Button>
        <Button variant="contained" color="primary" onClick={handleExport}>
          Export Data
        </Button>
      </Box>
      <StatGroup stats={cardConfig} />

      <div className="flex-row justify-center text-center bg-white p-6 border-gray-300 border">
        <Typography variant="h5" style={{ marginBottom: "20px", color: "#71045F", fontWeight: "bold" }}>
          Booking Details
        </Typography>

        <div className="w-1/4">
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            margin="normal"
            value={search}
            onChange={handleSearch}
          />
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {tableHeaders.map((header, index) => (
                  <TableCell key={index} align="center" sx={{ backgroundColor: '#F7EEF9', fontWeight: '700' }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{booking.date}</TableCell>
                    <TableCell align="center">{booking.id}</TableCell>
                    <TableCell align="center">{booking.name}</TableCell>
                    <TableCell align="center">{booking.phone}</TableCell>
                    <TableCell align="center">{booking.slot}</TableCell>
                    <TableCell align="center">{booking.service}</TableCell>
                    <TableCell align="center">{booking.login_time}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={(event) => handleMenuClick(event, booking)}
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
                        <MenuItem onClick={handleEdit}>Edit</MenuItem>
                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No data available in table
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please update the booking details below.
          </DialogContentText>
          {editData && (
            <>
              <TextField
                margin="dense"
                label="Date"
                type="date"
                name="date"
                fullWidth
                value={editData.date}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="ID"
                type="text"
                name="id"
                fullWidth
                value={editData.id}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Name"
                type="text"
                name="name"
                fullWidth
                value={editData.name}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Phone"
                type="text"
                name="phone"
                fullWidth
                value={editData.phone}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Slot"
                type="text"
                name="slot"
                fullWidth
                value={editData.slot}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Service"
                type="text"
                name="service"
                fullWidth
                value={editData.service}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Login Time"
                type="time"
                name="login_time"
                fullWidth
                value={editData.login_time}
                onChange={handleEditChange}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookingDetails;