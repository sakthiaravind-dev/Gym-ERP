import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Menu,
  MenuItem,
  Modal,
  IconButton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

interface AttendanceRecord {
  sno: number;
  mem_id: string;
  mem_name: string;
  date: string;
  login_time: string;
  logout_time: string;
}

const TodayAttendance: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const handleAddAttendance = () => {
    navigate("/addattendance");
  };

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("attendance").select("*");
        if (error) throw error;
        setAttendanceData(data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendanceData();
  }, []);

  // Handle Actions menu
  const handleActionClick = (event: React.MouseEvent<HTMLElement>, record: AttendanceRecord) => {
    setAnchorEl(event.currentTarget);
    setSelectedRecord(record);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setOpenModal(true);
    handleMenuClose();
  };

  const handleDeleteClick = async () => {
    if (!selectedRecord) return;
    const { error } = await supabase
      .from("attendance")
      .delete()
      .eq("sno", selectedRecord.sno);
    if (error) {
      console.error("Error deleting attendance record:", error);
    } else {
      setAttendanceData(attendanceData.filter((record) => record.sno !== selectedRecord.sno));
      handleMenuClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedRecord((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSaveChanges = async () => {
    if (!selectedRecord) return;
    const { error } = await supabase
      .from("attendance")
      .update({
        mem_id: selectedRecord.mem_id,
        mem_name: selectedRecord.mem_name,
        date: selectedRecord.date,
        login_time: selectedRecord.login_time,
        logout_time: selectedRecord.logout_time,
      })
      .eq("sno", selectedRecord.sno);
    if (error) {
      console.error("Error updating attendance record:", error);
    } else {
      setAttendanceData(
        attendanceData.map((record) =>
          record.sno === selectedRecord.sno ? selectedRecord : record
        )
      );
      setOpenModal(false);
    }
  };

  // Filter records based on search term
  const filteredData = attendanceData.filter(
    (record) =>
      record.mem_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.mem_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.date?.includes(searchTerm)
  );

  // Handle Export to CSV
  const handleExport = () => {
    const csvRows = [
      ["S.NO", "MEMBER ID", "MEMBER NAME", "DATE", "LOGIN TIME", "LOGOUT TIME"], // Header row
      ...filteredData.map((record, index) => [
        index + 1,
        record.mem_id,
        record.mem_name,
        record.date,
        record.login_time,
        record.logout_time,
      ]),
    ];

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "attendance_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#e9f7fc", minHeight: "100vh" }}>
      {/* Top Section: Buttons, Heading, Search */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddAttendance}
          sx={{ backgroundColor: "#2485bd", color: "white" }}
        >
          Mark Attendance
        </Button>
        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: "bold", color: "#71045F" }}
        >
          Member Attendance Details
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
      <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 3 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleExport}
          sx={{ backgroundColor: "#2485bd", color: "white" }}
        >
          Export Data
        </Button>
      </Box>

      {/* Attendance Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F7EEF9" }}>
              <TableCell>S.NO</TableCell>
              <TableCell>MEMBER ID</TableCell>
              <TableCell>MEMBER NAME</TableCell>
              <TableCell>DATE</TableCell>
              <TableCell>LOGIN TIME</TableCell>
              <TableCell>LOGOUT TIME</TableCell>
              <TableCell>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <TableRow key={row.sno}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.mem_id}</TableCell>
                  <TableCell>{row.mem_name}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.login_time}</TableCell>
                  <TableCell>{row.logout_time}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      endIcon={<KeyboardArrowDownIcon />}
                      onClick={(e) => handleActionClick(e, row)}
                      sx={{ color: "#fff", backgroundColor: "#2485bd" }}
                    >
                      Actions
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedRecord?.sno === row.sno}
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
                  No Data Available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
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
            <Typography variant="h6">Edit Attendance</Typography>
            <IconButton onClick={() => setOpenModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            label="Member ID"
            variant="outlined"
            name="mem_id"
            value={selectedRecord?.mem_id || ""}
            onChange={handleInputChange}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Member Name"
            variant="outlined"
            name="mem_name"
            value={selectedRecord?.mem_name || ""}
            onChange={handleInputChange}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            name="date"
            value={selectedRecord?.date || ""}
            onChange={handleInputChange}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Login Time"
            type="time"
            InputLabelProps={{ shrink: true }}
            name="login_time"
            value={selectedRecord?.login_time || ""}
            onChange={handleInputChange}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Logout Time"
            type="time"
            InputLabelProps={{ shrink: true }}
            name="logout_time"
            value={selectedRecord?.logout_time || ""}
            onChange={handleInputChange}
            sx={{ marginBottom: "15px" }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleSaveChanges}
            sx={{ backgroundColor: "#2485bd", color: "white" }}
          >
            Save Changes
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default TodayAttendance;
