import React, { useState, useEffect } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  Paper,
  TextField,
  Menu,
  MenuItem,
  Modal,
  IconButton,
  TablePagination,
  CircularProgress,
  TableSortLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createClient } from "@supabase/supabase-js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReactNode } from 'react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const tableHeaders = [
  { id: "sno", label: "S.NO" },
  { id: "member_end_date", label: "END ON" },
  { id: "member_id", label: "MEMBER ID" },
  { id: "member_name", label: "MEMBER NAME" },
  { id: "member_phone_number", label: "PHONE" },
  { id: "member_type", label: "PACK" },
  { id: "actions", label: "ACTIONS", disableSorting: true },
];

interface Member {
  sno: number;
  member_end_date: string;
  member_id: string;
  member_name: string;
  member_phone_number: string;
  member_type: string;
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

const MembershipExpiring = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Member[]>([]);
  const [displayData, setDisplayData] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Member>("member_end_date");

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    handleDataFiltering();
  }, [searchQuery, data]);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const today = new Date();
      const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const todayDate = today.toISOString().split('T')[0];

      const { data: fetchedData, error } = await supabase
        .from("members")
        .select("sno, member_end_date, member_id, member_name, member_phone_number, member_type")
        .gte('member_end_date', twoWeeksAgo)
        .lte('member_end_date', todayDate)
        .order('member_end_date', { ascending: true });

      if (error) throw error;

      setData(fetchedData || []);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to fetch members");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSortingAndFiltering();
  }, [data, searchQuery, orderBy, order, page, rowsPerPage]);

  const handleSortingAndFiltering = () => {
    let filteredData = [...data];

    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (orderBy) {
      filteredData.sort((a, b) => {
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
    }

    // Apply pagination
    const paginatedData = filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    setDisplayData(paginatedData);
  };

  const handleDataFiltering = () => {
    try {
      let filtered = [...data];
      if (!searchQuery.trim()) {
        setDisplayData(data);
        return;
      }

      const query = searchQuery.toLowerCase();
      filtered = data.filter((item) => {
        return (
          (item.member_id?.toLowerCase() || "").includes(query) ||
          (item.member_name?.toLowerCase() || "").includes(query) ||
          (item.member_phone_number?.toLowerCase() || "").includes(query) ||
          (item.member_type?.toLowerCase() || "").includes(query)
        );
      });

      setDisplayData(filtered);
      setPage(0);
    } catch (error) {
      console.error("Error filtering data:", error);
      setDisplayData(data);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, member: Member) => {
    setAnchorEl(event.currentTarget);
    setSelectedMember(member);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setOpenEditModal(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!selectedMember) return;

    try {
      const { error } = await supabase
        .from("members")
        .delete()
        .eq("sno", selectedMember.sno);

      if (error) throw error;

      toast.success("Member deleted successfully!");
      await fetchMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error("Failed to delete member");
    }
    handleMenuClose();
  };

  const handleEditSubmit = async () => {
    if (!selectedMember) return;

    try {
      const { error } = await supabase
        .from("members")
        .update({
          member_id: selectedMember.member_id,
          member_name: selectedMember.member_name,
          member_phone_number: selectedMember.member_phone_number,
          member_type: selectedMember.member_type,
          member_end_date: selectedMember.member_end_date,
        })
        .eq("sno", selectedMember.sno);

      if (error) throw error;

      toast.success("Member updated successfully!");
      await fetchMembers();
      setOpenEditModal(false);
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error("Failed to update member");
    }
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSelectedMember((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property: keyof Member) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <ToastContainer />
      <Box sx={{ marginBottom: 3, display: "flex", gap: 1 }}>
        <Button variant="contained" color="primary">
          Show Filter
        </Button>
        <Button variant="contained" color="primary">
          Hide Filter
        </Button>
      </Box>

      <div className="flex-row justify-center text-center bg-white p-6 border-gray-300 border">
        <Typography
          variant="h5"
          style={{ marginBottom: "20px", color: "#71045F", fontWeight: "bold" }}
        >
          Membership Going to End
        </Typography>

        <div className="w-1/4">
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchQuery}
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
                        onClick={() => handleSort(header.id as keyof Member)}
                      >
                        {header.label}
                      </TableSortLabel>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayData.length > 0 ? (
                displayData.map((row, index) => (
                  <TableRow key={row.sno}>
                    <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell align="center">{formatDate(row.member_end_date)}</TableCell>
                    <TableCell align="center">{row.member_id}</TableCell>
                    <TableCell align="center">{row.member_name}</TableCell>
                    <TableCell align="center">{row.member_phone_number}</TableCell>
                    <TableCell align="center">{row.member_type}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "#2485bd" }}
                        size="small"
                        onClick={(event) => handleMenuOpen(event, row)}
                      >
                        Actions
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No members found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </div>

      <Menu
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
            <Typography variant="h6">Edit Member</Typography>
            <IconButton onClick={() => setOpenEditModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            name="member_id"
            label="Member ID"
            fullWidth
            value={selectedMember?.member_id || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="member_name"
            label="Member Name"
            fullWidth
            value={selectedMember?.member_name || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="member_phone_number"
            label="Phone Number"
            fullWidth
            value={selectedMember?.member_phone_number || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="member_type"
            label="Pack"
            fullWidth
            value={selectedMember?.member_type || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="member_end_date"
            label="End On"
            type="date"
            fullWidth
            value={selectedMember?.member_end_date || ""}
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

export default MembershipExpiring;