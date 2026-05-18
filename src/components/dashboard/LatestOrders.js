import PropTypes from 'prop-types';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

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
  tableWrapper: {
    minWidth: 760
  },
  headCell: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    backgroundColor: '#F8FAFC',
    borderBottom: '1px solid #E2E8F0'
  },
  row: {
    '&:hover': {
      backgroundColor: '#F8FAFC'
    }
  },
  bodyCell: {
    color: '#0F172A',
    borderBottom: '1px solid #EEF2F7'
  },
  refText: {
    fontWeight: 700,
    color: '#0F172A'
  },
  customerText: {
    fontWeight: 500,
    color: '#334155'
  },
  dateText: {
    color: '#64748B'
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(2)
  },
  viewButton: {
    fontWeight: 600,
    textTransform: 'none'
  },
  chip: {
    fontWeight: 600,
    textTransform: 'capitalize'
  },
  pendingChip: {
    backgroundColor: '#FEF3C7',
    color: '#92400E'
  },
  deliveredChip: {
    backgroundColor: '#DCFCE7',
    color: '#166534'
  },
  refundedChip: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B'
  },
  defaultChip: {
    backgroundColor: '#E2E8F0',
    color: '#334155'
  }
}));

const orders = [
  {
    id: uuid(),
    ref: 'CDD1049',
    amount: 30.5,
    customer: {
      name: 'Ekaterina Tankova'
    },
    createdAt: 1555016400000,
    status: 'pending'
  },
  {
    id: uuid(),
    ref: 'CDD1048',
    amount: 25.1,
    customer: {
      name: 'Cao Yu'
    },
    createdAt: 1555016400000,
    status: 'delivered'
  },
  {
    id: uuid(),
    ref: 'CDD1047',
    amount: 10.99,
    customer: {
      name: 'Alexa Richardson'
    },
    createdAt: 1554930000000,
    status: 'refunded'
  },
  {
    id: uuid(),
    ref: 'CDD1046',
    amount: 96.43,
    customer: {
      name: 'Anje Keizer'
    },
    createdAt: 1554757200000,
    status: 'pending'
  },
  {
    id: uuid(),
    ref: 'CDD1045',
    amount: 32.54,
    customer: {
      name: 'Clarke Gillebert'
    },
    createdAt: 1554670800000,
    status: 'delivered'
  },
  {
    id: uuid(),
    ref: 'CDD1044',
    amount: 16.76,
    customer: {
      name: 'Adam Denisov'
    },
    createdAt: 1554670800000,
    status: 'delivered'
  }
];

const getStatusClassName = (status, classes) => {
  switch (status) {
    case 'pending':
      return classes.pendingChip;
    case 'delivered':
      return classes.deliveredChip;
    case 'refunded':
      return classes.refundedChip;
    default:
      return classes.defaultChip;
  }
};

const LatestOrders = (props) => {
  const classes = useStyles();

  return (
    <Card className={classes.card} {...props}>
      <CardHeader
        className={classes.headerRoot}
        title={(
          <Typography variant="h6" className={classes.headerTitle}>
            Recent Activity
          </Typography>
        )}
        subheader={(
          <Typography className={classes.headerSubTitle}>
            Latest transactions and operational updates
          </Typography>
        )}
      />

      <Divider />

      <PerfectScrollbar>
        <Box className={classes.tableWrapper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.headCell}>
                  Reference
                </TableCell>
                <TableCell className={classes.headCell}>
                  Customer
                </TableCell>
                <TableCell className={classes.headCell} sortDirection="desc">
                  <Tooltip enterDelay={300} title="Sort by date">
                    <TableSortLabel active direction="desc">
                      Date
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell className={classes.headCell}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map((order) => (
                <TableRow hover key={order.id} className={classes.row}>
                  <TableCell className={classes.bodyCell}>
                    <Typography variant="body2" className={classes.refText}>
                      {order.ref}
                    </Typography>
                  </TableCell>

                  <TableCell className={classes.bodyCell}>
                    <Typography variant="body2" className={classes.customerText}>
                      {order.customer.name}
                    </Typography>
                  </TableCell>

                  <TableCell className={classes.bodyCell}>
                    <Typography variant="body2" className={classes.dateText}>
                      {moment(order.createdAt).format('DD MMM YYYY')}
                    </Typography>
                  </TableCell>

                  <TableCell className={classes.bodyCell}>
                    <Chip
                      label={order.status}
                      size="small"
                      className={`${classes.chip} ${getStatusClassName(
                        order.status,
                        classes
                      )}`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>

      <Divider />

      <Box className={classes.footer}>
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
          className={classes.viewButton}
        >
          View all
        </Button>
      </Box>
    </Card>
  );
};

LatestOrders.propTypes = {
  className: PropTypes.string
};

LatestOrders.defaultProps = {
  className: ''
};

export default LatestOrders;
