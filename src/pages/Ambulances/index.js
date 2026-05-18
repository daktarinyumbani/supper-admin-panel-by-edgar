/* eslint-disable */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress
} from '@material-ui/core';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import {
  makeDeleteRequest,
  makeGetRequest
} from 'src/services/httpservice';
import AmbulancesListToolbar from 'src/components/ambulances/AmbulancesListToolbar';
import AmbulancesListResults from 'src/components/ambulances/AmbulancesListResults';

const ADMIN_AMBULANCES_ENDPOINT = '/admin/ambulances';

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

const extractAmbulances = (response) => {
  if (
    response &&
    response.data &&
    response.data.ambulances &&
    Array.isArray(response.data.ambulances)
  ) {
    return response.data.ambulances;
  }

  if (
    response &&
    response.ambulances &&
    Array.isArray(response.ambulances)
  ) {
    return response.ambulances;
  }

  if (
    response &&
    response.data &&
    Array.isArray(response.data)
  ) {
    return response.data;
  }

  return [];
};

const buildFullName = (user) => {
  if (!user) {
    return '';
  }

  const names = [];

  if (user.first_name) {
    names.push(user.first_name);
  }

  if (user.last_name) {
    names.push(user.last_name);
  }

  return names.join(' ').trim();
};

const getActiveValue = (item) => {
  if (item && typeof item.active === 'boolean') {
    return item.active;
  }

  if (item && typeof item.is_active === 'boolean') {
    return item.is_active;
  }

  if (item && (item.active === 1 || item.active === '1')) {
    return true;
  }

  return false;
};

const getProviderData = (item) => {
  if (item && item.provider) {
    return item.provider;
  }

  if (item && item.service_provider) {
    return item.service_provider;
  }

  return {};
};

const normalizeAmbulance = (item, index) => {
  const user = item && item.user ? item.user : {};
  const provider = getProviderData(item);

  return {
    id:
      (item && item.id) ||
      (item && item.ambulance_id) ||
      (item && item.provider_id) ||
      index + 1,

    ambulanceProvider:
      (item && item.company_name) ||
      (item && item.provider_name) ||
      provider.company_name ||
      provider.name ||
      buildFullName(user) ||
      'N/A',

    contactName:
      (item && item.contact_name) ||
      buildFullName(user) ||
      'N/A',

    phone:
      (item && item.phone) ||
      user.phone ||
      provider.phone ||
      'N/A',

    plateNumber:
      (item && item.reg_number) ||
      (item && item.plate_number) ||
      (item && item.registration_number) ||
      'N/A',

    boardStatus:
      (item && item.board_status) || 'Unknown',

    currentHospital:
      (item && item.current_hospital) ||
      (item && item.hospital_name) ||
      (item && item.hospital) ||
      'N/A',

    location:
      (item && item.address) ||
      (item && item.location) ||
      provider.address ||
      'N/A',

    createdAt:
      (item && item.created_at) ||
      (item && item.createdAt) ||
      '',

    active: getActiveValue(item),
    raw: item
  };
};

const Ambulances = () => {
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getServiceProviders = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await makeGetRequest(ADMIN_AMBULANCES_ENDPOINT);
      console.log('Admin ambulances response:', response);

      const ambulances = extractAmbulances(response);
      const normalizedAmbulances = ambulances.map(function (item, index) {
        return normalizeAmbulance(item, index);
      });

      setProviders(normalizedAmbulances);
    } catch (error) {
      console.error('Error fetching ambulances:', error);
      setProviders([]);
      setErrorMessage('Unable to load ambulance records. Please check the endpoint response.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteAmbulance = useCallback(
    async (ambulanceId) => {
      const confirmed = window.confirm(
        'Are you sure you want to delete this ambulance record?'
      );

      if (!confirmed) {
        return;
      }

      setLoading(true);
      setErrorMessage('');

      try {
        const response = await makeDeleteRequest(
          ADMIN_AMBULANCES_ENDPOINT + '/' + ambulanceId
        );

        if (response && response.status) {
          await getServiceProviders();
          return;
        }

        setErrorMessage('Delete failed. Please try again.');
      } catch (error) {
        console.error('Error deleting ambulance:', error);
        setErrorMessage('Delete failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [getServiceProviders]
  );

  useEffect(() => {
    getServiceProviders();
  }, [getServiceProviders]);

  const filteredProviders = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      return providers;
    }

    return providers.filter(function (item) {
      return [
        item.ambulanceProvider,
        item.contactName,
        item.phone,
        item.plateNumber,
        item.currentHospital,
        item.location,
        item.boardStatus
      ]
        .join(' ')
        .toLowerCase()
        .includes(keyword);
    });
  }, [providers, searchTerm]);

  const totalAmbulances = providers.length;
  const activeAmbulances = providers.filter(function (item) {
    return item.active;
  }).length;

  const assignedHospitalCount = providers.filter(function (item) {
    return item.currentHospital && item.currentHospital !== 'N/A';
  }).length;

  return (
    <>
      <Helmet>
        <title>Ambulances | Health Admin</title>
      </Helmet>

      <Box
        style={{
          minHeight: '100%',
          paddingTop: 24,
          paddingBottom: 32,
          background:
            'linear-gradient(180deg, #f8fbff 0%, #eef5fb 40%, #f4f6f8 100%)'
        }}
      >
        <Container maxWidth={false}>
          <AmbulancesListToolbar
            loading={loading}
            totalCount={filteredProviders.length}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
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
                          Total Ambulances
                        </Typography>
                        <Typography variant="h3" style={{ fontWeight: 700, color: '#111827' }}>
                          {totalAmbulances}
                        </Typography>
                      </Box>
                      <Box style={iconWrapStyle}>
                        <LocalShippingIcon style={{ color: '#0284c7' }} />
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
                          Active Records
                        </Typography>
                        <Typography variant="h3" style={{ fontWeight: 700, color: '#111827' }}>
                          {activeAmbulances}
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
                          Assigned Hospitals
                        </Typography>
                        <Typography variant="h3" style={{ fontWeight: 700, color: '#111827' }}>
                          {assignedHospitalCount}
                        </Typography>
                      </Box>
                      <Box style={iconWrapStyle}>
                        <LocalHospitalIcon style={{ color: '#0f766e' }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Box style={{ paddingTop: 8 }}>
            {loading ? (
              <Card style={{ borderRadius: 18 }}>
                <Box
                  style={{
                    minHeight: 320,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CircularProgress color="primary" />
                </Box>
              </Card>
            ) : (
              <AmbulancesListResults
                providers={filteredProviders}
                loading={loading}
                errorMessage={errorMessage}
                onDelete={handleDeleteAmbulance}
              />
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Ambulances;