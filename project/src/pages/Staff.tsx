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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import StatGroup from '../components/dashboard/StatGroup';
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const tableHeaders = [
  "STAFF ID",
  "STAFF NAME",
  "STAFF PHONE NUMBER",
  "STAFF ADDRESS",
  "STAFF DATE OF JOINING",
  "STAFF DATE OF BIRTH",
  "ACTIONS",
];

const StaffDetails = () => {
  interface Staff {
    employee_id: string;
    employee_name: string;
    employee_phone_number: string;
    employee_address: string;
    date_of_joining: string;
    employee_dob: string;
    gender?: string;
    employee_blood_group?: string;
    employee_father_name?: string;
    employee_mother_name?: string;
    employee_primary_skill?: string;
    branch?: string;
    employee_marital_status?: string;
    document_id_number?: string;
    identity_document_type?: string;
    designation?: string;
  }
  
  const [staffData, setStaffData] = useState<Staff[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    const { data, error } = await supabase.from("employees").select("employee_id, employee_name, employee_phone_number, employee_address, date_of_joining, employee_dob");
    if (error) {
      console.error("Error fetching staff:", error);
    } else {
      setStaffData(data);
    }
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(staffData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Staff");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "staff.xlsx");
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, staff: Staff) => {
    setAnchorEl(event.currentTarget);
    setSelectedStaff(staff);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleEdit = () => {
    setOpenEditDialog(true);
    handleClose();
  };

  const handleDelete = async () => {
    if (selectedStaff) {
      const { error } = await supabase.from("employees").delete().eq("employee_id", selectedStaff.employee_id);
      if (error) {
        toast.error("Failed to delete staff: " + error.message);
      } else {
        toast.success("Staff deleted successfully!");
        fetchStaff();
      }
    }
    handleClose();
  };

  const handleView = () => {
    setOpenViewDialog(true);
    handleClose();
  };

  const handleEditSubmit = async () => {
    if (selectedStaff) {
      const updatedStaff = {
        employee_name: selectedStaff.employee_name || null,
        employee_phone_number: selectedStaff.employee_phone_number || null,
        employee_address: selectedStaff.employee_address || null,
        date_of_joining: selectedStaff.date_of_joining || null,
        employee_dob: selectedStaff.employee_dob || null,
      };

      const { error } = await supabase
        .from("employees")
        .update(updatedStaff)
        .eq("employee_id", selectedStaff.employee_id);
      if (error) {
        toast.error("Failed to update staff: " + error.message);
      } else {
        toast.success("Staff updated successfully!");
        fetchStaff();
      }
    }
    setOpenEditDialog(false);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setSelectedStaff((prevData) => prevData ? ({
      ...prevData,
      [name]: value,
    }) : null);
  };

  const filteredStaff = staffData.filter((staff) =>
    staff.employee_name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedStaff = filteredStaff.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleAddStaff = () => {
    navigate("/addstaff");
  }
  const navigate = useNavigate();

  const cardConfig = [
    { title: "TOTAL NO STAFF", value: staffData.length.toString(), Icon: Users, path: "/pending" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Box sx={{ marginBottom: 3, display: "flex", gap: 1 }}>
        <Button variant="contained" color="primary" onClick={handleAddStaff}>
          Add Staff
        </Button>
        <Button variant="contained" color="primary" onClick={handleExport}>
          Export Data
        </Button>
        <Button variant="contained" color="primary">
          Employee Attendance
        </Button>
      </Box>
      <StatGroup stats={cardConfig} />

      <div className="flex-row justify-center text-center bg-white p-6 border-gray-300 border">
        <Typography variant="h5" style={{ marginBottom: "20px", color: "#71045F", fontWeight: "bold" }}>
          Staff Details
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
                {tableHeaders.map((header, index) => (
                  <TableCell key={index} align="center" sx={{ backgroundColor: '#F7EEF9', fontWeight: '700' }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedStaff.length > 0 ? (
                paginatedStaff.map((staff, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{staff.employee_id}</TableCell>
                    <TableCell align="center">{staff.employee_name}</TableCell>
                    <TableCell align="center">{staff.employee_phone_number}</TableCell>
                    <TableCell align="center">{staff.employee_address}</TableCell>
                    <TableCell align="center">{staff.date_of_joining}</TableCell>
                    <TableCell align="center">{staff.employee_dob}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        aria-controls={anchorEl ? "actions-menu" : undefined}
                        aria-haspopup="true"
                        onClick={(event) => handleClick(event, staff)}
                        endIcon={<ArrowDropDownIcon />}
                      >
                        Actions
                      </Button>
                      <Menu
                        id="actions-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        <MenuItem onClick={handleView}>View</MenuItem>
                        <MenuItem onClick={handleEdit}>Edit</MenuItem>
                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No Staff Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={filteredStaff.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>
          Edit Staff
          <IconButton
            aria-label="close"
            onClick={() => setOpenEditDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Staff Name"
            name="employee_name"
            value={selectedStaff?.employee_name || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Staff Phone Number"
            name="employee_phone_number"
            value={selectedStaff?.employee_phone_number || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Staff Address"
            name="employee_address"
            value={selectedStaff?.employee_address || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Date of Joining"
            name="date_of_joining"
            type="date"
            value={selectedStaff?.date_of_joining || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Date of Birth"
            name="employee_dob"
            type="date"
            value={selectedStaff?.employee_dob || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
        <DialogTitle>
          View Staff
          <IconButton
            aria-label="close"
            onClick={() => setOpenViewDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1"><strong>Staff ID:</strong> {selectedStaff?.employee_id}</Typography>
          <Typography variant="body1"><strong>Staff Name:</strong> {selectedStaff?.employee_name}</Typography>
          <Typography variant="body1"><strong>Phone Number:</strong> {selectedStaff?.employee_phone_number}</Typography>
          <Typography variant="body1"><strong>Address:</strong> {selectedStaff?.employee_address}</Typography>
          <Typography variant="body1"><strong>Date of Joining:</strong> {selectedStaff?.date_of_joining}</Typography>
          <Typography variant="body1"><strong>Date of Birth:</strong> {selectedStaff?.employee_dob}</Typography>
          <Typography variant="body1"><strong>Email:</strong> {selectedStaff?.employee_id}</Typography>
          <Typography variant="body1"><strong>Gender:</strong> {selectedStaff?.gender}</Typography>
          <Typography variant="body1"><strong>Blood Group:</strong> {selectedStaff?.employee_blood_group}</Typography>
          <Typography variant="body1"><strong>Father's Name:</strong> {selectedStaff?.employee_father_name}</Typography>
          <Typography variant="body1"><strong>Mother's Name:</strong> {selectedStaff?.employee_mother_name}</Typography>
          <Typography variant="body1"><strong>Primary Skill:</strong> {selectedStaff?.employee_primary_skill}</Typography>
          <Typography variant="body1"><strong>Branch:</strong> {selectedStaff?.branch}</Typography>
          <Typography variant="body1"><strong>Marital Status:</strong> {selectedStaff?.employee_marital_status}</Typography>
          <Typography variant="body1"><strong>Document ID Number:</strong> {selectedStaff?.document_id_number}</Typography>
          <Typography variant="body1"><strong>Identity Document Type:</strong> {selectedStaff?.identity_document_type}</Typography>
          <Typography variant="body1"><strong>Designation:</strong> {selectedStaff?.designation}</Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffDetails;