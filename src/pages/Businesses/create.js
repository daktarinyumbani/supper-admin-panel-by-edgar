/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Divider,
  CircularProgress
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/Save';
import BusinessIcon from '@material-ui/icons/Business';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete';
import { makeGetRequest } from 'src/services/httpservice';
import { useNavigate, useParams } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

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

const locationBoxStyle = {
  border: '1px solid #e5e7eb',
  borderRadius: 16,
  backgroundColor: '#ffffff',
  overflow: 'hidden'
};

const CreateBusiness = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

  const [message, setMessage] = useState('');
  const [address, setAddress] = useState('');
  const [latLng, setLatLng] = useState({
    lat: '',
    lng: ''
  });
  const [mode, setMode] = useState('create');
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [initialValues, setInitialValues] = useState({
    name: '',
    phone: '',
    business_type: '',
    latitude: '',
    longitude: '',
    address: '',
    bio: '',
    active: '1'
  });

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

  const getBusinessObject = (response) => {
    if (!response) {
      return null;
    }

    if (response.data && response.data.business) {
      return response.data.business;
    }

    if (response.business) {
      return response.business;
    }

    if (response.data && response.data.id) {
      return response.data;
    }

    return null;
  };

  const getDetails = async (businessId) => {
    try {
      setLoadingDetails(true);
      setMessage('');

      const response = await makeGetRequest('/admin/businesses/' + businessId);
      const business = getBusinessObject(response);

      console.log('Business details response:', response);

      if (!response || !response.status || !business) {
        setMessage('Failed to load business details.');
        return;
      }

      setMode('edit');
      setAddress(business.address ? business.address : '');
      setLatLng({
        lat: business.latitude ? business.latitude : '',
        lng: business.longitude ? business.longitude : ''
      });

      setInitialValues({
        name: business.name ? business.name : '',
        phone: business.phone ? business.phone : '',
        business_type: business.business_type ? business.business_type : '',
        latitude: business.latitude ? business.latitude : '',
        longitude: business.longitude ? business.longitude : '',
        address: business.address ? business.address : '',
        bio: business.bio ? business.bio : '',
        active:
          business.active === 0 || business.active === '0'
            ? '0'
            : '1'
      });
    } catch (error) {
      console.error(error);
      setMessage(getErrorMessage(error, 'Failed to load business details.'));
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (id) {
      getDetails(id);
    }
  }, [id]);

  const handleAddressChange = (nextAddress) => {
    setAddress(nextAddress);
  };

  const handleAddressSelect = (selectedAddress) => {
    setAddress(selectedAddress);

    geocodeByAddress(selectedAddress)
      .then((results) => getLatLng(results[0]))
      .then((coords) => {
        setLatLng(coords);
      })
      .catch((error) => {
        console.error('Address geocode error:', error);
      });
  };

  const submitBusiness = async (values, setSubmitting) => {
    try {
      setMessage('');

      if (!address) {
        setMessage('Business address is required.');
        return;
      }

      const payload = {
        name: values.name,
        phone: values.phone,
        business_type: values.business_type,
        latitude: latLng.lat ? latLng.lat : values.latitude,
        longitude: latLng.lng ? latLng.lng : values.longitude,
        address: address,
        bio: values.bio,
        active: values.active
      };

      const token = localStorage.getItem('token');

      let response;

      if (mode === 'edit') {
        payload._method = 'PUT';

        response = await axios.post(
          API_BASE + '/admin/businesses/' + id,
          payload,
          {
            headers: {
              Authorization: 'Bearer ' + token
            }
          }
        );
      } else {
        response = await axios.post(
          API_BASE + '/admin/businesses',
          payload,
          {
            headers: {
              Authorization: 'Bearer ' + token
            }
          }
        );
      }

      console.log('Business save response:', response.data);

      if (
        (response.status === 200 || response.status === 201) &&
        response.data &&
        response.data.status
      ) {
        if (mode === 'edit') {
          navigate('/app/businesses/' + id + '/details');
        } else {
          navigate('/app/businesses');
        }
        return;
      }

      if (response.data && response.data.message) {
        setMessage(response.data.message);
        return;
      }

      setMessage('Something went wrong. Please try again.');
    } catch (error) {
      console.error(error);
      setMessage(getErrorMessage(error, 'Something went wrong. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{mode === 'edit' ? 'Update Business' : 'Create Business'}</title>
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
                    {mode === 'edit' ? 'Update Business' : 'Register Business'}
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 720 }}
                  >
                    Manage healthcare businesses in a cleaner professional admin
                    form for business details, contact information, location and status.
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/app/businesses')}
                  style={{
                    borderColor: 'rgba(255,255,255,0.35)',
                    color: '#ffffff',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    borderRadius: 12,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Back to Businesses
                </Button>
              </Box>
            </Box>
          </Paper>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper style={formCardStyle}>
                {loadingDetails ? (
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
                ) : (
                  <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={Yup.object().shape({
                      name: Yup.string()
                        .max(64)
                        .required('Business name is required'),
                      phone: Yup.string().required('Phone is required'),
                      business_type: Yup.string().required('Business type is required'),
                      active: Yup.string().required('Business status is required'),
                      bio: Yup.string().required('Bio is required')
                    })}
                    onSubmit={async (values, { setSubmitting }) => {
                      await submitBusiness(values, setSubmitting);
                    }}
                  >
                    {({
                      errors,
                      handleBlur,
                      handleChange,
                      handleSubmit,
                      setFieldValue,
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
                            Business Information
                          </Typography>
                          <Typography variant="body2" style={{ color: '#6b7280' }}>
                            Enter the business profile, contact details, location and operating status.
                          </Typography>
                        </Box>

                        <Divider style={{ marginBottom: 24 }} />

                        <Grid container spacing={3}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              select
                              error={Boolean(touched.business_type && errors.business_type)}
                              fullWidth
                              helperText={touched.business_type && errors.business_type}
                              label="Business Type"
                              margin="normal"
                              name="business_type"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.business_type}
                              variant="outlined"
                            >
                              <MenuItem value="retailer">Retailer</MenuItem>
                              <MenuItem value="wholesaler">Wholesaler</MenuItem>
                              <MenuItem value="dialysis">Dialysis</MenuItem>
                              <MenuItem value="insurance">Insurance Agency</MenuItem>
                            </TextField>
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <TextField
                              error={Boolean(touched.name && errors.name)}
                              fullWidth
                              helperText={touched.name && errors.name}
                              label="Business Name"
                              margin="normal"
                              name="name"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.name}
                              variant="outlined"
                            />
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <Box style={{ marginTop: 16 }}>
                              <Typography
                                variant="body2"
                                style={{ color: '#6b7280', marginBottom: 8 }}
                              >
                                Phone Number
                              </Typography>

                              <PhoneInput
                                country="tz"
                                onlyCountries={['tz']}
                                masks={{ tz: '(...) ... - ...' }}
                                prefix="+"
                                countryCodeEditable={false}
                                value={values.phone}
                                onChange={(value) => {
                                  setFieldValue('phone', '+' + value);
                                }}
                                inputStyle={{
                                  width: '100%',
                                  height: 56,
                                  borderRadius: 4,
                                  border: '1px solid #c4c4c4'
                                }}
                                buttonStyle={{
                                  borderTopLeftRadius: 4,
                                  borderBottomLeftRadius: 4
                                }}
                              />

                              {touched.phone && errors.phone ? (
                                <Typography
                                  variant="caption"
                                  style={{ color: '#d32f2f', marginTop: 6, display: 'block' }}
                                >
                                  {errors.phone}
                                </Typography>
                              ) : null}
                            </Box>
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <TextField
                              select
                              error={Boolean(touched.active && errors.active)}
                              fullWidth
                              helperText={touched.active && errors.active}
                              label="Business Status"
                              margin="normal"
                              name="active"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.active}
                              variant="outlined"
                            >
                              <MenuItem value="0">Inactive</MenuItem>
                              <MenuItem value="1">Active</MenuItem>
                            </TextField>
                          </Grid>

                          <Grid item xs={12}>
                            <Typography
                              variant="h6"
                              style={{ fontWeight: 700, color: '#111827', marginBottom: 8 }}
                            >
                              Business Location
                            </Typography>
                            <Typography
                              variant="body2"
                              style={{ color: '#6b7280', marginBottom: 12 }}
                            >
                              Search and select the business address to improve location accuracy.
                            </Typography>

                            <PlacesAutocomplete
                              value={address}
                              onChange={handleAddressChange}
                              onSelect={handleAddressSelect}
                              searchOptions={{
                                componentRestrictions: { country: ['tza'] }
                              }}
                            >
                              {({
                                getInputProps,
                                suggestions,
                                getSuggestionItemProps,
                                loading
                              }) => (
                                <div>
                                  <TextField
                                    fullWidth
                                    label="Search address"
                                    margin="normal"
                                    name="location"
                                    onBlur={handleBlur}
                                    variant="outlined"
                                    {...getInputProps()}
                                  />

                                  <Box style={locationBoxStyle}>
                                    {loading ? (
                                      <Box style={{ padding: 14 }}>
                                        <Typography variant="body2" color="textPrimary">
                                          Loading locations...
                                        </Typography>
                                      </Box>
                                    ) : null}

                                    {suggestions.map((suggestion) => {
                                      const style = suggestion.active
                                        ? {
                                            backgroundColor: '#f8fafc',
                                            cursor: 'pointer',
                                            padding: 12,
                                            borderBottom: '1px solid #eef2f7'
                                          }
                                        : {
                                            backgroundColor: '#ffffff',
                                            cursor: 'pointer',
                                            padding: 12,
                                            borderBottom: '1px solid #eef2f7'
                                          };

                                      return (
                                        <div
                                          key={suggestion.placeId || suggestion.description}
                                          {...getSuggestionItemProps(suggestion, {
                                            style: style
                                          })}
                                        >
                                          <Grid container alignItems="center" spacing={1}>
                                            <Grid item>
                                              <LocationOnIcon style={{ color: '#0b5ed7' }} />
                                            </Grid>
                                            <Grid item xs>
                                              <Typography
                                                variant="body1"
                                                style={{ color: '#111827', fontWeight: 600 }}
                                              >
                                                {suggestion.formattedSuggestion.mainText}
                                              </Typography>

                                              <Typography
                                                variant="body2"
                                                style={{ color: '#6b7280' }}
                                              >
                                                {suggestion.description}
                                              </Typography>
                                            </Grid>
                                          </Grid>
                                        </div>
                                      );
                                    })}
                                  </Box>
                                </div>
                              )}
                            </PlacesAutocomplete>
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              multiline
                              rows={3}
                              error={Boolean(touched.bio && errors.bio)}
                              fullWidth
                              helperText={touched.bio && errors.bio}
                              label="Bio"
                              margin="normal"
                              name="bio"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.bio}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>

                        {message ? (
                          <Box
                            style={{
                              marginTop: 20,
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
                          style={{ gap: 12, marginTop: 28 }}
                        >
                          <Button
                            variant="outlined"
                            onClick={() => navigate('/app/businesses')}
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
                            {mode === 'edit' ? 'Update Business' : 'Register Business'}
                          </Button>
                        </Box>
                      </form>
                    )}
                  </Formik>
                )}
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
                    <BusinessIcon />
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
                      Keep business information clear, active status accurate and addresses properly selected.
                    </Typography>
                  </Box>
                </Box>

                <Divider style={{ marginBottom: 16 }} />

                <Box style={{ marginBottom: 14 }}>
                  <Typography style={{ fontWeight: 700, color: '#111827' }}>
                    Current Mode
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ color: '#6b7280', marginTop: 4 }}
                  >
                    {mode === 'edit' ? 'Editing an existing business' : 'Creating a new business'}
                  </Typography>
                </Box>

                <Box style={{ marginBottom: 14 }}>
                  <Typography style={{ fontWeight: 700, color: '#111827' }}>
                    Address Status
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ color: '#6b7280', marginTop: 4 }}
                  >
                    {address ? 'Address selected or entered' : 'No address selected yet'}
                  </Typography>
                </Box>

                <Box>
                  <Typography style={{ fontWeight: 700, color: '#111827' }}>
                    Recommended Types
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ color: '#6b7280', marginTop: 4 }}
                  >
                    Retailer, Wholesaler, Dialysis, Insurance Agency
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

export default CreateBusiness;