import React, { useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  MenuItem,
  TextField,
  Button,
  TablePagination,
  Box,
} from "@mui/material";
import StatGroup from '../components/dashboard/StatGroup';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Users } from "lucide-react";

const cardConfig = [
    { title: "TOTAL NO STAFF", value: "2", Icon: Users, path: "/pending" },
  ];

const mockMemberData = Array.from({ length: 2 }, (_, index) => ({
  id: `S${index + 1}`,
  name: `STAFF ${index + 1}`,
  phoneNumber: `12345${index.toString().padStart(5, "0")}`,
  address: "",
  joinDate: `2025-12-${(index % 31 + 1).toString().padStart(2, "0")}`,
  birthDate: `1988-12-${(index % 31 + 1).toString().padStart(2, "0")}`,
}));

const tableHeaders = [
  "STAFF ID",
  "STAFF NAME",
  "STAFF PHONE NUMBER",
  "STAFF ADDRESS",
  "STAFF DATE OF JOINING",
  "STAFF DATE OF BIRTH",
  "ACTIONS",
];

const StaffDetails = () => {
  const [memberData] = useState(mockMemberData); 
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(10); 
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
};

  const filteredMembers = memberData.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );
  const handleAction = (action: string) => {
    console.log(`${action} clicked`);
    setAnchorEl(null); 
  };

const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
};

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
};


  const paginatedMembers = filteredMembers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div style={{ padding: "20px" }}>
        <Box sx={{ marginBottom: 3, display: "flex", gap: 1 }}>
        <Button variant="contained" color="primary" >
          Add Salary
        </Button>
        <Button variant="contained" color="primary">
          View Salary
        </Button>
        <Button variant="contained" color="primary" >
          Track Trainer
        </Button>
        <Button variant="contained" color="primary">
          Export Data
        </Button>
        <Button variant="contained" color="primary">
          Employee Attendance
        </Button>
        </Box>
      <StatGroup stats={cardConfig} />

      <div className="flex-row justify-center text-center bg-white p-6 border-gray-300 border">
      <Typography variant="h5" style={{ marginBottom: "20px", color: "#71045F", fontWeight: "bold" }}>
       Fee Pending Details
      </Typography>

      <div className="w-1/4">
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={search}
        onChange={handleSearch}
      />
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeaders.map((header, index) => (
                <TableCell key={index} align="center" sx={{backgroundColor: '#F7EEF9', fontWeight: '700'  }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedMembers.length > 0 ? (
              paginatedMembers.map((member, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{member.id}</TableCell>
                  <TableCell align="center">{member.name}</TableCell>
                  <TableCell align="center">{member.phoneNumber}</TableCell>
                  <TableCell align="center">{member.address}</TableCell>
                  <TableCell align="center">{member.joinDate}</TableCell>
                  <TableCell align="center">{member.birthDate}</TableCell>
                  <TableCell align="center">
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No Members Found
                </TableCell>
              </TableRow>
            )}
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
        <MenuItem onClick={() => handleAction("View")}>Edit</MenuItem>
        <MenuItem onClick={() => handleAction("Delete")}>Delete</MenuItem>
      </Menu>

      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={filteredMembers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      </div>
    </div>
  );
};

export default StaffDetails;

