import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import {
  Box,
  Typography,
  IconButton,
  Button,Modal,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface TaskItemProps {
  title: string;
  count: number;
  items: Array<{ name: string; id: string }>;
  onViewMore: () => void;
  onRedirect: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TaskItem: React.FC<TaskItemProps> = ({ title, count, items, onViewMore, onRedirect }) => {
  const [openModal, setOpenModal] = useState(false);
  const [modalItems, setModalItems] = useState<{ name: string; id: string }[]>([]);

  const handleViewMore = () => {
    setModalItems(items);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-purple-800 font-semibold">{title} ({count})</h3>
        <Edit size={16} className="text-gray-400" />
      </div>
      {items.length > 0 ? (
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-700">{items[0].name}</span>
          <span className="text-gray-500 text-sm">{items[0].id}</span>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No {title.toLowerCase()} left today</p>
      )}
      <button className="text-purple-600 text-sm mt-4" onClick={handleViewMore}>View More</button>
      <button className="text-purple-600 text-sm mt-4" onClick={onRedirect}>Go to {title}</button>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 600,
            bgcolor: 'white',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">{title}</Typography>
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

export default TaskItem;