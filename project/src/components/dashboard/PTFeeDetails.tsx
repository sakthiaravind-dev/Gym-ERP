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
  TableSortLabel,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import { createClient } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import StatGroup from "./StatGroup";
import { Users } from "lucide-react";
import { ReactNode } from 'react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const tableHeaders = [
  { id: "sno", label: "S.NO" },
  { id: "emp_id", label: "MEMBER ID" },
  { id: "member_name", label: "MEMBER NAME" },
  { id: "pending", label: "PENDING AMOUNT" },
  { id: "phone", label: "MEMBER PHONE NUMBER" },
  { id: "renewal_date", label: "PENDING EXP DATE" },
  { id: "actions", label: "ACTIONS", disableSorting: true },
];

interface Transaction {
  sno: number;
  emp_id: string;
  member_name: string;
  pending: string;
  phone: string;
  renewal_date: string;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  try {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  } catch {
    return dateString;
  }
};

// Add this custom pagination component before the main Members component
const TablePaginationActions = (props: {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}) => {
  const { count, page, rowsPerPage, onPageChange } = props;
  const [showInput, setShowInput] = useState(false);
  const [inputPage, setInputPage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pageNumber = parseInt(inputPage, 10);
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= Math.ceil(count / rowsPerPage)) {
      onPageChange(e as unknown as React.MouseEvent<HTMLButtonElement>, pageNumber - 1);
    }
    setShowInput(false);
    setInputPage('');
  };

  const renderPageNumbers = () => {
    const pageNumbers: ReactNode[] = [];
    const totalPages = Math.ceil(count / rowsPerPage);
    const currentPage = page + 1;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <Button
            key={i}
            onClick={(e) => onPageChange(e, i - 1)}
            variant={currentPage === i ? "contained" : "outlined"}
            size="small"
            sx={{ mx: 0.5, minWidth: '30px' }}
          >
            {i}
          </Button>
        );
      }
    } else {
      // Always show first page
      pageNumbers.push(
        <Button
          key={1}
          onClick={(e) => onPageChange(e, 0)}
          variant={currentPage === 1 ? "contained" : "outlined"}
          size="small"
          sx={{ mx: 0.5, minWidth: '30px' }}
        >
          1
        </Button>
      );

      if (currentPage <= 4) {
        for (let i = 2; i <= 5; i++) {
          pageNumbers.push(
            <Button
              key={i}
              onClick={(e) => onPageChange(e, i - 1)}
              variant={currentPage === i ? "contained" : "outlined"}
              size="small"
              sx={{ mx: 0.5, minWidth: '30px' }}
            >
              {i}
            </Button>
          );
        }
        pageNumbers.push(
          <Button key="dots1" onClick={() => setShowInput(true)}>
            ...
          </Button>
        );
      } else if (currentPage >= totalPages - 3) {
        pageNumbers.push(
          <Button key="dots1" onClick={() => setShowInput(true)}>
            ...
          </Button>
        );
        for (let i = totalPages - 4; i < totalPages; i++) {
          pageNumbers.push(
            <Button
              key={i}
              onClick={(e) => onPageChange(e, i - 1)}
              variant={currentPage === i ? "contained" : "outlined"}
              size="small"
              sx={{ mx: 0.5, minWidth: '30px' }}
            >
              {i}
            </Button>
          );
        }
      } else {
        pageNumbers.push(
          <Button key="dots1" onClick={() => setShowInput(true)}>
            ...
          </Button>
        );
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(
            <Button
              key={i}
              onClick={(e) => onPageChange(e, i - 1)}
              variant={currentPage === i ? "contained" : "outlined"}
              size="small"
              sx={{ mx: 0.5, minWidth: '30px' }}
            >
              {i}
            </Button>
          );
        }
        pageNumbers.push(
          <Button key="dots2" onClick={() => setShowInput(true)}>
            ...
          </Button>
        );
      }

      pageNumbers.push(
        <Button
          key={totalPages}
          onClick={(e) => onPageChange(e, totalPages - 1)}
          variant={currentPage === totalPages ? "contained" : "outlined"}
          size="small"
          sx={{ mx: 0.5, minWidth: '30px' }}
        >
          {totalPages}
        </Button>
      );
    }

    return pageNumbers;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {renderPageNumbers()}
      {showInput && (
        <form onSubmit={handleInputSubmit}>
          <TextField
            size="small"
            value={inputPage}
            onChange={handleInputChange}
            onBlur={() => setShowInput(false)}
            autoFocus
            sx={{ width: '50px', mx: 0.5 }}
          />
        </form>
      )}
    </Box>
  );
};

const PTFeePending = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalPendingAmount, setTotalPendingAmount] = useState<number>(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Transaction>("sno");

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
    setPage(0);
  };

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

  const handleSort = (property: keyof Transaction) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.member_name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const valueA = a[orderBy];
    const valueB = b[orderBy];

    if (valueA < valueB) {
      return order === "asc" ? -1 : 1;
    }
    if (valueA > valueB) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  });

  const paginatedTransactions = sortedTransactions.slice(
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
                {tableHeaders.map((header) => (
                  <TableCell
                    key={header.id}
                    align="center"
                    sx={{ backgroundColor: "#F7EEF9", fontWeight: "700" }}
                  >
                    {header.disableSorting ? (
                      header.label
                    ) : (
                      <TableSortLabel
                        active={orderBy === header.id}
                        direction={orderBy === header.id ? order : "asc"}
                        onClick={() => handleSort(header.id as keyof Transaction)}
                      >
                        {header.label}
                      </TableSortLabel>
                    )}
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
                    <TableCell align="center">{formatDate(transaction.renewal_date)}</TableCell>
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
          ActionsComponent={TablePaginationActions}
        />
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

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