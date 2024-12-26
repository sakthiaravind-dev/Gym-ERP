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
  TablePagination,
  TextField,
  Paper,
  Button,
} from "@mui/material";
import { Users } from "lucide-react";
import StatGroup from "./StatGroup";


const cardConfig = [
    { title: "TOTAL AMOUNT", value: "0", Icon: Users, path: "/expense" },
    { title: "TOTAL AMOUNT SPENT THIS YEAR", value: "0", Icon: Users, path: "/expense" },
    { title: "AMOUNT SPENT THIS MONTH", value: "0", Icon: Users, path: "/expense" },
    { title: "TOTAL AMOUNT SPENT TODAY", value: "0", Icon: Users, path: "/expense" },
  ];

const Expense = () => {
  const tableRows = Array.from({ length: 0 }, (_, index) => ({
    id: `${index + 1}`,
    item: `Item ${index + 1}`,
    date: `2025-12-${(index % 31 + 1).toString().padStart(2, "0")}`,
    description: `Description ${index + 1}`,
    amount: `${(index + 1) * 100}`,
    receipt: `Receipt ${index + 1}`,
  }));

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter rows based on search text
  const filteredRows = tableRows.filter((row) =>
    row.item.toLowerCase().includes(searchText.toLowerCase())
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
        <Button variant="contained" color="primary">
          Upcoming Service
        </Button>
        <Button variant="contained" color="primary">
          Export Data
        </Button>
        <Button variant="contained" color="primary">
          Add Expense
        </Button>
      </Box>
      <div>
        <StatGroup stats={cardConfig} />
      </div>
      {/* Header */}
      <div className="flex-row justify-center text-center bg-white p-6 border-gray-300 border">
      <Typography
        variant="h5"
        gutterBottom
        style={{ marginBottom: "20px", color: "#71045F", fontWeight: "bold" }}
      >
        Expense Details
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
            <TableRow sx={{ backgroundColor: "#F7EEF9", fontWeight: '700'   }}>
              <TableCell>ID</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Receipt</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.item}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.receipt}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary">
                    Actions
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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

export default Expense;
