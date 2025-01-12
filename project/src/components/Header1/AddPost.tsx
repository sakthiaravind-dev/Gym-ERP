import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { createClient } from '@supabase/supabase-js';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@mui/icons-material/Delete';

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

const formatDescription = (desc: string, limit = 20): string => {
  const words = desc.split(' ');
  const lines: string[] = [];
  for (let i = 0; i < words.length; i += limit) {
    lines.push(words.slice(i, i + limit).join(' '));
  }
  return lines.join('\n');
};

const AddPost: React.FC = () => {
  const [memberID, setMemberID] = useState('');
  const [description, setDescription] = useState('');
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let imageUrl: string | null = null;
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
    const { error } = await supabase
      .from('post')
      .insert([{ member_id: memberID, description }]);
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

  const handleDelete = async (post: Post) => {
    if (post.member_id) {
      const { error: deleteError } = await supabase
        .storage
        .from('images')
        .remove([`posts_${post.member_id}`]);
      if (deleteError) {
        toast.error('Failed to delete image: ' + deleteError.message);
        return;
      }
    }
    const { error } = await supabase.from('post').delete().eq('sno', post.sno);
    if (error) {
      toast.error('Failed to delete post: ' + error.message);
    } else {
      toast.success('Post deleted successfully!');
      fetchPosts();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 600,
          mx: 'auto',
          p: 3,
          border: '1px solid #ccc',
          borderRadius: 2,
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Add New Post
        </Typography>
        <Box mb={2}>
          <label style={{ fontWeight: 'bold', fontSize: 13, color: '#71045f' }}>Member ID</label>
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
        </Box>
        <Box mb={2}>
          <label style={{ fontWeight: 'bold', fontSize: 13, color: '#71045f' }}>Description</label>
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
        </Box>
        <Box mb={2}>
          <label style={{ fontWeight: 'bold', fontSize: 13, color: '#71045f' }}>Select Image to upload</label>
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed #2485bd',
              p: 1,
              borderRadius: 1,
              textAlign: 'center',
              cursor: 'pointer',
              mb: 2,
            }}
          >
            <input {...getInputProps()} />
            <Typography variant="body2">Choose File</Typography>
          </Box>
        </Box>
        <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: '#2485bd' }}>
          ADD TO LIST
        </Button>
      </Box>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Recent Posts
        </Typography>
        <List sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {posts.map((post) => {
            const formattedDesc = formatDescription(post.description, 20);
            return (
              <ListItem
                key={post.sno}
                sx={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  mb: 2,
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="bold">
                      Member ID: {post.member_id}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        component="div"
                        variant="body2"
                        sx={{
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word',
                          mt: 1,
                        }}
                      >
                        {formattedDesc}
                      </Typography>
                      {post.member_id && (
                        <Box mt={1}>
                          <img
                            src={supabase.storage.from('images').getPublicUrl(`posts_${post.member_id}`).data.publicUrl}
                            alt="Post"
                            style={{ maxWidth: '100%', height: 'auto' }}
                          />
                        </Box>
                      )}
                    </>
                  }
                />
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(post)}
                  sx={{ alignSelf: 'flex-end', mt: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};

export default AddPost;