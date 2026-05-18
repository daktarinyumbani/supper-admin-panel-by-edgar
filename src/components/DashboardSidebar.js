import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Drawer,
  Hidden,
  List,
  Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  BarChart as BarChartIcon,
  Inbox as InboxIcon,
  PlusSquare as PlusSquareIcon,
  MapPin as BusinessIcon,
  Users as UsersIcon,
  FileText as FileTextIcon,
  User as UserIcon,
  Edit as EditIcon
} from 'react-feather';
import NavItem from './NavItem';

const drawerWidth = 256;

const useStyles = makeStyles(() => ({
  mobileDrawerPaper: {
    width: drawerWidth
  },
  desktopDrawerPaper: {
    width: drawerWidth,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  listWrapper: {
    padding: 16
  },
  grow: {
    flexGrow: 1
  },
  blogButton: {
    color: 'inherit',
    fontWeight: 500,
    justifyContent: 'flex-start',
    letterSpacing: 0,
    paddingTop: 10,
    paddingBottom: 10,
    textTransform: 'none',
    width: '100%'
  },
  blogLink: {
    display: 'flex',
    alignItems: 'center',
    color: 'inherit',
    textDecoration: 'none',
    width: '100%'
  },
  blogIcon: {
    marginRight: 8
  }
}));

const items = [
  { href: '/app/dashboard', icon: BarChartIcon, title: 'Dashboard' },
  { href: '/app/requests', icon: InboxIcon, title: 'Requests' },
  { href: '/app/users', icon: UsersIcon, title: 'Users' },
  { href: '/app/service-providers', icon: PlusSquareIcon, title: 'Service Providers' },
  { href: '/app/ambulances', icon: PlusSquareIcon, title: 'Ambulances' },
  { href: '/app/businesses', icon: BusinessIcon, title: 'Pharmacy/Insurance' },
  { href: '/app/products', icon: InboxIcon, title: 'Products' },
  { href: '/app/generics', icon: FileTextIcon, title: 'Generics' },
  { href: '/app/settings', icon: UserIcon, title: 'Profile' }
];

const DashboardSidebar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname, onMobileClose, openMobile]);

  const content = (
    <Box className={classes.content}>
      <Box className={classes.listWrapper}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}

          <Button className={classes.blogButton}>
            <a
              href="https://blog.daktarinyumbani.or.tz/wp-admin"
              target="_blank"
              rel="noreferrer"
              className={classes.blogLink}
            >
              <EditIcon size={18} className={classes.blogIcon} />
              <span>Blog</span>
            </a>
          </Button>
        </List>
      </Box>

      <Box className={classes.grow} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            className: classes.mobileDrawerPaper
          }}
        >
          {content}
        </Drawer>
      </Hidden>

      <Hidden lgDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            className: classes.desktopDrawerPaper
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

DashboardSidebar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default DashboardSidebar;
