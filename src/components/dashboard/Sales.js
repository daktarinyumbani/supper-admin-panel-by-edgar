import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  useTheme
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: 16,
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)',
    border: '1px solid rgba(15, 23, 42, 0.06)',
    overflow: 'hidden'
  },
  headerRoot: {
    padding: theme.spacing(2.5, 3)
  },
  headerTitle: {
    fontWeight: 700,
    color: '#0F172A'
  },
  headerSubTitle: {
    color: '#64748B',
    fontSize: 13,
    marginTop: theme.spacing(0.5)
  },
  chartWrap: {
    height: 380,
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      height: 300
    }
  }
}));

const normalizeTrendData = (records) => {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((item) => ({
    date: item && item.date ? item.date : '',
    count: item && item.count ? item.count : 0
  }));
};

const Sales = ({
  serviceRequestsTrend,
  ambulanceRequestsTrend,
  interval
}) => {
  const classes = useStyles();
  const theme = useTheme();

  const normalizedServiceTrend = normalizeTrendData(serviceRequestsTrend);
  const normalizedAmbulanceTrend = normalizeTrendData(ambulanceRequestsTrend);

  const labels = normalizedServiceTrend.map((record) => record.date);
  const serviceRequestsData = normalizedServiceTrend.map((record) => record.count);
  const ambulanceRequestsData = normalizedAmbulanceTrend.map((record) => record.count);

  const data = {
    labels,
    datasets: [
      {
        label: 'Service Requests',
        data: serviceRequestsData,
        backgroundColor: '#0F766E',
        hoverBackgroundColor: '#115E59',
        borderRadius: 8,
        barThickness: 14,
        maxBarThickness: 18
      },
      {
        label: 'Ambulance Requests',
        data: ambulanceRequestsData,
        backgroundColor: '#60A5FA',
        hoverBackgroundColor: '#2563EB',
        borderRadius: 8,
        barThickness: 14,
        maxBarThickness: 18
      }
    ]
  };

  const options = {
    animation: false,
    maintainAspectRatio: false,
    responsive: true,
    layout: {
      padding: 0
    },
    legend: {
      display: true,
      position: 'top',
      labels: {
        fontColor: theme.palette.text.primary,
        boxWidth: 12,
        padding: 16
      }
    },
    scales: {
      xAxes: [
        {
          barPercentage: 0.6,
          categoryPercentage: 0.6,
          ticks: {
            fontColor: theme.palette.text.secondary
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            min: 0,
            precision: 0,
            fontColor: theme.palette.text.secondary
          },
          gridLines: {
            color: '#E2E8F0',
            drawBorder: false,
            zeroLineColor: '#E2E8F0',
            borderDash: [3, 3],
            zeroLineBorderDash: [3, 3]
          }
        }
      ]
    },
    tooltips: {
      enabled: true,
      intersect: false,
      mode: 'index',
      backgroundColor: '#FFFFFF',
      titleFontColor: '#0F172A',
      bodyFontColor: '#475569',
      borderColor: '#E2E8F0',
      borderWidth: 1,
      footerFontColor: '#475569'
    }
  };

  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.headerRoot}
        title={(
          <Typography variant="h6" className={classes.headerTitle}>
            Request Trend Overview
          </Typography>
        )}
        subheader={(
          <Typography className={classes.headerSubTitle}>
            Service and ambulance demand across
            {' '}
            {interval}
          </Typography>
        )}
      />

      <Divider />

      <CardContent>
        <Box className={classes.chartWrap}>
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

Sales.propTypes = {
  serviceRequestsTrend: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      count: PropTypes.number
    })
  ),
  ambulanceRequestsTrend: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      count: PropTypes.number
    })
  ),
  interval: PropTypes.string
};

Sales.defaultProps = {
  serviceRequestsTrend: [],
  ambulanceRequestsTrend: [],
  interval: '30 days'
};

export default Sales;
