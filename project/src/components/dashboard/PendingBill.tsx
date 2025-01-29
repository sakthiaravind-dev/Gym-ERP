import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface TransactionData {
  sno: number;
  bill_date: string;
  start_date: string;
  member_name: string;
  month_paid: string;
  total_amount_received: string;
  discount: string;
  pending: string;
  payment_mode: string;
  state: string;
  emp_id: string;
  renewal_date: string;
}

const PendingBill = () => {
  const { emp_id, sno } = useParams<{ emp_id: string; sno: string }>();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [memberPack, setMemberPack] = useState<string>("");
  const [tax, setTax] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (emp_id && sno) {
      fetchTransactionDetails();
    }
  }, [emp_id, sno]);

  useEffect(() => {
    if (transaction?.member_name) {
      fetchMemberPack();
    }
  }, [transaction]);

  useEffect(() => {
    if (transaction) {
      setTotalAmount(calculateTotalAmount(transaction.total_amount_received, transaction.discount, tax));
    }
  }, [tax, transaction]);

  const fetchTransactionDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("emp_id", emp_id)
        .eq("sno", sno)
        .single();

      if (error) throw error;
      setTransaction(data);
      setTotalAmount(calculateTotalAmount(data.total_amount_received, data.discount, tax));
    } catch (error) {
      toast.error("Error fetching transaction details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberPack = async () => {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("member_type")
        .eq("member_name", transaction?.member_name)
        .single();

      if (error) throw error;
      setMemberPack(data.member_type);
    } catch (error) {
      toast.error("Error fetching member pack");
      console.error(error);
    }
  };

  const calculateTotalAmount = (total_amount_received: string, discount: string, tax: number): number => {
    const baseAmount = parseFloat(total_amount_received) || 0;
    const discountAmount = parseFloat(discount) || 0;
    const taxAmount = (baseAmount * tax) / 100;
    return baseAmount + taxAmount - discountAmount;
  };

  const handleTaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) || 0;
    setTax(value);
    if (transaction) {
      setTotalAmount(calculateTotalAmount(transaction.total_amount_received, transaction.discount, value));
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTransaction(prev => {
      const updatedTransaction = prev ? { ...prev, [name]: value } : null;
      if (updatedTransaction) {
        setTotalAmount(calculateTotalAmount(updatedTransaction.total_amount_received, updatedTransaction.discount, tax));
      }
      return updatedTransaction;
    });
  };

  const handleMemberPackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMemberPack(event.target.value);
  };

  const handleTotalAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) || 0;
    setTotalAmount(value);
  };

  const handleSubmit = async () => {
    try {
      if (!transaction) return;

      const { error } = await supabase
        .from("transactions")
        .update({
          bill_date: transaction.bill_date,
          start_date: transaction.start_date,
          member_name: transaction.member_name,
          month_paid: transaction.month_paid,
          total_amount_received: totalAmount.toString(),
          discount: transaction.discount,
          pending: transaction.pending,
          payment_mode: transaction.payment_mode,
          state: transaction.state,
          renewal_date: transaction.renewal_date,
        })
        .eq("emp_id", emp_id)
        .eq("sno", sno);

      if (error) throw error;

      const { error: memberError } = await supabase
        .from("members")
        .update({ member_type: memberPack })
        .eq("member_name", transaction.member_name);

      if (memberError) throw memberError;

      toast.success("Transaction updated successfully");
      navigate(-1);
    } catch (error) {
      toast.error("Error updating transaction");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!transaction) {
    return (
      <Box p={4}>
        <Typography>No transaction found</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <ToastContainer />
      <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}>
        Transaction Form
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={3}>
        <Box>
          <Typography sx={{ fontWeight: "bold" }}>Expired Date:</Typography>
          <Typography variant="h6" color="primary">
            {transaction.renewal_date}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: "bold" }}>Pending Amount:</Typography>
          <Typography variant="h6" color="secondary">
            ₹{transaction.pending}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: "bold" }}>Member ID:</Typography>
          <Typography variant="h6" color="primary">
            {transaction.emp_id}
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
            name="bill_date"
            value={transaction.bill_date}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Member Name*"
            fullWidth
            name="member_name"
            value={transaction.member_name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Total Month Paid*"
            fullWidth
            name="month_paid"
            value={transaction.month_paid}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Billing Amount*"
            fullWidth
            name="total_amount_received"
            value={transaction.total_amount_received}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Discount Amount*"
            fullWidth
            name="discount"
            value={transaction.discount}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Pending Amount*"
            fullWidth
            name="pending"
            value={transaction.pending}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Total Amount"
            fullWidth
            value={totalAmount.toFixed(2)}
            onChange={handleTotalAmountChange}
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
            name="start_date"
            value={transaction.start_date}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Member Pack*"
            fullWidth
            value={memberPack}
            onChange={handleMemberPackChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Pack Amount*"
            fullWidth
            name="total_amount_received"
            value={transaction.total_amount_received}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Tax (%)*"
            fullWidth
            type="number"
            value={tax}
            onChange={handleTaxChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Payment Mode*"
            fullWidth
            name="payment_mode"
            value={transaction.payment_mode}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Pending Date*"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            name="bill_date"
            value={transaction.bill_date}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Bill State*"
            fullWidth
            name="state"
            value={transaction.state}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
        </Box>
      </Box>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, float: "right" }}
        onClick={handleSubmit}
      >
        Save Transaction
      </Button>
    </Box>
  );
};

export default PendingBill;