// material-ui
import { Grid } from '@mui/material';

// project import
import ProfileEditor from "../../components/user/ProfileEditor"

// ==============================|| SAMPLE PAGE ||============================== //

const ProfilePage = () => {
  return <>
    <Grid container direction="column" justifyContent="flex-end">
      <Grid item xs={12} sx={{ m: { xs: 1, sm: 3 }, mt: { xs: 1, sm: 3 } }}>
        <ProfileEditor />
      </Grid>
    </Grid>
  </>
};

export default ProfilePage;