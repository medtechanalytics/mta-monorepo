/*
https://github.com/codedthemes/mantis-free-react-admin-template/blob/main/LICENSE
 */

// material-ui
import { Button, Link, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// assets
// import avatar from 'assets/images/users/avatar-group.png';
import AnimateButton from 'components/@extended/AnimateButton';

const NavCard = () => (
  <MainCard sx={{ bgcolor: 'grey.50', m: 3 }}>
    <Stack alignItems="center" spacing={2.5}>
      {/*<CardMedia component="img" image={avatar} sx={{ width: 112 }} />*/}
      <Stack alignItems="center">
        <Typography variant="h5">Contact us</Typography>
        <Typography variant="h6" color="secondary">
          Questions? Comments?
        </Typography>
      </Stack>
      <AnimateButton>
        <Button component={Link} target="_blank" href="https://medtechanalytics.com" variant="contained" color="success"
                size="small">
          Chat
        </Button>
      </AnimateButton>
    </Stack>
  </MainCard>
);

export default NavCard;
