import React, { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { fetchFollowUpData } from '../constants/followUpData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const supabase = createClient(supabaseUrl, supabaseKey);

interface TaskItemProps {
  title: string;
  count: number;
  items: Array<{ name: string; id: string }>;
  onViewMore: () => void;
}

const TaskItem = ({ title, count, items, onViewMore }: TaskItemProps) => {
  return (
    <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-purple-800 font-semibold">{title} ({count})</h3>
        <Edit size={16} className="text-gray-400" />
      </div>
      {items.length > 0 ? (
        items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2">
            <span className="text-gray-700">{item.name}</span>
            <span className="text-gray-500 text-sm">{item.id}</span>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center py-4">No {title.toLowerCase()} left today</p>
      )}
      <button className="text-purple-600 text-sm mt-4" onClick={onViewMore}>View More</button>
    </div>
  );
};

interface FollowUpItem {
  title: string;
  count: number;
  items: { name: string; id: string }[];
}

const FollowUpTask = () => {
  const [followUpData, setFollowUpData] = useState<FollowUpItem[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalItems, setModalItems] = useState<{ name: string; id: string }[]>([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchFollowUpData();
      setFollowUpData(data);
    };

    getData();
  }, []);

  const handleViewMore = (title: string, items: { name: string; id: string }[]) => {
    setModalTitle(title);
    setModalItems(items);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Follow-up Task</h2>
      <div className="grid grid-cols-4 gap-4">
        {followUpData.map((task, index) => (
          <TaskItem 
            key={index}
            title={task.title}
            count={task.count}
            items={task.items.slice(0, 5)}
            onViewMore={() => handleViewMore(task.title, task.items)}
          />
        ))}
      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'white',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">{modalTitle}</Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          {modalItems.map((item, index) => (
            <Box key={index} display="flex" justifyContent="space-between" alignItems="center" py={1}>
              <Typography>{item.name}</Typography>
              <Typography variant="body2" color="textSecondary">{item.id}</Typography>
            </Box>
          ))}
          <Button
            fullWidth
            variant="contained"
            onClick={handleCloseModal}
            sx={{ mt: 2, backgroundColor: "#2485bd", color: "white" }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default FollowUpTask;