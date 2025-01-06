import React, { useState } from "react";
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
} from "@mui/material";

interface RatingRecord {
  date: string;
  memberId: string;
  ratingForGym: number;
  commentForGym: string;
  trainerName: string;
  ratingForTrainer: number;
  commentForTrainer: string;
}

const Ratings: React.FC = () => {
  const [ratingRecords, setRatingRecords] = useState<RatingRecord[]>([]);

  const handleExport = () => {
    const csvData = [
      [
        "DATE",
        "MEMBER ID",
        "RATING FOR GYM",
        "COMMENT FOR GYM",
        "TRAINER NAME",
        "RATING FOR TRAINER",
        "COMMENT FOR TRAINER",
      ],
      ...ratingRecords.map((record) => [
        record.date,
        record.memberId,
        record.ratingForGym,
        record.commentForGym,
        record.trainerName,
        record.ratingForTrainer,
        record.commentForTrainer,
      ]),
    ];
    const csvContent = `data:text/csv;charset=utf-8,${csvData
      .map((e) => e.join(","))
      .join("\n")}`;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "overall_rating_detail.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddRating = () => {
    alert("Add Rating functionality to be implemented.");
  };

  return (
    <Box sx={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Heading at Top Center */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#71045F",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Overall Rating Detail
      </Typography>

      {/* Add Rating Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-start", marginBottom: "20px" }}>
        <Button
          onClick={handleAddRating}
          variant="contained"
          sx={{
            backgroundColor: "#2485bd",
            color: "white",
            padding: "5px 15px",
          }}
        >
          Add Rating
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F7EEF9" }}>
              <TableCell>DATE</TableCell>
              <TableCell>MEMBER ID</TableCell>
              <TableCell>RATING FOR GYM</TableCell>
              <TableCell>COMMENT FOR GYM</TableCell>
              <TableCell>TRAINER NAME</TableCell>
              <TableCell>RATING FOR TRAINER</TableCell>
              <TableCell>COMMENT FOR TRAINER</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ratingRecords.length > 0 ? (
              ratingRecords.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.memberId}</TableCell>
                  <TableCell>{record.ratingForGym}</TableCell>
                  <TableCell>{record.commentForGym}</TableCell>
                  <TableCell>{record.trainerName}</TableCell>
                  <TableCell>{record.ratingForTrainer}</TableCell>
                  <TableCell>{record.commentForTrainer}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No data available in table
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Export Data Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
        <Button
          onClick={handleExport}
          variant="contained"
          sx={{
            backgroundColor: "#2485bd",
            color: "white",
            padding: "5px 15px",
          }}
        >
          Export Data
        </Button>
      </Box>
    </Box>
  );
};

export default Ratings;