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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Search as SearchIcon } from '@mui/icons-material';
import StatGroup from './StatGroup';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Users } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  "S.NO",
  "MEMBER ID",
  "MEMBER NAME",
  "PENDING AMOUNT",
  "MEMBER PHONE NUMBER",
  "PENDING EXP DATE",
  "ACTIONS",
];

const FeePending = () => {
  const [feePendingData, setFeePendingData] = useState<FeePendingData[]>([]);
  const [filteredFeePendingData, setFilteredFeePendingData] = useState<FeePendingData[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FeePendingData | null>(null);
  const [totalPendingAmount, setTotalPendingAmount] = useState<number>(0);

  useEffect(() => {
    fetchFeePendingData();
  }, []);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [feePendingData, search, sortDirection]);

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
        item.member_id.toString().includes(search)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const order = sortDirection === "asc" ? 1 : -1;
      return (a.sno - b.sno) * order;
    });

    setFilteredFeePendingData(filtered);
  };

  const handleSearch = () => {
    applyFiltersAndSorting();
  };

  const handleSort = () => {
    setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
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

        <Box display="flex" justifyContent="space-between" width="100%" marginBottom={2}>
  <Button variant="contained" onClick={handleSort} sx={{ backgroundColor: '#2485bd', color: '#fff', width: '130px', height: '50px' }}>
    Sort ({sortDirection === "asc" ? "Ascending" : "Descending"})
  </Button>
  <Box display="flex" alignItems="center" ml="auto">
    <TextField
      label="Search"
      variant="outlined"
      margin="normal"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      sx={{ width: "300px" }}
    />
    <IconButton onClick={handleSearch} aria-label="search">
      <SearchIcon />
    </IconButton>
  </Box>
</Box>
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
                paginatedMembers.map((member) => (
                  <TableRow key={member.sno}>
                    <TableCell align="center">{member.sno}</TableCell>
                    <TableCell align="center">{member.member_id}</TableCell>
                    <TableCell align="center">{member.member_name}</TableCell>
                    <TableCell align="center">{member.pending_amount}</TableCell>
                    <TableCell align="center">{member.member_phone}</TableCell>
                    <TableCell align="center">{member.pending_exp_date}</TableCell>
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