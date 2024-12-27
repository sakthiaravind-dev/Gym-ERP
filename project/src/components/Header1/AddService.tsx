import React, { useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const AddService: React.FC = () => {
  const [serviceName, setServiceName] = useState<string>("");
  const [services, setServices] = useState<{ id: number; name: string }[]>([
    { id: 1, name: "ZUMBA" },
    { id: 2, name: "Yoga" },
  ]);

  const handleAddService = () => {
    if (serviceName.trim() === "") return;

    setServices((prevServices) => [
      ...prevServices,
      { id: prevServices.length + 1, name: serviceName },
    ]);
    setServiceName(""); // Clear the input after adding
  };

  const handleDeleteService = (id: number) => {
    setServices((prevServices) => prevServices.filter((service) => service.id !== id));
  };

  return (
    <Box sx={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Heading */}
      <Typography
        variant="h5"
        sx={{ textAlign: "center", fontWeight: "bold", marginBottom: "20px", color: "#71045F" }}
      >
        Add Service Info
      </Typography>

      {/* Input and Update Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Box sx={{ flex: 1, display: "flex", gap: "10px" }}>
          <TextField
            label="Service Name"
            placeholder="Enter service name"
            variant="outlined"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            sx={{ minWidth: "200px" }}
          />
          <Button
            variant="contained"
            onClick={handleAddService}
            sx={{ backgroundColor: "#2485bd",
                color: "white",
                padding: "2px 15px", }}
          >
            Update
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F7EEF9" }}>
              <TableCell>ID</TableCell>
              <TableCell>SERVICE NAME</TableCell>
              <TableCell>ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.length > 0 ? (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.id}</TableCell>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No services available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AddService;