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
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom"; 

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

interface AttendanceRecord {
  id: string;
  loginTime: string;
  logoutTime: string;
  name: string;
  date: string;
}

const MemberAttendance: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAttendanceId, setSelectedAttendanceId] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleAddAttendance = () => {
    navigate("/addattendance")
  }

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
  const handleActionClick = (event: React.MouseEvent<HTMLElement>, attendanceId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedAttendanceId(attendanceId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAttendanceId(null);
  };

  const handleMarkPresent = () => {
    console.log(`Mark Present clicked for ID: ${selectedAttendanceId}`);
    handleMenuClose();
  };

  const handleMarkAbsent = () => {
    console.log(`Mark Absent clicked for ID: ${selectedAttendanceId}`);
    handleMenuClose();
  };

  const handleEditAttendance = () => {
    console.log(`Edit Attendance clicked for ID: ${selectedAttendanceId}`);
    handleMenuClose();
  };

  const filteredData = attendanceData.filter(
    (record) =>
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.date.includes(searchTerm)
  );

  return (
    <Box sx={{ padding: 3, backgroundColor: "#e9f7fc", minHeight: "100vh" }}>
      {/* Top Section: Button, Heading, Search */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        {/* Left: Mark Attendance Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddAttendance}
          sx={{ backgroundColor: "#2485bd", color: "white" }}
        >
          Mark Attendance
        </Button>

        {/* Center: Heading */}
        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: "bold", color: "#71045F" }}
        >
          Member Attendance Details
        </Typography>

        {/* Right: Search Bar */}
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ backgroundColor: "white" }}
        />
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
                <TableRow key={row.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.loginTime}</TableCell>
                  <TableCell>{row.logoutTime}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      endIcon={<KeyboardArrowDownIcon />}
                      onClick={(e) => handleActionClick(e, row.id)}
                      sx={{ color: "#2485bd" }}
                    >
                      Actions
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedAttendanceId === row.id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleMarkPresent}>Mark Present</MenuItem>
                      <MenuItem onClick={handleMarkAbsent}>Mark Absent</MenuItem>
                      <MenuItem onClick={handleEditAttendance}>Edit Attendance</MenuItem>
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
    </Box>
  );
};

export default MemberAttendance;