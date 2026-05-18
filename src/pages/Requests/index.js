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
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import RequestListResults from 'src/components/requests/RequestListResults';
import RequestListToolbar from 'src/components/requests/RequestListToolbar';
import { makeGetRequest } from 'src/services/httpservice';

const useStyles = makeStyles((theme) => ({
  page: {
    backgroundColor: '#f4f7fb',
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(4)
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

const normalizeRequests = (response) => {
  if (!response) return [];

  if (Array.isArray(response.requests)) return response.requests;
  if (Array.isArray(response.data)) return response.data;

  if (response.data && Array.isArray(response.data.requests)) {
    return response.data.requests;
  }

  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }

  if (response.data && Array.isArray(response.data.service_requests)) {
    return response.data.service_requests;
  }

  if (Array.isArray(response.service_requests)) {
    return response.service_requests;
  }

  return [];
};

const extractMessage = (response) => {
  if (response && response.message) return response.message;
  if (response && response.data && response.data.message) return response.data.message;
  return 'No consultation requests found.';
};

const getStatusValue = (request) => {
  const raw = request.status
    || request.request_status
    || request.state
    || '';

  return String(raw).trim().toLowerCase();
};

const buildFullName = (user) => {
  if (!user) return '';

  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
  if (fullName) return fullName;

  return user.name || '';
};

const getSearchText = (request) => {
  const userFullName = buildFullName(request.user);
  const providerFullName = request.service_provider
    ? buildFullName(request.service_provider.user)
    : '';

  return [
    request.id,
    request.request_id,
    request.patient_name,
    request.full_name,
    request.name,
    request.title,
    request.type,
    request.service_name,
    request.consultation_type,
    request.description,
    request.reason,
    request.status,
    request.request_status,
    request.state,
    request.date,
    request.created_at,
    request.category && request.category.name,
    userFullName,
    providerFullName
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
};

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

const Requests = () => {
  const classes = useStyles();
  const isMountedRef = useRef(true);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);

  const getRequests = useCallback(async (background = false) => {
    if (!isMountedRef.current) return;

    if (background) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setMessage('');

    try {
      const response = await makeGetRequest('all-service-requests');
      const requestList = normalizeRequests(response);
      const responseMessage = extractMessage(response);

      if (isMountedRef.current) {
        setRequests(requestList);
        setMessage(requestList.length === 0 ? responseMessage : '');
        setLastUpdated(new Date());
      }
    } catch (error) {
      const errorMessage = error && error.message
        ? error.message
        : 'Failed to fetch consultation requests.';

      if (isMountedRef.current) {
        setRequests([]);
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
    getRequests(false);

    return () => {
      isMountedRef.current = false;
    };
  }, [getRequests]);

  const stats = useMemo(() => {
    const pending = requests.filter((item) => {
      const status = getStatusValue(item);
      return status.includes('pending');
    }).length;

    const inProgress = requests.filter((item) => {
      const status = getStatusValue(item);
      return (
        status.includes('progress')
        || status.includes('processing')
        || status.includes('ongoing')
      );
    }).length;

    const completed = requests.filter((item) => {
      const status = getStatusValue(item);
      return (
        status.includes('complete')
        || status.includes('resolved')
        || status.includes('done')
      );
    }).length;

    return {
      total: requests.length,
      pending,
      inProgress,
      completed
    };
  }, [requests]);

  const normalizedSearchTerm = useMemo(
    () => searchTerm.trim().toLowerCase(),
    [searchTerm]
  );

  const filteredRequests = useMemo(() => requests.filter((request) => {
    const matchesSearch = normalizedSearchTerm
      ? getSearchText(request).includes(normalizedSearchTerm)
      : true;

    const status = getStatusValue(request);
    const matchesStatus = statusFilter === 'all'
      ? true
      : status.includes(statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  }), [requests, normalizedSearchTerm, statusFilter]);

  const handleRefresh = () => {
    getRequests(true);
  };

  const handleImport = () => {
    console.log('Import requests');
  };

  const handleExport = () => {
    console.log('Export requests');
  };

  const handleViewRequest = (request) => {
    console.log('View request details:', request);
  };

  const handleEditRequest = (request) => {
    console.log('Update request:', request);
  };

  const handleDeleteRequest = (request) => {
    console.log('Delete request:', request);
  };

  const renderContent = () => {
    if (loading && requests.length === 0) {
      return (
        <Box className={classes.centeredState}>
          <CircularProgress size={34} />
          <Typography style={{ marginTop: 16 }} color="textSecondary" variant="body2">
            Loading health consultation requests...
          </Typography>
        </Box>
      );
    }

    if (filteredRequests.length > 0) {
      return (
        <RequestListResults
          requests={filteredRequests}
          loading={loading || refreshing}
          onView={handleViewRequest}
          onEdit={handleEditRequest}
          onDelete={handleDeleteRequest}
        />
      );
    }

    return (
      <Box className={classes.centeredState}>
        <AssignmentOutlinedIcon
          style={{ fontSize: 44, color: '#94a3b8', marginBottom: 8 }}
        />
        <Typography variant="h6" gutterBottom>
          No consultation requests found
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {searchTerm || statusFilter !== 'all'
            ? 'No records matched your current search or filter.'
            : message}
        </Typography>
      </Box>
    );
  };

  return (
    <>
      <Helmet>
        <title>Health Consultation Requests</title>
      </Helmet>

      <Box className={classes.page}>
        <Container maxWidth="xl">
          <Box className={classes.hero}>
            <Typography variant="h4" style={{ fontWeight: 700 }}>
              Health Consultation Requests
            </Typography>

            <Typography
              variant="body1"
              style={{ marginTop: 8, opacity: 0.92, maxWidth: 760 }}
            >
              Monitor and manage patient consultation requests in a modern, fast and responsive dashboard.
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
                title="Total Requests"
                value={stats.total}
                icon={AssignmentOutlinedIcon}
                color="#0f4c81"
              />
            </Grid>

            <Grid item lg={3} md={6} sm={6} xs={12}>
              <SummaryCard
                title="Pending"
                value={stats.pending}
                icon={ScheduleIcon}
                color="#f59e0b"
              />
            </Grid>

            <Grid item lg={3} md={6} sm={6} xs={12}>
              <SummaryCard
                title="In Progress"
                value={stats.inProgress}
                icon={AutorenewIcon}
                color="#2563eb"
              />
            </Grid>

            <Grid item lg={3} md={6} sm={6} xs={12}>
              <SummaryCard
                title="Completed"
                value={stats.completed}
                icon={CheckCircleOutlineIcon}
                color="#10b981"
              />
            </Grid>
          </Grid>

          <Box mt={3}>
            <Card className={classes.contentCard}>
              {refreshing && <LinearProgress />}

              <CardContent>
                <RequestListToolbar
                  loading={refreshing}
                  total={filteredRequests.length}
                  searchTerm={searchTerm}
                  statusFilter={statusFilter}
                  onSearchChange={setSearchTerm}
                  onStatusChange={setStatusFilter}
                  onRefresh={handleRefresh}
                  onImport={handleImport}
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

export default Requests;
