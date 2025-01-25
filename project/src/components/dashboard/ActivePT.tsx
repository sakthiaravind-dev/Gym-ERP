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
  Box,
  TablePagination,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useParams } from "react-router-dom";
import { Users } from "lucide-react";
import StatGroup from './StatGroup';


const cardConfig = [
    { title: "ACTIVE PT MEMBERS", value: "0", Icon: Users, path: "/apt/:status" },
    { title: "IN-ACTIVE PT MEMBERS", value: "30", Icon: Users, path: "/apt/inactive" },
  ];

const mockMemberData = Array.from({ length: 50 }, (_, index) => ({
    id: `M${index + 1}`,
    name: `Member ${index + 1}`,
    phoneNumber: `12345${index.toString().padStart(5, "0")}`,
    pack: ["annual", "half-yearly", "monthly", "quarterly"][index % 4],
    status: index % 2 === 0 ? "Active" : "Inactive",
    type: ["Yearly", "half-yearly", "monthly", "quarterly"][index % 4],
    endDate: `2025-12-${(index % 31 + 1).toString().padStart(2, "0")}`,
  }));
  

  const tableHeaders = [
    "MEMBER ID",
    "MEMBER NAME",
    "MEMBER PHONE NUMBER",
    "MEMBER PACK",
    "MEMBER TYPE",
    "PT EXP DATE",
    "ACTIONS",
  ];
  
  const pttableHeaders = [
      "MEMBER ID",
      "MEMBER NAME",
      "MEMBER PHONE NUMBER",
      "MEMBER PACk",
      "MEMBER TYPE",
      "MEMBER STATUS",
      "ACTIONS",
    ];

const ActivePT = () => {
  const { status } = useParams<{ status: string }>();
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

  const filteredMembers = mockMemberData
    .filter((member) => member.status.toLowerCase() === status?.toLowerCase())
    .filter((member) => 
      member.name.toLowerCase().includes(search.toLowerCase())
    );

  const handleAction = (action: string) => {
    console.log(`${action} clicked`);
    setAnchorEl(null); // Close menu after action
  };

  const handlePageChange = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedMembers = filteredMembers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div style={{ padding: "20px" }}>
      <StatGroup stats={cardConfig} />

      <div className="flex-row justify-center text-center bg-white p-6 border-gray-300 border">
        <Typography
          variant="h5"
          style={{
            marginBottom: "20px",
            color: "#71045F",
            fontWeight: "bold",
          }}
        >
          {status == 'active'? 'ACTIVE': 'IN-ACTIVE'} MEMBER WITH ADDON/PERSONAL TRAINING DETAILS
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
                  <TableCell
                    key={index}
                    align="center"
                    sx={{ backgroundColor: "#F7EEF9", fontWeight: '700' }}
                  >
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
                  <TableCell align="center">{member.pack}</TableCell>
                  <TableCell align="center">{member.type}</TableCell>
                  <TableCell align="center">{member.endDate}</TableCell>
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
                    No {status} Members Found
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
          <MenuItem onClick={() => handleAction("Pay Bill")}>Pay Bill</MenuItem>
          <MenuItem onClick={() => handleAction("View")}>View</MenuItem>
          <MenuItem onClick={() => handleAction("Edit")}>Edit</MenuItem>
          <MenuItem onClick={() => handleAction("Delete")}>Delete</MenuItem>
          <MenuItem onClick={() => handleAction("Diet")}>Diet</MenuItem>
          <MenuItem onClick={() => handleAction("Work-out")}>Work-out</MenuItem>
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

      <div className="flex-row justify-center text-center bg-white p-6 border-gray-300 border">
      <Typography variant="h5" style={{ marginBottom: "20px", color: "#71045F", fontWeight: "bold" }}>
      Personal Training Going To End
      </Typography>


      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {pttableHeaders.map((header, index) => (
                <TableCell key={index} align="center" sx={{backgroundColor: '#F7EEF9', fontWeight: '700'}}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
          </TableBody>
        </Table>
        
      </TableContainer>
      <Box sx={{ marginTop: 3, display: "flex", gap: 1 }}>
      <Button variant="contained" color="primary" sx={{}}>
            Export Data
        </Button>
        </Box>
      </div>
    </div>
  );
};

export default ActivePT;
