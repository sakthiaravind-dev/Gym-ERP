import React, { useEffect, useState } from "react";
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
} from "@mui/material";

const SupplementBill: React.FC = () => {
  const mockData = [
    {
      billDate: "16/09/2023",
      id: "70663",
      name: "Kavin Mohan",
      contact: "9626055777",
      product: "GNC Creatine",
      amount: 1100,
      pending: 0,
      modeOfPayment: "Gpay",
    },
    {
      billDate: "15/09/2023",
      id: "70025",
      name: "Nithes",
      contact: "9500624007",
      product: "GNC Creatine",
      amount: 1100,
      pending: 0,
      modeOfPayment: "Gpay",
    },
    {
      billDate: "17/09/2023",
      id: "01",
      name: "Out side customer",
      contact: "Nill",
      product: "Raw Creatine",
      amount: 1300,
      pending: 0,
      modeOfPayment: "Paytm",
    },
    {
      billDate: "16/09/2023",
      id: "70000",
      name: "Elavarasan M",
      contact: "9789841310",
      product: "CBUM Pre-workout",
      amount: 2000,
      pending: 0,
      modeOfPayment: "Gpay",
    },
    {
      billDate: "01/09/2023",
      id: "70025",
      name: "Nithes",
      contact: "9500624007",
      product: "Avvatar Muscle Gainer",
      amount: 4700,
      pending: 0,
      modeOfPayment: "Gpay",
    },
    {
      billDate: "15/09/2023",
      id: "70201",
      name: "Gowthaman S",
      contact: "9362562562",
      product: "Muscle Tech",
      amount: 5200,
      pending: 0,
      modeOfPayment: "Gpay",
    },
  ];
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalPending, setTotalPending] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredData, setFilteredData] = useState(mockData);

  useEffect(() => {
    const totalAmt = mockData.reduce((sum, item) => sum + item.amount, 0);
    const totalPend = mockData.reduce((sum, item) => sum + item.pending, 0);
    setTotalAmount(totalAmt);
    setTotalPending(totalPend);
  }, [mockData]);

  useEffect(() => {
    const filtered = mockData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.includes(searchTerm) ||
        item.billDate.includes(searchTerm)
    );
    setFilteredData(filtered);
  }, [searchTerm, mockData]);

  const handleExport = () => {
    const csvData = [
      ["Bill Date", "ID", "Name", "Contact", "Product", "Amount", "Pending", "Mode of Payment"],
      ...mockData.map((row) => [
        row.billDate,
        row.id,
        row.name,
        row.contact,
        row.product,
        row.amount,
        row.pending,
        row.modeOfPayment,
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

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Updated Total Amount Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <Box
          sx={{
            flex: 1,
            marginRight: 2,
            padding: 2,
            borderRadius: 2,
            backgroundColor: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography sx={{ fontWeight: "bold", color: "#4a4a4a" }}>
            Total Amount Collected
          </Typography>
          <Typography sx={{ fontSize: 20, fontWeight: "bold", color: "#3b82f6" }}>
            ₹{totalAmount}
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            padding: 2,
            borderRadius: 2,
            backgroundColor: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography sx={{ fontWeight: "bold", color: "#4a4a4a" }}>
            Total Amount Pending
          </Typography>
          <Typography sx={{ fontSize: 20, fontWeight: "bold", color: "#e53e3e" }}>
            ₹{totalPending}
          </Typography>
        </Box>
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

          <Box sx={{ flex: -1}}>
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
                  filteredData.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.billDate}</TableCell>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.contact}</TableCell>
                      <TableCell>{row.product}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell>{row.pending}</TableCell>
                      <TableCell>{row.modeOfPayment}</TableCell>
                      <TableCell>
                        <Button style={{backgroundColor: "#2485bd"}} variant="contained"  size="small">
                          Actions
                        </Button>
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
            <Button style={{backgroundColor: "#2485bd", padding: "5px 15px"}}
              variant="contained"
              
              onClick={handleExport}
            >
              Export Data
            </Button>
            <Button style={{backgroundColor: "#2485bd", padding: "5px 15px"}}
              variant="contained"
              
              
            >
              Add a new bill
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default SupplementBill;