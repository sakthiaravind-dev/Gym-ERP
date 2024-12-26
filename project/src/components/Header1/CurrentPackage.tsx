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

const CurrentPackage: React.FC = () => {
  const mockPackages = [
    { id: 2, name: "quarterly", duration: 4, status: "active", amount: 7500, addedBy: "focus7" },
    { id: 3, name: "half yearly", duration: 6, status: "active", amount: 12000, addedBy: "focus7" },
    { id: 14, name: "2 months", duration: 2, status: "active", amount: 5000, addedBy: "focus7" },
    { id: 16, name: "4 months", duration: 4, status: "active", amount: 7500, addedBy: "focus7" },
    { id: 17, name: "Annual", duration: 12, status: "active", amount: 18000, addedBy: "focus7" },
    { id: 18, name: "BLACK FRIDAY", duration: 13, status: "active", amount: 9199, addedBy: "focus7" },
  ];

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);

  const filteredPackages = mockPackages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(pkg.id).includes(searchTerm) ||
      String(pkg.amount).includes(searchTerm) ||
      pkg.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const csvData = [
      ["ID", "Package Name", "Duration (Months)", "Status", "Amount", "Added By"],
      ...mockPackages.map((pkg) => [
        pkg.id,
        pkg.name,
        pkg.duration,
        pkg.status,
        pkg.amount,
        pkg.addedBy,
      ]),
    ];
    const csvContent = `data:text/csv;charset=utf-8,${csvData
      .map((e) => e.join(","))
      .join("\n")}`;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "current_packages.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
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
        >
          Add Package
        </Button>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: "bold", color: "#71045F" }}
        >
          Current Package
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

      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120, marginRight: "15px" }}>
          <InputLabel>Show</InputLabel>
          <Select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            label="Show"
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
        <Typography>entries</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F7EEF9" }}>
              <TableCell>PACKAGE ID</TableCell>
              <TableCell>PACKAGE NAME</TableCell>
              <TableCell>PACKAGE DURATION</TableCell>
              <TableCell>PACKAGE STATUS</TableCell>
              <TableCell>AMOUNT</TableCell>
              <TableCell>ADDED BY</TableCell>
              <TableCell>ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPackages.slice(0, entriesPerPage).map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell>{pkg.id}</TableCell>
                <TableCell>{pkg.name}</TableCell>
                <TableCell>{pkg.duration}</TableCell>
                <TableCell>{pkg.status}</TableCell>
                <TableCell>{pkg.amount}</TableCell>
                <TableCell>{pkg.addedBy}</TableCell>
                <TableCell>
                  <Button variant="contained" size="small" style={{ backgroundColor: "#2485bd" }}>
                    Actions
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <Typography>Showing 1 to {Math.min(entriesPerPage, filteredPackages.length)} of {filteredPackages.length} entries</Typography>
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

export default CurrentPackage;