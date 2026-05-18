import { useState } from 'react';
import {
  Outlet,
  Link as RouterLink,
  useLocation,
  useNavigate
} from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import Logo from './Logo';

const drawerWidth = 256;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f4f6f8'
  },
  appBar: {
    backgroundColor: '#104da2',
    boxShadow: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    zIndex: theme.zIndex.drawer + 1
  },
  toolbar: {
    minHeight: 64,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between'
  },
  leftHeader: {
    display: 'flex',
    alignItems: 'center'
  },
  menuButton: {
    color: '#ffffff',
    marginRight: theme.spacing(1)
  },
  logoLink: {
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none'
  },
  rightHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
  },
  profileButton: {
    color: '#ffffff',
    borderColor: 'rgba(255,255,255,0.25)'
  },
  logoutButton: {
    color: '#ffffff',
    backgroundColor: '#6D28D9'
  },
  mobileDrawerPaper: {
    width: drawerWidth,
    backgroundColor: '#111827',
    color: '#ffffff'
  },
  desktopDrawerPaper: {
    width: drawerWidth,
    top: 64,
    height: 'calc(100% - 64px)',
    backgroundColor: '#111827',
    color: '#ffffff',
    borderRight: '1px solid rgba(255,255,255,0.08)'
  },
  drawerContent: {
    height: '100%',
    padding: theme.spacing(2)
  },
  navList: {
    padding: 0
  },
  navLink: {
    display: 'block',
    textDecoration: 'none',
    marginBottom: theme.spacing(1)
  },
  navItem: {
    padding: '12px 14px',
    borderRadius: 8,
    color: '#ffffff',
    fontWeight: 500
  },
  navItemActive: {
    backgroundColor: '#6D28D9',
    color: '#ffffff',
    fontWeight: 700
  },
  blogBox: {
    padding: '12px 14px',
    borderRadius: 8,
    color: '#ffffff',
    fontWeight: 500,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginTop: theme.spacing(2)
  },
  contentWrapper: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  toolbarSpacer: {
    minHeight: 64
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    [theme.breakpoints.up('lg')]: {
      marginLeft: drawerWidth
    }
  }
}));

const navItems = [
  { href: '/app/dashboard', title: 'Dashboard' },
  { href: '/app/requests', title: 'Requests' },
  { href: '/app/users', title: 'Users' },
  { href: '/app/service-providers', title: 'Service Providers' },
  { href: '/app/ambulances', title: 'Ambulances' },
  { href: '/app/businesses', title: 'Pharmacy/Insurance' },
  { href: '/app/products', title: 'Products' },
  { href: '/app/generics', title: 'Generics' },
  { href: '/app/settings', title: 'Profile' }
];

const DashboardLayout = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  const renderNav = () => (
    <Box className={classes.drawerContent}>
      <List className={classes.navList}>
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.href);

          return (
            <RouterLink
              key={item.href}
              to={item.href}
              className={classes.navLink}
              onClick={() => setMobileOpen(false)}
            >
              <ListItem
                button
                className={`${classes.navItem} ${
                  active ? classes.navItemActive : ''
                }`}
              >
                <Typography variant="body2">{item.title}</Typography>
              </ListItem>
            </RouterLink>
          );
        })}
      </List>

      <a
        href="https://myweb.admindaktarinyumbani.org/"
        target="_blank"
        rel="noreferrer"
        style={{ textDecoration: 'none' }}
      >
        <Box className={classes.blogBox}>
          <Typography variant="body2">Blog</Typography>
        </Box>
      </a>
    </Box>
  );

  return (
    <Box className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Box className={classes.leftHeader}>
            <Hidden lgUp>
              <IconButton
                edge="start"
                className={classes.menuButton}
                onClick={() => setMobileOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>

            <RouterLink to="/app/dashboard" className={classes.logoLink}>
              <Logo width="140px" />
            </RouterLink>
          </Box>

          <Box className={classes.rightHeader}>
            <Hidden mdDown>
              <Button
                variant="outlined"
                className={classes.profileButton}
                onClick={() => navigate('/app/settings')}
              >
                Profile
              </Button>
            </Hidden>

            <Button
              variant="contained"
              className={classes.logoutButton}
              onClick={logout}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Hidden lgUp>
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          variant="temporary"
          PaperProps={{
            className: classes.mobileDrawerPaper
          }}
        >
          {renderNav()}
        </Drawer>
      </Hidden>

      <Hidden mdDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            className: classes.desktopDrawerPaper
          }}
        >
          {renderNav()}
        </Drawer>
      </Hidden>

      <Box className={classes.contentWrapper}>
        <div className={classes.toolbarSpacer} />
        <Box className={classes.content}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
