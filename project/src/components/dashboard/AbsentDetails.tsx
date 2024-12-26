import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  TablePagination,
  TextField,
  Paper,
  Button,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const AbsentDetails = () => {
  const tableRows = Array.from({ length: 10 }, (_, index) => ({
    id: `${index + 1}`,
    name: `Member ${index + 1}`,
    phoneNumber: `12345${index.toString().padStart(5, "0")}`,
  }));

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleAction = (action: string) => {
        console.log(`${action} clicked`);
        setAnchorEl(null); // Close menu after action
      };

      const handleClose = () => {
        setAnchorEl(null);
      };
  

  // Filter rows based on search text
  const filteredRows = tableRows.filter((row) =>
    row.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Paginated rows
  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle pagination
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

  return (
    <Box p={4}>
        <Box sx={{ marginBottom: 3, display: "flex", gap: 1 }}>
        <Button variant="contained" color="primary" >
          Filter
        </Button>
      </Box>
      {/* Header */}
      <div className="flex-row justify-center text-center bg-white p-6 border-gray-300 border">
      <Typography
        variant="h5"
        gutterBottom
        style={{ marginBottom: "20px", color: "#71045F", fontWeight: "bold" }}
      >
        Continuous Absent Details
      </Typography>

      {/* Search Field */}
      <div className="w-1/4">
        <TextField
          label="Search by Item"
          variant="outlined"
          fullWidth
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: "20px" }}
        />
      </div>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F7EEF9", fontWeight: '700'  }}>
                <TableCell>SNO</TableCell>
              <TableCell>MEMBER ID</TableCell>
              <TableCell>MEMBER NAME</TableCell>
              <TableCell>PHONE NUMBER</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.phoneNumber}</TableCell>
                <TableCell>
                <Button
                    variant="contained"
                    aria-controls={anchorEl ? "actions-menu" : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                    endIcon={<ArrowDropDownIcon />} 
                    >
                      Actions
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
          id="actions-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleAction("View")}>View</MenuItem>
          <MenuItem onClick={() => handleAction("sent-message")}>Sent Messange</MenuItem>
        </Menu>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredRows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </div>
    </Box>
  );
};

export default AbsentDetails;
