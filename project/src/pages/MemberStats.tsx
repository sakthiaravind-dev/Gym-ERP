import React from "react";
import { Box, Typography } from "@mui/material";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const MemberStats: React.FC = () => {
  // Data for Bar Chart (Member Trends - Year)
  const memberTrendsYearData = {
    labels: ["2023", "2024"],
    datasets: [
      {
        label: "Member Trends",
        data: [200, 1179],
        backgroundColor: ["#D3C3E9", "#71045F"],
        borderColor: "#71045F",
        borderWidth: 1,
      },
    ],
  };

  // Data for Line Chart (Member Trends - Gender)
  const memberTrendsGenderData = {
    labels: ["Female", "Male"],
    datasets: [
      {
        label: "Member Trends",
        data: [200, 1800],
        borderColor: "#71045F",
        backgroundColor: "#D3C3E9",
        tension: 0.4,
      },
    ],
  };

  // Data for Doughnut Chart (Age Ratio)
  const ageRatioData = {
    labels: ["14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"],
    datasets: [
      {
        data: [4.8, 6, 7.6, 8, 13, 15, 11.8, 9, 6.4, 5, 4],
        backgroundColor: [
          "#8E44AD",
          "#9B59B6",
          "#AF7AC5",
          "#BB8FCE",
          "#D2B4DE",
          "#D3C3E9",
          "#E8DAEF",
          "#C39BD3",
          "#884EA0",
          "#7D3C98",
          "#512E5F",
        ],
      },
    ],
  };

  // Data for Doughnut Chart (Status Ratio)
  const statusRatioData = {
    labels: ["Active", "Not-Active"],
    datasets: [
      {
        data: [64.5, 35.5],
        backgroundColor: ["#71045F", "#D3C3E9"],
      },
    ],
  };

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#F7F9FC",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#71045F", marginBottom: "20px" }}
      >
        Member Stats
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
        }}
      >
        {/* Bar Chart - Member Trends (Year) */}
        <Box sx={{ backgroundColor: "white", padding: 2, borderRadius: 2 }}>
          <Typography
            variant="h6"
            align="center"
            sx={{ color: "#71045F", marginBottom: "10px" }}
          >
            Member Trends (Year)
          </Typography>
          <Bar data={memberTrendsYearData} />
        </Box>

        {/* Line Chart - Member Trends (Gender) */}
        <Box sx={{ backgroundColor: "white", padding: 2, borderRadius: 2 }}>
          <Typography
            variant="h6"
            align="center"
            sx={{ color: "#71045F", marginBottom: "10px" }}
          >
            Member Trends (Gender)
          </Typography>
          <Line data={memberTrendsGenderData} />
        </Box>

        {/* Doughnut Chart - Age Ratio */}
        <Box sx={{ backgroundColor: "white", padding: 2, borderRadius: 2 }}>
          <Typography
            variant="h6"
            align="center"
            sx={{ color: "#71045F", marginBottom: "10px" }}
          >
            Age Ratio
          </Typography>
          <Doughnut data={ageRatioData} />
        </Box>

        {/* Doughnut Chart - Status Ratio */}
        <Box sx={{ backgroundColor: "white", padding: 2, borderRadius: 2 }}>
          <Typography
            variant="h6"
            align="center"
            sx={{ color: "#71045F", marginBottom: "10px" }}
          >
            Status Ratio
          </Typography>
          <Doughnut data={statusRatioData} />
        </Box>
      </Box>
    </Box>
  );
};

export default MemberStats;