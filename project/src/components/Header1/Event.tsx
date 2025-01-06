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
  MenuItem,
  Modal,
  IconButton,
  Menu,
} from "@mui/material";
import { createClient } from "@supabase/supabase-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

/// <reference types="vite/client" />
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or anon key");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  description: string;
  status: string;
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState<Omit<Event, "id">>({
    name: "",
    date: "",
    time: "",
    description: "",
    status: "",
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from("events").select("*");
    if (error) {
      toast.error("Failed to fetch events: " + error.message);
    } else {
      setEvents(data);
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.name || !newEvent.date || !newEvent.time || !newEvent.status) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const { error } = await supabase.from("events").insert([newEvent]);
    if (error) {
      toast.error("Failed to add event: " + error.message);
    } else {
      toast.success("Event added successfully!");
      fetchEvents();
      setOpenAddModal(false);
      setNewEvent({
        name: "",
        date: "",
        time: "",
        description: "",
        status: "",
      });
    }
  };

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, eventItem: Event) => {
    setAnchorEl(event.currentTarget);
    setSelectedEvent(eventItem);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  const handleEditClick = () => {
    setCurrentEvent(selectedEvent);
    setOpenEditModal(true);
    handleMenuClose();
  };

  const handleDeleteEvent = async (id: number) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete event: " + error.message);
    } else {
      toast.success("Event deleted successfully!");
      fetchEvents();
    }
  };

  const handleDeleteClick = () => {
    if (selectedEvent) {
      handleDeleteEvent(selectedEvent.id);
    }
    handleMenuClose();
  };

  const filteredEvents = events.filter(
    (event) =>
      event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(event.id).includes(searchTerm) ||
      event.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <ToastContainer />
      {/* Top Section */}
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
          Add new event
        </Button>
        <Typography
          variant="h5"
          sx={{ textAlign: "center", fontWeight: "bold", color: "#71045F", flex: 1 }}
        >
          Events
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

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F7EEF9" }}>
              <TableCell>ID</TableCell>
              <TableCell>NAME</TableCell>
              <TableCell>DATE</TableCell>
              <TableCell>TIME</TableCell>
              <TableCell>DESCRIPTION</TableCell>
              <TableCell>STATUS</TableCell>
              <TableCell>ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvents.length > 0 ? (
              filteredEvents.slice(0, entriesPerPage).map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.id}</TableCell>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>{event.time}</TableCell>
                  <TableCell>{event.description}</TableCell>
                  <TableCell>{event.status}</TableCell>
                  <TableCell>
                    <Button
                    style={{backgroundColor: "#2485bd",
                      color: "white",}}
                      variant="outlined"
                      endIcon={<KeyboardArrowDownIcon />}
                      onClick={(e) => handleActionClick(e, event)}
                    >
                      Action
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedEvent?.id === event.id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleEditClick}>Edit</MenuItem>
                      <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No data available in table
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Event Modal */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Add New Event</Typography>
            <IconButton onClick={() => setOpenAddModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Time"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={newEvent.time}
            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            multiline
            rows={3}
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            sx={{ marginBottom: "15px" }}
          />
          <FormControl fullWidth sx={{ marginBottom: "15px" }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newEvent.status}
              onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <Button
            fullWidth
            variant="contained"
            onClick={handleAddEvent}
            sx={{ backgroundColor: "#2485bd", color: "white" }}
          >
            Add Event
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default EventsPage;
