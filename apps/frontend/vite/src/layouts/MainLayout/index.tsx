/*
https://github.com/codedthemes/mantis-free-react-admin-template/blob/main/LICENSE
 */

import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Toolbar, useMediaQuery } from '@mui/material';

// project import
import Drawer from './Drawer';
import Header from './Header';
import { useRecoilState } from "recoil"
import { menuState } from "store/atoms"

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('md'));

  const [menu, setMenu] = useRecoilState(menuState)
  const { drawerOpen } = menu

  const setDrawerOpen = (val: boolean) => {
    setMenu((m) => ({
        ...m,
        drawerOpen: val
      })
    )
  }

  // drawer toggler
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  };

  // set media wise responsive drawer
  useEffect(() => {
    setDrawerOpen(!matchDownLG);
  }, [matchDownLG]);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header open={drawerOpen} handleDrawerToggle={handleDrawerToggle} />
      <Drawer open={drawerOpen} handleDrawerToggle={handleDrawerToggle} />
      <Box component="main" sx={{ width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar />
        {/*<Breadcrumbs navigation={navigation} title titleBottom card={false} divider={false} />*/}
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
