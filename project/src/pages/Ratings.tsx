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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { createClient } from "@supabase/supabase-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface RatingRecord {
  [x: string]: unknown;
  date: string;
  member_id: string;
  rating_for_gym: number;
  comment_for_gym: string;
  trainer_name: string;
  rating_for_trainer: number;
  comment_for_trainer: string;
}

const Ratings: React.FC = () => {
  const [ratingRecords, setRatingRecords] = useState<RatingRecord[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRating, setSelectedRating] = useState<RatingRecord | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState<RatingRecord | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newRating, setNewRating] = useState<RatingRecord>({
    date: "",
    member_id: "",
    rating_for_gym: 0,
    comment_for_gym: "",
    trainer_name: "",
    rating_for_trainer: 0,
    comment_for_trainer: "",
  });

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    const { data, error } = await supabase.from("ratings").select("*");
    if (error) {
      toast.error("Failed to fetch ratings: " + error.message);
    } else {
      setRatingRecords(data);
    }
  };

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
        record.member_id,
        record.rating_for_gym,
        record.comment_for_gym,
        record.trainer_name,
        record.rating_for_trainer,
        record.comment_for_trainer,
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
    setAddDialogOpen(true);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, rating: RatingRecord) => {
    setAnchorEl(event.currentTarget);
    setSelectedRating(rating);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRating(null);
  };

  const handleEdit = () => {
    if (selectedRating) {
      setEditData(selectedRating);
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedRating) {
      const { error } = await supabase
        .from('ratings')
        .delete()
        .eq('id', selectedRating.id);

      if (error) {
        toast.error("Failed to delete rating: " + error.message);
      } else {
        toast.success("Rating deleted successfully!");
        fetchRatings();
      }
    }
    handleMenuClose();
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editData) {
      setEditData({
        ...editData,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleEditSubmit = async () => {
    if (editData) {
      const { error } = await supabase
        .from('ratings')
        .update(editData)
        .eq('id', editData.id);

      if (error) {
        toast.error("Failed to update rating: " + error.message);
      } else {
        toast.success("Rating updated successfully!");
        fetchRatings();
        setEditDialogOpen(false);
      }
    }
  };

  const handleAddChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewRating({
      ...newRating,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddSubmit = async () => {
    const { error } = await supabase
      .from('ratings')
      .insert([newRating]);

    if (error) {
      toast.error("Failed to add rating: " + error.message);
    } else {
      toast.success("Rating added successfully!");
      fetchRatings();
      setAddDialogOpen(false);
      setNewRating({
        date: "",
        member_id: "",
        rating_for_gym: 0,
        comment_for_gym: "",
        trainer_name: "",
        rating_for_trainer: 0,
        comment_for_trainer: "",
      });
    }
  };

  return (
    <Box sx={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <ToastContainer />
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
              <TableCell>ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ratingRecords.length > 0 ? (
              ratingRecords.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.member_id}</TableCell>
                  <TableCell>{record.rating_for_gym}</TableCell>
                  <TableCell>{record.comment_for_gym}</TableCell>
                  <TableCell>{record.trainer_name}</TableCell>
                  <TableCell>{record.rating_for_trainer}</TableCell>
                  <TableCell>{record.comment_for_trainer}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={(event) => handleMenuClick(event, record)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleEdit}>Edit</MenuItem>
                      <MenuItem onClick={handleDelete}>Delete</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Rating</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please update the rating details below.
          </DialogContentText>
          {editData && (
            <>
              <TextField
                margin="dense"
                label="Date"
                type="date"
                name="date"
                fullWidth
                value={editData.date}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Member ID"
                type="text"
                name="member_id"
                fullWidth
                value={editData.member_id}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Rating for Gym"
                type="number"
                name="rating_for_gym"
                fullWidth
                value={editData.rating_for_gym}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Comment for Gym"
                type="text"
                name="comment_for_gym"
                fullWidth
                value={editData.comment_for_gym}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Trainer Name"
                type="text"
                name="trainer_name"
                fullWidth
                value={editData.trainer_name}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Rating for Trainer"
                type="number"
                name="rating_for_trainer"
                fullWidth
                value={editData.rating_for_trainer}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Comment for Trainer"
                type="text"
                name="comment_for_trainer"
                fullWidth
                value={editData.comment_for_trainer}
                onChange={handleEditChange}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add Rating</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the rating details below.
          </DialogContentText>
          <TextField
            margin="dense"
            label="Date"
            type="date"
            name="date"
            fullWidth
            value={newRating.date}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            label="Member ID"
            type="text"
            name="member_id"
            fullWidth
            value={newRating.member_id}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            label="Rating for Gym"
            type="number"
            name="rating_for_gym"
            fullWidth
            value={newRating.rating_for_gym}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            label="Comment for Gym"
            type="text"
            name="comment_for_gym"
            fullWidth
            value={newRating.comment_for_gym}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            label="Trainer Name"
            type="text"
            name="trainer_name"
            fullWidth
            value={newRating.trainer_name}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            label="Rating for Trainer"
            type="number"
            name="rating_for_trainer"
            fullWidth
            value={newRating.rating_for_trainer}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            label="Comment for Trainer"
            type="text"
            name="comment_for_trainer"
            fullWidth
            value={newRating.comment_for_trainer}
            onChange={handleAddChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Ratings;