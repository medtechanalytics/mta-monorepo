
import { Grid, Stack, Typography } from '@mui/material';

import AuthLogout from 'components/auth/AuthLogout';
import AuthWrapper from 'layouts/AuthWrapper';

const Logout = () => (
  <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">Logout</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <AuthLogout />
      </Grid>
    </Grid>
  </AuthWrapper>
);

export default Logout;