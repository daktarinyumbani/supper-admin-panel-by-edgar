import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  Toolbar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Logo from './Logo';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#ffffff',
    boxShadow: 'none',
    borderBottom: '1px solid #eaeaea',
    zIndex: theme.zIndex.drawer + 1
  },
  toolbar: {
    minHeight: 64
  },
  grow: {
    flexGrow: 1
  },
  iconButton: {
    color: theme.palette.text.primary
  },
  logoLink: {
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none'
  }
}));

const DashboardNavbar = ({ onMobileNavOpen, ...rest }) => {
  const classes = useStyles();
  const [notifications] = useState([]);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <AppBar
      elevation={0}
      position="fixed"
      className={classes.appBar}
      {...rest}
    >
      <Toolbar className={classes.toolbar}>
        <RouterLink to="/" className={classes.logoLink}>
          <Logo width="120px" />
        </RouterLink>

        <Box className={classes.grow} />

        <Hidden lgDown>
          <IconButton
            className={classes.iconButton}
            onClick={() => navigate('/app/settings')}
          >
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <AccountCircleIcon />
            </Badge>
          </IconButton>

          <IconButton
            className={classes.iconButton}
            onClick={logout}
          >
            <InputIcon />
          </IconButton>
        </Hidden>

        <Hidden lgUp>
          <IconButton
            className={classes.iconButton}
            onClick={onMobileNavOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

DashboardNavbar.propTypes = {
  onMobileNavOpen: PropTypes.func
};

DashboardNavbar.defaultProps = {
  onMobileNavOpen: () => {}
};

export default DashboardNavbar;
