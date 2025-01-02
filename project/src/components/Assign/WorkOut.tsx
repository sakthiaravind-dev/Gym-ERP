import React from "react";
import {
  Button,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

const workoutData = [
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

const columns: GridColDef[] = [
  { field: "id", headerName: "WORKOUT ID", flex: 1, sortable: true },
  { field: "name", headerName: "WORKOUT NAME", flex: 2, sortable: true },
  { field: "type", headerName: "WORKOUT TYPE", flex: 1 },
  { field: "group", headerName: "WORKOUT GROUP", flex: 1 },
  {
    field: "actions",
    headerName: "ACTION",
    flex: 1,
    renderCell: () => (
      <Button variant="contained" size="small">
        Actions
      </Button>
    ),
  },
];

const CurrentWorkouts = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: "20px" }}>
      <Box>
      {/* Header Section */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" color="secondary" style={{ marginBottom: "20px", color: "#71045F", fontWeight: "bold" }}>
            Current Workouts
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="contained" color="primary" onClick={() => navigate('/add/work-out')}>
            Add Workout
          </Button>
          <Button variant="contained" color="secondary">
            Assign Workout
          </Button>
        </Grid>
      </Grid>

      {/* Table Section */}
      <div className="flex-row justify-center text-center bg-white p-6 border-gray-300 border mb-5">
      <Box mt={4} sx={{ height: 500 }}>
      <DataGrid
        rows={workoutData}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        pageSizeOptions={[10]}
        disableColumnMenu
        sx={{
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#F7EEF9",
            color: "#000", 
            fontWeight: "bold",
            fontSize: "16px", 
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold", 

          },
        }}
      />

      </Box>
      </div>
    </Box>
    </div>
  );
};

export default CurrentWorkouts;
