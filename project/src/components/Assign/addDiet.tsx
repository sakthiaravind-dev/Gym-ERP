import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledEditor = styled("div")(({ theme }) => ({
    border: `1px solid ${theme?.palette?.divider || "#ccc"}`,
    borderRadius: theme?.shape?.borderRadius || "4px",
    padding: theme?.spacing(2) || "16px",
    minHeight: "200px",
    fontSize: "16px",
    fontFamily: "Roboto, sans-serif",
    outline: "none",
  }));

const AddDiet = () => {
  return (
    <Box sx={{ maxWidth: "600px", margin: "auto", padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" sx={{ marginBottom: 2, color: '#71045F', fontWeight: '700' }}>
          Add Diet
        </Typography>
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="subtitle1" sx={{ marginBottom: 1, color: '#71045F'  }}>
            Diet Name*
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Diet Name"
          />
        </Box>

        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="subtitle1" sx={{ marginBottom: 1, color: '#71045F' }}>
            Description
          </Typography>
          <StyledEditor
  contentEditable
  suppressContentEditableWarning={true}
  role="textbox"
  tabIndex={0}
>
  {/* Editable content here */}
</StyledEditor>
        </Box>

        <Button
          variant="contained"
          color="primary"
          sx={{ textTransform: "none" }}
        >
          Save
        </Button>
      </Paper>
    </Box>
  );
};

export default AddDiet;
