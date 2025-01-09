import React, { useEffect, useState } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
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

interface Workout {
  workout_id: number;
  workout_name: string;
  workout_type: string;
  workout_group: string;
}

const CurrentWorkouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newWorkout, setNewWorkout] = useState<Workout>({
    workout_id: 0,
    workout_name: "",
    workout_type: "",
    workout_group: "",
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    const { data, error } = await supabase.from("current_workouts").select("*");
    if (error) {
      toast.error("Failed to fetch workouts: " + error.message);
    } else {
      setWorkouts(data);
    }
  };

  const handleExport = () => {
    const csvData = [
      ["WORKOUT ID", "WORKOUT NAME", "WORKOUT TYPE", "WORKOUT GROUP"],
      ...workouts.map((workout) => [
        workout.workout_id,
        workout.workout_name,
        workout.workout_type,
        workout.workout_group,
      ]),
    ];
    const csvContent = `data:text/csv;charset=utf-8,${csvData
      .map((e) => e.join(","))
      .join("\n")}`;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "current_workouts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const handleAddWorkout = () => {
    setAddDialogOpen(true);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, workout: Workout) => {
    setAnchorEl(event.currentTarget);
    setSelectedWorkout(workout);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedWorkout(null);
  };

  const handleEdit = () => {
    if (selectedWorkout) {
      setNewWorkout(selectedWorkout);
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedWorkout) {
      const { error } = await supabase
        .from('current_workouts')
        .delete()
        .eq('workout_id', selectedWorkout.workout_id);

      if (error) {
        toast.error("Failed to delete workout: " + error.message);
      } else {
        toast.success("Workout deleted successfully!");
        fetchWorkouts();
      }
    }
    handleMenuClose();
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewWorkout({
      ...newWorkout,
      [event.target.name]: event.target.value,
    });
  };

  const handleEditSubmit = async () => {
    const { error } = await supabase
      .from('current_workouts')
      .update(newWorkout)
      .eq('workout_id', newWorkout.workout_id);

    if (error) {
      toast.error("Failed to update workout: " + error.message);
    } else {
      toast.success("Workout updated successfully!");
      fetchWorkouts();
      setEditDialogOpen(false);
    }
  };

  const handleAddChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewWorkout({
      ...newWorkout,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddSubmit = async () => {
    const { error } = await supabase
      .from('current_workouts')
      .insert([newWorkout]);

    if (error) {
      toast.error("Failed to add workout: " + error.message);
    } else {
      toast.success("Workout added successfully!");
      fetchWorkouts();
      setAddDialogOpen(false);
      setNewWorkout({
        workout_id: 0,
        workout_name: "",
        workout_type: "",
        workout_group: "",
      });
    }
  };

  const filteredWorkouts = workouts.filter(
    (workout) =>
      workout.workout_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(workout.workout_id).includes(searchTerm) ||
      workout.workout_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          onClick={handleAddWorkout}
          sx={{
            backgroundColor: "#2485bd",
            color: "white",
            padding: "5px 15px",
          }}
        >
          Add Workout
        </Button>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: "bold", color: "#71045F" }}
        >
          Current Workout
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
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
        <Typography>entries</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F7EEF9" }}>
              <TableCell>WORKOUT ID</TableCell>
              <TableCell>WORKOUT NAME</TableCell>
              <TableCell>WORKOUT TYPE</TableCell>
              <TableCell>WORKOUT GROUP</TableCell>
              <TableCell>ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredWorkouts.slice(0, entriesPerPage).map((workout) => (
              <TableRow key={workout.workout_id}>
                <TableCell>{workout.workout_id}</TableCell>
                <TableCell>{workout.workout_name}</TableCell>
                <TableCell>{workout.workout_type}</TableCell>
                <TableCell>{workout.workout_group}</TableCell>
                <TableCell>
                  <IconButton
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={(event) => handleMenuClick(event, workout)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <Typography>Showing 1 to {Math.min(entriesPerPage, filteredWorkouts.length)} of {filteredWorkouts.length} entries</Typography>
        <Button
          onClick={handleExport}
          variant="contained"
          sx={{ backgroundColor: "#2485bd", color: "white", padding: "5px 15px" }}
        >
          Export Data
        </Button>
      </Box>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Workout</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Workout Name"
            type="text"
            name="workout_name"
            fullWidth
            value={newWorkout.workout_name}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Workout Type"
            type="text"
            name="workout_type"
            fullWidth
            value={newWorkout.workout_type}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Workout Group"
            type="text"
            name="workout_group"
            fullWidth
            value={newWorkout.workout_group}
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
        <DialogTitle>Add Workout</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Workout Name"
            type="text"
            name="workout_name"
            fullWidth
            value={newWorkout.workout_name}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            label="Workout Type"
            type="text"
            name="workout_type"
            fullWidth
            value={newWorkout.workout_type}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            label="Workout Group"
            type="text"
            name="workout_group"
            fullWidth
            value={newWorkout.workout_group}
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
    </Box>
  );
};

export default CurrentWorkouts;