import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

const PendingBill = () => {
  return (
    <Box p={4}>
      <Typography
        variant="h5"
        sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}
      >
        Transaction Form
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={3}>
        <Box>
          <Typography sx={{ fontWeight: "bold" }}>Expired Date:</Typography>
          <Typography variant="h6" color="primary">
            25/03/2026
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: "bold" }}>Pending Amount:</Typography>
          <Typography variant="h6" color="secondary">
            ₹0
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: "bold" }}>Member ID:</Typography>
          <Typography variant="h6" color="primary">
            71393
          </Typography>
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" flexWrap="wrap">
        {/* Left Column */}
        <Box width="48%">
          <TextField
            label="Bill Date*"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Member Name*"
            fullWidth
            value="MANIKANDAN M"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Total Month Paid*"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Billing Amount*"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Discount Amount*"
            fullWidth
            value="0"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Pending Amount*"
            fullWidth
            value="0"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Total Amount"
            fullWidth
            sx={{ mb: 2 }}
          />
        </Box>

        {/* Right Column */}
        <Box width="48%">
          <TextField
            label="Start Date*"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Member Pack*"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Pack Amount*"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Tax*"
            fullWidth
            value="0"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Payment Mode*"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Pending Date*"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Bill State*"
            fullWidth
            value="Renewal"
            sx={{ mb: 2 }}
          />
        </Box>
      </Box>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, float: "right" }}
      >
        Save Transaction
      </Button>
    </Box>
  );
};

export default PendingBill;