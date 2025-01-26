import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { createClient } from "@supabase/supabase-js";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "react-toastify/dist/ReactToastify.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or anon key");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Transaction {
  sno?: number;
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
  const { period } = useParams<{ period?: string }>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [amountCollected, setAmountCollected] = useState<number>(0);
  const [amountPending, setAmountPending] = useState<number>(0);
  const [collectedToday, setCollectedToday] = useState<number>(0);
  const [transactionCount, setTransactionCount] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);


  

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
    calculateStatusCards();
  }, [period, transactions, searchQuery]);

  const fetchTransactions = async () => {
    let allTransactions: Transaction[] = [];
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
        if (data.length > 0) {
          allTransactions = [...allTransactions, ...data];
          from += step;
          to += step;
        } else {
          fetchMore = false;
        }
      }
    }

    setTransactions(allTransactions);
  };

  const filterTransactions = () => {
    const today = new Date();
    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.bill_date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth();
      const transactionDay = transactionDate.getDate();

      let isPeriodMatch = true;
      switch (period) {
        case "yearly":
          isPeriodMatch = transactionYear === today.getFullYear();
          break;
        case "monthly":
          isPeriodMatch = transactionYear === today.getFullYear() && transactionMonth === today.getMonth();
          break;
        case "today":
          isPeriodMatch =
            transactionYear === today.getFullYear() &&
            transactionMonth === today.getMonth() &&
            transactionDay === today.getDate();
          break;
        default:
          break;
      }

      const isSearchMatch =
        transaction.member_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.emp_id.toLowerCase().includes(searchQuery.toLowerCase());

      return isPeriodMatch && isSearchMatch;
    });

    setFilteredTransactions(filtered);
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>, transaction: Transaction) => {
    setAnchorEl(event.currentTarget);
    setSelectedTransaction(transaction);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedTransaction(null);
  };

  const handleEdit = () => {
    toast.info(`Editing transaction for ${selectedTransaction?.member_name}`);
    handleClose();
  };

  const handleDelete = () => {
    toast.error(`Deleting transaction for ${selectedTransaction?.member_name}`);
    handleClose();
  };
 
const navigate = useNavigate();
const handleBill = () => {
  navigate("/pendingbill");
};
const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(transactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "transactions.xlsx");
    toast.success("Transactions exported successfully!");
  };

  const calculateStatusCards = () => {
    const today = new Date();
    let collected = 0;
    let pending = 0;
    let todayCollected = 0;
    let todayTransactions = 0;

    transactions.forEach((transaction) => {
      collected += parseFloat(transaction.total_amount_received || "0");
      pending += parseFloat(transaction.pending || "0");

      const transactionDate = new Date(transaction.bill_date);
      if (
        transactionDate.getFullYear() === today.getFullYear() &&
        transactionDate.getMonth() === today.getMonth() &&
        transactionDate.getDate() === today.getDate()
      ) {
        todayCollected += parseFloat(transaction.total_amount_received || "0");
        todayTransactions += 1;
      }
    });

    setAmountCollected(collected);
    setAmountPending(pending);
    setCollectedToday(todayCollected);
    setTransactionCount(todayTransactions);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  return (
    <Box p={4}>
      <ToastContainer />

      {/* Status Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Amount Collected This Month
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
                Total Amount Pending
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
                Total Amount Collected Today
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                ₹{collectedToday.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Total Transactions Today
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {transactionCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Table */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Button
                  variant="contained"
                  color="primary"
                  onClick={handleExport}
                  sx={{ backgroundColor: "#2485bd", color: "#fff" }}
                >
                  Export Data
                </Button>
        <Typography
          variant="h5"
          sx={{ textAlign: "center", fontWeight: "bold", color: "#71045F", flexGrow: 1 }}
        >
          {(period || "").charAt(0).toUpperCase() + (period || "").slice(1)} Transaction Details
        </Typography>
        <TextField
          label="Search"
          variant="outlined"
          sx={{ width: "25%" }}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
        />
        
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: "700" }}>SNO</TableCell>
              <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: "700" }}>BILL DATE</TableCell>
              <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: "700" }}>MEMBER ID</TableCell>
              <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: "700" }}>MEMBER NAME</TableCell>
              <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: "700" }}>MONTH PAID</TableCell>
              <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: "700" }}>PENDING</TableCell>
              <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: "700" }}>DISCOUNT</TableCell>
              <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: "700" }}>STATE</TableCell>
              <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: "700" }}>
                TOTAL AMOUNT RECEIVED
              </TableCell>
              <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: "700" }}>
                PAYMENT MODE
              </TableCell>
              <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: "700" }}>START DATE</TableCell>
              <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: "700" }}>RENEWAL DATE</TableCell>
              <TableCell sx={{ backgroundColor: "#F7EEF9", fontWeight: "700" }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction, index) => (
                <TableRow key={transaction.sno}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{transaction.bill_date}</TableCell>
                  <TableCell>{transaction.emp_id}</TableCell>
                  <TableCell>{transaction.member_name}</TableCell>
                  <TableCell>{transaction.month_paid}</TableCell>
                  <TableCell>{transaction.pending}</TableCell>
                  <TableCell>{transaction.discount}</TableCell>
                  <TableCell>{transaction.state}</TableCell>
                  <TableCell>{transaction.total_amount_received}</TableCell>
                  <TableCell>{transaction.payment_mode}</TableCell>
                  <TableCell>{transaction.start_date}</TableCell>
                  <TableCell>{transaction.renewal_date}</TableCell>
                  <TableCell>
                  <Button
                      variant="contained"
                      onClick={(event) => handleClick(event, transaction)}
                      endIcon={<ArrowDropDownIcon />}
                    >
                      Actions
                    </Button>

                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
        <MenuItem onClick={handleBill}>Pay Bill</MenuItem>
      </Menu>

      

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredTransactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default TransactionComponent;