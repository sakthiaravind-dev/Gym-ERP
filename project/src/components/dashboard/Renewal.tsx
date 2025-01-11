import React from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";




const tableHeaders = [
  "EXPIRY DATE",
  "EXTEND TO",
  "MEMBER ID",
  "MEMBER NAME",
  "PHONE NUMBER",
  "PACK AMOUNT",
  "TOTAL AMOUNT",
  "START DATE",
  "ACTIONS",
];

const MembershipRenewal = () => {
  const navigate = useNavigate();
  const handleAddRenewal = () => {
    navigate("/renewal");
  }
  return (
    <div style={{ padding: "20px" }}>

<Box sx={{ marginBottom: 3, display: "flex", gap: 1 }}>
        <Button variant="contained" color="primary" >
          Show Filter
        </Button>
        <Button variant="contained" color="primary" onClick={handleAddRenewal}>
          Add Renewal Info
        </Button>
        <Button variant="contained" color="primary">
         Export Data
        </Button>
      </Box>

      <div className="flex-row justify-center text-center bg-white p-6 border-gray-300 border">
      <Typography variant="h5" style={{ marginBottom: "20px", color: "#71045F", fontWeight: "bold" }}>
       Renewal Details
      </Typography>

      <div className="w-1/4">
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeaders.map((header, index) => (
                <TableCell key={index} align="center" sx={{backgroundColor: '#F7EEF9', fontWeight: '700'  }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
              <TableRow>
                <TableCell colSpan={7} align="center">
                No data available in table 
                </TableCell>
              </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      </div>
    </div>
  );
};

export default MembershipRenewal;
