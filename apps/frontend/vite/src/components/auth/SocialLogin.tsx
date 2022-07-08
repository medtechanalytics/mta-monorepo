// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Button, Stack } from '@mui/material';

// assets
import Google from 'assets/images/icons/google.svg';

// ==============================|| FIREBASE - SOCIAL BUTTON ||============================== //

const SocialLogin = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const googleHandler = async () => {
    window.location.href = `https://${import.meta.env.VITE_COGNITO_DOMAIN}/oauth2/authorize?identity_provider=Google&response_type=code&client_id=${import.meta.env.VITE_COGNITO_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_COGNITO_CALLBACK}/oauth`
  };


  return (
    <Stack
      direction="row"
      spacing={matchDownSM ? 1 : 2}
      justifyContent={matchDownSM ? 'space-around' : 'space-between'}
      sx={{ '& .MuiButton-startIcon': { mr: matchDownSM ? 0 : 1, ml: matchDownSM ? 0 : -0.5 } }}
    >
      <Button
        variant="outlined"
        color="secondary"
        fullWidth={!matchDownSM}
        startIcon={<img src={Google} alt="Google" />}
        onClick={googleHandler}
      >
        {!matchDownSM && 'Google'}
      </Button>
    </Stack>
  );
};

export default SocialLogin;
