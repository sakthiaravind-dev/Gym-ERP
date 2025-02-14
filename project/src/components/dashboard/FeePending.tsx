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
  Box,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableSortLabel,
} from "@mui/material";
import { Search as SearchIcon } from '@mui/icons-material';
import StatGroup from './StatGroup';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Users } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReactNode } from 'react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const cardConfig = [
  { title: "TOTAL AMOUNT PENDING", value: "Loading...", Icon: Users, path: "/pending" },
];

interface FeePendingData {
  sno: number;
  member_id: number;
  member_name: string;
  pending_amount: string;
  member_phone: string;
  pending_exp_date: string;
}

const tableHeaders = [
  { id: "sno", label: "S.NO" },
  { id: "member_id", label: "MEMBER ID" },
  { id: "member_name", label: "MEMBER NAME" },
  { id: "pending_amount", label: "PENDING AMOUNT" },
  { id: "member_phone", label: "MEMBER PHONE NUMBER" },
  { id: "pending_exp_date", label: "PENDING EXP DATE" },
  { id: "actions", label: "ACTIONS", disableSorting: true },
];

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

const FeePending = () => {
  const [feePendingData, setFeePendingData] = useState<FeePendingData[]>([]);
  const [filteredFeePendingData, setFilteredFeePendingData] = useState<FeePendingData[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof FeePendingData>("sno");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FeePendingData | null>(null);
  const [totalPendingAmount, setTotalPendingAmount] = useState<number>(0);

  useEffect(() => {
    fetchFeePendingData();
  }, []);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [feePendingData, search, orderBy, order]);

  const fetchFeePendingData = async () => {
    try {
      const { data, error } = await supabase
        .from("fee_pending")
        .select("*");

      if (error) {
        toast.error(`Error fetching data: ${error.message}`);
      } else {
        setFeePendingData(data || []);
        calculateTotalPendingAmount(data || []);
      }
    } catch (err) {
      toast.error(`Unexpected error: ${err}`);
    }
  };

  const calculateTotalPendingAmount = (data: FeePendingData[]) => {
    const total = data.reduce((acc, curr) => acc + parseFloat(curr.pending_amount), 0);
    setTotalPendingAmount(total);
  };

  useEffect(() => {
    // Update cardConfig with the fetched total pending amount
    cardConfig[0].value = totalPendingAmount.toString();
  }, [totalPendingAmount]);

  const applyFiltersAndSorting = () => {
    let filtered = [...feePendingData];

    // Apply search filter
    if (search) {
      filtered = feePendingData.filter(item =>
        item.member_name.toLowerCase().includes(search.toLowerCase()) ||
        item.member_id.toString().includes(search) ||
        item.member_phone.includes(search)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (orderBy === "sno" || orderBy === "member_id") {
        const valueA = a[orderBy];
        const valueB = b[orderBy];
  
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return order === "asc" ? valueA - valueB : valueB - valueA;
        }
        return 0;
      }
  
      if (orderBy === "pending_exp_date") {
        const dateA = new Date(a[orderBy] || "");
        const dateB = new Date(b[orderBy] || "");
        return order === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
  
      if (orderBy === "pending_amount") {
        const numA = parseFloat(a[orderBy] || "0");
        const numB = parseFloat(b[orderBy] || "0");
        return order === "asc" ? numA - numB : numB - numA;
      }
  
      const compareA = String(a[orderBy] || "").toLowerCase();
      const compareB = String(b[orderBy] || "").toLowerCase();
      return order === "asc"
        ? compareA.localeCompare(compareB)
        : compareB.localeCompare(compareA);
    });

    setFilteredFeePendingData(filtered);
  };

  const handleSort = (property: keyof FeePendingData) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, record: FeePendingData) => {
    setAnchorEl(event.currentTarget);
    setSelectedRecord(record);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = async (action: string) => {
    handleClose();
    if (!selectedRecord) return;

    switch (action) {
      case "Pay Bill":
        setOpenEditDialog(true);
        break;
      case "View":
        toast.info(`Viewing record ${selectedRecord.sno}`);
        break;
      case "Delete":
        try {
          const { error } = await supabase
            .from("fee_pending")
            .delete()
            .eq("sno", selectedRecord.sno);

          if (error) {
            toast.error(`Error deleting record: ${error.message}`);
          } else {
            toast.success("Record deleted successfully");
            fetchFeePendingData();
          }
        } catch (err) {
          toast.error(`Unexpected error: ${err}`);
        }
        break;
      default:
        console.log(`${action} clicked`);
    }
  };

  const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
  };

  const handleEditSubmit = async () => {
    if (!selectedRecord) return;

    try {
      const { error } = await supabase
        .from("fee_pending")
        .update({
          member_id: selectedRecord.member_id,
          member_name: selectedRecord.member_name,
          pending_amount: selectedRecord.pending_amount,
          member_phone: selectedRecord.member_phone,
          pending_exp_date: selectedRecord.pending_exp_date,
        })
        .eq("sno", selectedRecord.sno);

      if (error) {
        toast.error(`Error updating record: ${error.message}`);
      } else {
        toast.success("Record updated successfully");
        fetchFeePendingData();
      }
    } catch (err) {
      toast.error(`Unexpected error: ${err}`);
    } finally {
      setOpenEditDialog(false);
    }
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSelectedRecord(prev => prev ? { ...prev, [name]: value } : null);
  };

  const paginatedMembers = filteredFeePendingData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div style={{ padding: "20px" }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <StatGroup stats={cardConfig} />

      <div className="flex-row justify-center text-center bg-white p-6 border-gray-300 border">
        <Typography variant="h5" style={{ marginBottom: "20px", color: "#71045F", fontWeight: "bold" }}>
          Fee Pending Details
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{ position: 'relative', width: "300px" }}>
              <TextField
                placeholder="Search Members"
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                  ),
                }}
              />
            </Box>
            <TablePagination
              rowsPerPageOptions={[50, 60, 100]}
              component="div"
              count={filteredFeePendingData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              sx={{ border: 'none', '.MuiTablePagination-toolbar': { pl: 0 } }}
            />
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableCell
                    key={header.id}
                    align="center"
                    sx={{
                      backgroundColor: "#F7EEF9",
                      fontWeight: "700",
                      cursor: header.disableSorting ? 'default' : 'pointer'
                    }}
                  >
                    {header.disableSorting ? (
                      header.label
                    ) : (
                      <TableSortLabel
                        active={orderBy === header.id}
                        direction={orderBy === header.id ? order : "asc"}
                        onClick={() => handleSort(header.id as keyof FeePendingData)}
                        sx={{
                          '&.MuiTableSortLabel-active': {
                            color: '#71045F',
                          },
                          '&.MuiTableSortLabel-active .MuiTableSortLabel-icon': {
                            color: '#71045F',
                          },
                        }}
                      >
                        {header.label}
                      </TableSortLabel>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedMembers.length > 0 ? (
                paginatedMembers.map((member) => (
                  <TableRow key={member.sno}>
                    <TableCell align="center">{member.sno}</TableCell>
                    <TableCell align="center">{member.member_id}</TableCell>
                    <TableCell align="center">{member.member_name}</TableCell>
                    <TableCell align="center">{member.pending_amount}</TableCell>
                    <TableCell align="center">{member.member_phone}</TableCell>
                    <TableCell align="center">{formatDate(member.pending_exp_date)}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        aria-controls={anchorEl ? "actions-menu" : undefined}
                        aria-haspopup="true"
                        onClick={(event) => handleClick(event, member)}
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
          <MenuItem onClick={() => handleAction("Pay Bill")}>Pay Bill</MenuItem>
          <MenuItem onClick={() => handleAction("View")}>View</MenuItem>
          <MenuItem onClick={() => handleAction("Delete")}>Delete</MenuItem>
        </Menu>

        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={filteredFeePendingData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          ActionsComponent={TablePaginationActions}
        />
      </div>

      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Fee Pending Details</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Member ID"
            type="number"
            fullWidth
            name="member_id"
            value={selectedRecord?.member_id || ""}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Member Name"
            type="text"
            fullWidth
            name="member_name"
            value={selectedRecord?.member_name || ""}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Pending Amount"
            type="text"
            fullWidth
            name="pending_amount"
            value={selectedRecord?.pending_amount || ""}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Member Phone"
            type="text"
            fullWidth
            name="member_phone"
            value={selectedRecord?.member_phone || ""}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Pending Exp Date"
            type="date"
            fullWidth
            name="pending_exp_date"
            value={selectedRecord?.pending_exp_date || ""}
            onChange={handleEditChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FeePending;