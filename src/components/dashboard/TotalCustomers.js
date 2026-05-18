import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

const useStyles = makeStyles((theme) => ({
  card: {
    height: '100%',
    borderRadius: 16,
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)',
    border: '1px solid rgba(15, 23, 42, 0.06)'
  },
  content: {
    padding: theme.spacing(3)
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: theme.spacing(1)
  },
  value: {
    color: '#0F172A',
    fontWeight: 700,
    lineHeight: 1.2
  },
  helperText: {
    color: '#94A3B8',
    marginTop: theme.spacing(0.75),
    fontSize: 13
  },
  avatar: {
    background: 'linear-gradient(135deg, #16A34A 0%, #22C55E 100%)',
    color: '#FFFFFF',
    height: 56,
    width: 56,
    boxShadow: '0 8px 18px rgba(34, 197, 94, 0.28)'
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2)
  },
  trendIcon: {
    color: '#16A34A',
    fontSize: 18,
    marginRight: theme.spacing(0.5)
  },
  footerText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: 500
  }
}));

const TotalCustomers = ({ count }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        <Grid container spacing={2} className={classes.headerRow}>
          <Grid item xs>
            <Typography className={classes.label}>
              Total Users
            </Typography>

            <Typography variant="h3" className={classes.value}>
              {count}
            </Typography>

            <Typography className={classes.helperText}>
              Registered patients and platform users
            </Typography>
          </Grid>

          <Grid item>
            <Avatar className={classes.avatar}>
              <PeopleIcon fontSize="medium" />
            </Avatar>
          </Grid>
        </Grid>

        <Box className={classes.footer}>
          <TrendingUpIcon className={classes.trendIcon} />
          <Typography className={classes.footerText}>
            Community growth overview
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

TotalCustomers.propTypes = {
  count: PropTypes.number
};

TotalCustomers.defaultProps = {
  count: 0
};

export default TotalCustomers;
