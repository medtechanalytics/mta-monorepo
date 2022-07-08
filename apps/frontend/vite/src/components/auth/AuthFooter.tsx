/*
https://github.com/codedthemes/mantis-free-react-admin-template/blob/main/LICENSE
 */

import { useTheme } from '@mui/material/styles';
import { Container, Link, Stack, Typography, useMediaQuery } from '@mui/material';


const AuthFooter = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="xl">
      <Stack
        direction={matchDownSM ? 'column' : 'row'}
        justifyContent={matchDownSM ? 'center' : 'space-between'}
        spacing={2}
        textAlign={matchDownSM ? 'center' : 'inherit'}
      >
        <Typography variant="subtitle2" color="secondary" component="span">
          &copy; &nbsp;
          <Typography component={Link} variant="subtitle2" href="https://www.medtechanalytics.com" target="_blank"
                      underline="hover">
            MedTech Analytics
          </Typography>
        </Typography>

        <Stack
          direction={matchDownSM ? 'column' : 'row'}
          spacing={matchDownSM ? 1 : 3}
          textAlign={matchDownSM ? 'center' : 'inherit'}
        >

          <Typography
            variant="subtitle2"
            color="secondary"
            component={Link}
            // href="https://"
            target="_blank"
            underline="hover"
          >
            Privacy Policy
          </Typography>
          <Typography
            variant="subtitle2"
            color="secondary"
            component={Link}
            // href=""
            target="_blank"
            underline="hover"
          >
            Support
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
};

export default AuthFooter;