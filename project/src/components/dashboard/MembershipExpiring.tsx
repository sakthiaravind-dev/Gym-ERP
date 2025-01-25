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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createClient } from "@supabase/supabase-js";
import { toast } from "react-toastify";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
  const [data, setData] = useState<Member[]>([]);
  const [filteredData, setFilteredData] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const todayDate = today.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from("members")
      .select("sno, member_end_date, member_id, member_name, member_phone_number, member_type")
      .gte('member_end_date', firstDayOfMonth)
      .lte('member_end_date', todayDate);

    if (error) {
      console.error("Error fetching members:", error);
    } else {
      setData(data || []);
      setFilteredData(data || []);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = data.filter(
      (item) =>
        item.member_id.toLowerCase().includes(query) ||
        item.member_name.toLowerCase().includes(query) ||
        item.member_phone_number.toLowerCase().includes(query) ||
        item.member_type.toLowerCase().includes(query)
    );

    setFilteredData(filtered);
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
    if (selectedMember) {
      const { error } = await supabase.from("members").delete().eq("sno", selectedMember.sno);
      if (error) {
        toast.error("Failed to delete member: " + error.message);
      } else {
        toast.success("Member deleted successfully!");
        fetchMembers();
      }
    }
    handleMenuClose();
  };

  const handleEditSubmit = async () => {
    if (selectedMember) {
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
      if (error) {
        toast.error("Failed to update member: " + error.message);
      } else {
        toast.success("Member updated successfully!");
        fetchMembers();
      }
    }
    setOpenEditModal(false);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSelectedMember((prevData) =>
      prevData
        ? {
            ...prevData,
            [name]: value,
          }
        : null
    );
  };

  return (
    <div style={{ padding: "20px" }}>
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
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <TableRow key={row.sno}>
                    <TableCell align="center">{index + 1}</TableCell>
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
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No data available in table
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
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