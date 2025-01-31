import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Modal,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { useParams, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { toast, ToastContainer } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import "react-toastify/dist/ReactToastify.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface FormData {
  sno: number;
  bill_date: string;
  start_date: string;
  member_name: string;
  month_paid: string;
  discount: string;
  pending: string;
  payment_mode: string;
  state: string;
  emp_id: string;
  renewal_date: string;
  totalAmount: string;
  tax: string;
  memberPack: string;
  billingAmount: string;
  packAmount: string;
  totalMonthPaid: string;
}

const PendingBill: React.FC = () => {
  const { emp_id, sno } = useParams<{ emp_id: string; sno: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    sno: 0,
    bill_date: "",
    start_date: "",
    member_name: "",
    month_paid: "",
    discount: "",
    pending: "",
    payment_mode: "",
    state: "",
    emp_id: "",
    renewal_date: "",
    totalAmount: "0",
    tax: "0",
    memberPack: "",
    billingAmount: "0",
    packAmount: "0",
    totalMonthPaid: "0",
  });

  useEffect(() => {
    if (emp_id && sno) {
      fetchTransactionDetails(emp_id, sno);
    }
  }, [emp_id, sno]);

  useEffect(() => {
    const calculateBillingDetails = () => {
      let totalMonthsPaid = 0;
      let billingAmount = 0;
      let packAmount = 0;

      switch (formData.memberPack) {
        case "Quaterly":
          totalMonthsPaid = 3;
          billingAmount = 7500;
          packAmount = 7500;
          break;
        case "Half-yearly":
          totalMonthsPaid = 6;
          billingAmount = 12000;
          packAmount = 12000;
          break;
        case "Monthly":
          totalMonthsPaid = 1;
          billingAmount = 3500;
          packAmount = 3500;
          break;
        case "Annual":
          totalMonthsPaid = 12;
          billingAmount = 18000;
          packAmount = 18000;
          break;
        case "2 Months":
          totalMonthsPaid = 2;
          billingAmount = 5000;
          packAmount = 5000;
          break;
        case "4 Months":
          totalMonthsPaid = 4;
          billingAmount = 7800;
          packAmount = 7800;
          break;
        case "12 + 2 Months":
          totalMonthsPaid = 14;
          billingAmount = 18000;
          packAmount = 18000;
          break;
        case "6 + 1 Month":
          totalMonthsPaid = 7;
          billingAmount = 9000;
          packAmount = 9000;
          break;
        default:
          totalMonthsPaid = 0;
          billingAmount = 0;
          packAmount = 0;
      }

      let totalCalc = billingAmount;
      const discountNum = parseFloat(formData.discount) || 0;
      if (discountNum > 1) {
        totalCalc -= discountNum;
      }

      const taxNum = parseFloat(formData.tax) || 0;
      if (taxNum > 1) {
        const taxed = (taxNum / 100) * totalCalc;
        totalCalc += taxed;
      }

      if (totalCalc < 0) {
        totalCalc = 0;
      }

      setFormData((prev) => ({
        ...prev,
        totalMonthPaid: totalMonthsPaid.toString(),
        billingAmount: billingAmount.toString(),
        packAmount: packAmount.toString(),
        totalAmount: totalCalc.toFixed(2),
      }));
    };

    calculateBillingDetails();
  }, [formData.memberPack, formData.discount, formData.tax]);

  const fetchTransactionDetails = async (empId: string, sNo: string) => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("emp_id", empId)
        .eq("sno", sNo)
        .single();
      if (error) throw error;

      const { data: memberData, error: memberError } = await supabase
        .from("members")
        .select("member_type")
        .eq("member_name", data.member_name)
        .single();
      if (memberError) throw memberError;

      setFormData({
        sno: data.sno,
        bill_date: data.bill_date || "",
        start_date: data.start_date || "",
        member_name: data.member_name || "",
        month_paid: data.month_paid || "",
        discount: data.discount || "",
        pending: data.pending || "",
        payment_mode: data.payment_mode || "",
        state: data.state || "",
        emp_id: data.emp_id || "",
        renewal_date: data.renewal_date || "",
        totalAmount: data.total_amount_received || "0",
        tax: "0",
        memberPack: memberData.member_type || "",
        billingAmount: "0",
        packAmount: "0",
        totalMonthPaid: "0",
      });
    } catch (error) {
      toast.error("Error fetching transaction details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setOpenEdit(true);
  };

  const handleCloseModal = () => {
    setOpenEdit(false);
  };

  const handleChangeMainForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMemberPackChange = (e: SelectChangeEvent<string>) => {
    setFormData((prev) => ({ ...prev, memberPack: e.target.value }));
  };

  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, tax: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from("transactions")
        .update({
          bill_date: formData.bill_date,
          start_date: formData.start_date,
          member_name: formData.member_name,
          month_paid: formData.month_paid,
          total_amount_received: formData.totalAmount,
          discount: formData.discount,
          pending: formData.pending,
          payment_mode: formData.payment_mode,
          state: formData.state,
          renewal_date: formData.renewal_date,
        })
        .eq("emp_id", formData.emp_id)
        .eq("sno", formData.sno);

      if (error) throw error;

      const { error: memberError } = await supabase
        .from("members")
        .update({ member_type: formData.memberPack })
        .eq("member_name", formData.member_name);

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

  if (!formData.emp_id) {
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
            {formData.renewal_date}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: "bold" }}>Pending Amount:</Typography>
          <Typography variant="h6" color="secondary">
            ₹{formData.pending}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: "bold" }}>Member ID:</Typography>
          <Typography variant="h6" color="primary">
            {formData.emp_id}
          </Typography>
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" flexWrap="wrap">
        <Box width="48%">
          <TextField
            label="Bill Date*"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            name="bill_date"
            value={formData.bill_date}
            onChange={handleChangeMainForm}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Member Name*"
            fullWidth
            name="member_name"
            value={formData.member_name}
            onChange={handleChangeMainForm}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Total Month Paid*"
            fullWidth
            name="month_paid"
            value={formData.month_paid}
            onChange={handleChangeMainForm}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Billing Amount*"
            fullWidth
            name="billingAmount"
            value={formData.billingAmount}
            onChange={handleChangeMainForm}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Discount Amount*"
            fullWidth
            name="discount"
            value={formData.discount}
            onChange={handleChangeMainForm}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Pending Amount*"
            fullWidth
            name="pending"
            value={formData.pending}
            onChange={handleChangeMainForm}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Total Amount"
            fullWidth
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleChangeMainForm}
            sx={{ mb: 2 }}
          />
        </Box>

        <Box width="48%">
          <TextField
            label="Start Date*"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            name="start_date"
            value={formData.start_date}
            onChange={handleChangeMainForm}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Member Pack*</InputLabel>
            <Select label="Member Pack*" value={formData.memberPack} onChange={handleMemberPackChange}>
              <MenuItem value="Quaterly">Quaterly</MenuItem>
              <MenuItem value="Half-yearly">Half-yearly</MenuItem>
              <MenuItem value="Monthly">Monthly</MenuItem>
              <MenuItem value="Annual">Annual</MenuItem>
              <MenuItem value="2 Months">2 Months</MenuItem>
              <MenuItem value="4 Months">4 Months</MenuItem>
              <MenuItem value="12 + 2 Months">12 + 2 Months</MenuItem>
              <MenuItem value="6 + 1 Month">6 + 1 Month</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Pack Amount*"
            fullWidth
            name="packAmount"
            value={formData.packAmount}
            onChange={handleChangeMainForm}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Tax (%)*"
            fullWidth
            type="number"
            name="tax"
            value={formData.tax}
            onChange={handleTaxChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Payment Mode*"
            fullWidth
            name="payment_mode"
            value={formData.payment_mode}
            onChange={handleChangeMainForm}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Pending Date*"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            name="bill_date"
            value={formData.bill_date}
            onChange={handleChangeMainForm}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Bill State*"
            fullWidth
            name="state"
            value={formData.state}
            onChange={handleChangeMainForm}
            sx={{ mb: 2 }}
          />
        </Box>
      </Box>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, float: "right" }}
        onClick={handleOpenModal}
      >
        Save Transaction
      </Button>

      <Modal open={openEdit} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 500,
            bgcolor: "white",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Save Transaction</Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            sx={{ my: 1 }}
            name="bill_date"
            label="Bill Date"
            type="date"
            fullWidth
            value={formData.bill_date}
            onChange={handleChangeMainForm}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            sx={{ my: 1 }}
            name="start_date"
            label="Start Date"
            type="date"
            fullWidth
            value={formData.start_date}
            onChange={handleChangeMainForm}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            sx={{ my: 1 }}
            name="member_name"
            label="Member Name"
            fullWidth
            value={formData.member_name}
            onChange={handleChangeMainForm}
          />
          <TextField
            sx={{ my: 1 }}
            name="month_paid"
            label="Total Month Paid"
            fullWidth
            value={formData.month_paid}
            onChange={handleChangeMainForm}
          />
          <TextField
            sx={{ my: 1 }}
            name="billingAmount"
            label="Billing Amount"
            fullWidth
            value={formData.billingAmount}
            onChange={handleChangeMainForm}
          />
          <TextField
            sx={{ my: 1 }}
            name="discount"
            label="Discount Amount"
            fullWidth
            value={formData.discount}
            onChange={handleChangeMainForm}
          />
          <TextField
            sx={{ my: 1 }}
            name="pending"
            label="Pending Amount"
            fullWidth
            value={formData.pending}
            onChange={handleChangeMainForm}
          />
          <TextField
            sx={{ my: 1 }}
            name="totalAmount"
            label="Total Amount"
            fullWidth
            value={formData.totalAmount}
            onChange={handleChangeMainForm}
          />
          <TextField
            sx={{ my: 1 }}
            name="tax"
            label="Tax (%)"
            fullWidth
            type="number"
            value={formData.tax}
            onChange={handleTaxChange}
          />
          <TextField
            sx={{ my: 1 }}
            name="payment_mode"
            label="Payment Mode"
            fullWidth
            value={formData.payment_mode}
            onChange={handleChangeMainForm}
          />
          <TextField
            sx={{ my: 1 }}
            name="state"
            label="Bill State"
            fullWidth
            value={formData.state}
            onChange={handleChangeMainForm}
          />
          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default PendingBill;