/* eslint-disable @typescript-eslint/no-unused-vars */
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
  TableSortLabel,
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
import StatGroup from "../components/dashboard/StatGroup";
import { useLocation } from "react-router-dom";
import { LucideIcon, Users } from "lucide-react";
import { ReactNode } from 'react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);


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

interface CardConfig {
  title: string;
  value: string;
  Icon: LucideIcon;
  path: string;
}

const tableHeaders = [
  { id: "sno", label: "S.No" },
  { id: "member_id", label: "Member ID" },
  { id: "member_name", label: "Name" },
  { id: "member_phone_number", label: "Phone" },
  { id: "member_type", label: "Type" },
  { id: "member_status", label: "Status" },
  { id: "referred_by", label: "Referred By" },
  { id: "member_end_date", label: "End Date" },
  { id: "actions", label: "Actions", disableSorting: true },
];
interface Member {
  member_id: string;
  member_name: string;
  member_phone_number: string;
  member_type: string;
  member_status: string;
  referred_by: string;
  member_end_date: string;
  sno: number; // Added for sorting
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
  const [cardConfig, setCardConfig] = useState<CardConfig[]>([]);
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const [orderBy, setOrderBy] = useState("");

  // Added sort direction for sno
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const location = useLocation();

  useEffect(() => {
    fetchAllMembers();
  }, [location.search]);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [page, rowsPerPage, memberData, searchQuery, sortDirection]);

  const fetchAllMembers = async () => {
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get("type");

    let query = supabase
      .from("members")
      .select("member_id, member_name, member_phone_number, member_type, member_status, referred_by, member_end_date");

    if (type) {
      if (type === "active" || type === "inactive") {
        query = query.eq("member_status", type === "active" ? "active" : "Not-active");
      } else {
        query = query.eq("member_type", type);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching members:", error);
    } else if (data) {
      // Assign a sno to each record for sorting
      const withSno = data.map((member, index) => ({
        ...member,
        sno: index + 1,
      }));
      setMemberData(withSno);
      setTotalCount(withSno.length);
    }
  };

  const applyFiltersAndSorting = () => {
    // First filter by search query
    const queried = memberData.filter((member) =>
      Object.values(member).some((value) => String(value).toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Sort by sno
    if (sortDirection === "asc") {
      queried.sort((a, b) => a.sno - b.sno);
    } else {
      queried.sort((a, b) => b.sno - a.sno);
    }

    setTotalCount(queried.length);
    setFilteredData(queried.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(memberData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "members.xlsx");
    toast.success("Members exported successfully!");
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
      const { error } = await supabase
        .from("members")
        .delete()
        .eq("member_id", selectedMember.member_id);
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

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Toggle sort direction by sno
  const handleSortBySno = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };
  const fetchData = async (table: string, column: string, filter?: string) => {
    let query = supabase.from(table).select(column).limit(1000);
    if (filter) {
      query = query.eq(column, filter);
    }
    let { data, error } = await query;
    if (error) {
      console.error(`Error fetching ${column} from ${table}:`, error);
      return "NILL";
    }
    let allData: unknown[] = data || [];
    while (data && data.length === 1000) {
      const from = allData ? allData.length : 0;
      ({ data, error } = await query.range(from, from + 999));
      if (error) {
        console.error(`Error fetching ${column} from ${table}:`, error);
        return "NILL";
      }
      allData = allData.concat(data);
    }
    return allData.length > 0 ? allData.length.toString() : "NILL";
  };

  const fetchCardConfig = async () => {
    return [
      { title: "YEARLY MEMBERS", value: await fetchData("members", "member_type", "yearly"), Icon: Users, path: "/members?type=yearly" },
      { title: "HALF YEARLY MEMBERS", value: await fetchData("members", "member_type", "half-yearly"), Icon: Users, path: "/members?type=half-yearly" },
      { title: "QUARTERLY MEMBERS", value: await fetchData("members", "member_type", "quarterly"), Icon: Users, path: "/members?type=quarterly" },
      { title: "MONTHLY MEMBERS", value: await fetchData("members", "member_type", "monthly"), Icon: Users, path: "/members?type=monthly" },
    ];
  };

  useEffect(() => {
    const loadCardConfig = async () => {
      const config = await fetchCardConfig();
      setCardConfig(config);
    };

    loadCardConfig();
  }, []);


  const handleSort = (property: keyof Member) => {
    setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setOrderBy(property);
  };


  const sortedData = [...filteredData].sort((a, b) => {
    const valueA = a[orderBy as keyof Member];
    const valueB = b[orderBy as keyof Member];

    if (valueA < valueB) return order === "asc" ? -1 : 1;
    if (valueA > valueB) return order === "asc" ? 1 : -1;
    return 0;
  });


  return (
    <div style={{ padding: "20px" }}>
      <div>
        <StatGroup stats={cardConfig} />
      </div>
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
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleExport}
            sx={{ backgroundColor: "#2485bd", color: "#fff" }}
          >
            Export Data
          </Button>
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
            {sortedData.map((member) => (
              <TableRow key={member.member_id}>
                <TableCell align="center">{member.sno}</TableCell>
                <TableCell align="center">{member.member_id}</TableCell>
                <TableCell align="center">{member.member_name}</TableCell>
                <TableCell align="center">{member.member_phone_number}</TableCell>
                <TableCell align="center">{member.member_type}</TableCell>
                <TableCell align="center">{member.member_status}</TableCell>
                <TableCell align="center">{member.referred_by}</TableCell>
                <TableCell align="center">{formatDate(member.member_end_date)}</TableCell>
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
        rowsPerPageOptions={[50, 60, 100]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
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