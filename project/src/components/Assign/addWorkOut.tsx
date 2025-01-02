import React, { useState } from "react";
import { Box, TextField, Button, MenuItem, Grid, Typography } from "@mui/material";

const AddWorkout = () => {
  const [workoutName, setWorkoutName] = useState("");
  const [workoutType, setWorkoutType] = useState("");

  const workoutTypes = ["WARMUP","Cardio", "Core", "Weight Training", "Cool Down"]; 

  const handleAddToList = () => {
    console.log({ workoutName, workoutType });
  };

  return (
    <Box
      sx={{
        padding: "20px",
        margin: "20px auto",
        maxWidth: "800px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h5"
        align="center"
        sx={{ marginBottom: "20px", fontWeight: "bold", color: "#333" }}
      >
        Add-Workout
      </Typography>
      <Grid container spacing={4}>
        {/* Workout Name Field */}
        <Grid item xs={12} sm={6}>
          <Typography sx={{ color: "#71045F", fontWeight: "bold", marginBottom: "8px" }}>
            Workout Name*
          </Typography>
          <TextField
            fullWidth
            placeholder="Workout Name"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
          />
          </Grid>
          <Grid item xs={12} sm={6}>
          <Typography sx={{ color: "#71045F", fontWeight: "bold", marginBottom: "8px" }}>
            Workout Type
          </Typography>
          <TextField
            fullWidth
            placeholder="Workout Type"
            value={workoutType}
            onChange={(e) => setWorkoutName(e.target.value)}
          />
        </Grid>

        {/* Workout Type Field */}
        <Grid item xs={12} sm={6}>
          <Typography sx={{ color: "#71045F", fontWeight: "bold", marginBottom: "8px" }}>
            Select Workout Type
          </Typography>
          <TextField
            fullWidth
            select
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
            placeholder="----"
          >
            <MenuItem value="">
              <em>----</em>
            </MenuItem>
            {workoutTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Add to List Button */}
      <Box sx={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddToList}
          sx={{ padding: "10px 20px", fontWeight: "bold" }}
        >
          Add To List
        </Button>
      </Box>
    </Box>
  );
};

export default AddWorkout;
