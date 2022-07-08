/*
Based on
https://github.com/codedthemes/mantis-free-react-admin-template/blob/main/LICENSE
 */

import { Box, List, Typography } from '@mui/material';
import { useRecoilState } from "recoil"
import { menuState } from "store/atoms"
import NavItem from "./NavItem"

// ==============================|| NAVIGATION - LIST GROUP ||============================== //

interface MenuItemTypes {
  id: string
  type: string
}

interface NavGroupType {
  item: {
    title: string
    id: string;
    type: string;
    url: string;
    breadcrumbs: boolean;
    children?: MenuItemTypes[]
  }
}

const NavGroup = ({ item }: NavGroupType) => {
  const [menu] = useRecoilState(menuState)
  const { drawerOpen } = menu;

  const navCollapse = item.children?.map((menuItem: MenuItemTypes) => {
    switch (menuItem.type) {
      case 'collapse':
        return (
          <Typography key={menuItem.id} variant="caption" color="error" sx={{ p: 2.5 }}>
            collapse - only available in paid version
          </Typography>
        );
      case 'item':
        return <NavItem key={menuItem.id} item={menuItem} level={1} />;
      default:
        return (
          <Typography key={menuItem.id} variant="h6" color="error" align="center">
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  });

  return (
    <List
      subheader={
        item.title &&
        drawerOpen && (
          <Box sx={{ pl: 3, mb: 0.5, mt: 1.5 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {item.title}
            </Typography>
            {/* only available in paid version */}
          </Box>
        )
      }
      sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  );
};

export default NavGroup;
