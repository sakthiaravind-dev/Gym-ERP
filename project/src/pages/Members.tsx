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
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  "MEMBER ID",
  "MEMBER NAME",
  "MEMBER PHONE NUMBER",
  "MEMBER TYPE",
  "REFERRED BY",
  "END ON",
  "ACTIONS",
];

interface Member {
  member_id: string;
  member_name: string;
  member_phone_number: string;
  member_type: string;
  referred_by: string;
  bill_date: string;
}

const Members = () => {
  const [memberData, setMemberData] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filter, setFilter] = useState({ type: "", referredBy: "" });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("members")
      .select("member_id, member_name, member_phone_number, member_type, referred_by, bill_date");
    if (error) {
      console.error("Error fetching members:", error);
    } else {
      setMemberData(data);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, member: Member) => {
    setAnchorEl(event.currentTarget);
    setSelectedMember(member);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const handleFilterApply = () => {
    setFilterDialogOpen(false);
  };

  const handleFilterReset = () => {
    setFilter({ type: "", referredBy: "" });
    setFilterDialogOpen(false);
  };

  const filteredMembers = memberData.filter((member) => {
    return (
      member.member_name.toLowerCase().includes(search.toLowerCase()) &&
      (filter.type ? member.member_type === filter.type : true) &&
      (filter.referredBy ? member.referred_by === filter.referredBy : true)
    );
  });

  const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(memberData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "members.xlsx");
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
        fetchMembers();
      }
    }
    handleClose();
  };

  const handleEditSubmit = async () => {
    if (selectedMember) {
      const updatedMember = {
        member_name: selectedMember.member_name || null,
        member_phone_number: selectedMember.member_phone_number || null,
        member_type: selectedMember.member_type || null,
        referred_by: selectedMember.referred_by || null,
        bill_date: selectedMember.bill_date || null,
      };

      const { error } = await supabase
        .from("members")
        .update(updatedMember)
        .eq("member_id", selectedMember.member_id);
      if (error) {
        toast.error("Failed to update member: " + error.message);
      } else {
        toast.success("Member updated successfully!");
        fetchMembers();
      }
    }
    setOpenEditDialog(false);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const paginatedMembers = filteredMembers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div style={{ padding: "20px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" color="primary" onClick={() => setFilterDialogOpen(true)}>
            Filter
          </Button>
          <Button variant="contained" color="primary" onClick={handleExport}>
            Export Data
          </Button>
        </Box>
        <TextField
          label="Search"
          variant="outlined"
          value={search}
          onChange={handleSearch}
          size="small"
        />
      </Box>
      <Typography
        variant="h5"
        sx={{ marginBottom: 2, textAlign: "center", color: "#71045F", fontWeight: "bold" }}
      >
        Member Details
      </Typography>
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
            {paginatedMembers.length > 0 ? (
              paginatedMembers.map((member, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{member.member_id}</TableCell>
                  <TableCell align="center">{member.member_name}</TableCell>
                  <TableCell align="center">{member.member_phone_number}</TableCell>
                  <TableCell align="center">{member.member_type}</TableCell>
                  <TableCell align="center">{member.referred_by}</TableCell>
                  <TableCell align="center">{member.bill_date}</TableCell>
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
      {/* Remaining components like Menu, Pagination, Edit Dialog, Filter Dialog */}
    </div>
  );
};

export default Members;