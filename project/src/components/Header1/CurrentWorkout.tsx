import React, { useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";


const CurrentWorkouts: React.FC = () => {
  const mockWorkouts = [
    { id: 154, name: "Dumbbell Shoulder Press", type: "Shoulder", group: "Shoulder" },
    { id: 155, name: "Hammer Shoulder Press", type: "Shoulder", group: "Shoulder" },
    { id: 156, name: "DB Side Lateral Raise", type: "Shoulder", group: "Shoulder" },
    { id: 158, name: "DB Seated Bentover Lateral Raise", type: "Shoulder", group: "Shoulder" },
    { id: 159, name: "DB Shrugs", type: "Shoulder", group: "Shoulder" },
    { id: 160, name: "BB Wide Grip Upright Rows", type: "Shoulder", group: "Shoulder" },
    { id: 161, name: "BB Close Grip Upright Rows", type: "Shoulder", group: "Shoulder" },
    { id: 162, name: "BB Overhead Press", type: "Shoulder", group: "Shoulder" },
    { id: 163, name: "Standing Behind Neck BB Press", type: "Shoulder", group: "Shoulder" },
    { id: 164, name: "BB/EZ-Bar Rear Delt Row", type: "Shoulder", group: "Shoulder" },
  ];

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);

  const filteredWorkouts = mockWorkouts.filter(
    (workout) =>
      workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(workout.id).includes(searchTerm) ||
      workout.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const csvData = [
      ["WORKOUT ID", "WORKOUT NAME", "WORKOUT TYPE", "WORKOUT GROUP"],
      ...mockWorkouts.map((workout) => [
        workout.id,
        workout.name,
        workout.type,
        workout.group,
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
  const navigate = useNavigate();
  const handleAddWorkout = () => {
    navigate("/addworkout");
  }

  return (
    <Box sx={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
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
            path: "/addworkout",
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
              <TableRow key={workout.id}>
                <TableCell>{workout.id}</TableCell>
                <TableCell>{workout.name}</TableCell>
                <TableCell>{workout.type}</TableCell>
                <TableCell>{workout.group}</TableCell>
                <TableCell>
                  <Button variant="contained" size="small" style={{ backgroundColor: "#2485bd" }}>
                    Actions
                  </Button>
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
    </Box>
  );
};

export default CurrentWorkouts;
