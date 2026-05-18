import 'react-perfect-scrollbar/dist/css/styles.css';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import useToken from './hooks/useToken';
import useSettings from './hooks/useSettings';

const AppRoutes = () => {
  const { token, setToken } = useToken();
  const { settings, setSettings } = useSettings();

  return useRoutes(routes(token, setToken, settings, setSettings));
};

const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <AppRoutes />
  </ThemeProvider>
);

export default App;
