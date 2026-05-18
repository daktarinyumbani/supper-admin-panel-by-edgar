import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Tooltip,
  Typography,
  useMediaQuery
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport
} from '@material-ui/data-grid';

const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: 18,
    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
    overflow: 'hidden',
    width: '100%'
  },
  tableOuter: {
    width: '100%',
    overflowX: 'auto'
  },
  tableWrapper: {
    width: '100%',
    minWidth: 960
  },
  toolbar: {
    padding: theme.spacing(1.5, 2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc'
  },
  toolbarTitle: {
    fontWeight: 700,
    color: '#0f172a'
  },
  toolbarSubtitle: {
    color: '#64748b',
    fontSize: 13
  },
  statusChip: {
    fontWeight: 600,
    borderRadius: 8
  },
  actionButtons: {
    display: 'flex',
    flexWrap: 'nowrap',
    gap: 4,
    alignItems: 'center'
  },
  smallActionButton: {
    minWidth: 58,
    padding: '2px 6px',
    fontSize: 11,
    lineHeight: 1.2
  },
  textCell: {
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    lineHeight: 1.35,
    width: '100%'
  },
  mobileContainer: {
    padding: theme.spacing(2)
  },
  mobileCard: {
    borderRadius: 16,
    border: '1px solid #e2e8f0',
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.05)',
    marginBottom: theme.spacing(2)
  },
  mobileHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1.2),
    marginBottom: theme.spacing(1.5)
  },
  mobileName: {
    fontWeight: 700,
    color: '#0f172a',
    wordBreak: 'break-word'
  },
  mobileSubText: {
    color: '#64748b',
    fontSize: 13,
    wordBreak: 'break-word'
  },
  mobileRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(1.2),
    flexWrap: 'wrap'
  },
  mobileLabel: {
    color: '#64748b',
    fontWeight: 600,
    fontSize: 13
  },
  mobileValue: {
    color: '#0f172a',
    fontSize: 14,
    wordBreak: 'break-word',
    maxWidth: '100%'
  },
  mobileActions: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
    marginTop: theme.spacing(2)
  },
  emptyState: {
    minHeight: 220,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    color: '#64748b',
    textAlign: 'center',
    padding: theme.spacing(3)
  }
}));

const safeText = (value, fallback = '--') => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  return value;
};

const getPatientName = (row) => {
  if (row.user) {
    const firstName = row.user.first_name || '';
    const lastName = row.user.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();

    if (fullName) {
      return fullName;
    }
  }

  if (row.patient_name) return row.patient_name;
  if (row.name) return row.name;

  return '--';
};

const getServiceProviderName = (row) => {
  if (row.service_provider && row.service_provider.user) {
    const firstName = row.service_provider.user.first_name || '';
    const lastName = row.service_provider.user.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();

    if (fullName) {
      return fullName;
    }
  }

  if (row.service_provider_name) return row.service_provider_name;

  return '--';
};

const formatDate = (value) => {
  if (!value) return '--';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

const getStatus = (row) => row.status || row.request_status || 'Pending';

const getStatusStyles = (status) => {
  const value = String(status).toLowerCase();

  if (value.includes('complete')) {
    return {
      backgroundColor: '#dcfce7',
      color: '#166534'
    };
  }

  if (value.includes('approve') || value.includes('progress')) {
    return {
      backgroundColor: '#dbeafe',
      color: '#1d4ed8'
    };
  }

  if (value.includes('cancel') || value.includes('reject')) {
    return {
      backgroundColor: '#fee2e2',
      color: '#b91c1c'
    };
  }

  return {
    backgroundColor: '#fef3c7',
    color: '#92400e'
  };
};

const LongTextCell = ({ value }) => {
  const classes = useStyles();

  return (
    <Tooltip title={String(safeText(value))}>
      <Typography variant="body2" className={classes.textCell}>
        {safeText(value)}
      </Typography>
    </Tooltip>
  );
};

LongTextCell.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

LongTextCell.defaultProps = {
  value: '--'
};

const CustomNoRowsOverlay = () => {
  const classes = useStyles();

  return (
    <Box className={classes.emptyState}>
      <Typography variant="h6">No consultation requests found</Typography>
      <Typography variant="body2">
        Requests will appear here once data is available.
      </Typography>
    </Box>
  );
};

const RequestListResults = ({
  requests,
  onView,
  onEdit,
  onDelete,
  loading,
  ...rest
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const rows = requests.map((request, index) => ({
    ...request,
    rowId: request.id || request.request_id || request.uuid || `request-${index}`
  }));

  const columns = [
    {
      field: 'request_id',
      headerName: 'Request ID',
      minWidth: 120,
      flex: 0.8,
      renderCell: (params) => (
        <LongTextCell value={params.row.request_id || params.row.id || '--'} />
      )
    },
    {
      field: 'patient_name',
      headerName: 'Patient Name',
      minWidth: 170,
      flex: 1.2,
      renderCell: (params) => (
        <LongTextCell value={getPatientName(params.row)} />
      )
    },
    {
      field: 'service_provider_name',
      headerName: 'Service Provider',
      minWidth: 170,
      flex: 1.2,
      renderCell: (params) => (
        <LongTextCell value={getServiceProviderName(params.row)} />
      )
    },
    {
      field: 'date',
      headerName: 'Date Time',
      minWidth: 170,
      flex: 1,
      renderCell: (params) => (
        <LongTextCell value={formatDate(params.row.date)} />
      )
    },
    {
      field: 'requests_count',
      headerName: 'Requests',
      minWidth: 100,
      flex: 0.6,
      renderCell: (params) => (
        <LongTextCell value={safeText(params.row.requests_count, 0)} />
      )
    },
    {
      field: 'created_at',
      headerName: 'Requested At',
      minWidth: 170,
      flex: 1,
      renderCell: (params) => (
        <LongTextCell value={formatDate(params.row.created_at)} />
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 120,
      flex: 0.7,
      sortable: false,
      renderCell: (params) => {
        const status = getStatus(params.row);

        return (
          <Chip
            label={status}
            size="small"
            className={classes.statusChip}
            style={getStatusStyles(status)}
          />
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Action',
      minWidth: 190,
      flex: 0.9,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box className={classes.actionButtons}>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<VisibilityOutlinedIcon style={{ fontSize: 14 }} />}
            onClick={() => onView(params.row)}
            className={classes.smallActionButton}
          >
            View
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<EditOutlinedIcon style={{ fontSize: 14 }} />}
            onClick={() => onEdit(params.row)}
            className={classes.smallActionButton}
          >
            Edit
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="secondary"
            startIcon={<DeleteOutlineOutlinedIcon style={{ fontSize: 14 }} />}
            onClick={() => onDelete(params.row)}
            className={classes.smallActionButton}
          >
            Delete
          </Button>
        </Box>
      )
    }
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer className={classes.toolbar}>
        <Box>
          <Typography className={classes.toolbarTitle} variant="subtitle1">
            Request Directory
          </Typography>
          <Typography className={classes.toolbarSubtitle}>
            Professional and responsive consultation requests table
          </Typography>
        </Box>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  if (isMobile) {
    return (
      <Card className={classes.card} {...rest}>
        <Box className={classes.mobileContainer}>
          {rows.length === 0 ? (
            <CustomNoRowsOverlay />
          ) : (
            rows.map((row) => {
              const patientName = getPatientName(row);
              const serviceProviderName = getServiceProviderName(row);
              const status = getStatus(row);

              return (
                <Card key={row.rowId} className={classes.mobileCard}>
                  <CardContent>
                    <Box className={classes.mobileHeader}>
                      <PersonOutlineOutlinedIcon color="primary" />
                      <Box style={{ flex: 1, minWidth: 0 }}>
                        <Typography className={classes.mobileName} variant="subtitle1">
                          {patientName}
                        </Typography>
                        <Typography className={classes.mobileSubText}>
                          Request ID:
                          {' '}
                          {safeText(row.request_id || row.id)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box className={classes.mobileRow}>
                      <Typography className={classes.mobileLabel}>
                        Service Provider
                      </Typography>
                      <Typography className={classes.mobileValue}>
                        {serviceProviderName}
                      </Typography>
                    </Box>

                    <Box className={classes.mobileRow}>
                      <Typography className={classes.mobileLabel}>
                        Date Time
                      </Typography>
                      <Typography className={classes.mobileValue}>
                        {safeText(formatDate(row.date))}
                      </Typography>
                    </Box>

                    <Box className={classes.mobileRow}>
                      <Typography className={classes.mobileLabel}>
                        Requests
                      </Typography>
                      <Typography className={classes.mobileValue}>
                        {safeText(row.requests_count, 0)}
                      </Typography>
                    </Box>

                    <Box className={classes.mobileRow}>
                      <Typography className={classes.mobileLabel}>
                        Requested At
                      </Typography>
                      <Typography className={classes.mobileValue}>
                        {safeText(formatDate(row.created_at))}
                      </Typography>
                    </Box>

                    <Box mt={1}>
                      <Chip
                        label={status}
                        size="small"
                        className={classes.statusChip}
                        style={getStatusStyles(status)}
                      />
                    </Box>

                    <Divider style={{ marginTop: 16, marginBottom: 16 }} />

                    <Box className={classes.mobileActions}>
                      <Button
                        fullWidth
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<VisibilityOutlinedIcon />}
                        onClick={() => onView(row)}
                      >
                        View
                      </Button>

                      <Button
                        fullWidth
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<EditOutlinedIcon />}
                        onClick={() => onEdit(row)}
                      >
                        Edit
                      </Button>

                      <Button
                        fullWidth
                        size="small"
                        variant="outlined"
                        color="secondary"
                        startIcon={<DeleteOutlineOutlinedIcon />}
                        onClick={() => onDelete(row)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            })
          )}
        </Box>
      </Card>
    );
  }

  return (
    <Card className={classes.card} {...rest}>
      <PerfectScrollbar>
        <Box className={classes.tableOuter}>
          <Box className={classes.tableWrapper}>
            <DataGrid
              autoHeight
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 25]}
              disableSelectionOnClick
              getRowId={(row) => row.rowId}
              loading={loading}
              headerHeight={56}
              rowHeight={76}
              components={{
                Toolbar: CustomToolbar,
                NoRowsOverlay: CustomNoRowsOverlay
              }}
            />
          </Box>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

RequestListResults.propTypes = {
  requests: PropTypes.array,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  loading: PropTypes.bool
};

RequestListResults.defaultProps = {
  requests: [],
  onView: () => {},
  onEdit: () => {},
  onDelete: () => {},
  loading: false
};

export default RequestListResults;
