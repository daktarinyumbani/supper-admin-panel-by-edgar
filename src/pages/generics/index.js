/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
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
import CategoryIcon from '@material-ui/icons/Category';
import AssignmentIcon from '@material-ui/icons/Assignment';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import { makeGetRequest } from 'src/services/httpservice';
import GenericsListToolbar from 'src/components/generics/GenericsListToolbar';
import GenericsListResults from 'src/components/generics/GenericsListResults';

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

const Generics = () => {
  const [generics, setGenerics] = useState([]);
  const [loading, setLoading] = useState(true);

  const extractGenerics = (responseJson) => {
    if (
      responseJson
      && responseJson.status
      && responseJson.data
      && Array.isArray(responseJson.data.generics)
    ) {
      return responseJson.data.generics;
    }

    if (
      responseJson
      && Array.isArray(responseJson.generics)
    ) {
      return responseJson.generics;
    }

    if (
      responseJson
      && Array.isArray(responseJson.data)
    ) {
      return responseJson.data;
    }

    if (Array.isArray(responseJson)) {
      return responseJson;
    }

    return [];
  };

  const fetchGenerics = useCallback(async () => {
    try {
      setLoading(true);

      const responseJson = await makeGetRequest('/admin/generics');

      console.log('Generics response:', responseJson);

      const items = extractGenerics(responseJson);
      setGenerics(items);
    } catch (error) {
      console.error('Error fetching generics:', error);
      setGenerics([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGenerics();
  }, [fetchGenerics]);

  const metrics = useMemo(() => {
    const totalGenerics = generics.length;

    const namedGenerics = generics.filter((item) => item && item.name).length;

    const describedGenerics = generics.filter((item) => item && (item.description || item.details || item.summary)).length;

    return {
      totalGenerics,
      namedGenerics,
      describedGenerics
    };
  }, [generics]);

  return (
    <>
      <Helmet>
        <title>Generics | Health Admin</title>
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
          <GenericsListToolbar
            genericsCount={metrics.totalGenerics}
            onRefresh={fetchGenerics}
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
                          Total Generics
                        </Typography>
                        <Typography variant="h3" style={{ fontWeight: 700, color: '#111827' }}>
                          {metrics.totalGenerics}
                        </Typography>
                      </Box>
                      <Box style={iconWrapStyle}>
                        <CategoryIcon style={{ color: '#0284c7' }} />
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
                          Named Records
                        </Typography>
                        <Typography variant="h3" style={{ fontWeight: 700, color: '#111827' }}>
                          {metrics.namedGenerics}
                        </Typography>
                      </Box>
                      <Box style={iconWrapStyle}>
                        <FormatListBulletedIcon style={{ color: '#10b981' }} />
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
                          With Description
                        </Typography>
                        <Typography variant="h3" style={{ fontWeight: 700, color: '#111827' }}>
                          {metrics.describedGenerics}
                        </Typography>
                      </Box>
                      <Box style={iconWrapStyle}>
                        <AssignmentIcon style={{ color: '#0f766e' }} />
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
              <GenericsListResults generics={generics} />
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Generics;
