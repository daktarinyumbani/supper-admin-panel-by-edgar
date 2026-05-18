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
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined';
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
    background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
    color: '#FFFFFF',
    height: 56,
    width: 56,
    boxShadow: '0 8px 18px rgba(245, 158, 11, 0.28)'
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

const Requests = ({ count, interval }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        <Grid container spacing={2} className={classes.headerRow}>
          <Grid item xs>
            <Typography className={classes.label}>
              Total Requests
            </Typography>

            <Typography variant="h3" className={classes.value}>
              {count}
            </Typography>

            <Typography className={classes.helperText}>
              Appointment and service requests recorded
            </Typography>
          </Grid>

          <Grid item>
            <Avatar className={classes.avatar}>
              <InsertChartIcon fontSize="medium" />
            </Avatar>
          </Grid>
        </Grid>

        <Box className={classes.footer}>
          <TrendingUpIcon className={classes.trendIcon} />
          <Typography className={classes.footerText}>
            Reporting period:
            {' '}
            {interval}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

Requests.propTypes = {
  count: PropTypes.number,
  interval: PropTypes.string
};

Requests.defaultProps = {
  count: 0,
  interval: '30 days'
};

export default Requests;
