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
  MenuItem as DropdownMenuItem,
} from "@mui/material";
import { createClient } from "@supabase/supabase-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@mui/icons-material/Close";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or anon key");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AttendanceRecord {
  sno?: number;
  emp_id: string;
  date: string;
  login_time: string;
  logout_time: string;
  member_name: string;
}

const EmployeeAttendance: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [entriesPerPage, setEntriesPerPage] = useState<number>(5);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [newRecord, setNewRecord] = useState<AttendanceRecord>({
    emp_id: "",
    date: "",
    login_time: "",
    logout_time: "",
    member_name: "",
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    const { data, error } = await supabase.from("employee_attendance").select("*");
    if (error) {
      toast.error("Failed to fetch attendance records: " + error.message);
    } else {
      setAttendanceRecords(data);
    }
  };

  const handleAddRecord = async () => {
    const { error } = await supabase.from("employee_attendance").insert([newRecord]);
    if (error) {
      toast.error("Failed to add attendance record: " + error.message);
    } else {
      toast.success("Attendance record added successfully!");
      fetchAttendanceRecords();
      setOpenModal(false);
      setNewRecord({
        emp_id: "",
        date: "",
        login_time: "",
        logout_time: "",
        member_name: "",
      });
    }
  };

  const handleEditRecord = async () => {
    if (!selectedRecord) return;
    const { error } = await supabase
      .from("employee_attendance")
      .update(selectedRecord)
      .eq("sno", selectedRecord.sno);
    if (error) {
      toast.error("Failed to update attendance record: " + error.message);
    } else {
      toast.success("Attendance record updated successfully!");
      fetchAttendanceRecords();
      setAnchorEl(null);
      setSelectedRecord(null);
      setOpenModal(false);
    }
  };

  const handleDeleteRecord = async () => {
    if (!selectedRecord) return;
    const { error } = await supabase
      .from("employee_attendance")
      .delete()
      .eq("sno", selectedRecord.sno);
    if (error) {
      toast.error("Failed to delete attendance record: " + error.message);
    } else {
      toast.success("Attendance record deleted successfully!");
      fetchAttendanceRecords();
      setAnchorEl(null);
      setSelectedRecord(null);
    }
  };

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, record: AttendanceRecord) => {
    setAnchorEl(event.currentTarget);
    setSelectedRecord(record);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRecord(null);
  };

  const filteredRecords = attendanceRecords.filter(
    (record) =>
      record.emp_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.member_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.date?.includes(searchTerm) ||
      record.login_time?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.logout_time?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <ToastContainer />
      <Button
        variant="contained"
        sx={{ backgroundColor: "#2485bd", color: "white", padding: "5px 15px", marginBottom: -6 }}
        onClick={() => {
          setOpenModal(true);
          setSelectedRecord(null); // Clear selected record when adding a new one
        }}
      >
        Mark Attendance
      </Button>
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: "bold", color: "#71045F" }}
        >
          Employee Attendance Details
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ backgroundColor: "white" }}
        />
        <Box sx={{ display: "flex", alignItems: "center" }}>
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
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F7EEF9" }}>
              <TableCell>S.NO</TableCell>
              <TableCell>EMPLOYEE ID</TableCell>
              <TableCell>EMPLOYEE NAME</TableCell>
              <TableCell>DATE</TableCell>
              <TableCell>LOGIN TIME</TableCell>
              <TableCell>LOG-OUT TIME</TableCell>
              <TableCell>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.length > 0 ? (
              filteredRecords.slice(0, entriesPerPage).map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{record.emp_id}</TableCell>
                  <TableCell>{record.member_name}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.login_time}</TableCell>
                  <TableCell>{record.logout_time}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={(e) => handleActionClick(e, record)}
                    >
                      Action
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedRecord?.sno === record.sno}
                      onClose={handleMenuClose}
                    >
                      <DropdownMenuItem
                        onClick={() => {
                          setOpenModal(true);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDeleteRecord}>
                        Delete
                      </DropdownMenuItem>
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

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <Typography>
          Showing {filteredRecords.slice(0, entriesPerPage).length} of {attendanceRecords.length} entries
        </Typography>
      </Box>

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
            <Typography variant="h6">{selectedRecord ? "Edit Attendance" : "Mark Attendance"}</Typography>
            <IconButton onClick={() => setOpenModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            label="Employee ID"
            variant="outlined"
            value={selectedRecord ? selectedRecord.emp_id : newRecord.emp_id}
            onChange={(e) => {
              const value = e.target.value;
              if (selectedRecord) {
                setSelectedRecord({ ...selectedRecord, emp_id: value });
              } else {
                setNewRecord({ ...newRecord, emp_id: value });
              }
            }}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Employee Name"
            variant="outlined"
            value={selectedRecord ? selectedRecord.member_name : newRecord.member_name}
            onChange={(e) => {
              const value = e.target.value;
              if (selectedRecord) {
                setSelectedRecord({ ...selectedRecord, member_name: value });
              } else {
                setNewRecord({ ...newRecord, member_name: value });
              }
            }}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={selectedRecord ? selectedRecord.date : newRecord.date}
            onChange={(e) => {
              const value = e.target.value;
              if (selectedRecord) {
                setSelectedRecord({ ...selectedRecord, date: value });
              } else {
                setNewRecord({ ...newRecord, date: value });
              }
            }}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Login Time"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={selectedRecord ? selectedRecord.login_time : newRecord.login_time}
            onChange={(e) => {
              const value = e.target.value;
              if (selectedRecord) {
                setSelectedRecord({ ...selectedRecord, login_time: value });
              } else {
                setNewRecord({ ...newRecord, login_time: value });
              }
            }}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Logout Time"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={selectedRecord ? selectedRecord.logout_time : newRecord.logout_time}
            onChange={(e) => {
              const value = e.target.value;
              if (selectedRecord) {
                setSelectedRecord({ ...selectedRecord, logout_time: value });
              } else {
                setNewRecord({ ...newRecord, logout_time: value });
              }
            }}
            sx={{ marginBottom: "15px" }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={selectedRecord ? handleEditRecord : handleAddRecord}
            sx={{ backgroundColor: "#2485bd", color: "white" }}
          >
            {selectedRecord ? "Save Changes" : "Mark Present"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default EmployeeAttendance;