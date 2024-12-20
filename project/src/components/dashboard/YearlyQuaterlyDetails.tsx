import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import { useParams } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const MemberDetails = () => {
  const { members } = useParams<{ members: string }>();

  const membershipType = members || "yearly"; 

  const memberData = Array.from({ length: 50 }, (_, index) => ({
    id: `M${index + 1}`,
    name: `Member ${index + 1}`,
    phone: `12345${index.toString().padStart(5, "0")}`,
    type: ["yearly", "half-yearly", "quarterly"][index % 3], 
    status: index % 2 === 0 ? "Active" : "In-Active", 
    referredBy: `Ref${index % 10 + 1}`,
    endDate: `2025-12-${(index % 31 + 1).toString().padStart(2, "0")}`,
  }));

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMembers, setFilteredMembers] = useState(memberData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentMemberId, setCurrentMemberId] = useState<string | null>(null);

  useEffect(() => {
    const filteredByType = memberData.filter(
      (member) => member.type === membershipType
    );
    setFilteredMembers(filteredByType);
  }, [membershipType, memberData]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilteredMembers(
      memberData
        .filter((member) => member.type === membershipType) 
        .filter((member) =>
          member.name.toLowerCase().includes(term.toLowerCase())
        )
    );
  };

  
  const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };


const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

 
  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentMemberId(null);
  };


  const handleAction = (action: string) => {
    console.log(`Action: ${action} for member ID: ${currentMemberId}`);
    handleMenuClose();
  };

  return (
    <div style={{ padding: "20px" }}>

      <Grid container spacing={3}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="h4">
                {filteredMembers.filter((m) => m.status === "Active").length}
              </Typography>
              <Typography>Active Members</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="h4">
                {filteredMembers.filter((m) => m.status === "In-Active").length}
              </Typography>
              <Typography>In-Active Members</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>


      <div className="flex-row justify-center text-center bg-white p-6 border-gray-300 border mt-5">
        <Typography
          variant="h5"
          style={{
            marginBottom: "20px ",
            color: "#71045F",
            fontWeight: "bold",
          }}
        >
          {membershipType.charAt(0).toUpperCase() + membershipType.slice(1)}{" "}
          Members
        </Typography>

        <div className="w-1/4">
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F7EEF9" }}>
                <TableCell>SNO</TableCell>
                <TableCell>Member ID</TableCell>
                <TableCell>Member Name</TableCell>
                <TableCell>Member Phone Number</TableCell>
                <TableCell>Member Type</TableCell>
                <TableCell>Member Status</TableCell>
                <TableCell>Referred By</TableCell>
                <TableCell>End On</TableCell>
                <TableCell>Actions</TableCell> 
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers
                .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                .map((member, index) => (
                  <TableRow key={member.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{member.id}</TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>{member.type}</TableCell>
                    <TableCell>{member.status}</TableCell>
                    <TableCell>{member.referredBy}</TableCell>
                    <TableCell>{member.endDate}</TableCell>
                    <TableCell>
                      <Button
                    variant="contained"
                    aria-controls={anchorEl ? "actions-menu" : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                    endIcon={<ArrowDropDownIcon />} 
                    >
                      Actions
                  </Button>
                      
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <Menu
                id="actions-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                >
                <MenuItem onClick={() => handleAction("Pay Bill")}>Pay Bill</MenuItem>
                <MenuItem onClick={() => handleAction("View")}>View</MenuItem>
                <MenuItem onClick={() => handleAction("Edit")}>Edit</MenuItem>
                <MenuItem onClick={() => handleAction("Delete")}>Delete</MenuItem>
                <MenuItem onClick={() => handleAction("Diet")}>Diet</MenuItem>
                <MenuItem onClick={() => handleAction("Work-out")}>Work-out</MenuItem>
                </Menu>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={filteredMembers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
    </div>
  );
};

export default MemberDetails;
