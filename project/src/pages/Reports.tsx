/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import { createClient } from "@supabase/supabase-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BarChart } from '@mui/x-charts/BarChart';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Reports: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    fetchExpenses();
    fetchPackages();
  }, []);

  const fetchExpenses = async () => {
    const { data, error } = await supabase.from("expenses").select("*");
    if (error) {
      toast.error("Failed to fetch expenses: " + error.message);
    } else {
      setExpenses(data);
    }
  };

  const fetchPackages = async () => {
    const { data, error } = await supabase.from("current_package").select("*");
    if (error) {
      toast.error("Failed to fetch packages: " + error.message);
    } else {
      setPackages(data);
    }
  };

  const expenseData = expenses.map((expense: any) => ({
    label: expense.item,
    value: parseFloat(expense.amount),
  }));

  const packageData = packages.map((pkg: any) => ({
    label: pkg.package_name,
    value: parseFloat(pkg.package_amount),
  }));

  return (
    <Box sx={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <ToastContainer />
      <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", marginBottom: "20px", color: "#71045F" }}>
        Reports
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: "20px" }}>
            <Typography variant="h6" sx={{ marginBottom: "20px" }}>Expenses</Typography>
            <BarChart
              xAxis={[{ dataKey: 'label', label: 'Item' }]}
              series={[{ dataKey: 'value', label: 'Amount', color: '#8884d8' }]}
              dataset={expenseData}
              width={500}
              height={300}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: "20px" }}>
            <Typography variant="h6" sx={{ marginBottom: "20px" }}>Packages</Typography>
            <BarChart
              xAxis={[{ dataKey: 'label', label: 'Package' }]}
              series={[{ dataKey: 'value', label: 'Amount', color: '#82ca9d' }]}
              dataset={packageData}
              width={500}
              height={300}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;