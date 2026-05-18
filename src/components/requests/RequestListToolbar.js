import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(3)
  },
  heroCard: {
    borderRadius: 18,
    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
    overflow: 'hidden'
  },
  heroContent: {
    padding: theme.spacing(3)
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
    marginBottom: theme.spacing(3)
  },
  title: {
    fontWeight: 700,
    color: '#0f172a'
  },
  subtitle: {
    color: '#64748b',
    marginTop: theme.spacing(0.5)
  },
  statBox: {
    minWidth: 120,
    borderRadius: 14,
    padding: theme.spacing(1.5, 2),
    background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
    border: '1px solid #bae6fd',
    textAlign: 'center'
  },
  statValue: {
    fontWeight: 700,
    color: '#0369a1'
  },
  statLabel: {
    color: '#64748b',
    fontSize: 13
  },
  actionButtons: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
    justifyContent: 'flex-end'
  },
  searchField: {
    backgroundColor: '#fff',
    borderRadius: 10
  },
  filterField: {
    backgroundColor: '#fff',
    borderRadius: 10
  },
  refreshButton: {
    height: 40,
    borderRadius: 10,
    boxShadow: 'none'
  }
}));

const RequestListToolbar = ({
  total,
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onRefresh,
  onImport,
  onExport,
  loading,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.root} {...rest}>
      <Card className={classes.heroCard}>
        <CardContent className={classes.heroContent}>
          <Box className={classes.topRow}>
            <Box>
              <Typography className={classes.title} variant="h4">
                Health Consultation Requests
              </Typography>
              <Typography className={classes.subtitle} variant="body2">
                Manage patient requests with a cleaner, faster and more professional view.
              </Typography>
            </Box>

            <Box className={classes.statBox}>
              <Typography className={classes.statValue} variant="h5">
                {total}
              </Typography>
              <Typography className={classes.statLabel}>
                Total Requests
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2} alignItems="center">
            <Grid item md={5} sm={12} xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search patient, provider, request ID..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className={classes.searchField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item md={3} sm={6} xs={12}>
              <TextField
                select
                fullWidth
                variant="outlined"
                size="small"
                label="Status"
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
                className={classes.filterField}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>

            <Grid item md={4} sm={6} xs={12}>
              <Box className={classes.actionButtons}>
                <Button
                  variant="outlined"
                  startIcon={<PublishIcon />}
                  onClick={onImport}
                >
                  Import
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<GetAppIcon />}
                  onClick={onExport}
                >
                  Export
                </Button>

                <Button
                  color="primary"
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={onRefresh}
                  disabled={loading}
                  className={classes.refreshButton}
                >
                  {loading ? 'Refreshing...' : 'Refresh'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

RequestListToolbar.propTypes = {
  total: PropTypes.number,
  searchTerm: PropTypes.string,
  statusFilter: PropTypes.string,
  onSearchChange: PropTypes.func,
  onStatusChange: PropTypes.func,
  onRefresh: PropTypes.func,
  onImport: PropTypes.func,
  onExport: PropTypes.func,
  loading: PropTypes.bool
};

RequestListToolbar.defaultProps = {
  total: 0,
  searchTerm: '',
  statusFilter: 'all',
  onSearchChange: () => {},
  onStatusChange: () => {},
  onRefresh: () => {},
  onImport: () => {},
  onExport: () => {},
  loading: false
};

export default RequestListToolbar;
