/*
https://github.com/codedthemes/mantis-free-react-admin-template/blob/main/LICENSE
 */

// import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import logo from 'assets/images/auth/MA_Data_1200x900.svg';

const AuthBackground = () => {
  // const theme = useTheme();
  return (
    <Box sx={{ position: 'absolute', filter: 'blur(12px)', zIndex: -1, bottom: '0%', width: '90vw'}}>
      <img src={logo} alt={'Medtech Analytics LLC'}/>
    </Box>
  );
};

export default AuthBackground;