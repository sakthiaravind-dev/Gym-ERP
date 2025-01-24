import React, { useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  Paper,
  TextField,
  Menu,
  MenuItem,
} from "@mui/material";

// Sample data for the table
const initialData = [
  {
    endOn: "2025-01-31",
    memberId: "M001",
    memberName: "John Doe",
    phone: "123-456-7890",
    pack: "Gold",
  },
  {
    endOn: "2025-02-15",
    memberId: "M002",
    memberName: "Jane Smith",
    phone: "987-654-3210",
    pack: "Silver",
  },
  {
    endOn: "2025-03-01",
    memberId: "M003",
    memberName: "Alice Johnson",
    phone: "555-123-4567",
    pack: "Platinum",
  },
];

const tableHeaders = [
  "S.NO",
  "END ON",
  "MEMBER ID",
  "MEMBER NAME",
  "PHONE",
  "PACK",
  "ACTIONS",
];

const MembershipExpiring = () => {
  const [data, setData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState("");

  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredData = initialData.filter(
      (item) =>
        item.memberId.toLowerCase().includes(query) ||
        item.memberName.toLowerCase().includes(query) ||
        item.phone.toLowerCase().includes(query) ||
        item.pack.toLowerCase().includes(query)
    );

    setData(filteredData);
  };

  // Handle menu open
  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  // Handle Edit functionality
  const handleEdit = () => {
    console.log("Editing:", selectedRow);
    handleMenuClose();
    // Add edit logic here
    alert(`Editing Member: ${selectedRow.memberName}`);
  };

  // Handle Delete functionality
  const handleDelete = () => {
    console.log("Deleting:", selectedRow);
    setData((prevData) => prevData.filter((row) => row !== selectedRow));
    handleMenuClose();
    alert(`Deleted Member: ${selectedRow.memberName}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Box sx={{ marginBottom: 3, display: "flex", gap: 1 }}>
        <Button variant="contained" color="primary">
          Show Filter
        </Button>
        <Button variant="contained" color="primary">
          Hide Filter
        </Button>
      </Box>

      <div className="flex-row justify-center text-center bg-white p-6 border-gray-300 border">
        <Typography
          variant="h5"
          style={{ marginBottom: "20px", color: "#71045F", fontWeight: "bold" }}
        >
          Membership Going to End
        </Typography>

        <div className="w-1/4">
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {tableHeaders.map((header, index) => (
                  <TableCell
                    key={index}
                    align="center"
                    sx={{ backgroundColor: "#F7EEF9", fontWeight: "700" }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{row.endOn}</TableCell>
                    <TableCell align="center">{row.memberId}</TableCell>
                    <TableCell align="center">{row.memberName}</TableCell>
                    <TableCell align="center">{row.phone}</TableCell>
                    <TableCell align="center">{row.pack}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "#2485bd" }}
                        size="small"
                        onClick={(event) => handleMenuOpen(event, row)}
                      >
                        Actions
                      </Button>
                      {/* Dropdown Menu */}
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={handleEdit}>Edit</MenuItem>
                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
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
      </div>
    </div>
  );
};

export default MembershipExpiring;