import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  Paper,
  TableCell,
  TextField,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TablePagination,
} from "@mui/material";
import { Users, Clock, UserCheck, User } from "lucide-react";
import StatGroup from "./StatGroup";

const memberData = Array.from({ length: 50 }, (_, index) => ({
  id: `M${index + 1}`,
  name: `Member ${index + 1}`,
  phone: `12345${index.toString().padStart(5, "0")}`,
  type: ["yearly", "half-yearly", "quarterly", "monthly"][index % 4],
  status: index % 2 === 0 ? "Active" : "In-Active",
  referredBy: `Ref${index % 10 + 1}`,
  endDate: `2025-12-${(index % 31 + 1).toString().padStart(2, "0")}`,
}));

const MemberPage = () => {
  const { gender, period } = useParams<{ gender?: string; period?: string }>();
  const filteredGender = gender || "male";

  // Filter members by gender
  const membersByGender = memberData.filter((_, index) => {
    if (filteredGender === "male") return index % 3 === 0;
    if (filteredGender === "female") return index % 3 === 1;
    if (filteredGender === "transgender") return index % 3 === 2;
    return true;
  });

  // Further filter by membership type if `period` is specified
  const members =
    period && period !== "all"
      ? membersByGender.filter((member) => member.type === period)
      : membersByGender;

  const cardConfig = [
    { title: "YEARLY MEMBERS", value: "688", Icon: Clock, path: `/period/${gender}/yearly` },
    { title: "HALF YEARLY MEMBERS", value: "372", Icon: UserCheck, path: `/period/${gender}/half-yearly` },
    { title: "MONTHLY MEMBERS", value: "339", Icon: Users, path: `/period/${gender}/monthly` },
    { title: "QUARTERLY MEMBERS", value: "418", Icon: User, path: `/period/${gender}/quarterly` },
  ];

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Handle pagination change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Paginated members
  const paginatedMembers = members.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box p={4}>
      {/* Cards Section */}
      <div>
        <StatGroup stats={cardConfig} />
      </div>

      {/* Member Details Table */}
      <div className="flex-row justify-center text-center bg-white p-6 border-gray-300 border">
        <Typography
          variant="h5"
          gutterBottom
          style={{ marginBottom: "20px", color: "#71045F", fontWeight: "bold" }}
        >
          {filteredGender.charAt(0).toUpperCase() + filteredGender.slice(1)} Member Details
        </Typography>

        <div className="w-1/4">
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            style={{ marginBottom: "20px" }}
          />
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F7EEF9" }}>
                <TableCell>SNO</TableCell>
                <TableCell>MEMBER ID</TableCell>
                <TableCell>MEMBER NAME</TableCell>
                <TableCell>MEMBER PHONE NUMBER</TableCell>
                <TableCell>MEMBERSHIP TYPE</TableCell>
                <TableCell>MEMBER STATUS</TableCell>
                <TableCell>REFERRED BY</TableCell>
                <TableCell>END DATE</TableCell>
                <TableCell>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedMembers.map((member, index) => (
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
                    <Button variant="contained" color="primary">
                      Actions
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Pagination */}
        <TablePagination
          component="div"
          count={members.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </Box>
  );
};

export default MemberPage;
