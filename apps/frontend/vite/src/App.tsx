/*
Based on https://github.com/codedthemes/mantis-free-react-admin-template/blob/main/LICENSE
 */


import ThemeRoutes from './routes';
import ThemeCustomization from './themes';
import ScrollTop from 'components/ScrollTop';


const App = () => (
  <ThemeCustomization>
    <ScrollTop>
      <ThemeRoutes />
    </ScrollTop>
  </ThemeCustomization>
);

export default App;
