import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
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
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import PhoneIcon from '@material-ui/icons/Phone';
import TabletIcon from '@material-ui/icons/Tablet';

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
    height: 300,
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      height: 240
    }
  },
  devicesWrap: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingTop: theme.spacing(2)
  },
  deviceBox: {
    padding: theme.spacing(1.5),
    minWidth: 120,
    textAlign: 'center'
  },
  deviceIcon: {
    fontSize: 28,
    marginBottom: theme.spacing(0.5)
  },
  deviceTitle: {
    color: '#475569',
    fontWeight: 600
  },
  deviceValue: {
    fontWeight: 700,
    marginTop: theme.spacing(0.5)
  }
}));

const TrafficByDevice = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  const deviceColors = {
    desktop: '#0F766E',
    tablet: '#2563EB',
    mobile: '#F59E0B'
  };

  const data = {
    datasets: [
      {
        data: [63, 15, 22],
        backgroundColor: [
          deviceColors.desktop,
          deviceColors.tablet,
          deviceColors.mobile
        ],
        borderWidth: 6,
        borderColor: '#FFFFFF',
        hoverBorderColor: '#FFFFFF'
      }
    ],
    labels: ['Desktop', 'Tablet', 'Mobile']
  };

  const options = {
    animation: false,
    cutoutPercentage: 78,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  const devices = [
    {
      title: 'Desktop',
      value: 63,
      icon: LaptopMacIcon,
      color: deviceColors.desktop
    },
    {
      title: 'Tablet',
      value: 15,
      icon: TabletIcon,
      color: deviceColors.tablet
    },
    {
      title: 'Mobile',
      value: 22,
      icon: PhoneIcon,
      color: deviceColors.mobile
    }
  ];

  return (
    <Card className={classes.card} {...props}>
      <CardHeader
        className={classes.headerRoot}
        title={(
          <Typography variant="h6" className={classes.headerTitle}>
            Access by Device
          </Typography>
        )}
        subheader={(
          <Typography className={classes.headerSubTitle}>
            How patients and staff access the appointment platform
          </Typography>
        )}
      />

      <Divider />

      <CardContent>
        <Box className={classes.chartWrap}>
          <Doughnut data={data} options={options} />
        </Box>

        <Box className={classes.devicesWrap}>
          {devices.map((device) => {
            const Icon = device.icon;

            return (
              <Box key={device.title} className={classes.deviceBox}>
                <Icon
                  className={classes.deviceIcon}
                  style={{ color: device.color }}
                />

                <Typography
                  variant="body1"
                  className={classes.deviceTitle}
                >
                  {device.title}
                </Typography>

                <Typography
                  variant="h5"
                  className={classes.deviceValue}
                  style={{ color: device.color }}
                >
                  {device.value}
                  %
                </Typography>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

TrafficByDevice.propTypes = {
  className: PropTypes.string
};

TrafficByDevice.defaultProps = {
  className: ''
};

export default TrafficByDevice;
