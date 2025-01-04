import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Modal,
  IconButton,
} from "@mui/material";
import { createClient } from "@supabase/supabase-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@mui/icons-material/Close";

/// <reference types="vite/client" />
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface User {
  id: number;
  username: string;
  profile_name: string;
  user_email: string;
  user_type: string;
}

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [entriesPerPage, setEntriesPerPage] = useState<number>(5);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    username: "",
    profile_name: "",
    user_email: "",
    user_type: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("admin").select("*");
    if (error) {
      toast.error("Failed to fetch users: " + error.message);
    } else {
      setUsers(data);
    }
  };

  const handleAddUser = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase.from("admin").insert([newUser]);
    if (error) {
      toast.error("Failed to add user: " + error.message);
    } else {
      toast.success("User added successfully!");
      fetchUsers();
      setOpenAddModal(false);
      setNewUser({
        username: "",
        profile_name: "",
        user_email: "",
        user_type: "",
      });
    }
  };

  const handleEditUser = async () => {
    if (currentUser) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error } = await supabase
        .from("admin")
        .update(currentUser)
        .eq("id", currentUser.id);
      if (error) {
        toast.error("Failed to update user: " + error.message);
      } else {
        toast.success("User updated successfully!");
        fetchUsers();
        setOpenEditModal(false);
        setCurrentUser(null);
      }
    }
  };

  const handleDeleteUser = async (id: number) => {
    const { error } = await supabase.from("admin").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete user: " + error.message);
    } else {
      toast.success("User deleted successfully!");
      fetchUsers();
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.profile_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const csvData = [
      ["Username", "Profile Name", "User Email", "User Type"],
      ...users.map((user) => [
        user.username,
        user.profile_name,
        user.user_email,
        user.user_type,
      ]),
    ];
    const csvContent = `data:text/csv;charset=utf-8,${csvData
      .map((e) => e.join(","))
      .join("\n")}`;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "current_users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#2485bd",
            color: "white",
            padding: "5px 15px",
          }}
          onClick={() => setOpenAddModal(true)}
        >
          Add User
        </Button>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: "bold", color: "#71045F" }}
        >
          Current Users
        </Typography>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ backgroundColor: "white" }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120, marginRight: "15px" }}>
          <InputLabel>Show</InputLabel>
          <Select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            label="Show"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
        <Typography>entries</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F7EEF9" }}>
              <TableCell>USERNAME</TableCell>
              <TableCell>PROFILE NAME</TableCell>
              <TableCell>USER EMAIL</TableCell>
              <TableCell>USER TYPE</TableCell>
              <TableCell>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.slice(0, entriesPerPage).map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.profile_name}</TableCell>
                <TableCell>{user.user_email}</TableCell>
                <TableCell>{user.user_type}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ backgroundColor: "#2485bd", marginRight: 1 }}
                    onClick={() => {
                      setCurrentUser(user);
                      setOpenEditModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ backgroundColor: "#D32F2F" }}
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <Typography>
          Showing 1 to {Math.min(entriesPerPage, filteredUsers.length)} of{" "}
          {filteredUsers.length} entries
        </Typography>
        <Button
          onClick={handleExport}
          variant="contained"
          sx={{ backgroundColor: "#2485bd", color: "white", padding: "5px 15px" }}
        >
          Export Data
        </Button>
      </Box>

      {/* Add User Modal */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box sx={modalStyle}>
          <IconButton
            sx={{ position: "absolute", top: 10, right: 10 }}
            onClick={() => setOpenAddModal(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Add New User
          </Typography>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
          <TextField
            label="Profile Name"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={newUser.profile_name}
            onChange={(e) => setNewUser({ ...newUser, profile_name: e.target.value })}
          />
          <TextField
            label="User Email"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={newUser.user_email}
            onChange={(e) => setNewUser({ ...newUser, user_email: e.target.value })}
          />
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>User Type</InputLabel>
            <Select
              value={newUser.user_type}
              onChange={(e) => setNewUser({ ...newUser, user_type: e.target.value })}
              label="User Type"
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" sx={{ backgroundColor: "#2485bd" }} onClick={handleAddUser}>
            Add User
          </Button>
        </Box>
      </Modal>

      {/* Edit User Modal */}
      {currentUser && (
        <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
          <Box sx={modalStyle}>
            <IconButton
              sx={{ position: "absolute", top: 10, right: 10 }}
              onClick={() => setOpenEditModal(false)}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Edit User
            </Typography>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={currentUser.username}
              onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
            />
            <TextField
              label="Profile Name"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={currentUser.profile_name}
              onChange={(e) => setCurrentUser({ ...currentUser, profile_name: e.target.value })}
            />
            <TextField
              label="User Email"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={currentUser.user_email}
              onChange={(e) => setCurrentUser({ ...currentUser, user_email: e.target.value })}
            />
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>User Type</InputLabel>
              <Select
                value={currentUser.user_type}
                onChange={(e) => setCurrentUser({ ...currentUser, user_type: e.target.value })}
                label="User Type"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" sx={{ backgroundColor: "#2485bd" }} onClick={handleEditUser}>
              Save Changes
            </Button>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default Admin;