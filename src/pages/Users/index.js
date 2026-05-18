import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  LinearProgress,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import BlockIcon from '@material-ui/icons/Block';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import UsersListToolbar from 'src/components/users/UsersListToolbar';
import UsersListResults from 'src/components/users/UsersListResults';
import { makeGetRequest } from 'src/services/httpservice';

const useStyles = makeStyles((theme) => ({
  page: {
    backgroundColor: '#f4f7fb',
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(4)
  },
  container: {
    width: '100%',
    maxWidth: 1600,
    margin: '0 auto',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  hero: {
    color: '#fff',
    padding: theme.spacing(3),
    borderRadius: 20,
    marginBottom: theme.spacing(3),
    background: 'linear-gradient(135deg, #0f4c81 0%, #1d7bb8 100%)',
    boxShadow: '0 16px 40px rgba(15, 76, 129, 0.18)'
  },
  statCard: {
    borderRadius: 18,
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
    height: '100%'
  },
  statValue: {
    fontWeight: 700,
    marginTop: theme.spacing(1)
  },
  contentCard: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)'
  },
  centeredState: {
    minHeight: 260,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    padding: theme.spacing(3)
  }
}));

const normalizeUsers = (response) => {
  if (!response) return [];

  if (Array.isArray(response.users)) return response.users;
  if (Array.isArray(response.data)) return response.data;

  if (response.data && Array.isArray(response.data.users)) {
    return response.data.users;
  }

  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }

  if (response.users && Array.isArray(response.users.data)) {
    return response.users.data;
  }

  return [];
};

const extractMessage = (response) => {
  if (response && response.message) return response.message;
  if (response && response.data && response.data.message) return response.data.message;
  return 'No users found.';
};

const getUserStatusValue = (user) => {
  const raw = user.status
    || user.account_status
    || user.state
    || user.user_status
    || '';

  return String(raw).trim().toLowerCase();
};

const getSearchText = (user) => [
  user.id,
  user.first_name,
  user.last_name,
  user.name,
  user.full_name,
  user.email,
  user.phone,
  user.mobile,
  user.role,
  user.user_type,
  user.gender,
  user.status,
  user.account_status
]
  .filter(Boolean)
  .join(' ')
  .toLowerCase();

const SummaryCard = ({ title, value, icon, color }) => {
  const classes = useStyles();
  const Icon = icon;

  return (
    <Card className={classes.statCard}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography color="textSecondary" variant="body2">
            {title}
          </Typography>

          <Box
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: color
            }}
          >
            <Icon style={{ color: '#fff' }} />
          </Box>
        </Box>

        <Typography className={classes.statValue} variant="h4">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired
};

const Users = () => {
  const classes = useStyles();
  const isMountedRef = useRef(true);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);

  const getUsers = useCallback(async (background = false) => {
    if (!isMountedRef.current) return;

    if (background) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setMessage('');

    try {
      const response = await makeGetRequest('admin/users/all');
      const userList = normalizeUsers(response);
      const responseMessage = extractMessage(response);

      if (isMountedRef.current) {
        setUsers(userList);
        setMessage(userList.length === 0 ? responseMessage : '');
        setLastUpdated(new Date());
      }
    } catch (error) {
      const errorMessage = error && error.message
        ? error.message
        : 'Failed to fetch users.';

      if (isMountedRef.current) {
        setUsers([]);
        setMessage(errorMessage);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    getUsers(false);

    return () => {
      isMountedRef.current = false;
    };
  }, [getUsers]);

  const stats = useMemo(() => {
    const active = users.filter((item) => {
      const status = getUserStatusValue(item);
      return status.includes('active');
    }).length;

    const inactive = users.filter((item) => {
      const status = getUserStatusValue(item);
      return (
        status.includes('inactive')
        || status.includes('disabled')
        || status.includes('blocked')
      );
    }).length;

    const newUsers = users.filter((item) => {
      const createdAt = item.created_at ? new Date(item.created_at) : null;

      if (!createdAt || Number.isNaN(createdAt.getTime())) {
        return false;
      }

      const now = new Date();
      const diffInDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

      return diffInDays <= 30;
    }).length;

    return {
      total: users.length,
      active,
      inactive,
      newUsers
    };
  }, [users]);

  const normalizedSearchTerm = useMemo(
    () => searchTerm.trim().toLowerCase(),
    [searchTerm]
  );

  const filteredUsers = useMemo(() => users.filter((user) => {
    const matchesSearch = normalizedSearchTerm
      ? getSearchText(user).includes(normalizedSearchTerm)
      : true;

    const status = getUserStatusValue(user);
    const matchesStatus = statusFilter === 'all'
      ? true
      : status.includes(statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  }), [users, normalizedSearchTerm, statusFilter]);

  const handleRefresh = () => {
    getUsers(true);
  };

  const handleExport = () => {
    console.log('Export users');
  };

  const handleViewUser = (user) => {
    console.log('View user details:', user);
  };

  const handleEditUser = (user) => {
    console.log('Edit user:', user);
  };

  const handleDeleteUser = (user) => {
    console.log('Delete user:', user);
  };

  const renderContent = () => {
    if (loading && users.length === 0) {
      return (
        <Box className={classes.centeredState}>
          <CircularProgress size={34} />
          <Typography style={{ marginTop: 16 }} color="textSecondary" variant="body2">
            Loading users...
          </Typography>
        </Box>
      );
    }

    if (filteredUsers.length > 0) {
      return (
        <UsersListResults
          users={filteredUsers}
          loading={loading || refreshing}
          onView={handleViewUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      );
    }

    return (
      <Box className={classes.centeredState}>
        <PeopleOutlineIcon style={{ fontSize: 44, color: '#94a3b8', marginBottom: 8 }} />
        <Typography variant="h6" gutterBottom>
          No users found
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {searchTerm || statusFilter !== 'all'
            ? 'No users matched your current search or filter.'
            : message}
        </Typography>
      </Box>
    );
  };

  return (
    <>
      <Helmet>
        <title>Users Management</title>
      </Helmet>

      <Box className={classes.page}>
        <Container maxWidth={false} className={classes.container}>
          <Box className={classes.hero}>
            <Typography variant="h4" style={{ fontWeight: 700 }}>
              Users Management
            </Typography>

            <Typography
              variant="body1"
              style={{ marginTop: 8, opacity: 0.92, maxWidth: 760 }}
            >
              View, manage and monitor registered users in a clean, responsive and professional dashboard.
            </Typography>

            {lastUpdated && (
              <Typography variant="body2" style={{ marginTop: 12, opacity: 0.85 }}>
                Last updated:
                {' '}
                {lastUpdated.toLocaleString()}
              </Typography>
            )}
          </Box>

          <Grid container spacing={3}>
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <SummaryCard
                title="Total Users"
                value={stats.total}
                icon={PeopleOutlineIcon}
                color="#0f4c81"
              />
            </Grid>

            <Grid item lg={3} md={6} sm={6} xs={12}>
              <SummaryCard
                title="Active Users"
                value={stats.active}
                icon={VerifiedUserIcon}
                color="#10b981"
              />
            </Grid>

            <Grid item lg={3} md={6} sm={6} xs={12}>
              <SummaryCard
                title="Inactive Users"
                value={stats.inactive}
                icon={BlockIcon}
                color="#ef4444"
              />
            </Grid>

            <Grid item lg={3} md={6} sm={6} xs={12}>
              <SummaryCard
                title="New This Month"
                value={stats.newUsers}
                icon={PersonAddIcon}
                color="#2563eb"
              />
            </Grid>
          </Grid>

          <Box mt={3}>
            <Card className={classes.contentCard}>
              {refreshing && <LinearProgress />}

              <CardContent>
                <UsersListToolbar
                  loading={refreshing}
                  total={filteredUsers.length}
                  searchTerm={searchTerm}
                  statusFilter={statusFilter}
                  onSearchChange={setSearchTerm}
                  onStatusChange={setStatusFilter}
                  onRefresh={handleRefresh}
                  onExport={handleExport}
                />
              </CardContent>

              {renderContent()}
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Users;
