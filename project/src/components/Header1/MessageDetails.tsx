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

const MessageDetails: React.FC = () => {
  const mockMessage: any[] = []; // Placeholder for event data

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);

  const filteredEvents = mockMessage.filter(
    (event) =>
      event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(event.id).includes(searchTerm) ||
      event.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const csvData = [
      ["S.NO", "PHONE", "MESSAGE", "SENT BY"],
      ...mockMessage.map((event) => [
        event.sno,
        event.phone,
        event.message,
        event.sent,
        
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
      {/* Top Section with Heading, Search, and Add Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
       
        {/* Centered Heading */}
        <Typography
          variant="h5"
          sx={{ color: "#71045F", fontWeight: "bold", margin: 0, flex: 1, textAlign: "center", marginRight: -15 }}>
          Message details
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
              <TableCell>S.NO</TableCell>
              <TableCell>PHONE</TableCell>
              <TableCell>MESSAGE</TableCell>
              <TableCell>SENT BY</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvents.length > 0 ? (
              filteredEvents.slice(0, entriesPerPage).map((event) => (
                <TableRow key={event.sno}>
                  <TableCell>{event.sno}</TableCell>
                  <TableCell>{event.phone}</TableCell>
                  <TableCell>{event.message}</TableCell>
                  <TableCell>{event.sent}</TableCell>
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
    </Box>
  );
};

export default MessageDetails;