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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import StatGroup from './StatGroup';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { membershipStats } from '../../constants/dashboardStats';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LucideIcon } from "lucide-react";



// Mock member data
const mockMemberData = Array.from({ length: 50 }, (_, index) => ({
  id: `M${index + 1}`,
  name: `Member ${index + 1}`,
  phoneNumber: `12345${index.toString().padStart(5, "0")}`,
  type: ["Yearly", "Monthly", "Quarterly"][index % 3],
  referredBy: `Referrer ${index % 10 + 1}`,
  endDate: `2025-12-${(index % 31 + 1).toString().padStart(2, "0")}`,
}));

const tableHeaders = [
  "MEMBER ID",
  "MEMBER NAME",
  "MEMBER PHONE NUMBER",
  "MEMBER TYPE",
  "REFERRED BY",
  "END ON",
  "ACTIONS",
];

const MemberDetails = () => {
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
    setAnchorEl(null); // Close menu after action
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
      

      <div className="flex-row justify-center text-center bg-white p-6 border-gray-300 border">
        <Typography variant="h5" style={{ marginBottom: "20px", color: "#71045F", fontWeight: "bold" }}>
          Member Details
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
                  <TableCell key={index} align="center" sx={{ backgroundColor: '#F7EEF9', fontWeight: '700' }}>
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
                    <TableCell align="center">{member.type}</TableCell>
                    <TableCell align="center">{member.referredBy}</TableCell>
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
          <MenuItem onClick={() => handleAction("Edit")}>Edit</MenuItem>
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

export default MemberDetails;