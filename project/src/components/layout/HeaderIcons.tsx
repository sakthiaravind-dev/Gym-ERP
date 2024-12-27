import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import StyleIcon from '@mui/icons-material/Style';
import BarChartIcon from '@mui/icons-material/BarChart';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const iconList = [
  { Icon: PersonAddIcon, label: 'Add Member', subMenu: [
      { Icon: PersonAddIcon, label: 'Add Member', path: '/addmember' },
      { Icon: PersonAddIcon, label: 'Add Staff', path: '/addstaff' },
      { Icon: PersonAddIcon, label: 'Add Enquiry', path: '/addlead' },
    ] },
  { Icon: CreditCardIcon, label: 'Pay Bill', subMenu: [
    { Icon: CreditCardIcon, label: 'Renewal', path: '/renewal' },
    { Icon: CreditCardIcon, label: 'Add Addon Bill', path: '/' },
    { Icon: CreditCardIcon, label: 'Supplement Bill', path: '/supplementbill' },
    { Icon: CreditCardIcon, label: 'Add Expense', path: '/addexpense' }
  ]  },
  { Icon: LiveHelpIcon, label: 'FAQ', subMenu: [
    { Icon: LiveHelpIcon, label: 'FAQ', path: '/' },
    { Icon: LiveHelpIcon, label: 'Tutorial', path: '/' } 
]},
  { Icon: FitnessCenterIcon, label: 'Assign', subMenu: [
    { Icon: FitnessCenterIcon, label: 'Personal-Diet', path: '/addmember' },
    { Icon: FitnessCenterIcon, label: 'Common-Diet', path: '/addstaff' },
    { Icon: FitnessCenterIcon, label: 'Workout', path: '/addlead' },
  ]},
  { Icon: StyleIcon, label: 'Offers & Events', subMenu: [
    { Icon: StyleIcon, label: 'Package', path: '/addpackage' },
    { Icon: StyleIcon, label: 'Add-on Package', path: '/addstaff' },
    { Icon: StyleIcon, label: 'Events', path: '/event' },
    { Icon: StyleIcon, label: 'Offers', path: '/offer' },
    { Icon: StyleIcon, label: 'Booking Slot', path: '/addstaff' },
    { Icon: StyleIcon, label: 'Add Service', path: '/service' },
  ]},
  { Icon: BarChartIcon, label: 'Reports', subMenu: [
    { Icon: BarChartIcon, label: 'Income and Expense Report', path: '/renewal' },
    { Icon: BarChartIcon, label: 'Income Report', path: '/' },
    { Icon: BarChartIcon, label: 'Transaction Report', path: '/supplementbill' },
    { Icon: BarChartIcon, label: 'Package Report', path: '/addexpense' }
  ] },
  { Icon: ChatBubbleOutlineOutlinedIcon, label: 'Post', subMenu: [
    { Icon: ChatBubbleOutlineOutlinedIcon, label: 'Post', path: '/renewal' },
    { Icon: ChatBubbleOutlineOutlinedIcon, label: 'Campaign', path: '/' },
    { Icon: ChatBubbleOutlineOutlinedIcon, label: 'Message Report', path: '/supplementbill' },
    { Icon: ChatBubbleOutlineOutlinedIcon, label: 'Chat', path: '/addexpense' }
  ] },
  { Icon: AccountCircleIcon, label: 'Profile', path: '/profile' },
];

const HeaderIcons: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentMenu, setCurrentMenu] = useState<any[]>([]);


  const handleClick = (event: React.MouseEvent<HTMLElement>, subMenu: any) => {
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
      {iconList.map(({ Icon, label, subMenu }, index) => (
        <div key={index}>
          <IconButton
            onClick={(e) => handleClick(e, subMenu)}
            className="hover:bg-gray-100 rounded-full"
            title={label}
          >
            <Icon fontSize="medium" style={{ color: '#810474' }} />
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
        {currentMenu.map(({ Icon, label, path }, idx) => (
          <MenuItem
            key={idx}
            onClick={handleClose}
            component={Link}
            to={path}
          >
            <ListItemIcon>
              <Icon fontSize="small" style={{ color: '#d58b05' }} />
            </ListItemIcon>
            <ListItemText primary={label} />
          </MenuItem>
        ))}

      </Menu>
    </div>
  );
};

export default HeaderIcons;