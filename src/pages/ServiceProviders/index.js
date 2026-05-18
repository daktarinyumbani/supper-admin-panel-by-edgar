/* eslint-disable */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography
} from '@material-ui/core';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import ServiceProvidersListToolbar from 'src/components/serviceProviders/ServiceProvidersListToolbar';
import ServiceProvidersListResults from 'src/components/serviceProviders/ServiceProvidersListResults';
import { makeGetRequest, makePostRequest } from 'src/services/httpservice';

const ADMIN_SERVICE_PROVIDERS_ENDPOINT = '/admin/service-providers';

const headerCardStyle = {
  borderRadius: 22,
  overflow: 'hidden',
  marginBottom: 24,
  boxShadow: '0 14px 40px rgba(15, 23, 42, 0.08)',
  background: 'linear-gradient(135deg, #0f172a 0%, #0b5ed7 55%, #0ea5e9 100%)'
};

const metricCardStyle = {
  height: '100%',
  borderRadius: 18,
  boxShadow: '0 10px 30px rgba(31, 41, 55, 0.08)'
};

const iconWrapStyle = {
  width: 52,
  height: 52,
  borderRadius: 14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, rgba(14,165,233,0.14), rgba(16,185,129,0.14))'
};

const extractProvidersFromResponse = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (response && response.data && Array.isArray(response.data.providers)) {
    return response.data.providers;
  }

  if (response && response.data && Array.isArray(response.data)) {
    return response.data;
  }

  if (response && Array.isArray(response.providers)) {
    return response.providers;
  }

  if (response && Array.isArray(response.items)) {
    return response.items;
  }

  return [];
};

const getFullName = (provider) => {
  const firstName =
    provider && provider.user && provider.user.first_name
      ? provider.user.first_name
      : '';

  const lastName =
    provider && provider.user && provider.user.last_name
      ? provider.user.last_name
      : '';

  const fullName = (firstName + ' ' + lastName).trim();

  if (fullName) {
    return fullName;
  }

  return 'this service provider';
};

const ServiceProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slowLoading, setSlowLoading] = useState(false);
  const [error, setError] = useState('');
  const [providerToDelete, setProviderToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const getServiceProviders = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await makeGetRequest(ADMIN_SERVICE_PROVIDERS_ENDPOINT);
      console.log('ADMIN SERVICE PROVIDERS RESPONSE:', response);

      const fetchedProviders = extractProvidersFromResponse(response);
      setProviders(fetchedProviders);
    } catch (err) {
      console.error('Failed to fetch service providers:', err);
      setProviders([]);
      setError(
        err && err.message
          ? err.message
          : 'Something went wrong while loading service providers.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async () => {
    if (!providerToDelete) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      await makePostRequest(
        ADMIN_SERVICE_PROVIDERS_ENDPOINT + '/' + providerToDelete.id,
        {},
        'DELETE'
      );

      setProviderToDelete(null);
      await getServiceProviders();
    } catch (err) {
      console.error('Failed to delete service provider:', err);
      setError(
        err && err.message
          ? err.message
          : 'Failed to delete service provider. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    getServiceProviders();
  }, [getServiceProviders]);

  useEffect(() => {
    let timer = null;

    if (loading) {
      timer = setTimeout(() => {
        setSlowLoading(true);
      }, 1200);
    } else {
      setSlowLoading(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [loading]);

  const metrics = useMemo(() => {
    const totalProviders = providers.length;

    const activeProviders = providers.filter((provider) => {
      if (!provider) {
        return false;
      }

      if (provider.active === true || provider.active === 1 || provider.active === '1') {
        return true;
      }

      return false;
    }).length;

    const verifiedProviders = providers.filter((provider) => {
      const boardStatus = provider && provider.board_status
        ? String(provider.board_status).toLowerCase()
        : '';

      return (
        boardStatus.indexOf('registered') !== -1 ||
        boardStatus.indexOf('approved') !== -1
      );
    }).length;

    return {
      totalProviders: totalProviders,
      activeProviders: activeProviders,
      verifiedProviders: verifiedProviders
    };
  }, [providers]);

  const deleteName = providerToDelete ? getFullName(providerToDelete) : '';

  return (
    <>
      <Helmet>
        <title>Service Providers | Health Admin</title>
      </Helmet>

      <Box
        style={{
          minHeight: '100%',
          paddingTop: 24,
          paddingBottom: 32,
          background:
            'linear-gradient(180deg, #f8fbff 0%, #eef6fb 45%, #f4f6f8 100%)'
        }}
      >
        <Container maxWidth={false}>
          <Card style={headerCardStyle}>
            <CardContent style={{ padding: 28 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                style={{ gap: 16 }}
              >
                <Box>
                  <Typography
                    variant="h3"
                    style={{ color: '#ffffff', fontWeight: 700, marginBottom: 8 }}
                  >
                    Service Providers
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 760 }}
                  >
                    Manage healthcare professionals, review provider records and
                    keep consultation data organized in a cleaner admin dashboard.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <ServiceProvidersListToolbar
            total={providers.length}
            loading={loading}
            onRefresh={getServiceProviders}
          />

          <Box style={{ marginTop: 24, marginBottom: 24 }}>
            <Grid container spacing={3}>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <Card style={metricCardStyle}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography
                          variant="body2"
                          style={{ color: '#6b7280', marginBottom: 6 }}
                        >
                          Total Providers
                        </Typography>
                        <Typography
                          variant="h3"
                          style={{ fontWeight: 700, color: '#111827' }}
                        >
                          {metrics.totalProviders}
                        </Typography>
                      </Box>
                      <Box style={iconWrapStyle}>
                        <LocalHospitalIcon style={{ color: '#0284c7' }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item lg={4} md={4} sm={12} xs={12}>
                <Card style={metricCardStyle}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography
                          variant="body2"
                          style={{ color: '#6b7280', marginBottom: 6 }}
                        >
                          Active Providers
                        </Typography>
                        <Typography
                          variant="h3"
                          style={{ fontWeight: 700, color: '#111827' }}
                        >
                          {metrics.activeProviders}
                        </Typography>
                      </Box>
                      <Box style={iconWrapStyle}>
                        <CheckCircleOutlineIcon style={{ color: '#10b981' }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item lg={4} md={4} sm={12} xs={12}>
                <Card style={metricCardStyle}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography
                          variant="body2"
                          style={{ color: '#6b7280', marginBottom: 6 }}
                        >
                          Verified Board Status
                        </Typography>
                        <Typography
                          variant="h3"
                          style={{ fontWeight: 700, color: '#111827' }}
                        >
                          {metrics.verifiedProviders}
                        </Typography>
                      </Box>
                      <Box style={iconWrapStyle}>
                        <VerifiedUserIcon style={{ color: '#0f766e' }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {slowLoading && loading ? (
            <Card
              style={{
                marginTop: 24,
                borderRadius: 18,
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)'
              }}
            >
              <CardContent>
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: 600, color: '#1f2937' }}
                >
                  Loading service providers...
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  The request is taking longer than usual. Please wait a moment.
                </Typography>
              </CardContent>
            </Card>
          ) : null}

          {!!error && !loading ? (
            <Card
              style={{
                marginTop: 24,
                borderRadius: 18,
                border: '1px solid #fecaca',
                background: '#fff7f7',
                boxShadow: 'none'
              }}
            >
              <CardContent
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 16,
                  flexWrap: 'wrap'
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: 600, color: '#991b1b' }}
                  >
                    Unable to load data
                  </Typography>
                  <Typography variant="body2" style={{ color: '#7f1d1d' }}>
                    {error}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={getServiceProviders}
                  style={{
                    borderRadius: 12,
                    textTransform: 'none',
                    fontWeight: 700
                  }}
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : null}

          <Box style={{ marginTop: 24 }}>
            <ServiceProvidersListResults
              providers={providers}
              loading={loading}
              onDelete={(provider) => setProviderToDelete(provider)}
            />
          </Box>
        </Container>
      </Box>

      <Dialog
        open={Boolean(providerToDelete)}
        onClose={() => {
          if (!deleting) {
            setProviderToDelete(null);
          }
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle style={{ fontWeight: 700 }}>
          Delete service provider
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{deleteName}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions style={{ padding: 16 }}>
          <Button
            onClick={() => setProviderToDelete(null)}
            disabled={deleting}
            style={{
              borderRadius: 10,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDelete}
            color="secondary"
            variant="contained"
            disabled={deleting}
            style={{
              borderRadius: 10,
              textTransform: 'none',
              fontWeight: 700
            }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ServiceProviders;