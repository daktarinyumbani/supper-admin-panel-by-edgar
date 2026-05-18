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
    minWidth: 980
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

const getFullName = (row) => {
  const firstName = row.first_name || '';
  const lastName = row.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim();

  if (fullName) return fullName;
  if (row.full_name) return row.full_name;
  if (row.name) return row.name;

  return '--';
};

const getPhone = (row) => row.phone || row.mobile || row.phone_number || '--';
const getRole = (row) => row.role || row.user_type || row.type || '--';
const getStatus = (row) => row.status || row.account_status || row.state || 'Active';

const formatDate = (value) => {
  if (!value) return '--';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

const getStatusStyles = (status) => {
  const value = String(status).toLowerCase();

  if (value.includes('active')) {
    return {
      backgroundColor: '#dcfce7',
      color: '#166534'
    };
  }

  if (value.includes('pending')) {
    return {
      backgroundColor: '#fef3c7',
      color: '#92400e'
    };
  }

  if (value.includes('blocked') || value.includes('disabled') || value.includes('inactive')) {
    return {
      backgroundColor: '#fee2e2',
      color: '#b91c1c'
    };
  }

  return {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8'
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
      <Typography variant="h6">No users found</Typography>
      <Typography variant="body2">
        Users will appear here once data is available.
      </Typography>
    </Box>
  );
};

const UsersListResults = ({
  users,
  onView,
  onEdit,
  onDelete,
  loading,
  ...rest
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const rows = users.map((user, index) => ({
    ...user,
    rowId: user.id || user.user_id || user.uuid || `user-${index}`
  }));

  const columns = [
    {
      field: 'id',
      headerName: 'User ID',
      minWidth: 110,
      flex: 0.7,
      renderCell: (params) => (
        <LongTextCell value={params.row.id || params.row.user_id || '--'} />
      )
    },
    {
      field: 'name',
      headerName: 'Full Name',
      minWidth: 180,
      flex: 1.2,
      renderCell: (params) => (
        <LongTextCell value={getFullName(params.row)} />
      )
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 220,
      flex: 1.4,
      renderCell: (params) => (
        <LongTextCell value={params.row.email} />
      )
    },
    {
      field: 'phone',
      headerName: 'Phone',
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <LongTextCell value={getPhone(params.row)} />
      )
    },
    {
      field: 'role',
      headerName: 'Role',
      minWidth: 140,
      flex: 0.9,
      renderCell: (params) => (
        <LongTextCell value={getRole(params.row)} />
      )
    },
    {
      field: 'created_at',
      headerName: 'Registered At',
      minWidth: 180,
      flex: 1,
      renderCell: (params) => (
        <LongTextCell value={formatDate(params.row.created_at)} />
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 120,
      flex: 0.8,
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
            Users Directory
          </Typography>
          <Typography className={classes.toolbarSubtitle}>
            Professional and responsive users table
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
              const fullName = getFullName(row);
              const status = getStatus(row);

              return (
                <Card key={row.rowId} className={classes.mobileCard}>
                  <CardContent>
                    <Box className={classes.mobileHeader}>
                      <PersonOutlineOutlinedIcon color="primary" />
                      <Box style={{ flex: 1, minWidth: 0 }}>
                        <Typography className={classes.mobileName} variant="subtitle1">
                          {fullName}
                        </Typography>
                        <Typography className={classes.mobileSubText}>
                          User ID:
                          {' '}
                          {safeText(row.id || row.user_id)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box className={classes.mobileRow}>
                      <Typography className={classes.mobileLabel}>Email</Typography>
                      <Typography className={classes.mobileValue}>
                        {safeText(row.email)}
                      </Typography>
                    </Box>

                    <Box className={classes.mobileRow}>
                      <Typography className={classes.mobileLabel}>Phone</Typography>
                      <Typography className={classes.mobileValue}>
                        {getPhone(row)}
                      </Typography>
                    </Box>

                    <Box className={classes.mobileRow}>
                      <Typography className={classes.mobileLabel}>Role</Typography>
                      <Typography className={classes.mobileValue}>
                        {getRole(row)}
                      </Typography>
                    </Box>

                    <Box className={classes.mobileRow}>
                      <Typography className={classes.mobileLabel}>Registered At</Typography>
                      <Typography className={classes.mobileValue}>
                        {formatDate(row.created_at)}
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

UsersListResults.propTypes = {
  users: PropTypes.array,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  loading: PropTypes.bool
};

UsersListResults.defaultProps = {
  users: [],
  onView: () => {},
  onEdit: () => {},
  onDelete: () => {},
  loading: false
};

export default UsersListResults;
