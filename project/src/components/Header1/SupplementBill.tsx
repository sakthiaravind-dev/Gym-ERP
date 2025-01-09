import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TextField,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { createClient } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import StatGroup from './StatGroupTop';
import { Users } from "lucide-react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SupplementBill: React.FC = () => {
  interface Bill {
    bill_date: string;
    id: string;
    sno: number;
    name: string;
    contact: string;
    product: string;
    amount: string;
    pending: string;
    mode_of_payment: string;
  }
  
  const [data, setData] = useState<Bill[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredData, setFilteredData] = useState<Bill[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPendingAmount, setTotalPendingAmount] = useState(0);

  const calculateTotals = useCallback((bills: Bill[]) => {
    const totalAmount = bills.reduce((sum, bill) => sum + parseFloat(bill.amount), 0);
    const totalPendingAmount = bills.reduce((sum, bill) => sum + parseFloat(bill.pending), 0);
    setTotalAmount(totalAmount);
    setTotalPendingAmount(totalPendingAmount);
  }, []);

  const fetchData = useCallback(async () => {
    const { data, error } = await supabase.from("supplements_billing").select("*");
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setData(data);
      setFilteredData(data);
      calculateTotals(data);
    }
  }, [calculateTotals]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const filtered = data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.includes(searchTerm) ||
        item.bill_date.includes(searchTerm)
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const handleExport = () => {
    const csvData = [
      ["Bill Date", "ID", "SNO", "Name", "Contact", "Product", "Amount", "Pending", "Mode of Payment"],
      ...data.map((row) => [
        row.bill_date,
        row.id,
        row.sno,
        row.name,
        row.contact,
        row.product,
        row.amount,
        row.pending,
        row.mode_of_payment,
      ]),
    ];
    const csvContent = `data:text/csv;charset=utf-8,${csvData
      .map((e) => e.join(","))
      .join("\n")}`;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "supplements_billing.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, bill: Bill) => {
    setAnchorEl(event.currentTarget);
    setSelectedBill(bill);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setOpenEditDialog(true);
    handleClose();
  };

  const handleDelete = async () => {
    if (selectedBill) {
      const { error } = await supabase.from("supplements_billing").delete().eq("id", selectedBill.id);
      if (error) {
        toast.error("Failed to delete bill: " + error.message);
      } else {
        toast.success("Bill deleted successfully!");
        fetchData();
      }
    }
    handleClose();
  };

  const handleEditSubmit = async () => {
    if (selectedBill) {
      const { error } = await supabase
        .from("supplements_billing")
        .update(selectedBill)
        .eq("id", selectedBill.id);
      if (error) {
        toast.error("Failed to update bill: " + error.message);
      } else {
        toast.success("Bill updated successfully!");
        fetchData();
      }
    }
    setOpenEditDialog(false);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setSelectedBill((prevData) => prevData ? ({
      ...prevData,
      [name]: value,
    }) : null);
  };

  const handleAddSubmit = async (newBill: Bill) => {
    const { error } = await supabase.from("supplements_billing").insert(newBill);
    if (error) {
      toast.error("Failed to add bill: " + error.message);
    } else {
      toast.success("Bill added successfully!");
      fetchData();
    }
    setOpenAddDialog(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <StatGroup stats={[
          { title: "TOTAL AMOUNT", value: totalAmount.toString(), Icon: Users, path:"/message" },
        ]} />
        <StatGroup stats={[
          { title: "TOTAL PENDING AMOUNT", value: totalPendingAmount.toString(), Icon: Users, path: "/message"},
        ]} />
      </Box>

      <Box sx={{ padding: 3, backgroundColor: "#e9f7fc", minHeight: "100vh" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#71045F", fontWeight: "bold", margin: 0, flex: 1, textAlign: "center", marginRight: -15 }}
          >
            Supplements Billing
          </Typography>

          <Box sx={{ flex: -1 }}>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ backgroundColor: "white" }}
            />
          </Box>
        </Box>

        <Box sx={{ marginTop: 3, backgroundColor: "white", padding: "20px" }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F7EEF9" }}>
                  <TableCell>S.NO</TableCell>
                  <TableCell>BILL DATE</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>NAME</TableCell>
                  <TableCell>CONTACT</TableCell>
                  <TableCell>PRODUCT</TableCell>
                  <TableCell>AMOUNT</TableCell>
                  <TableCell>PENDING</TableCell>
                  <TableCell>MODE OF PAYMENT</TableCell>
                  <TableCell>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length > 0 ? (
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  filteredData.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.sno}</TableCell>
                      <TableCell>{row.bill_date}</TableCell>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.contact}</TableCell>
                      <TableCell>{row.product}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell>{row.pending}</TableCell>
                      <TableCell>{row.mode_of_payment}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          aria-controls={anchorEl ? "actions-menu" : undefined}
                          aria-haspopup="true"
                          onClick={(event) => handleClick(event, row)}
                          endIcon={<ArrowDropDownIcon />}
                        >
                          Actions
                        </Button>
                        <Menu
                          id="actions-menu"
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleClose}
                        >
                          <MenuItem onClick={handleEdit}>Edit</MenuItem>
                          <MenuItem onClick={handleDelete}>Delete</MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      No Data Available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Button
              style={{ backgroundColor: "#2485bd", padding: "5px 15px" }}
              variant="contained"
              onClick={handleExport}
            >
              Export Data
            </Button>
            <Button
              style={{ backgroundColor: "#2485bd", padding: "5px 15px" }}
              variant="contained"
              onClick={() => setOpenAddDialog(true)}
            >
              Add a new bill
            </Button>
          </Box>
        </Box>
      </Box>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>
          Edit Bill
          <IconButton
            aria-label="close"
            onClick={() => setOpenEditDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Bill Date"
            name="bill_date"
            type="date"
            value={selectedBill?.bill_date || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Name"
            name="name"
            value={selectedBill?.name || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contact"
            name="contact"
            value={selectedBill?.contact || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Product"
            name="product"
            value={selectedBill?.product || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Amount"
            name="amount"
            value={selectedBill?.amount || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Pending"
            name="pending"
            value={selectedBill?.pending || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Mode of Payment</InputLabel>
            <Select
              name="mode_of_payment"
              value={selectedBill?.mode_of_payment || ""}
              onChange={handleEditChange}
              label="Mode of Payment"
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Credit">Credit</MenuItem>
              <MenuItem value="POS">POS</MenuItem>
              <MenuItem value="Google pay">Google pay</MenuItem>
              <MenuItem value="Paytm">Paytm</MenuItem>
              <MenuItem value="Amazon pay">Amazon pay</MenuItem>
              <MenuItem value="Netbanking">Netbanking</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>
          Add New Bill
          <IconButton
            aria-label="close"
            onClick={() => setOpenAddDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Serial No"
            name="sno"
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Bill Date"
            name="bill_date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="ID"
            name="id"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contact"
            name="contact"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Product"
            name="product"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Amount"
            name="amount"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Pending"
            name="pending"
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Mode of Payment</InputLabel>
            <Select
              name="mode_of_payment"
              label="Mode of Payment"
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Credit">Credit</MenuItem>
              <MenuItem value="POS">POS</MenuItem>
              <MenuItem value="Google pay">Google pay</MenuItem>
              <MenuItem value="Paytm">Paytm</MenuItem>
              <MenuItem value="Amazon pay">Amazon pay</MenuItem>
              <MenuItem value="Netbanking">Netbanking</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleAddSubmit({
            id: (document.querySelector('input[name="id"]') as HTMLInputElement).value,
            sno: parseInt((document.querySelector('input[name="sno"]') as HTMLInputElement).value, 10),
            bill_date: (document.querySelector('input[name="bill_date"]') as HTMLInputElement).value,
            name: (document.querySelector('input[name="name"]') as HTMLInputElement).value,
            contact: (document.querySelector('input[name="contact"]') as HTMLInputElement).value,
            product: (document.querySelector('input[name="product"]') as HTMLInputElement).value,
            amount: (document.querySelector('input[name="amount"]') as HTMLInputElement).value,
            pending: (document.querySelector('input[name="pending"]') as HTMLInputElement).value,
            mode_of_payment: (document.querySelector('input[name="mode_of_payment"]') as HTMLInputElement).value,
          })} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SupplementBill;