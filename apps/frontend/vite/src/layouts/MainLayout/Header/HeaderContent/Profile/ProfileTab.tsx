/*
https://github.com/codedthemes/mantis-free-react-admin-template/blob/main/LICENSE
 */

import PropTypes, { InferType } from 'prop-types';
import React, { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
import { EditOutlined, LogoutOutlined, ProfileOutlined, UserOutlined, WalletOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom"

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //
const ProfileTabPropTypes = {
  handleLogout: PropTypes.func
};

const ProfileTab = ({ handleLogout }: InferType<typeof ProfileTabPropTypes>) => {
  const theme = useTheme();
  const navigate = useNavigate()

  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleListItemClick = (event: React.MouseEvent, index: number) => {
    setSelectedIndex(index);
    switch (index) {
      case 0:
        console.log("Navigate to profile")
        navigate('/profile')
        break;
    }
  };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
      <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
        <ListItemIcon>
          <EditOutlined />
        </ListItemIcon>
        <ListItemText primary="View/Edit Profile" />
      </ListItemButton>
      {/*<ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>*/}
      {/*  <ListItemIcon>*/}
      {/*    <UserOutlined />*/}
      {/*  </ListItemIcon>*/}
      {/*  <ListItemText primary="View Profile" />*/}
      {/*</ListItemButton>*/}
      {/**/}
      {/*<ListItemButton selected={selectedIndex === 3} onClick={(event) => handleListItemClick(event, 3)}>*/}
      {/*  <ListItemIcon>*/}
      {/*    <ProfileOutlined />*/}
      {/*  </ListItemIcon>*/}
      {/*  <ListItemText primary="Social Profile" />*/}
      {/*</ListItemButton>*/}
      <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
        <ListItemIcon>
          <WalletOutlined />
        </ListItemIcon>
        <ListItemText primary="Billing" />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 2} onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
};

ProfileTab.propTypes = ProfileTabPropTypes

export default ProfileTab;
