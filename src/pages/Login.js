/* eslint-disable */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  CircularProgress
} from '@material-ui/core';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import SecurityOutlinedIcon from '@material-ui/icons/SecurityOutlined';
import axios from 'axios';

const pageBackground = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(180deg, #f8fbff 0%, #eef6fb 45%, #f4f6f8 100%)',
  paddingTop: 24,
  paddingBottom: 24
};

const brandCardStyle = {
  borderRadius: 24,
  overflow: 'hidden',
  boxShadow: '0 18px 45px rgba(15, 23, 42, 0.10)',
  background: 'linear-gradient(135deg, #0f172a 0%, #0b5ed7 50%, #0ea5e9 100%)',
  height: '100%'
};

const loginCardStyle = {
  borderRadius: 24,
  overflow: 'hidden',
  boxShadow: '0 18px 45px rgba(15, 23, 42, 0.10)',
  backgroundColor: '#ffffff',
  height: '100%'
};

const iconWrapStyle = {
  width: 64,
  height: 64,
  borderRadius: 18,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255,255,255,0.14)',
  color: '#ffffff',
  marginBottom: 20
};

const infoBoxStyle = {
  padding: 16,
  borderRadius: 14,
  backgroundColor: 'rgba(255,255,255,0.10)',
  border: '1px solid rgba(255,255,255,0.12)'
};

const Login = ({
  setToken = function () {},
  setSettings = function () {}
}) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleLogin = async (values, { setSubmitting }) => {
    const API_URL = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');
    const loginUrl = API_URL + '/admin/auth/login';

    try {
      setMessage('');

      if (!API_URL) {
        setMessage('REACT_APP_API_URL is missing in your .env file.');
        return;
      }

      console.log('LOGIN URL:', loginUrl);
      console.log('LOGIN PAYLOAD:', values);

      const response = await axios.post(
        loginUrl,
        values,
        {
          responseType: 'json',
          timeout: 10000,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      const data = response.data;
      console.log('LOGIN RESPONSE:', data);

      if (data && data.status) {
        const plainTextToken =
          data.user &&
          data.user.token &&
          data.user.token.plainTextToken
            ? data.user.token.plainTextToken
            : '';

        const actualSettings =
          data.user && data.user.user
            ? data.user.user
            : null;

        localStorage.setItem('token', plainTextToken);
        localStorage.setItem('settings', JSON.stringify(actualSettings));

        setToken(plainTextToken);
        setSettings(actualSettings);

        navigate('/app/dashboard', { replace: true });
      } else {
        setMessage(data && data.message ? data.message : 'Login failed.');
      }
    } catch (error) {
      console.error('LOGIN ERROR FULL:', error);

      if (error && error.response) {
        console.error('LOGIN ERROR RESPONSE:', error.response);
        console.error('LOGIN ERROR DATA:', error.response.data);

        if (error.response.status === 401) {
          setMessage(
            error.response.data &&
            (error.response.data.message || error.response.data.error)
              ? error.response.data.message || error.response.data.error
              : 'Invalid email or password.'
          );
        } else {
          setMessage(
            error.response.data &&
            (error.response.data.message || error.response.data.error)
              ? error.response.data.message || error.response.data.error
              : 'Server error: ' + error.response.status
          );
        }
      } else if (error && error.request) {
        console.error('LOGIN ERROR REQUEST:', error.request);
        setMessage('No response from server. Check API URL, backend, or CORS.');
      } else {
        setMessage(error && error.message ? error.message : 'Login failed.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | Daktari Nyumbani</title>
      </Helmet>

      <Box style={pageBackground}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="stretch">
            <Grid item xs={12} md={6}>
              <Card style={brandCardStyle}>
                <CardContent style={{ padding: 36, height: '100%' }}>
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%'
                    }}
                  >
                    <Box>
                      <Box style={iconWrapStyle}>
                        <LocalHospitalIcon style={{ fontSize: 34 }} />
                      </Box>

                      <Typography
                        variant="h3"
                        style={{
                          color: '#ffffff',
                          fontWeight: 700,
                          marginBottom: 12
                        }}
                      >
                        Daktari Nyumbani
                      </Typography>

                      <Typography
                        variant="h6"
                        style={{
                          color: 'rgba(255,255,255,0.88)',
                          fontWeight: 500,
                          marginBottom: 16
                        }}
                      >
                        Professional healthcare administration platform
                      </Typography>

                      <Typography
                        variant="body1"
                        style={{
                          color: 'rgba(255,255,255,0.78)',
                          lineHeight: 1.7,
                          maxWidth: 520
                        }}
                      >
                        Securely manage healthcare providers, consultations,
                        appointments, ambulances, businesses, products, and
                        medical records from one modern admin dashboard.
                      </Typography>
                    </Box>

                    <Box style={{ marginTop: 28 }}>
                      <Box style={{ ...infoBoxStyle, marginBottom: 14 }}>
                        <Typography
                          variant="subtitle1"
                          style={{ color: '#ffffff', fontWeight: 700 }}
                        >
                          Secure access
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{ color: 'rgba(255,255,255,0.78)', marginTop: 6 }}
                        >
                          Sign in to access protected healthcare administration tools.
                        </Typography>
                      </Box>

                      <Box style={infoBoxStyle}>
                        <Typography
                          variant="subtitle1"
                          style={{ color: '#ffffff', fontWeight: 700 }}
                        >
                          Centralized management
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{ color: 'rgba(255,255,255,0.78)', marginTop: 6 }}
                        >
                          View operational data, manage providers, and keep medical
                          services organized in one place.
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card style={loginCardStyle}>
                <CardContent style={{ padding: 36 }}>
                  <Box
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: 18
                    }}
                  >
                    <Box
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%)',
                        color: '#0b5ed7'
                      }}
                    >
                      <SecurityOutlinedIcon />
                    </Box>

                    <Box>
                      <Typography
                        variant="h4"
                        style={{ color: '#111827', fontWeight: 700 }}
                      >
                        Sign in
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ color: '#6b7280', marginTop: 4 }}
                      >
                        Enter your credentials to continue
                      </Typography>
                    </Box>
                  </Box>

                  <Divider style={{ marginBottom: 24 }} />

                  <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={Yup.object({
                      email: Yup.string()
                        .email('Must be a valid email')
                        .required('Email is required'),
                      password: Yup.string().required('Password is required')
                    })}
                    onSubmit={handleLogin}
                  >
                    {({
                      errors,
                      touched,
                      values,
                      handleBlur,
                      handleChange,
                      handleSubmit,
                      isSubmitting
                    }) => (
                      <form onSubmit={handleSubmit}>
                        {message ? (
                          <Box
                            style={{
                              marginBottom: 20,
                              padding: 14,
                              borderRadius: 12,
                              backgroundColor: '#fff1f2',
                              border: '1px solid #fecdd3'
                            }}
                          >
                            <Typography
                              variant="body2"
                              style={{ color: '#9f1239', fontWeight: 600 }}
                            >
                              {message}
                            </Typography>
                          </Box>
                        ) : null}

                        <TextField
                          name="email"
                          label="Email Address"
                          type="email"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          value={values.email}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailOutlinedIcon fontSize="small" />
                              </InputAdornment>
                            )
                          }}
                        />

                        <TextField
                          name="password"
                          label="Password"
                          type="password"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          value={values.password}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.password && errors.password)}
                          helperText={touched.password && errors.password}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockOutlinedIcon fontSize="small" />
                              </InputAdornment>
                            )
                          }}
                        />

                        <Box style={{ paddingTop: 20 }}>
                          <Button
                            type="submit"
                            fullWidth
                            size="large"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            style={{
                              borderRadius: 12,
                              minHeight: 50,
                              textTransform: 'none',
                              fontWeight: 700,
                              boxShadow: '0 10px 24px rgba(37, 99, 235, 0.22)'
                            }}
                            startIcon={
                              isSubmitting ? (
                                <CircularProgress size={18} color="inherit" />
                              ) : null
                            }
                          >
                            {isSubmitting ? 'Signing in...' : 'Sign in now'}
                          </Button>
                        </Box>

                        <Box style={{ marginTop: 18 }}>
                          <Typography
                            variant="body2"
                            style={{ color: '#6b7280', textAlign: 'center' }}
                          >
                            Protected healthcare access for authorized users only.
                          </Typography>
                        </Box>
                      </form>
                    )}
                  </Formik>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Login.propTypes = {
  setToken: PropTypes.func,
  setSettings: PropTypes.func
};

export default Login;