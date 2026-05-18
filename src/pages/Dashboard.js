import { useEffect, useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import {
  Box,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Doctors from 'src/components/dashboard/Doctors';
import Sales from 'src/components/dashboard/Sales';
import Requests from 'src/components/dashboard/Requests';
import TotalCustomers from 'src/components/dashboard/TotalCustomers';
import Ambulances from 'src/components/dashboard/Ambulances';
import LatestOrders from 'src/components/dashboard/LatestOrders';
import LatestProducts from 'src/components/dashboard/LatestProducts';
import TrafficByDevice from 'src/components/dashboard/TrafficByDevice';
import { makePostRequest } from 'src/services/httpservice';

const useStyles = makeStyles((theme) => ({
  page: {
    backgroundColor: '#F4F8FB',
    minHeight: '100vh',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(4)
  },
  headerCard: {
    borderRadius: 16,
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
    border: '1px solid rgba(15, 23, 42, 0.06)',
    background:
      'linear-gradient(135deg, #0F766E 0%, #155E75 55%, #1E3A8A 100%)',
    color: '#FFFFFF'
  },
  headerContent: {
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(4)
    }
  },
  headerTopRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  },
  titleBlock: {
    maxWidth: 760
  },
  title: {
    fontWeight: 700,
    letterSpacing: -0.3
  },
  subtitle: {
    marginTop: theme.spacing(1),
    color: 'rgba(255,255,255,0.84)',
    lineHeight: 1.7
  },
  periodCard: {
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.18)',
    minWidth: 220
  },
  periodCardInner: {
    padding: theme.spacing(2)
  },
  filterLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  selectRoot: {
    width: '100%',
    minWidth: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 10
  },
  statsStrip: {
    marginTop: theme.spacing(3),
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))'
    }
  },
  statBox: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: 14,
    padding: theme.spacing(2)
  },
  statLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 700,
    marginTop: theme.spacing(0.5)
  },
  sectionSpacing: {
    marginTop: theme.spacing(3)
  },
  sectionHeader: {
    marginBottom: theme.spacing(2)
  },
  sectionTitle: {
    fontWeight: 700,
    color: '#0F172A'
  },
  sectionText: {
    color: '#64748B',
    marginTop: theme.spacing(0.5)
  },
  messageCard: {
    borderRadius: 14,
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
    border: '1px solid rgba(15, 23, 42, 0.06)'
  },
  loadingText: {
    color: '#0F766E',
    fontWeight: 600
  },
  errorText: {
    color: '#B91C1C',
    fontWeight: 600
  },
  chartCard: {
    borderRadius: 16,
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
    border: '1px solid rgba(15, 23, 42, 0.06)',
    backgroundColor: '#FFFFFF'
  },
  chartHeader: {
    padding: theme.spacing(2.5, 3, 2)
  }
}));

const availableTimeSlots = [
  { name: 'Today', value: '24', unit: 'hours' },
  { name: 'Last 7 days', value: '7', unit: 'days' },
  { name: '30 days', value: '30', unit: 'days' },
  { name: '3 months', value: '3', unit: 'months' },
  { name: '6 months', value: '6', unit: 'months' },
  { name: '1 year', value: '1', unit: 'year' }
];

const Dashboard = () => {
  const classes = useStyles();
  const [summary, setSummary] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [interval, setIntervalState] = useState({
    name: '30 days',
    value: '30',
    unit: 'days'
  });

  const [intervalUnit, setIntervalUnit] = useState('day');
  const [startDate, setStartDate] = useState(
    moment().subtract(30, 'days').format()
  );

  const updateReportTimes = (event) => {
    const selected = availableTimeSlots.find(
      (slot) => slot.value === event.target.value
    );

    if (!selected) {
      return;
    }

    setIntervalState(selected);
    setIntervalUnit(selected.name === 'Today' ? 'hour' : 'day');

    if (selected.name === 'Today') {
      setStartDate(moment().startOf('day').format());
    } else {
      setStartDate(moment().subtract(selected.value, selected.unit).format());
    }
  };

  const normalizeSummaryResponse = (responseJson) => {
    if (!responseJson) {
      return null;
    }

    if (responseJson.summary) {
      return responseJson.summary;
    }

    if (
      responseJson.data
      && responseJson.data.summary
    ) {
      return responseJson.data.summary;
    }

    if (responseJson.data) {
      return responseJson.data;
    }

    return null;
  };

  const getSummary = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');
    setSummary(null);

    try {
      const body = {
        from: startDate,
        to: moment().format(),
        unit: intervalUnit
      };

      const responseJson = await makePostRequest(
        'admin/reports/summary',
        body
      );

      const summaryData = normalizeSummaryResponse(responseJson);

      if (summaryData) {
        setSummary(summaryData);
      } else {
        // eslint-disable-next-line no-console
        console.warn('Unexpected dashboard summary response:', responseJson);
        setErrorMessage('Dashboard summary returned invalid data.');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching dashboard summary:', error);

      let apiMessage = 'Failed to fetch dashboard summary.';

      if (
        error
        && error.response
        && error.response.data
        && (error.response.data.message || error.response.data.error)
      ) {
        apiMessage = error.response.data.message || error.response.data.error;
      } else if (error && error.message) {
        apiMessage = error.message;
      }

      setErrorMessage(apiMessage);
    } finally {
      setLoading(false);
    }
  }, [startDate, intervalUnit]);

  useEffect(() => {
    getSummary();
  }, [getSummary]);

  const dateRangeLabel = useMemo(
    () => `${moment(startDate).format('DD MMM YYYY')} - ${moment().format(
      'DD MMM YYYY'
    )}`,
    [startDate]
  );

  return (
    <>
      <Helmet>
        <title>Dashboard | Daktari Nyumbani</title>
      </Helmet>

      <Box className={classes.page}>
        <Container maxWidth={false}>
          <Card className={classes.headerCard}>
            <CardContent className={classes.headerContent}>
              <Box className={classes.headerTopRow}>
                <Box className={classes.titleBlock}>
                  <Typography variant="h4" className={classes.title}>
                    Appointment Operations Dashboard
                  </Typography>
                  <Typography variant="body1" className={classes.subtitle}>
                    Monitor providers, ambulances, patient activity and request
                    trends from one place with a clean healthcare-focused
                    overview.
                  </Typography>
                </Box>

                <Box className={classes.periodCard}>
                  <Box className={classes.periodCardInner}>
                    <Typography className={classes.filterLabel}>
                      Reporting period
                    </Typography>
                    <FormControl
                      variant="outlined"
                      size="small"
                      className={classes.selectRoot}
                    >
                      <Select
                        value={interval.value}
                        onChange={updateReportTimes}
                      >
                        {availableTimeSlots.map((slot) => (
                          <MenuItem key={slot.value} value={slot.value}>
                            {slot.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Box>

              <Box className={classes.statsStrip}>
                <Box className={classes.statBox}>
                  <Typography className={classes.statLabel}>
                    Selected range
                  </Typography>
                  <Typography variant="h6" className={classes.statValue}>
                    {interval.name}
                  </Typography>
                </Box>

                <Box className={classes.statBox}>
                  <Typography className={classes.statLabel}>
                    From
                  </Typography>
                  <Typography variant="h6" className={classes.statValue}>
                    {moment(startDate).format('DD MMM')}
                  </Typography>
                </Box>

                <Box className={classes.statBox}>
                  <Typography className={classes.statLabel}>
                    To
                  </Typography>
                  <Typography variant="h6" className={classes.statValue}>
                    {moment().format('DD MMM')}
                  </Typography>
                </Box>

                <Box className={classes.statBox}>
                  <Typography className={classes.statLabel}>
                    Timeline
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ color: '#FFFFFF', fontWeight: 600, marginTop: 6 }}
                  >
                    {dateRangeLabel}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Box className={classes.sectionSpacing}>
            <Box className={classes.sectionHeader}>
              <Typography variant="h5" className={classes.sectionTitle}>
                Care Delivery Overview
              </Typography>
              <Typography variant="body2" className={classes.sectionText}>
                Key operational indicators for appointments, ambulances,
                providers and patient activity.
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {loading && (
                <Grid item xs={12}>
                  <Card className={classes.messageCard}>
                    <CardContent>
                      <Typography className={classes.loadingText}>
                        Loading dashboard summary...
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {!loading && errorMessage && (
                <Grid item xs={12}>
                  <Card className={classes.messageCard}>
                    <CardContent>
                      <Typography className={classes.errorText}>
                        {errorMessage}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {!loading && summary && (
                <>
                  <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                    <Doctors count={summary.serviceProvidersCount || 0} />
                  </Grid>

                  <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                    <Ambulances count={summary.ambulancesCount || 0} />
                  </Grid>

                  <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                    <TotalCustomers count={summary.usersCount || 0} />
                  </Grid>

                  <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                    <Requests
                      count={summary.requestsCount || 0}
                      interval={interval.name}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Sales
                      serviceRequestsTrend={summary.serviceRequestsTrend || []}
                      ambulanceRequestsTrend={
                        summary.ambulanceRequestsTrend || []
                      }
                      interval={interval.name}
                    />
                  </Grid>

                  <Grid item lg={8} md={12} xs={12}>
                    <LatestOrders />
                  </Grid>

                  <Grid item lg={4} md={6} xs={12}>
                    <TrafficByDevice />
                  </Grid>

                  <Grid item lg={4} md={6} xs={12}>
                    <LatestProducts />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
