/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
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
  TableSortLabel,
  MenuItem,
  Button,
  TablePagination,
  Card,
  CardContent,
  Grid,
  Modal,
  IconButton,
  CircularProgress
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import { createClient } from "@supabase/supabase-js";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "react-toastify/dist/ReactToastify.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) throw new Error("Missing Supabase URL or anon key");
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Transaction {
  sno: number;
  bill_date: string;
  start_date: string;
  emp_id: string;
  member_name: string;
  month_paid: string;
  pending: string;
  discount: string;
  state: string;
  total_amount_received: string;
  payment_mode: string;
  renewal_date: string;
}

const TransactionComponent = () => {

  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [amountCollected, setAmountCollected] = useState(0);
  const [amountPending, setAmountPending] = useState(0);
  const [collectedToday, setCollectedToday] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const [orderBy, setOrderBy] = useState("");

  // Added for sorting by SNO:
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");



  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterAndSortTransactions();
    calculateStatusCards();
  }, [transactions, searchQuery, sortDirection]);

  const fetchTransactions = async () => {
    let all: Transaction[] = [];
    let from = 0;
    const step = 1000;
    let to = step - 1;
    let fetchMore = true;

    while (fetchMore) {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .range(from, to);

      if (error) {
        toast.error("Failed to fetch transactions: " + error.message);
        fetchMore = false;
      } else {
        if (data && data.length > 0) {
          all = [...all, ...data];
          from += step;
          to += step;
        } else {
          fetchMore = false;
        }
      }
    }
    setTransactions(all);
  };

  const filterAndSortTransactions = () => {
    // Filter by search query
    // eslint-disable-next-line prefer-const
    let result = transactions.filter(
      (t) =>
        t.member_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.emp_id?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort by sno
    if (sortDirection === "asc") {
      result.sort((a, b) => a.sno - b.sno);
    } else {
      result.sort((a, b) => b.sno - a.sno);
    }

    setFiltered(result);
  };

  const calculateStatusCards = () => {
    const today = new Date();
    let collected = 0;
    let pending = 0;
    let todayCollected = 0;
    let todayTrans = 0;

    transactions.forEach((t) => {
      const d = new Date(t.bill_date || "");
      if (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth()
      ) {
        collected += parseFloat(t.total_amount_received || "0");
      }
      pending += parseFloat(t.pending || "0");
      if (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
      ) {
        todayCollected += parseFloat(t.total_amount_received || "0");
        todayTrans++;
      }
    });
    setAmountCollected(collected);
    setAmountPending(pending);
    setCollectedToday(todayCollected);
    setTransactionCount(todayTrans);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>, t: Transaction) => {
    setAnchorEl(e.currentTarget);
    setSelectedTransaction(t);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setOpenEdit(true);
    handleClose();
  };

  const handleDelete = async () => {
    if (!selectedTransaction || !window.confirm("Are you sure?")) return;
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("sno", selectedTransaction.sno);
      if (error) throw error;
      toast.success("Transaction deleted!");
      await fetchTransactions();
    } catch (err) {
      toast.error("Failed to delete transaction");
    } finally {
      setIsSubmitting(false);
      handleClose();
    }
  };

  const handleBill = () => {
    if (!selectedTransaction) toast.error("No transaction selected");
    else navigate(`/pendingbill/${selectedTransaction.emp_id}/${selectedTransaction.sno}`);
    handleClose();
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(transactions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), "transactions.xlsx");
    toast.success("Transactions exported!");
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  // Toggle sort direction by SNO

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleEditSubmit = async () => {
    if (!selectedTransaction) return;
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("transactions")
        .update({
          bill_date: selectedTransaction.bill_date,
          start_date: selectedTransaction.start_date,
          member_name: selectedTransaction.member_name,
          month_paid: selectedTransaction.month_paid,
          pending: selectedTransaction.pending,
          discount: selectedTransaction.discount,
          state: selectedTransaction.state,
          total_amount_received: selectedTransaction.total_amount_received,
          payment_mode: selectedTransaction.payment_mode,
          renewal_date: selectedTransaction.renewal_date
        })
        .eq("sno", selectedTransaction.sno);
      if (error) throw error;
      toast.success("Transaction updated!");
      await fetchTransactions();
    } catch (err) {
      toast.error("Failed to update transaction");
    } finally {
      setIsSubmitting(false);
      setOpenEdit(false);
      setSelectedTransaction(null);
    }
  };
  const handleSort = (property: keyof Transaction) => {
    setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setOrderBy(property);
  };
  
  
  const sortedData = [...paginated].sort((a, b) => {
    const valueA = a[orderBy as keyof Transaction];
    const valueB = b[orderBy as keyof Transaction];
  
    if (valueA < valueB) return order === "asc" ? -1 : 1;
    if (valueA > valueB) return order === "asc" ? 1 : -1;
    return 0;
  });
  
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedTransaction((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  return (
    <Box p={4}>
      <ToastContainer />
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Collected This Month
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                ₹{amountCollected.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Total Pending
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                ₹{amountPending.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Collected Today
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {collectedToday.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Transactions Today
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {transactionCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleExport}
            sx={{ backgroundColor: "#2485bd" }}
          >
            Export Data
          </Button>
        </Box>

        <Typography
          variant="h5"
          sx={{ textAlign: "center", fontWeight: "bold", color: "#71045F", flexGrow: 1 }}
        >
          Transaction Details
        </Typography>

        <TextField
          label="Search"
          variant="outlined"
          sx={{ width: "25%" }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <Box sx={{ overflowX: "auto", maxWidth: "90vw" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ position: "sticky", top: 0, zIndex: 1, whiteSpace: "nowrap" }}>
            <TableRow>
              {[
                { id: "sno", label: "SNO" },
                { id: "bill_date", label: "BILL DATE" },
                { id: "emp_id", label: "MEMBER ID" },
                { id: "member_name", label: "MEMBER NAME" },
                { id: "month_paid", label: "MONTH PAID" },
                { id: "pending", label: "PENDING" },
                { id: "discount", label: "DISCOUNT" },
                { id: "state", label: "STATE" },
                { id: "total_amount_received", label: "TOTAL" },
                { id: "payment_mode", label: "PAYMENT MODE" },
                { id: "start_date", label: "START DATE" },
                { id: "renewal_date", label: "RENEWAL DATE" }
              ].map((column) => (
                <TableCell
                  key={column.id}
                  sx={{ backgroundColor: "#F7EEF9", fontWeight: 700 }}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : "asc"}
                    onClick={() => handleSort(column.id as keyof Transaction)}
                  >
                    {column.label}
                  </TableSortLabel>

                </TableCell>
              ))}
              <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: 700 }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.length ? (
              sortedData.map((t) => (
                <TableRow key={t.sno}>
                  <TableCell>{t.sno}</TableCell>
                  <TableCell>{t.bill_date}</TableCell>
                  <TableCell>{t.emp_id}</TableCell>
                  <TableCell>{t.member_name}</TableCell>
                  <TableCell>{t.month_paid}</TableCell>
                  <TableCell>{t.pending}</TableCell>
                  <TableCell>{t.discount}</TableCell>
                  <TableCell>{t.state}</TableCell>
                  <TableCell>{t.total_amount_received}</TableCell>
                  <TableCell>{t.payment_mode}</TableCell>
                  <TableCell>{t.start_date}</TableCell>
                  <TableCell>{t.renewal_date}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={(e) => handleClick(e, t)} endIcon={<ArrowDropDownIcon />}>
                      Actions
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={13} align="center">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
        <MenuItem onClick={handleBill}>Pay Bill</MenuItem>
      </Menu>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filtered.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 500,
            bgcolor: "white",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Edit Transaction</Typography>
            <IconButton onClick={() => setOpenEdit(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            sx={{ my: 1 }}
            name="bill_date"
            label="Bill Date"
            type="date"
            fullWidth
            value={selectedTransaction?.bill_date || ""}
            onChange={handleEditChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            sx={{ my: 1 }}
            name="start_date"
            label="Start Date"
            type="date"
            fullWidth
            value={selectedTransaction?.start_date || ""}
            onChange={handleEditChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            sx={{ my: 1 }}
            name="member_name"
            label="Member Name"
            fullWidth
            value={selectedTransaction?.member_name || ""}
            onChange={handleEditChange}
          />
          <TextField
            sx={{ my: 1 }}
            name="month_paid"
            label="Month Paid"
            fullWidth
            value={selectedTransaction?.month_paid || ""}
            onChange={handleEditChange}
          />
          <TextField
            sx={{ my: 1 }}
            name="pending"
            label="Pending"
            fullWidth
            value={selectedTransaction?.pending || ""}
            onChange={handleEditChange}
          />
          <TextField
            sx={{ my: 1 }}
            name="discount"
            label="Discount"
            fullWidth
            value={selectedTransaction?.discount || ""}
            onChange={handleEditChange}
          />
          <TextField
            sx={{ my: 1 }}
            name="state"
            label="State"
            fullWidth
            value={selectedTransaction?.state || ""}
            onChange={handleEditChange}
          />
          <TextField
            sx={{ my: 1 }}
            name="total_amount_received"
            label="Total Amount"
            fullWidth
            value={selectedTransaction?.total_amount_received || ""}
            onChange={handleEditChange}
          />
          <TextField
            sx={{ my: 1 }}
            name="payment_mode"
            label="Payment Mode"
            fullWidth
            value={selectedTransaction?.payment_mode || ""}
            onChange={handleEditChange}
          />
          <TextField
            sx={{ my: 1 }}
            name="renewal_date"
            label="Renewal Date"
            type="date"
            fullWidth
            value={selectedTransaction?.renewal_date || ""}
            onChange={handleEditChange}
            InputLabelProps={{ shrink: true }}
          />
          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <Button variant="outlined" onClick={() => setOpenEdit(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleEditSubmit}
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default TransactionComponent;