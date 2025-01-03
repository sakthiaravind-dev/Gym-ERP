import React, { useState } from "react";
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
} from "@mui/material";

// Define a type for attendance records
interface AttendanceRecord {
  memberId: string;
  date: string;
  loginTime: string;
  logoutTime: string;
  memberName: string;
}

const EmployeeAttendance: React.FC = () => {
  // Explicitly type the state
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [entriesPerPage, setEntriesPerPage] = useState<number>(5);

  const filteredRecords = attendanceRecords.filter(
    (record) =>
      record.memberId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.date?.includes(searchTerm) ||
      record.loginTime?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.logoutTime?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const csvData = [
      ["S.NO", "MEMBER ID", "DATE", "LOGIN TIME", "LOG-OUT TIME", "MEMBER NAME"],
      ...attendanceRecords.map((record, index) => [
        index + 1,
        record.memberId,
        record.date,
        record.loginTime,
        record.logoutTime,
        record.memberName,
      ]),
    ];
    const csvContent = `data:text/csv;charset=utf-8,${csvData
      .map((e) => e.join(","))
      .join("\n")}`;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "employee_attendance.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
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
              <TableCell>MEMBER ID</TableCell>
              <TableCell>DATE</TableCell>
              <TableCell>LOGIN TIME</TableCell>
              <TableCell>LOG-OUT TIME</TableCell>
              <TableCell>MEMBER NAME</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.length > 0 ? (
              filteredRecords.slice(0, entriesPerPage).map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{record.memberId}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.loginTime}</TableCell>
                  <TableCell>{record.logoutTime}</TableCell>
                  <TableCell>{record.memberName}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No data available in table
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <Typography>Showing 0 of 0 entries</Typography>
        <Button
          onClick={handleExport}
          variant="contained"
          sx={{ backgroundColor: "#2485bd", color: "white", padding: "5px 15px" }}
        >
          Export Data
        </Button>
      </Box>
    </Box>
  );
};

export default EmployeeAttendance;