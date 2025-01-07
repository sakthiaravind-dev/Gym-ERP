import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';

const AddPost: React.FC = () => {
  const [memberID, setMemberID] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Member ID:', memberID);
    console.log('Description:', description);
    console.log('Selected File:', selectedFile);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 600,
        margin: '0 auto',
        padding: 3,
        border: '1px solid #ccc',
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Add New Post
      </Typography>
      <div>
      <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13, color: "#71045f" }}>
              Member ID
            </label>
      <TextField
        label="Member ID"
        multiline
        rows={1}
        fullWidth
        margin="normal"
        variant="outlined"
        value={memberID}
        onChange={(e) => setMemberID(e.target.value)}
      />
      </div>
      <div>
      <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13, color: "#71045f" }}>
              Description
            </label>
      <TextField
        label="Description"
        multiline
        rows={4}
        fullWidth
        margin="normal"
        variant="outlined"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      </div>
      <div>
      <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: 13, color: "#71045f" }}>
              Select Image to upload
            </label>
      <input
        accept="image/*"
        type="file"
        onChange={handleFileChange}
        style={{ margin: '11px 0' }}
      />
      </div>
      <Button
        type="submit"
        variant="contained"
        fullWidth
        style={{backgroundColor: "#2485bd"}}
      >
        ADD TO LIST
      </Button>
    </Box>
  );
};

export default AddPost;