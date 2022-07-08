/*
Based on https://github.com/codedthemes/mantis-free-react-admin-template/blob/main/LICENSE
 */
// assets
import { LogoutOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
  LogoutOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const user = {
  id: 'authentication',
  title: 'User',
  type: 'group',
  children: [
    {
      id: 'profile',
      title: 'Profile',
      type: 'item',
      url: '/profile',
      icon: icons.ProfileOutlined,
      target: false
    },
    {
      id: 'logout',
      title: 'Logout',
      type: 'item',
      url: '/logout',
      icon: icons.LogoutOutlined,
      target: false
    }
  ]
};

export default user;