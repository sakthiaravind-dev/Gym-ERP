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
} from "@mui/material";
import StatGroup from "./StatGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Users } from "lucide-react";

const cardConfig = [
  { title: "TOTAL AMOUNT PENDING", value: "₹2500", Icon: Users, path: "/pending" },
];

const mockMemberData = Array.from({ length: 50 }, (_, index) => ({
  id: `M${index + 1}`,
  name: `Member ${index + 1}`,
  amount: `${(index + 1) * 100}`,
  phoneNumber: `12345${index.toString().padStart(5, "0")}`,
  expDate: `2025-12-${(index % 31 + 1).toString().padStart(2, "0")}`,
}));

// Table headers including the new S.No column
const tableHeaders = [
  "S.NO",
  "MEMBER ID",
  "MEMBER NAME",
  "PENDING AMOUNT",
  "MEMBER PHONE NUMBER",
  "PENDING EXP DATE",
  "ACTIONS",
];

const PTFeePending = () => {
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
      <StatGroup stats={cardConfig} />

      <div className="flex-row justify-center text-center bg-white p-6 border-gray-300 border">
        <Typography
          variant="h5"
          style={{ marginBottom: "20px", color: "#71045F", fontWeight: "bold" }}
        >
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
              {paginatedMembers.length > 0 ? (
                paginatedMembers.map((member, index) => (
                  <TableRow key={index}>
                    {/* Add Serial Number */}
                    <TableCell align="center">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell align="center">{member.id}</TableCell>
                    <TableCell align="center">{member.name}</TableCell>
                    <TableCell align="center">{member.amount}</TableCell>
                    <TableCell align="center">{member.phoneNumber}</TableCell>
                    <TableCell align="center">{member.expDate}</TableCell>
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
          <MenuItem onClick={() => handleAction("Pay Bill")}>Pay Pendings</MenuItem>
          <MenuItem onClick={() => handleAction("View")}>View</MenuItem>
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

export default PTFeePending;