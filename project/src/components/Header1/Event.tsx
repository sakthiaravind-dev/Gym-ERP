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
import MoreVertIcon from "@mui/icons-material/MoreVert";

/// <reference types="vite/client" />
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key');
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase.from("events").insert([newEvent]);
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

  const handleEditEvent = async () => {
    if (currentEvent) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error } = await supabase
        .from("events")
        .update(currentEvent)
        .eq("id", currentEvent.id);
      if (error) {
        toast.error("Failed to update event: " + error.message);
      } else {
        toast.success("Event updated successfully!");
        fetchEvents();
        setOpenEditModal(false);
        setCurrentEvent(null);
      }
    }
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

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, eventItem: Event) => {
    setAnchorEl(event.currentTarget);
    setCurrentEvent(eventItem);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const filteredEvents = events.filter(
    (event) =>
      event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(event.id).includes(searchTerm) ||
      event.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const csvData = [
      ["ID", "NAME", "DATE", "TIME", "DESCRIPTION", "STATUS"],
      ...events.map((event) => [
        event.id,
        event.name,
        event.date,
        event.time,
        event.description,
        event.status,
      ]),
    ];
    const csvContent = `data:text/csv;charset=utf-8,${csvData
      .map((e) => e.join(","))
      .join("\n")}`;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "events_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <ToastContainer />
      {/* Top Section with Heading, Search, and Add Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        {/* Add New Event Button */}
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
        {/* Centered Heading */}
        <Typography
          variant="h5"
          sx={{ textAlign: "center", fontWeight: "bold", color: "#71045F", flex: 1 }}
        >
          Events
        </Typography>
        {/* Search Bar */}
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ backgroundColor: "white" }}
        />
      </Box>

      {/* Dropdown for entries per page */}
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
                    <IconButton
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={(e) => handleMenuClick(e, event)}
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
                          handleDeleteEvent(event.id);
                          handleMenuClose();
                        }}
                      >
                        Delete
                      </MenuItem>
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

      {/* Footer Section with Export Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 2,
          alignItems: "center",
        }}
      >
        <Typography>
          Showing 1 to {Math.min(entriesPerPage, filteredEvents.length)} of{" "}
          {filteredEvents.length} entries
        </Typography>
        <Button
          onClick={handleExport}
          variant="contained"
          sx={{
            backgroundColor: "#2485bd",
            color: "white",
            padding: "5px 15px",
          }}
        >
          Export Data
        </Button>
      </Box>

      {/* Add Event Modal */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box sx={modalStyle}>
          <IconButton
            sx={{ position: "absolute", top: 10, right: 10 }}
            onClick={() => setOpenAddModal(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Add New Event
          </Typography>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
          />
          <TextField
            label="Date"
            type="date"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Time"
            type="time"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={newEvent.time}
            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          />
          <TextField
            label="Status"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={newEvent.status}
            onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
          />
          <Button variant="contained" sx={{ backgroundColor: "#2485bd" }} onClick={handleAddEvent}>
            Add Event
          </Button>
        </Box>
      </Modal>

      {/* Edit Event Modal */}
      {currentEvent && (
        <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
          <Box sx={modalStyle}>
            <IconButton
              sx={{ position: "absolute", top: 10, right: 10 }}
              onClick={() => setOpenEditModal(false)}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Edit Event
            </Typography>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={currentEvent.name}
              onChange={(e) => setCurrentEvent({ ...currentEvent, name: e.target.value })}
            />
            <TextField
              label="Date"
              type="date"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={currentEvent.date}
              onChange={(e) => setCurrentEvent({ ...currentEvent, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Time"
              type="time"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={currentEvent.time}
              onChange={(e) => setCurrentEvent({ ...currentEvent, time: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={currentEvent.description}
              onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
            />
            <TextField
              label="Status"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={currentEvent.status}
              onChange={(e) => setCurrentEvent({ ...currentEvent, status: e.target.value })}
            />
            <Button variant="contained" sx={{ backgroundColor: "#2485bd" }} onClick={handleEditEvent}>
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

export default EventsPage;