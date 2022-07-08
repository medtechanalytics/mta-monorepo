/*
https://github.com/codedthemes/mantis-free-react-admin-template/blob/main/LICENSE
 */

import { useRoutes } from 'react-router-dom';

import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';


const ThemeRoutes = () => {
  return useRoutes([
    MainRoutes,
    LoginRoutes]);
}


export default ThemeRoutes;

