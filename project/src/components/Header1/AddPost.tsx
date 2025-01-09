import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { createClient } from '@supabase/supabase-js';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Post {
  sno?: number;
  member_id: string;
  description: string;
  image_url?: string;
}

const AddPost: React.FC = () => {
  const [memberID, setMemberID] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase.from('post').select('*');
    if (error) {
      toast.error('Failed to fetch posts: ' + error.message);
    } else {
      setPosts(data);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let imageUrl = null;
    if (selectedFile) {
      const fileName = `posts_${memberID}`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('images')
        .upload(fileName, selectedFile, { upsert: true });

      if (uploadError) {
        toast.error('Failed to upload image: ' + uploadError.message);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      imageUrl = uploadData?.path;
      toast.success('Image uploaded successfully!');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase
      .from('post')
      .insert([
        {
          member_id: memberID,
          description: description,
        },
      ]);

    if (error) {
      toast.error('Failed to add post: ' + error.message);
    } else {
      toast.success('Post added successfully!');
      fetchPosts();
      setMemberID('');
      setDescription('');
      setSelectedFile(null);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <ToastContainer />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 600,
          margin: '0 auto',
          padding: 3,
          border: '1px solid #ccc',
          borderRadius: 2,
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Add New Post
        </Typography>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: 13, color: '#71045f' }}>
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
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: 13, color: '#71045f' }}>
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
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: 13, color: '#71045f' }}>
            Select Image to upload
          </label>
          <div
            {...getRootProps()}
            style={{
              border: '2px dashed #2485bd',
              padding: '7px',
              borderRadius: '8px',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '20px',
            }}
          >
            <input {...getInputProps()} />
            <p style={{ margin: 0 }}>Choose File</p>
          </div>
        </div>
        <Button type="submit" variant="contained" fullWidth style={{ backgroundColor: '#2485bd' }}>
          ADD TO LIST
        </Button>
      </Box>

      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6" gutterBottom>
          Recent Posts
        </Typography>
        <List>
          {posts.map((post) => (
            <ListItem key={post.sno}>
              <ListItemText
                primary={`Member ID: ${post.member_id}`}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="textPrimary">
                      {post.description}
                    </Typography>
                    {post.member_id && (
                      <img
                        src={`${supabase.storage.from('images').getPublicUrl(`posts_${post.member_id}`).data.publicUrl}`}
                        alt="Post"
                        style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }}
                      />
                    )}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default AddPost;