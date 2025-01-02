import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { Users } from "lucide-react";
import StatGroup from "./StatGroup";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Expense = () => {
  interface Expense {
    id: number;
    item: string;
    date_of_purchase: string;
    description: string;
    amount: string;
    payment_mode: string;
  }
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filter, setFilter] = useState({ startDate: "", endDate: "", minAmount: "", maxAmount: "", paymentMode: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const { data, error } = await supabase.from("expenses").select("*");
    if (error) {
      console.error("Error fetching expenses:", error);
    } else {
      setExpenses(data);
    }
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(expenses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "expenses.xlsx");
  };

  const handleFilter = () => {
    setFilterDialogOpen(true);
  };

  const handleFilterApply = () => {
    setFilterDialogOpen(false);
  };

  const handleFilterReset = () => {
    setFilter({ startDate: "", endDate: "", minAmount: "", maxAmount: "", paymentMode: "" });
    setFilterDialogOpen(false);
  };

  const handleAddExpense = () => {
    navigate("/addexpense");
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, expense: Expense) => {
    setAnchorEl(event.currentTarget);
    setSelectedExpense(expense);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setOpenEditDialog(true);
    handleClose();
  };

  const handleDelete = async () => {
    if (selectedExpense) {
      const { error } = await supabase.from("expenses").delete().eq("id", selectedExpense.id);
      if (error) {
        console.error("Failed to delete expense:", error);
      } else {
        fetchExpenses();
      }
    }
    handleClose();
  };

  const handleEditSubmit = async () => {
    if (selectedExpense) {
      const { error } = await supabase
        .from("expenses")
        .update(selectedExpense)
        .eq("id", selectedExpense.id);
      if (error) {
        console.error("Failed to update expense:", error);
      } else {
        fetchExpenses();
        setOpenEditDialog(false);
      }
    }
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setSelectedExpense((prevData) => prevData ? ({
      ...prevData,
      [name]: value,
    }) : null);
  };

  const calculateTotalAmount = () => {
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount || "0"), 0).toFixed(2);
  };

  const calculateTotalAmountSpentThisYear = () => {
    const currentYear = new Date().getFullYear();
    return expenses
      .filter((expense) => new Date(expense.date_of_purchase).getFullYear() === currentYear)
      .reduce((total, expense) => total + parseFloat(expense.amount || "0"), 0)
      .toFixed(2);
  };

  const calculateAmountSpentThisMonth = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    return expenses
      .filter(
        (expense) =>
          new Date(expense.date_of_purchase).getFullYear() === currentYear &&
          new Date(expense.date_of_purchase).getMonth() === currentMonth
      )
      .reduce((total, expense) => total + parseFloat(expense.amount || "0"), 0)
      .toFixed(2);
  };

  const calculateTotalAmountSpentToday = () => {
    const today = new Date().toISOString().split("T")[0];
    return expenses
      .filter((expense) => expense.date_of_purchase === today)
      .reduce((total, expense) => total + parseFloat(expense.amount || "0"), 0)
      .toFixed(2);
  };

  const cardConfig = [
    { title: "TOTAL AMOUNT", value: calculateTotalAmount(), Icon: Users, path: "/expense" },
    { title: "TOTAL AMOUNT SPENT THIS YEAR", value: calculateTotalAmountSpentThisYear(), Icon: Users, path: "/expense" },
    { title: "AMOUNT SPENT THIS MONTH", value: calculateAmountSpentThisMonth(), Icon: Users, path: "/expense" },
    { title: "TOTAL AMOUNT SPENT TODAY", value: calculateTotalAmountSpentToday(), Icon: Users, path: "/expense" },
  ];

  // Filter rows based on search text and filter criteria
  const filteredRows = expenses.filter((row) => {
    const matchesSearchText = row.item.toLowerCase().includes(searchText.toLowerCase());
    const matchesStartDate = filter.startDate ? new Date(row.date_of_purchase) >= new Date(filter.startDate) : true;
    const matchesEndDate = filter.endDate ? new Date(row.date_of_purchase) <= new Date(filter.endDate) : true;
    const matchesMinAmount = filter.minAmount ? parseFloat(row.amount) >= parseFloat(filter.minAmount) : true;
    const matchesMaxAmount = filter.maxAmount ? parseFloat(row.amount) <= parseFloat(filter.maxAmount) : true;
    const matchesPaymentMode = filter.paymentMode ? row.payment_mode === filter.paymentMode : true;
    return matchesSearchText && matchesStartDate && matchesEndDate && matchesMinAmount && matchesMaxAmount && matchesPaymentMode;
  });

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
        <Button variant="contained" color="primary" onClick={handleFilter}>
          Filter
        </Button>
        <Button variant="contained" color="primary">
          Upcoming Service
        </Button>
        <Button variant="contained" color="primary" onClick={handleExport}>
          Export Data
        </Button>
        <Button variant="contained" color="primary" onClick={handleAddExpense}>
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
              <TableRow sx={{ backgroundColor: "#F7EEF9", fontWeight: '700' }}>
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
              {paginatedRows.length > 0 ? (
                paginatedRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.item}</TableCell>
                    <TableCell>{row.date_of_purchase}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>{row.payment_mode}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        aria-controls={anchorEl ? "actions-menu" : undefined}
                        aria-haspopup="true"
                        onClick={(event) => handleClick(event, row)}
                      >
                        Actions
                      </Button>
                      <Menu
                        id="actions-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
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
                    No Expenses Found
                  </TableCell>
                </TableRow>
              )}
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

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>
          Edit Expense
          <IconButton
            aria-label="close"
            onClick={() => setOpenEditDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Item"
            name="item"
            value={selectedExpense?.item || ""}
            onChange={(event) => handleEditChange(event as SelectChangeEvent<string>)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Date of Purchase"
            name="date_of_purchase"
            type="date"
            value={selectedExpense?.date_of_purchase || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Description"
            name="description"
            value={selectedExpense?.description || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Amount"
            name="amount"
            value={selectedExpense?.amount || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Payment Mode</InputLabel>
            <Select
              name="payment_mode"
              value={selectedExpense?.payment_mode || ""}
              onChange={handleEditChange}
              label="Payment Mode"
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Credit">Credit</MenuItem>
              <MenuItem value="POS">POS</MenuItem>
              <MenuItem value="Google pay">Google pay</MenuItem>
              <MenuItem value="Paytm">Paytm</MenuItem>
              <MenuItem value="Amazon pay">Amazon pay</MenuItem>
              <MenuItem value="Netbanking">Netbanking</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)}>
        <DialogTitle>Filter Expenses</DialogTitle>
        <DialogContent>
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={filter.startDate}
            onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            value={filter.endDate}
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Min Amount"
            name="minAmount"
            type="number"
            value={filter.minAmount}
            onChange={(e) => setFilter({ ...filter, minAmount: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Max Amount"
            name="maxAmount"
            type="number"
            value={filter.maxAmount}
            onChange={(e) => setFilter({ ...filter, maxAmount: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Payment Mode"
            name="paymentMode"
            value={filter.paymentMode}
            onChange={(e) => setFilter({ ...filter, paymentMode: e.target.value })}
            fullWidth
            margin="normal"
            select
            SelectProps={{
              native: true,
            }}
          >
            <option value="">All</option>
            <option value="Cash">Cash</option>
            <option value="Credit">Credit</option>
            <option value="POS">POS</option>
            <option value="Google pay">Google pay</option>
            <option value="Paytm">Paytm</option>
            <option value="Amazon pay">Amazon pay</option>
            <option value="Netbanking">Netbanking</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterReset} color="primary">
            Reset
          </Button>
          <Button onClick={handleFilterApply} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Expense;