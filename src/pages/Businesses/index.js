/* eslint-disable */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography
} from '@material-ui/core';
import BusinessIcon from '@material-ui/icons/Business';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import LocalPharmacyIcon from '@material-ui/icons/LocalPharmacy';
import { makeGetRequest } from 'src/services/httpservice';
import BusinessesListToolbar from 'src/components/businesses/BusinessesListToolbar';
import BusinessesListResults from 'src/components/businesses/BusinessesListResults';

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

const Businesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const extractBusinesses = (response) => {
    if (
      response &&
      response.status &&
      response.data &&
      Array.isArray(response.data.businesses)
    ) {
      return response.data.businesses;
    }

    if (
      response &&
      response.data &&
      Array.isArray(response.data)
    ) {
      return response.data;
    }

    if (response && Array.isArray(response.businesses)) {
      return response.businesses;
    }

    if (Array.isArray(response)) {
      return response;
    }

    return [];
  };

  const fetchBusinesses = useCallback(async () => {
    try {
      setLoading(true);

      const response = await makeGetRequest('/admin/businesses');
      console.log('Businesses response:', response);

      const items = extractBusinesses(response);
      setBusinesses(items);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const metrics = useMemo(() => {
    const totalBusinesses = businesses.length;

    const activeBusinesses = businesses.filter(function (item) {
      return item && item.active;
    }).length;

    const pharmacyBusinesses = businesses.filter(function (item) {
      if (!item || !item.business_type) {
        return false;
      }

      return String(item.business_type).toLowerCase() === 'pharmacy';
    }).length;

    return {
      totalBusinesses: totalBusinesses,
      activeBusinesses: activeBusinesses,
      pharmacyBusinesses: pharmacyBusinesses
    };
  }, [businesses]);

  return (
    <>
      <Helmet>
        <title>Businesses | Health Admin</title>
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
          <BusinessesListToolbar
            businessCount={metrics.totalBusinesses}
            onRefresh={fetchBusinesses}
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
                          Total Businesses
                        </Typography>
                        <Typography variant="h3" style={{ fontWeight: 700, color: '#111827' }}>
                          {metrics.totalBusinesses}
                        </Typography>
                      </Box>
                      <Box style={iconWrapStyle}>
                        <BusinessIcon style={{ color: '#0284c7' }} />
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
                          Active Businesses
                        </Typography>
                        <Typography variant="h3" style={{ fontWeight: 700, color: '#111827' }}>
                          {metrics.activeBusinesses}
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
                          Pharmacies
                        </Typography>
                        <Typography variant="h3" style={{ fontWeight: 700, color: '#111827' }}>
                          {metrics.pharmacyBusinesses}
                        </Typography>
                      </Box>
                      <Box style={iconWrapStyle}>
                        <LocalPharmacyIcon style={{ color: '#0f766e' }} />
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
                    minHeight: 360,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CircularProgress color="primary" />
                </Box>
              </Card>
            ) : (
              <BusinessesListResults
                businesses={businesses}
                onRefresh={fetchBusinesses}
              />
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Businesses;