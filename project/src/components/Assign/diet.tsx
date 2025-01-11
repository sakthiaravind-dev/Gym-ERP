import React, { useEffect, useState } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
} from "@mui/material";
import { createClient } from "@supabase/supabase-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Diet {
  member_id?: number;
  diet_id: number;
  diet_name: string;
  diet_description: string;
}

const tableHeaders = [
  "MEMBER ID",
  "DIET ID",
  "DIET NAME",
  "DIET DESCRIPTION",
  "ACTION",
];

const DietManagement: React.FC = () => {
  const [diets, setDiets] = useState<Diet[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDiet, setSelectedDiet] = useState<Diet | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newDiet, setNewDiet] = useState<Diet>({
    diet_id: 0,
    diet_name: "",
    diet_description: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiets();
  }, []);

  const fetchDiets = async () => {
    const { data, error } = await supabase.from("diet_management").select("*");
    if (error) {
      toast.error("Failed to fetch diets: " + error.message);
    } else {
      setDiets(data);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, diet: Diet) => {
    setAnchorEl(event.currentTarget);
    setSelectedDiet(diet);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDiet(null);
  };

  const handleEdit = () => {
    if (selectedDiet) {
      setNewDiet(selectedDiet);
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedDiet) {
      const { error } = await supabase
        .from('diet_management')
        .delete()
        .eq('member_id', selectedDiet.member_id);

      if (error) {
        toast.error("Failed to delete diet: " + error.message);
      } else {
        toast.success("Diet deleted successfully!");
        fetchDiets();
      }
    }
    handleMenuClose();
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDiet({
      ...newDiet,
      [event.target.name]: event.target.value,
    });
  };

  const handleEditSubmit = async () => {
    const { error } = await supabase
      .from('diet_management')
      .update(newDiet)
      .eq('member_id', newDiet.member_id);

    if (error) {
      toast.error("Failed to update diet: " + error.message);
    } else {
      toast.success("Diet updated successfully!");
      fetchDiets();
      setEditDialogOpen(false);
    }
  };

  const handleAddChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDiet({
      ...newDiet,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddSubmit = async () => {
    const { error } = await supabase
      .from('diet_management')
      .insert([newDiet]);

    if (error) {
      toast.error("Failed to add diet: " + error.message);
    } else {
      toast.success("Diet added successfully!");
      fetchDiets();
      setAddDialogOpen(false);
      setNewDiet({
        diet_id: 0,
        diet_name: "",
        diet_description: "",
      });
    }
  };

  const filteredDiets = diets.filter(
    (diet) =>
      diet.diet_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(diet.member_id).includes(searchTerm) ||
      diet.diet_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <ToastContainer />
      <Box sx={{ marginBottom: 3, display: "flex", gap: 1 }}>
        <Button variant="contained" color="primary" onClick={() => setAddDialogOpen(true)}>
          Add Diet
        </Button>
      </Box>

      <div className="flex-row justify-center text-center bg-white p-6 border-gray-300 border">
        <Typography variant="h5" style={{ marginBottom: "20px", color: "#71045F", fontWeight: "bold" }}>
          Current Diet
        </Typography>

        <div className="w-1/4">
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              {filteredDiets.length > 0 ? (
                filteredDiets.map((diet) => (
                  <TableRow key={diet.member_id}>
                    <TableCell align="center">{diet.member_id}</TableCell>
                    <TableCell align="center">{diet.diet_id}</TableCell>
                    <TableCell align="center">{diet.diet_name}</TableCell>
                    <TableCell align="center">{diet.diet_description}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={(event) => handleMenuClick(event, diet)}
                      >
                        Action
                      </Button>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedDiet?.diet_id === diet.diet_id}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={handleEdit}>Edit</MenuItem>
                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No data available in table
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Diet</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Diet ID"
            type="number"
            name="diet_id"
            fullWidth
            value={newDiet.diet_id}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Diet Name"
            type="text"
            name="diet_name"
            fullWidth
            value={newDiet.diet_name}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Diet Description"
            type="text"
            name="diet_description"
            fullWidth
            value={newDiet.diet_description}
            onChange={handleEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add Diet</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Diet ID"
            type="number"
            name="diet_id"
            fullWidth
            value={newDiet.diet_id}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            label="Diet Name"
            type="text"
            name="diet_name"
            fullWidth
            value={newDiet.diet_name}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            label="Diet Description"
            type="text"
            name="diet_description"
            fullWidth
            value={newDiet.diet_description}
            onChange={handleAddChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DietManagement;