import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  Paper,
  TableCell,
  TextField,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  Button,
  TablePagination,
} from "@mui/material";
import { Users, Clock, UserCheck } from "lucide-react";
import StatGroup from "./StatGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";


const memberData = Array.from({ length: 50 }, (_, index) => ({
  billDate: `01/01/2024`,
  startDate: `01/01/2024`,
  transactionId: 1400 + index,
  memberName: `Member ${index}`,
  type: index % 2 === 0 ? 'Yearly' : 'Half-Yearly',
  phone: `9876543${index.toString().padStart(3, '0')}`,
  totalPaid: `${index.toString().padStart(3, "0")}`,
  totalAmountReceived: (index % 2 === 0 ? 10500 : 7500),
  Payment: ["Card", "Google Pay", "Paytm"][index % 3],
}));

const TransactionComponent = () => {
  const { period } = useParams<{ period?: string }>();
  const [filteredMembers, setFilteredMembers] = useState(memberData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const today = new Date();
    const filtered = memberData.filter((member) => {
      const memberDate = new Date(member.billDate);
      const memberYear = memberDate.getFullYear();
      const memberMonth = memberDate.getMonth();
      const memberDay = memberDate.getDate();

      switch (period) {
        case "yearly":
          return memberYear === today.getFullYear();
        case "monthly":
          return memberYear === today.getFullYear() && memberMonth === today.getMonth();
        case "today":
          return memberYear === today.getFullYear() && memberMonth === today.getMonth() && memberDay === today.getDate();
        default:
          return true; // Show all for the "all" case
      }
    });
    setFilteredMembers(filtered);
  }, [period]);

  const cardConfig = [
    { title: "AMOUNT COLLECTED THIS MONTH", value: "215350", Icon: Clock, path: "/transaction/monthly" },
    { title: "TOTAL AMOUNT COLLECTED THIS WEEK", value: "40000", Icon: UserCheck, path: "/transaction/yearly" },
    { title: "TOTAL AMOUNT COLLECTED TODAY", value: "12500", Icon: Users, path: "/transaction/today" },
  ];

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: string) => {
    console.log(`${action} clicked`);
    setAnchorEl(null); // Close menu after action
  };

  const paginatedMembers = filteredMembers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box p={4}>
      <div>
        <StatGroup stats={cardConfig} />
      </div>

      <div className="flex-row justify-center text-center bg-white p-6 border-gray-300 border">
        <Typography
          variant="h5"
          gutterBottom
          style={{ marginBottom: "20px", color: "#71045F", fontWeight: "bold" }}
        >
          {(period || "").charAt(0).toUpperCase() + (period || "").slice(1)} Transaction Details
        </Typography>

        <div className="w-1/4">
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            style={{ marginBottom: "20px" }}
          />
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F7EEF9", fontWeight: '700'   }}>
                <TableCell>SNO</TableCell>
                <TableCell>BILL DATE</TableCell>
                <TableCell>START DATE</TableCell>
                <TableCell>MEMBER ID</TableCell>
                <TableCell>MEMBER NAME</TableCell>
                <TableCell>MEMBER TYPE</TableCell>
                <TableCell>MEMBER PHONE NUMBER</TableCell>
                <TableCell>TOTAL MONTH PAID</TableCell>
                <TableCell>TOTAL AMOUNT RECEIVED</TableCell>
                <TableCell>PAYMENT MODE</TableCell>
                <TableCell>RECEIVED BY</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedMembers.map((member, index) => (
                <TableRow key={member.transactionId}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{member.billDate}</TableCell>
                  <TableCell>{member.startDate}</TableCell>
                  <TableCell>{member.transactionId}</TableCell>
                  <TableCell>{member.memberName}</TableCell>
                  <TableCell>{member.type}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{member.totalPaid}</TableCell>
                  <TableCell>{member.totalAmountReceived}</TableCell>
                  <TableCell>{member.Payment}</TableCell>
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
        <MenuItem onClick={() => handleAction("Pay Bill")}>Pay Bill</MenuItem>
        <MenuItem onClick={() => handleAction("View")}>View</MenuItem>
        <MenuItem onClick={() => handleAction("Delete")}>Delete</MenuItem>
      </Menu>

        <TablePagination
          component="div"
          count={filteredMembers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </Box>
  );
};

export default TransactionComponent;
