/* eslint-disable */
import React from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip
} from '@material-ui/core';
import SecurityIcon from '@material-ui/icons/Security';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import SettingsPassword from 'src/components/settings/SettingsPassword';
import SettingsNotifications from 'src/components/settings/SettingsNotifications';

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

const SettingsView = () => {
  return (
    <>
      <Helmet>
        <title>Settings | Daktari Nyumbani</title>
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
        <Container maxWidth="lg">
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
                  <Chip
                    label="Account & Security"
                    style={{
                      marginBottom: 14,
                      backgroundColor: 'rgba(255,255,255,0.16)',
                      color: '#ffffff',
                      fontWeight: 600
                    }}
                  />

                  <Typography
                    variant="h3"
                    style={{
                      color: '#ffffff',
                      fontWeight: 700,
                      marginBottom: 8
                    }}
                  >
                    Settings
                  </Typography>

                  <Typography
                    variant="body1"
                    style={{
                      color: 'rgba(255,255,255,0.84)',
                      maxWidth: 720
                    }}
                  >
                    Manage account security and communication preferences in a
                    cleaner professional dashboard layout.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Box style={{ marginBottom: 24 }}>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <Card style={metricCardStyle}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography
                          variant="body2"
                          style={{ color: '#6b7280', marginBottom: 6 }}
                        >
                          Security
                        </Typography>
                        <Typography
                          variant="h4"
                          style={{ fontWeight: 700, color: '#111827' }}
                        >
                          Password Management
                        </Typography>
                      </Box>
                      <Box style={iconWrapStyle}>
                        <SecurityIcon style={{ color: '#0284c7' }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item md={6} xs={12}>
                <Card style={metricCardStyle}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography
                          variant="body2"
                          style={{ color: '#6b7280', marginBottom: 6 }}
                        >
                          Communication
                        </Typography>
                        <Typography
                          variant="h4"
                          style={{ fontWeight: 700, color: '#111827' }}
                        >
                          Notification Preferences
                        </Typography>
                      </Box>
                      <Box style={iconWrapStyle}>
                        <NotificationsActiveIcon style={{ color: '#10b981' }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <SettingsPassword />
            </Grid>

            <Grid item xs={12} md={6}>
              <SettingsNotifications />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default SettingsView;