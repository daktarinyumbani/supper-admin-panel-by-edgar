import {
  NavLink as RouterLink,
  matchPath,
  useLocation
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  listItem: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: theme.palette.text.secondary,
    fontWeight: 500,
    justifyContent: 'flex-start',
    letterSpacing: 0,
    paddingTop: 10,
    paddingBottom: 10,
    textTransform: 'none',
    width: '100%'
  },
  activeButton: {
    color: theme.palette.primary.main
  },
  icon: {
    marginRight: theme.spacing(1)
  }
}));

const NavItem = ({
  href,
  icon: Icon,
  title,
  ...rest
}) => {
  const classes = useStyles();
  const location = useLocation();

  const active = href
    ? !!matchPath(
      {
        path: href,
        end: false
      },
      location.pathname
    )
    : false;

  return (
    <ListItem disableGutters className={classes.listItem} {...rest}>
      <Button
        component={RouterLink}
        to={href}
        className={`${classes.button} ${active ? classes.activeButton : ''}`}
      >
        {Icon ? <Icon size={20} className={classes.icon} /> : null}
        <span>{title}</span>
      </Button>
    </ListItem>
  );
};

NavItem.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string
};

NavItem.defaultProps = {
  href: '',
  icon: null,
  title: ''
};

export default NavItem;
