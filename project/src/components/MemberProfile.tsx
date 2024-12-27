import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
} from "@mui/material";


interface Member {
    id: number;
    name: string;
    gender: string;
    memberId: string;
    joinedDate: string;
    renewalStartDate: string;
    membershipEndingDate: string;
    memberPack: string;
    referredBy: string;
    personalTrainingEndingDate?: string; // Optional field
    trainerName?: string; // Optional field
    memberIdentityDocumentType?: string;
    documentIdNumber?: string;
    category?: string;
    memberStatus: string;
    healthStatus?: string;
    memberBranch?: string;
  }

  
const MemberPage = ({ id }: { id: number }) => {
    const [member, setMember] = useState<Member | null>(null);

    useEffect(() => {
      const fetchMemberData = async () => {
        const response = await fetch("/mockData.json");
        const data: Member[] = await response.json(); // Assume the JSON file contains an array of Member objects
        const memberData = data.find((m) => m.id === id);
        setMember(memberData || null);
      };

  

    fetchMemberData();
  }, [id]);

  if (!member)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 4, fontFamily: "Arial, sans-serif" }}>
      {/* Member Header */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {member.name}
        </Typography>
        <Typography variant="subtitle1" color="primary">
          {member.gender}
        </Typography>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Member ID - {member.memberId}
        </Typography>
      </Paper>

      {/* Navigation Buttons */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <Button variant="contained" color="primary">
          Edit Profile
        </Button>
        <Button variant="contained" color="secondary">
          Freeze Days
        </Button>
        <Button variant="contained" color="success">
          View Member Transactions
        </Button>
        <Button variant="contained" color="info">
          View Measurements
        </Button>
      </Box>

      {/* Member Details */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Joined Date"
                  secondary={member.joinedDate}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Renewal Start Date"
                  secondary={member.renewalStartDate}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Membership Ending Date"
                  secondary={member.membershipEndingDate}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Member Pack" secondary={member.memberPack} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Referred By" secondary={member.referredBy} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Personal Training Ending Date"
                  secondary={member.personalTrainingEndingDate || "N/A"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Trainer Name"
                  secondary={member.trainerName || "N/A"}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Member Identity Document Type"
                  secondary={member.memberIdentityDocumentType || "N/A"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Document ID Number"
                  secondary={member.documentIdNumber || "N/A"}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Category" secondary={member.category || "N/A"} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Member Status"
                  secondary={
                    <Typography color="primary" display="inline">
                      {member.memberStatus}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Health Status"
                  secondary={member.healthStatus || "N/A"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Member Branch"
                  secondary={member.memberBranch || "N/A"}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MemberPage;
