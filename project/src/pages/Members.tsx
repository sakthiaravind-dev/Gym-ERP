import React, { useState, useEffect } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Box,
  TableHead,
  TableRow,
  Paper,
  Menu,
  MenuItem,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TablePagination,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const tableHeaders = [
  "S.NO",
  "MEMBER ID",
  "MEMBER NAME",
  "MEMBER PHONE NUMBER",
  "MEMBER TYPE",
  "MEMBER STATUS",
  "REFERRED BY",
  "END ON",
  "ACTIONS",
];

interface Member {
  member_id: string;
  member_name: string;
  member_phone_number: string;
  member_type: string;
  member_status: string;
  referred_by: string;
  member_end_date: string;
}

const Members = () => {
  const [memberData, setMemberData] = useState<Member[]>([]);
  const [filteredData, setFilteredData] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchAllMembers();
  }, []);

  useEffect(() => {
    setFilteredData(memberData.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
  }, [page, rowsPerPage, memberData]);

  const fetchAllMembers = async () => {
    const { data, error } = await supabase
      .from("members")
      .select("member_id, member_name, member_phone_number, member_type, member_status, referred_by, member_end_date");

    if (error) {
      console.error("Error fetching members:", error);
    } else {
      setMemberData(data);
      setFilteredData(data.slice(0, rowsPerPage)); // Initially set filtered data to the first page
      setTotalCount(data.length);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = memberData.filter((member) =>
      Object.values(member).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );
    setFilteredData(filtered.slice(0, rowsPerPage));
    setTotalCount(filtered.length);
    setPage(0);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, member: Member) => {
    setAnchorEl(event.currentTarget);
    setSelectedMember(member);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setOpenEditDialog(true);
    handleClose();
  };

  const handleDelete = async () => {
    if (selectedMember) {
      const { error } = await supabase.from("members").delete().eq("member_id", selectedMember.member_id);
      if (error) {
        toast.error("Failed to delete member: " + error.message);
      } else {
        toast.success("Member deleted successfully!");
        fetchAllMembers();
      }
    }
    handleClose();
  };

  const handleEditSubmit = async () => {
    if (selectedMember) {
      const updatedMember = {
        member_id: selectedMember.member_id,
        member_name: selectedMember.member_name,
        member_phone_number: selectedMember.member_phone_number,
        member_type: selectedMember.member_type,
        member_status: selectedMember.member_status,
        referred_by: selectedMember.referred_by,
        member_end_date: selectedMember.member_end_date,
      };

      const { error } = await supabase
        .from("members")
        .update(updatedMember)
        .eq("member_id", selectedMember.member_id);
      if (error) {
        toast.error("Failed to update member: " + error.message);
      } else {
        toast.success("Member updated successfully!");
        fetchAllMembers();
      }
    }
    setOpenEditDialog(false);
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

  // Export to Excel
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(memberData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "members.xlsx");
    toast.success("Members exported successfully!");
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography
        variant="h5"
        sx={{ marginBottom: 2, textAlign: "center", color: "#71045F", fontWeight: "bold" }}
      >
        Member Details
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <TextField
          placeholder="Search Members"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          sx={{ marginRight: 2, width: "300px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleExport}
          sx={{ backgroundColor: "#2485bd", color: "#fff" }}
        >
          Export Data
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeaders.map((header, index) => (
                <TableCell key={index} align="center" sx={{ backgroundColor: "#F7EEF9", fontWeight: "700" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((member, index) => (
              <TableRow key={index}>
                <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                <TableCell align="center">{member.member_id}</TableCell>
                <TableCell align="center">{member.member_name}</TableCell>
                <TableCell align="center">{member.member_phone_number}</TableCell>
                <TableCell align="center">{member.member_type}</TableCell>
                <TableCell align="center">{member.member_status}</TableCell>
                <TableCell align="center">{member.referred_by}</TableCell>
                <TableCell align="center">{member.member_end_date}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    onClick={(event) => handleClick(event, member)}
                    endIcon={<ArrowDropDownIcon />}
                  >
                    Actions
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 50, 100]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Member</DialogTitle>
        <DialogContent>
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
            label="Member Type"
            fullWidth
            value={selectedMember?.member_type || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="member_status"
            label="Member Status"
            fullWidth
            value={selectedMember?.member_status || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="referred_by"
            label="Referred By"
            fullWidth
            value={selectedMember?.referred_by || ""}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Members;