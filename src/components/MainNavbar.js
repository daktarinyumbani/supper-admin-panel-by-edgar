import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Logo from './Logo';

const useStyles = makeStyles(() => ({
  appBar: {
    boxShadow: 'none'
  },
  toolbar: {
    minHeight: 64
  },
  logoLink: {
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none'
  }
}));

const MainNavbar = (props) => {
  const classes = useStyles();

  return (
    <AppBar elevation={0} className={classes.appBar} {...props}>
      <Toolbar className={classes.toolbar}>
        <RouterLink to="/" className={classes.logoLink}>
          <Logo />
        </RouterLink>
      </Toolbar>
    </AppBar>
  );
};

export default MainNavbar;
