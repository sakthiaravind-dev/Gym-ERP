import React, { useState } from "react";
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
} from "@mui/material";

const MemberAttendance = () => {
  const [id, setId] = useState("");
  const handleFilter = () => {
    console.log("Filter clicked!");
  };

  const mockData = [
    {
      id: "M001",
      loginTime: "09:00 AM",
      logoutTime: "05:00 PM",
      name: "John Doe",
      expiringDate: "2024-12-31",
      pendingAmount: "$50",
      daysLeft: 10,
    },
    {
      id: "M002",
      loginTime: "10:00 AM",
      logoutTime: "06:00 PM",
      name: "Jane Smith",
      expiringDate: "2025-01-15",
      pendingAmount: "$75",
      daysLeft: 25,
    },
    {
      id: "M003",
      loginTime: "08:30 AM",
      logoutTime: "04:30 PM",
      name: "Alex Johnson",
      expiringDate: "2024-11-20",
      pendingAmount: "$20",
      daysLeft: 5,
    },
    {
      id: "M004",
      loginTime: "07:45 AM",
      logoutTime: "03:45 PM",
      name: "Emily Davis",
      expiringDate: "2025-02-01",
      pendingAmount: "$0",
      daysLeft: 45,
    },
    {
      id: "M005",
      loginTime: "11:00 AM",
      logoutTime: "07:00 PM",
      name: "Michael Brown",
      expiringDate: "2024-12-10",
      pendingAmount: "$30",
      daysLeft: 20,
    },
  ];
  

  return (
    <Box sx={{ padding: 3, backgroundColor: "#e9f7fc", minHeight: "100vh" }}>
      {/* Filter Buttons */}
      <Box sx={{ marginBottom: 3, display: "flex", gap: 2 }}>
        <Button variant="contained" color="success" onClick={handleFilter}>
          Hide Filter
        </Button>
        <Button variant="contained" color="primary">
          Show Filter
        </Button>
        <Button variant="contained">Morning</Button>
        <Button variant="contained">Evening</Button>
        <Button variant="contained" color="info">
          Refresh Data
        </Button>
      </Box>

      {/* ID Input */}
      <Box sx={{ marginBottom: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Typography>ID:</Typography>
        <TextField
          value={id}
          onChange={(e) => setId(e.target.value)}
          variant="outlined"
          size="small"
        />
        <Button variant="contained" color="primary">
          Go
        </Button>
      </Box>

      {/* Member Attendance Table */}
      <Box sx={{ marginTop: 3, backgroundColor: 'white', padding: '20px' }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ marginBottom: "20px", color: "#71045F", fontWeight: "bold"  }}
        >
          Member Attendance Details
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{backgroundColor: '#F7EEF9'}}>
                <TableCell>S.NO</TableCell>
                <TableCell>MEMBER ID</TableCell>
                <TableCell>LOGIN TIME</TableCell>
                <TableCell>LOGOUT TIME</TableCell>
                <TableCell>MEMBER NAME</TableCell>
                <TableCell>MEMBERSHIP EXPIRING DATE</TableCell>
                <TableCell>PENDING AMOUNT</TableCell>
                <TableCell>DAYS LEFT</TableCell>
                <TableCell>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockData.length > 0 ? (
                mockData.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.loginTime}</TableCell>
                    <TableCell>{row.logoutTime}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.expiringDate}</TableCell>
                    <TableCell>{row.pendingAmount}</TableCell>
                    <TableCell>{row.daysLeft}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" size="small">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No Data Available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default MemberAttendance;
