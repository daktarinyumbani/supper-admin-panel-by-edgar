/* eslint-disable */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Divider
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/Save';
import CategoryIcon from '@material-ui/icons/Category';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const pageBackground = {
  minHeight: '100%',
  paddingTop: 24,
  paddingBottom: 32,
  background: 'linear-gradient(180deg, #f8fbff 0%, #eef6fb 45%, #f4f6f8 100%)'
};

const headerCardStyle = {
  borderRadius: 22,
  overflow: 'hidden',
  marginBottom: 24,
  boxShadow: '0 14px 40px rgba(15, 23, 42, 0.08)',
  background: 'linear-gradient(135deg, #0f172a 0%, #0b5ed7 55%, #0ea5e9 100%)'
};

const formCardStyle = {
  borderRadius: 20,
  padding: 28,
  boxShadow: '0 12px 34px rgba(15, 23, 42, 0.08)'
};

const iconWrapStyle = {
  width: 56,
  height: 56,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%)',
  color: '#0b5ed7'
};

const CreateGeneric = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

  const getErrorMessage = (error, fallbackMessage) => {
    if (error && error.response && error.response.data) {
      if (error.response.data.message) {
        return error.response.data.message;
      }
    }

    if (error && error.message) {
      return error.message;
    }

    return fallbackMessage;
  };

  const createGeneric = async (values, setSubmitting) => {
    try {
      setMessage('');

      const token = localStorage.getItem('token');

      const response = await axios.post(
        API_BASE + '/admin/generics',
        values,
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );

      console.log('Create generic response:', response.data);

      if (
        (response.status === 200 || response.status === 201) &&
        response.data &&
        response.data.status
      ) {
        navigate('/app/generics');
        return;
      }

      if (response.data && response.data.message) {
        setMessage(response.data.message);
        return;
      }

      setMessage('Something went wrong. Please try again.');
    } catch (error) {
      console.error('Create generic error:', error);
      setMessage(
        getErrorMessage(error, 'Something went wrong. Please try again.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Generic</title>
      </Helmet>

      <Box style={pageBackground}>
        <Container maxWidth={false}>
          <Paper style={headerCardStyle}>
            <Box style={{ padding: 28 }}>
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
                    Create Generic
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 700 }}
                  >
                    Add a new healthcare generic with a clean, professional admin
                    form designed to match the rest of your dashboard.
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/app/generics')}
                  style={{
                    borderColor: 'rgba(255,255,255,0.35)',
                    color: '#ffffff',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    borderRadius: 12,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Back to Generics
                </Button>
              </Box>
            </Box>
          </Paper>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper style={formCardStyle}>
                <Formik
                  initialValues={{
                    name: ''
                  }}
                  validationSchema={Yup.object().shape({
                    name: Yup.string()
                      .max(64)
                      .required('Generic name is required')
                  })}
                  onSubmit={async (values, { setSubmitting }) => {
                    await createGeneric(values, setSubmitting);
                  }}
                >
                  {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <Box style={{ marginBottom: 20 }}>
                        <Typography
                          variant="h5"
                          style={{ fontWeight: 700, color: '#111827', marginBottom: 6 }}
                        >
                          Generic Information
                        </Typography>
                        <Typography variant="body2" style={{ color: '#6b7280' }}>
                          Enter the generic name and save it to your healthcare catalog.
                        </Typography>
                      </Box>

                      <Divider style={{ marginBottom: 24 }} />

                      <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                          <TextField
                            error={Boolean(touched.name && errors.name)}
                            fullWidth
                            helperText={touched.name && errors.name}
                            label="Generic Name"
                            margin="normal"
                            name="name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.name}
                            variant="outlined"
                            placeholder="Enter generic name"
                          />
                        </Grid>
                      </Grid>

                      {message ? (
                        <Box
                          style={{
                            marginTop: 16,
                            marginBottom: 24,
                            padding: 14,
                            borderRadius: 12,
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca'
                          }}
                        >
                          <Typography style={{ color: '#b91c1c', fontWeight: 600 }}>
                            {message}
                          </Typography>
                        </Box>
                      ) : null}

                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        flexWrap="wrap"
                        style={{ gap: 12, marginTop: 24 }}
                      >
                        <Button
                          variant="outlined"
                          onClick={() => navigate('/app/generics')}
                          style={{
                            borderRadius: 12,
                            textTransform: 'none',
                            fontWeight: 600
                          }}
                        >
                          Cancel
                        </Button>

                        <Button
                          color="primary"
                          disabled={isSubmitting}
                          size="large"
                          type="submit"
                          variant="contained"
                          startIcon={<SaveIcon />}
                          style={{
                            borderRadius: 12,
                            minWidth: 180,
                            textTransform: 'none',
                            fontWeight: 700,
                            boxShadow: '0 10px 24px rgba(37, 99, 235, 0.22)'
                          }}
                        >
                          {isSubmitting ? 'Creating...' : 'Create Generic'}
                        </Button>
                      </Box>
                    </form>
                  )}
                </Formik>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper style={formCardStyle}>
                <Box
                  style={{
                    marginBottom: 18,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14
                  }}
                >
                  <Box style={iconWrapStyle}>
                    <CategoryIcon />
                  </Box>

                  <Box>
                    <Typography
                      variant="h6"
                      style={{ fontWeight: 700, color: '#111827' }}
                    >
                      Guidance
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ color: '#6b7280', marginTop: 4 }}
                    >
                      Keep names clear and standardized for better healthcare data management.
                    </Typography>
                  </Box>
                </Box>

                <Divider style={{ marginBottom: 16 }} />

                <Box style={{ marginBottom: 14 }}>
                  <Typography style={{ fontWeight: 700, color: '#111827' }}>
                    Best Practice
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ color: '#6b7280', marginTop: 4 }}
                  >
                    Use a clean and commonly recognized generic name so products can be grouped accurately.
                  </Typography>
                </Box>

                <Box>
                  <Typography style={{ fontWeight: 700, color: '#111827' }}>
                    Example
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ color: '#6b7280', marginTop: 4 }}
                  >
                    Amoxicillin, Paracetamol, Metformin
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default CreateGeneric;