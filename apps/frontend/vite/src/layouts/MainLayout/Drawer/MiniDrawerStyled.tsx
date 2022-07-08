/*
https://github.com/codedthemes/mantis-free-react-admin-template/blob/main/LICENSE
 */

// material-ui
import { styled, Theme } from '@mui/material/styles';
import Drawer, { DrawerProps } from '@mui/material/Drawer';

// project import
import { drawerWidth } from 'config';
import { StyledComponent } from "@emotion/styled"

const openedMixin = (theme: Theme) => ({
  width: drawerWidth,
  borderRight: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden',
  boxShadow: 'none'
});

const closedMixin = (theme: any) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: 0,
  borderRight: 'none',
  boxShadow: theme.customShadows.z1
});

// ==============================|| DRAWER - MINI STYLED ||============================== //

const MiniDrawerStyled = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open'
})<{ open: boolean }>(
  ({ theme, open }) => (
    {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme)
      }),
      ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme)
      })
    }
  ) as unknown as StyledComponent<DrawerProps, any, any>
);

export default MiniDrawerStyled;
