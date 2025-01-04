import React, { useState, useEffect } from "react";
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
import { createClient } from "@supabase/supabase-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/// <reference types="vite/client" />
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Service {
  id: number;
  service_name: string;
}

const AddService: React.FC = () => {
  const [serviceName, setServiceName] = useState<string>("");
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase.from("service").select("*");
    if (error) {
      toast.error("Failed to fetch services: " + error.message);
    } else {
      setServices(data);
    }
  };

  const handleAddService = async () => {
    if (serviceName.trim() === "") return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase
      .from("service")
      .insert([{ service_name: serviceName }]);

    if (error) {
      toast.error("Failed to add service: " + error.message);
    } else {
      toast.success("Service added successfully!");
      fetchServices();
      setServiceName(""); // Clear the input after adding
    }
  };

  const handleDeleteService = async (id: number) => {
    const { error } = await supabase.from("service").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete service: " + error.message);
    } else {
      toast.success("Service deleted successfully!");
      fetchServices();
    }
  };

  return (
    <Box sx={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <ToastContainer />
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
            sx={{ backgroundColor: "#2485bd", color: "white", padding: "2px 15px" }}
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
                  <TableCell>{service.service_name}</TableCell>
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