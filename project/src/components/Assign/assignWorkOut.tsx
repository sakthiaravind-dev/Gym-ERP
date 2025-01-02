import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";

type Diet = {
  dietId: string;
  dietName: string;
};

const DietManagement = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  
  // Example data - Replace this with your actual data
  const data: Diet[] = [
    { dietId: "1", dietName: "Keto Diet" },
    { dietId: "2", dietName: "Vegan Diet" },
    { dietId: "3", dietName: "Paleo Diet" },
    { dietId: "4", dietName: "Mediterranean Diet" },
    { dietId: "5", dietName: "Low-Carb Diet" },
  ];

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const filteredData = data.filter((row) =>
    row.dietName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Button variant="contained" color="primary" sx={{ mr: 2 }}>
          Add Diet
        </Button>
        <Button variant="contained" color="secondary">
          Assign Diet
        </Button>
      </Box>

      {/* Title */}
      <Typography
        variant="h5"
        align="center"
        sx={{
          color: "#6a0dad",
          fontWeight: "bold",
          mb: 3,
        }}
      >
        Current Diet
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 2, alignItems: "center" }}>
        <Grid item xs={6}>
          <Typography component="span">Show</Typography>
          <Select
            value={rowsPerPage}
            onChange={() => handleRowsPerPageChange}
            sx={{ mx: 1, minWidth: 80 }}
          >
            {[5, 10, 25].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          <Typography component="span">entries</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography component="span" sx={{ mr: 1 }}>
            Search:
          </Typography>
          <TextField
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "#f3e5f5", fontWeight: "bold" }}>
                DIET ID
              </TableCell>
              <TableCell sx={{ backgroundColor: "#f3e5f5", fontWeight: "bold" }}>
                DIET NAME
              </TableCell>
              <TableCell sx={{ backgroundColor: "#f3e5f5", fontWeight: "bold" }}>
                ACTION
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No data available in table
                </TableCell>
              </TableRow>
            ) : (
              filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.dietId}>
                    <TableCell>{row.dietId}</TableCell>
                    <TableCell>{row.dietName}</TableCell>
                    <TableCell>
                      <Button variant="contained" size="small">
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        sx={{ ml: 1 }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Typography>
          Showing {filteredData.length > 0 ? page * rowsPerPage + 1 : 0} to{" "}
          {Math.min(filteredData.length, (page + 1) * rowsPerPage)} of{" "}
          {filteredData.length} entries
        </Typography>
        <Button variant="contained" color="success">
          Export Data
        </Button>
      </Box>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Box>
  );
};

export default DietManagement;
