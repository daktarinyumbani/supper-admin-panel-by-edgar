import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1)
  },
  card: {
    borderRadius: 18,
    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)'
  },
  cardContent: {
    padding: theme.spacing(3)
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
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
  rightActions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    flexWrap: 'wrap'
  },
  totalChip: {
    fontWeight: 600,
    backgroundColor: '#e0f2fe',
    color: '#0369a1'
  },
  searchField: {
    backgroundColor: '#fff',
    borderRadius: 10
  },
  filterField: {
    backgroundColor: '#fff',
    borderRadius: 10
  },
  actionButtons: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
    justifyContent: 'flex-end'
  },
  createButton: {
    boxShadow: 'none',
    borderRadius: 10,
    height: 40
  },
  refreshButton: {
    boxShadow: 'none',
    borderRadius: 10,
    height: 40
  }
}));

const UsersListToolbar = ({
  loading,
  total,
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onRefresh,
  onExport,
  ...rest
}) => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Box className={classes.root} {...rest}>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Box className={classes.topRow}>
            <Box>
              <Typography className={classes.title} gutterBottom variant="h4">
                Users
              </Typography>
              <Typography className={classes.subtitle} variant="body2">
                Manage platform users in a clean, responsive and professional directory.
              </Typography>
            </Box>

            <Box className={classes.rightActions}>
              <Chip
                className={classes.totalChip}
                label={`${total} user${total === 1 ? '' : 's'}`}
              />

              <Button
                color="primary"
                variant="contained"
                startIcon={<PersonAddIcon />}
                className={classes.createButton}
                onClick={() => navigate('create')}
              >
                Create Admin User
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item md={5} sm={12} xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search name, email, phone or role"
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
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
                <MenuItem value="disabled">Disabled</MenuItem>
              </TextField>
            </Grid>

            <Grid item md={4} sm={6} xs={12}>
              <Box className={classes.actionButtons}>
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

UsersListToolbar.propTypes = {
  loading: PropTypes.bool,
  total: PropTypes.number,
  searchTerm: PropTypes.string,
  statusFilter: PropTypes.string,
  onSearchChange: PropTypes.func,
  onStatusChange: PropTypes.func,
  onRefresh: PropTypes.func,
  onExport: PropTypes.func
};

UsersListToolbar.defaultProps = {
  loading: false,
  total: 0,
  searchTerm: '',
  statusFilter: 'all',
  onSearchChange: () => {},
  onStatusChange: () => {},
  onRefresh: () => {},
  onExport: () => {}
};

export default UsersListToolbar;
