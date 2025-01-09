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
  Modal,
  IconButton,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from '@mui/icons-material/Close';
import { createClient } from "@supabase/supabase-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Transaction {
  sno?: number;
  bill_date: string;
  start_date: string;
  emp_id: string;
  member_name: string;
  member_type: string;
  phone: string;
  total_paid: string;
  total_amount_received: string;
  payment_mode: string;
  received_by: string;
}

const TransactionComponent = () => {
  const { period } = useParams<{ period?: string }>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    bill_date: "",
    start_date: "",
    emp_id: "",
    member_name: "",
    member_type: "",
    phone: "",
    total_paid: "",
    total_amount_received: "",
    payment_mode: "",
    received_by: "",
  });
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [period, transactions]);

  const fetchTransactions = async () => {
    const { data, error } = await supabase.from("transactions").select("*");
    if (error) {
      toast.error("Failed to fetch transactions: " + error.message);
    } else {
      setTransactions(data);
    }
  };

  const filterTransactions = () => {
    const today = new Date();
    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.bill_date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth();
      const transactionDay = transactionDate.getDate();

      switch (period) {
        case "yearly":
          return transactionYear === today.getFullYear();
        case "monthly":
          return transactionYear === today.getFullYear() && transactionMonth === today.getMonth();
        case "today":
          return transactionYear === today.getFullYear() && transactionMonth === today.getMonth() && transactionDay === today.getDate();
        default:
          return true; 
      }
    });
    setFilteredTransactions(filtered);
  };

  const handleAddTransaction = async () => {
    const { error } = await supabase.from("transactions").insert([newTransaction]);
    if (error) {
      toast.error("Failed to add transaction: " + error.message);
    } else {
      toast.success("Transaction added successfully!");
      fetchTransactions();
      setOpenModal(false);
      setNewTransaction({
        bill_date: "",
        start_date: "",
        emp_id: "",
        member_name: "",
        member_type: "",
        phone: "",
        total_paid: "",
        total_amount_received: "",
        payment_mode: "",
        received_by: "",
      });
    }
  };

  const handleEditTransaction = async () => {
    if (!selectedTransaction) return;
    const { error } = await supabase
      .from("transactions")
      .update(selectedTransaction)
      .eq("sno", selectedTransaction.sno);
    if (error) {
      toast.error("Failed to update transaction: " + error.message);
    } else {
      toast.success("Transaction updated successfully!");
      fetchTransactions();
      setAnchorEl(null);
      setSelectedTransaction(null);
    }
  };

  const handleDeleteTransaction = async () => {
    if (!selectedTransaction) return;
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("sno", selectedTransaction.sno);
    if (error) {
      toast.error("Failed to delete transaction: " + error.message);
    } else {
      toast.success("Transaction deleted successfully!");
      fetchTransactions();
      setAnchorEl(null);
      setSelectedTransaction(null);
    }
  };

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, transaction: Transaction) => {
    setAnchorEl(event.currentTarget);
    setSelectedTransaction(transaction);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTransaction(null);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedTransactions = filteredTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box p={4}>
      <ToastContainer />

      <div className="flex-row justify-center text-center bg-white p-6 border-gray-300 border">
        <Typography
          variant="h5"
          gutterBottom
          style={{ marginBottom: "20px", color: "#71045F", fontWeight: "bold" }}
        >
          {(period || "").charAt(0).toUpperCase() + (period || "").slice(1)} Transaction Details
        </Typography>

        <Button
          variant="contained"
          sx={{ backgroundColor: "#2485bd", color: "white", padding: "5px 15px", marginBottom: 2 }}
          onClick={() => setOpenModal(true)}
        >
          Add Transaction
        </Button>

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
              <TableRow >
                <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: '700'   }}>SNO</TableCell>
                <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: '700'   }}>BILL DATE</TableCell>
                <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: '700'   }}>START DATE</TableCell>
                <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: '700'   }}>MEMBER ID</TableCell>
                <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: '700'   }}>MEMBER NAME</TableCell>
                <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: '700'   }}>MEMBER TYPE</TableCell>
                <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: '700'   }}>MEMBER PHONE NUMBER</TableCell>
                <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: '700'   }}>TOTAL MONTH PAID</TableCell>
                <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: '700'   }}>TOTAL AMOUNT RECEIVED</TableCell>
                <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: '700'   }}>PAYMENT MODE</TableCell>
                <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: '700'   }}>RECEIVED BY</TableCell>
                <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: '700'   }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction, index) => (
                  <TableRow key={transaction.sno}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{transaction.bill_date}</TableCell>
                    <TableCell>{transaction.start_date}</TableCell>
                    <TableCell>{transaction.emp_id}</TableCell>
                    <TableCell>{transaction.member_name}</TableCell>
                    <TableCell>{transaction.member_type}</TableCell>
                    <TableCell>{transaction.phone}</TableCell>
                    <TableCell>{transaction.total_paid}</TableCell>
                    <TableCell>{transaction.total_amount_received}</TableCell>
                    <TableCell>{transaction.payment_mode}</TableCell>
                    <TableCell>{transaction.received_by}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        aria-controls={anchorEl ? "actions-menu" : undefined}
                        aria-haspopup="true"
                        onClick={(e) => handleActionClick(e, transaction)}
                        endIcon={<ArrowDropDownIcon />} 
                      >
                        Actions
                      </Button>
                      <Menu
                        id="actions-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedTransaction?.sno === transaction.sno}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={() => setOpenModal(true)}>Edit</MenuItem>
                        <MenuItem onClick={handleDeleteTransaction}>Delete</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    No data available in table
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredTransactions.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
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
            p: 4,
            borderRadius: 2,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">{selectedTransaction ? "Edit Transaction" : "Add Transaction"}</Typography>
            <IconButton onClick={() => setOpenModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            label="Bill Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={selectedTransaction ? selectedTransaction.bill_date : newTransaction.bill_date}
            onChange={(e) => {
              const value = e.target.value;
              if (selectedTransaction) {
                setSelectedTransaction({ ...selectedTransaction, bill_date: value });
              } else {
                setNewTransaction({ ...newTransaction, bill_date: value });
              }
            }}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={selectedTransaction ? selectedTransaction.start_date : newTransaction.start_date}
            onChange={(e) => {
              const value = e.target.value;
              if (selectedTransaction) {
                setSelectedTransaction({ ...selectedTransaction, start_date: value });
              } else {
                setNewTransaction({ ...newTransaction, start_date: value });
              }
            }}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Employee ID"
            variant="outlined"
            value={selectedTransaction ? selectedTransaction.emp_id : newTransaction.emp_id}
            onChange={(e) => {
              const value = e.target.value;
              if (selectedTransaction) {
                setSelectedTransaction({ ...selectedTransaction, emp_id: value });
              } else {
                setNewTransaction({ ...newTransaction, emp_id: value });
              }
            }}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Member Name"
            variant="outlined"
            value={selectedTransaction ? selectedTransaction.member_name : newTransaction.member_name}
            onChange={(e) => {
              const value = e.target.value;
              if (selectedTransaction) {
                setSelectedTransaction({ ...selectedTransaction, member_name: value });
              } else {
                setNewTransaction({ ...newTransaction, member_name: value });
              }
            }}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Member Type"
            variant="outlined"
            value={selectedTransaction ? selectedTransaction.member_type : newTransaction.member_type}
            onChange={(e) => {
              const value = e.target.value;
              if (selectedTransaction) {
                setSelectedTransaction({ ...selectedTransaction, member_type: value });
              } else {
                setNewTransaction({ ...newTransaction, member_type: value });
              }
            }}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Phone"
            variant="outlined"
            value={selectedTransaction ? selectedTransaction.phone : newTransaction.phone}
            onChange={(e) => {
              const value = e.target.value;
              if (selectedTransaction) {
                setSelectedTransaction({ ...selectedTransaction, phone: value });
              } else {
                setNewTransaction({ ...newTransaction, phone: value });
              }
            }}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Total Paid"
            variant="outlined"
            value={selectedTransaction ? selectedTransaction.total_paid : newTransaction.total_paid}
            onChange={(e) => {
              const value = e.target.value;
              if (selectedTransaction) {
                setSelectedTransaction({ ...selectedTransaction, total_paid: value });
              } else {
                setNewTransaction({ ...newTransaction, total_paid: value });
              }
            }}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Total Amount Received"
            variant="outlined"
            value={selectedTransaction ? selectedTransaction.total_amount_received : newTransaction.total_amount_received}
            onChange={(e) => {
              const value = e.target.value;
              if (selectedTransaction) {
                setSelectedTransaction({ ...selectedTransaction, total_amount_received: value });
              } else {
                setNewTransaction({ ...newTransaction, total_amount_received: value });
              }
            }}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Payment Mode"
            variant="outlined"
            value={selectedTransaction ? selectedTransaction.payment_mode : newTransaction.payment_mode}
            onChange={(e) => {
              const value = e.target.value;
              if (selectedTransaction) {
                setSelectedTransaction({ ...selectedTransaction, payment_mode: value });
              } else {
                setNewTransaction({ ...newTransaction, payment_mode: value });
              }
            }}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            label="Received By"
            variant="outlined"
            value={selectedTransaction ? selectedTransaction.received_by : newTransaction.received_by}
            onChange={(e) => {
              const value = e.target.value;
              if (selectedTransaction) {
                setSelectedTransaction({ ...selectedTransaction, received_by: value });
              } else {
                setNewTransaction({ ...newTransaction, received_by: value });
              }
            }}
            sx={{ marginBottom: "15px" }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={selectedTransaction ? handleEditTransaction : handleAddTransaction}
            sx={{ backgroundColor: "#2485bd", color: "white" }}
          >
            {selectedTransaction ? "Save Changes" : "Add Transaction"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default TransactionComponent;