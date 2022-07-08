
import { Link } from 'react-router-dom';

import { Grid, Stack, Typography } from '@mui/material';

import AuthVerify from 'components/auth/AuthVerify';
import AuthWrapper from 'layouts/AuthWrapper';

const Verify = () => (
  <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">Verify Account</Typography>
          <Typography component={Link} to="/request-verify" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
            Didn&apos;t get a code?
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <AuthVerify />
      </Grid>
    </Grid>
  </AuthWrapper>
);

export default Verify;