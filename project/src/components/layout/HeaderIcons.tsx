import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem, IconButton, ListItemText } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import StyleIcon from '@mui/icons-material/Style';
import BarChartIcon from '@mui/icons-material/BarChart';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


interface MenuItem {
  Icon?: React.ElementType;
  label: string;
  path?: string;
  onClick?: () => void;
  subMenu?: MenuItem[];
}

const HeaderIcons: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentMenu, setCurrentMenu] = useState<MenuItem[]>([]);

  const iconList = [
    {
      Icon: PersonAddIcon,
      label: 'Add Member',
      subMenu: [
        { Icon: PersonAddIcon, label: 'Add Member', path: '/addmember' },
        { Icon: PersonAddIcon, label: 'Add Staff', path: '/addstaff' },
        { Icon: PersonAddIcon, label: 'Add Enquiry', path: '/addlead' },
      ],
    },
    {
      Icon: CreditCardIcon,
      label: 'Pay Bill',
      subMenu: [
        { Icon: CreditCardIcon, label: 'Renewal', path: '/renewal' },
        { Icon: CreditCardIcon, label: 'Supplement Bill', path: '/supplementbill' },
        { Icon: CreditCardIcon, label: 'Add Expense', path: '/addexpense' },
      ],
    },
    {
      Icon: LiveHelpIcon,
      label: 'FAQ',
      subMenu: [
        { Icon: LiveHelpIcon, label: 'FAQ', path: '/' },
        { Icon: LiveHelpIcon, label: 'Tutorial', path: '/' },
      ],
    },
    {
      Icon: FitnessCenterIcon,
      label: 'Workouts',
      subMenu: [
        { Icon: FitnessCenterIcon, label: 'Personal-diet', path: '/diet' },
        { Icon: FitnessCenterIcon, label: 'Common-diet', path: '/dietdetails' },
        { Icon: FitnessCenterIcon, label: 'Workout', path: '/currentworkout' },
      ],
    },
    {
      Icon: StyleIcon,
      label: 'Offers & Events',
      subMenu: [
        { Icon: StyleIcon, label: 'Package', path: '/currentpackage' },
        { Icon: StyleIcon, label: 'Events', path: '/event' },
        { Icon: StyleIcon, label: 'Offers', path: '/offer' },
        { Icon: StyleIcon, label: 'Booking Slot', path: '/addbooking' },
        { Icon: StyleIcon, label: 'Add Service', path: '/service' },
      ],
    },
    {
      Icon: BarChartIcon,
      label: 'Reports',
      subMenu: [
        { Icon: BarChartIcon, label: 'Income and Expense Report', path: '/' },
        { Icon: BarChartIcon, label: 'Income Report', path: '/' },
        { Icon: BarChartIcon, label: 'Transaction Report', path: '/' },
        { Icon: BarChartIcon, label: 'Package Report', path: '/' },
      ],
    },
    {
      Icon: ChatBubbleOutlineOutlinedIcon,
      label: 'Post',
      subMenu: [
        { Icon: ChatBubbleOutlineOutlinedIcon, label: 'Post', path: '/addpost' },
        { Icon: ChatBubbleOutlineOutlinedIcon, label: 'Message Report', path: '/messagedetails' },
      ],
    },
    {
      Icon: AccountCircleIcon,
      label: 'Profile',
      path: '/profile',
    },
  ];

  const handleClick = (event: React.MouseEvent<HTMLElement>, subMenu: MenuItem[]) => {
    if (subMenu) {
      setAnchorEl(event.currentTarget);
      setCurrentMenu(subMenu);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentMenu([]);
  };

  return (
    <div className="flex items-center space-x-4">
      {iconList.map(({ Icon, label, subMenu, path }, index) => (
        <div key={index}>
          <IconButton
            onClick={(e) => (subMenu ? handleClick(e, subMenu) : path ? navigate(path) : undefined)}
            className="hover:bg-gray-100 rounded-full"
            title={label}
          >
            {Icon && <Icon style={{ fontSize: 24, color: "#71045F" }} />}
          </IconButton>
        </div>
      ))}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {currentMenu.map(({ Icon, label, path, onClick }, idx) => (
          <MenuItem
            key={idx}
            onClick={() => {
              handleClose();
              if (path) navigate(path);
              if (onClick) onClick();
            }}
          >
            {Icon && <Icon style={{ marginRight: 8, fontSize: 20}} />}
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default HeaderIcons;
