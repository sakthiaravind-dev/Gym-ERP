import React, { useState, useEffect } from "react";
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
  Modal,
  Box,
  IconButton,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import { createClient } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import StatGroup from "./StatGroup";
import { Users } from "lucide-react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const tableHeaders = [
  "S.NO",
  "MEMBER ID",
  "MEMBER NAME",
  "PENDING AMOUNT",
  "MEMBER PHONE NUMBER",
  "PENDING EXP DATE",
  "ACTIONS",
];

interface Transaction {
  sno: number;
  emp_id: string;
  member_name: string;
  pending: string;
  phone: string;
  renewal_date: string;
}

const PTFeePending = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalPendingAmount, setTotalPendingAmount] = useState<number>(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    fetchTransactions();
    fetchTotalPendingAmount();
  }, []);

  const fetchTransactions = async () => {
    const todayDate = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from("transactions")
      .select("sno, emp_id, member_name, pending, phone, renewal_date")
      .eq("state", "pending")
      .lte("renewal_date", todayDate);

    if (error) {
      console.error("Error fetching transactions:", error);
    } else {
      setTransactions(data || []);
    }
  };

  const fetchTotalPendingAmount = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("pending")
      .eq("state", "pending");

    if (error) {
      console.error("Error fetching total pending amount:", error);
    } else {
      const total = data.reduce((sum, transaction) => sum + parseFloat(transaction.pending), 0);
      setTotalPendingAmount(total);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.member_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, transaction: Transaction) => {
    setAnchorEl(event.currentTarget);
    setSelectedTransaction(transaction);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setOpenEditModal(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedTransaction) {
      const { error } = await supabase.from("transactions").delete().eq("sno", selectedTransaction.sno);
      if (error) {
        toast.error("Failed to delete transaction: " + error.message);
      } else {
        toast.success("Transaction deleted successfully!");
        fetchTransactions();
        fetchTotalPendingAmount();
      }
    }
    handleMenuClose();
  };

  const handleEditSubmit = async () => {
    if (selectedTransaction) {
      const { error } = await supabase
        .from("transactions")
        .update({
          emp_id: selectedTransaction.emp_id,
          member_name: selectedTransaction.member_name,
          pending: selectedTransaction.pending,
          phone: selectedTransaction.phone,
          renewal_date: selectedTransaction.renewal_date,
        })
        .eq("sno", selectedTransaction.sno);
      if (error) {
        toast.error("Failed to update transaction: " + error.message);
      } else {
        toast.success("Transaction updated successfully!");
        fetchTransactions();
        fetchTotalPendingAmount();
      }
    }
    setOpenEditModal(false);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSelectedTransaction((prevData) =>
      prevData
        ? {
            ...prevData,
            [name]: value,
          }
        : null
    );
  };

  const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div style={{ padding: "20px" }}>
      <StatGroup stats={[{ title: "TOTAL AMOUNT PENDING", value: `₹${totalPendingAmount}`, Icon: Users, path: "/pending" }]} />

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
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction, index) => (
                  <TableRow key={transaction.sno}>
                    <TableCell align="center">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell align="center">{transaction.emp_id}</TableCell>
                    <TableCell align="center">{transaction.member_name}</TableCell>
                    <TableCell align="center">{transaction.pending}</TableCell>
                    <TableCell align="center">{transaction.phone}</TableCell>
                    <TableCell align="center">{transaction.renewal_date}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        aria-controls={anchorEl ? "actions-menu" : undefined}
                        aria-haspopup="true"
                        onClick={(event) => handleMenuOpen(event, transaction)}
                        endIcon={<ArrowDropDownIcon />}
                      >
                        Actions
                      </Button>
                      <Menu
                        id="actions-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                          elevation: 0,
                          sx: {
                            overflow: 'visible',
                            filter: 'none',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1,
                            },
                            '&:before': {
                              display: 'none',
                            },
                          },
                        }}
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
                    No Members Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={filteredTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>

      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
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
            <Typography variant="h6">Edit Transaction</Typography>
            <IconButton onClick={() => setOpenEditModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            name="emp_id"
            label="Member ID"
            fullWidth
            value={selectedTransaction?.emp_id || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="member_name"
            label="Member Name"
            fullWidth
            value={selectedTransaction?.member_name || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="pending"
            label="Pending Amount"
            fullWidth
            value={selectedTransaction?.pending || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="phone"
            label="Phone Number"
            fullWidth
            value={selectedTransaction?.phone || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="renewal_date"
            label="Pending Exp Date"
            type="date"
            fullWidth
            value={selectedTransaction?.renewal_date || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleEditSubmit}
            sx={{ backgroundColor: "#2485bd", color: "white" }}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default PTFeePending;