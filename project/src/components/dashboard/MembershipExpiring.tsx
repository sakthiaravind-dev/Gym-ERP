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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createClient } from "@supabase/supabase-js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const tableHeaders = [
  "S.NO",
  "END ON",
  "MEMBER ID",
  "MEMBER NAME",
  "PHONE",
  "PACK",
  "ACTIONS",
];

interface Member {
  sno: number;
  member_end_date: string;
  member_id: string;
  member_name: string;
  member_phone_number: string;
  member_type: string;
}

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
      setDisplayData(fetchedData || []);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to fetch members");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataFiltering = () => {
    try {
      if (!searchQuery.trim()) {
        setDisplayData(data);
        return;
      }

      const query = searchQuery.toLowerCase();
      const filtered = data.filter((item) => {
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

  const paginatedData = displayData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <TableRow key={row.sno}>
                    <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell align="center">{row.member_end_date}</TableCell>
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
          count={displayData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
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