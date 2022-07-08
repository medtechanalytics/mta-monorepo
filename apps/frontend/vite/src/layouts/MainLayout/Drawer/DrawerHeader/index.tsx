/*
https://github.com/codedthemes/mantis-free-react-admin-template/blob/main/LICENSE
 */

import PropTypes, { InferProps } from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Chip, Stack } from '@mui/material';

// project import
import DrawerHeaderStyled from './DrawerHeaderStyled';
import Logo from 'components/Logo';


const DrawerHeaderPropTypes = {
  open: PropTypes.bool
};

const DrawerHeader = ({ open }: InferProps<typeof DrawerHeaderPropTypes>) => {
  const theme = useTheme();

  return (
    // only available in paid version
    <DrawerHeaderStyled theme={theme}
                        open={open as boolean}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Logo />
        <Chip
          label={import.meta.env.VITE_APP_VERSION}
          size="small"
          sx={{ height: 16, '& .MuiChip-label': { fontSize: '0.625rem', py: 0.25 } }}
          component="a"
          href="https://medtechanalytics.com"
          target="_blank"
          clickable
        />
      </Stack>
    </DrawerHeaderStyled>
  );
};


export default DrawerHeader;
