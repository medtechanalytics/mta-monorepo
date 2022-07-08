
import { Link } from 'react-router-dom';

import { Grid, Stack, Typography } from '@mui/material';

import AuthForgotPassword from 'components/auth/AuthForgotPassword';
import AuthWrapper from 'layouts/AuthWrapper';

const Verify = () => (
  <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">Forgot Password</Typography>
          <Typography component={Link} to="/register" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
            Don&apos;t have an account?
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <AuthForgotPassword />
      </Grid>
    </Grid>
  </AuthWrapper>
);

export default Verify;