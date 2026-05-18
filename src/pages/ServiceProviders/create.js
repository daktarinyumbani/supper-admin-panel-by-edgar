/* eslint-disable no-param-reassign */
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import SaveIcon from '@material-ui/icons/Save';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete';
import { useNavigate, useParams } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';

import 'react-phone-input-2/lib/material.css';

const API_BASE = String(process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

const API_ENDPOINTS = {
  services: API_BASE + '/admin/services',
  specialties: API_BASE + '/admin/specialties',
  serviceProviders: API_BASE + '/admin/service-providers'
};

const emptyInitialValues = {
  first_name: '',
  last_name: '',
  phone: '',
  password: '000000000',
  specialty_id: '',
  qualification: '',
  reg_number: '',
  board_status: '',
  current_hospital: '',
  latitude: '',
  longitude: '',
  address: '',
  bio: '',
  cost: 0,
  services: ''
};

const validationSchema = Yup.object().shape({
  first_name: Yup.string().max(64).required('First name is required'),
  last_name: Yup.string().max(64).required('Last name is required'),
  phone: Yup.string().required('Phone is required'),
  specialty_id: Yup.string().required('Specialty is required'),
  qualification: Yup.string().required('Qualification is required'),
  reg_number: Yup.string().max(64).required('Registration number is required'),
  board_status: Yup.string().required('Board status is required'),
  current_hospital: Yup.string()
    .max(100)
    .required('Current hospital is required'),
  bio: Yup.string().required('Bio is required'),
  cost: Yup.number()
    .typeError('Cost must be a valid number')
    .min(0, 'Cost cannot be negative')
    .required('Cost is required')
});

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

const fieldCardStyle = {
  borderRadius: 16,
  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
  border: '1px solid #eef2f7'
};

const sectionTitleStyle = {
  fontWeight: 700,
  color: '#111827',
  marginBottom: 6
};

const sectionSubtitleStyle = {
  color: '#6b7280',
  marginBottom: 16
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

const getTokenHeader = () => {
  const tokenString = localStorage.getItem('token');

  if (!tokenString) {
    return {};
  }

  try {
    const parsed = JSON.parse(tokenString);
    let tokenPlain = parsed;

    if (
      parsed &&
      parsed.token &&
      parsed.token.plainTextToken
    ) {
      tokenPlain = parsed.token.plainTextToken;
    }

    return { Authorization: 'Bearer ' + tokenPlain };
  } catch (error) {
    return { Authorization: 'Bearer ' + tokenString };
  }
};

const requestConfig = () => ({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...getTokenHeader()
  }
});

const getMessageStyle = (type) => {
  if (type === 'error') {
    return {
      background: '#fff1f2',
      border: '1px solid #fecdd3',
      color: '#9f1239'
    };
  }

  if (type === 'success') {
    return {
      background: '#ecfdf5',
      border: '1px solid #a7f3d0',
      color: '#065f46'
    };
  }

  return {
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    color: '#1d4ed8'
  };
};

const getModeText = (mode, type) => {
  const isEditMode = mode === 'edit';

  if (type === 'pageTitle') {
    if (isEditMode) return 'Update Service Provider';
    return 'Create Service Provider';
  }

  if (type === 'headerTitle') {
    if (isEditMode) return 'Update Service Provider';
    return 'Register Service Provider';
  }

  if (type === 'submitIdle') {
    if (isEditMode) return 'Update Service Provider';
    return 'Create Service Provider';
  }

  if (type === 'submitLoading') {
    if (isEditMode) return 'Updating...';
    return 'Saving...';
  }

  return '';
};

const getErrorMessage = (error, fallback) => {
  if (
    error &&
    error.response &&
    error.response.data &&
    error.response.data.message
  ) {
    return error.response.data.message;
  }

  if (error && error.message) {
    return error.message;
  }

  return fallback;
};

const getSuggestionText = (suggestion) => {
  if (
    suggestion &&
    suggestion.formattedSuggestion &&
    suggestion.formattedSuggestion.mainText
  ) {
    return suggestion.formattedSuggestion.mainText;
  }

  return suggestion.description;
};

const CreateServiceProvider = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;

  const [mode, setMode] = useState('create');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [pageLoading, setPageLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [specialtiesLoading, setSpecialtiesLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [address, setAddress] = useState('');
  const [latLng, setLatLng] = useState({ lat: '', lng: '' });
  const [selectedServices, setSelectedServices] = useState([]);
  const [initialValues, setInitialValues] = useState(emptyInitialValues);

  const pageTitle = getModeText(mode, 'pageTitle');
  const headerTitle = getModeText(mode, 'headerTitle');

  const onServiceChecked = (serviceId) => {
    setSelectedServices((prev) => {
      if (prev.indexOf(serviceId) !== -1) {
        return prev.filter((item) => item !== serviceId);
      }

      return prev.concat(serviceId);
    });
  };

  const getDetails = async (serviceProviderId) => {
    const response = await axios.get(
      API_ENDPOINTS.serviceProviders + '/' + serviceProviderId,
      requestConfig()
    );

    const responseJson = response.data;

    if (!responseJson || !responseJson.status) {
      throw new Error('Failed to load service provider details.');
    }

    const serviceProvider = responseJson.data.provider;

    setMode('edit');
    setAddress(serviceProvider.address || '');
    setLatLng({
      lat: serviceProvider.latitude ? String(serviceProvider.latitude) : '',
      lng: serviceProvider.longitude ? String(serviceProvider.longitude) : ''
    });

    if (serviceProvider.services) {
      setSelectedServices(
        serviceProvider.services.map((service) => service.id)
      );
    } else {
      setSelectedServices([]);
    }

    setInitialValues({
      first_name:
        serviceProvider.user && serviceProvider.user.first_name
          ? serviceProvider.user.first_name
          : '',
      last_name:
        serviceProvider.user && serviceProvider.user.last_name
          ? serviceProvider.user.last_name
          : '',
      phone: String(
        serviceProvider.user && serviceProvider.user.phone
          ? serviceProvider.user.phone
          : ''
      ).replace(/\D/g, ''),
      password: '000000000',
      specialty_id: String(serviceProvider.specialty_id || ''),
      qualification: serviceProvider.qualification || '',
      reg_number: serviceProvider.reg_number || '',
      board_status: serviceProvider.board_status || '',
      current_hospital: serviceProvider.current_hospital || '',
      latitude: serviceProvider.latitude ? String(serviceProvider.latitude) : '',
      longitude: serviceProvider.longitude ? String(serviceProvider.longitude) : '',
      address: serviceProvider.address || '',
      bio: serviceProvider.bio || '',
      cost: serviceProvider.cost || 0,
      services: ''
    });
  };

  const getSpecialties = async () => {
    setSpecialtiesLoading(true);

    try {
      const response = await axios.get(
        API_ENDPOINTS.specialties,
        requestConfig()
      );
      const responseJson = response.data;

      if (responseJson && responseJson.status) {
        setSpecialties(responseJson.data.specialties || []);
        return;
      }

      throw new Error('Failed to load specialties.');
    } finally {
      setSpecialtiesLoading(false);
    }
  };

  const getServices = async () => {
    setServicesLoading(true);

    try {
      const response = await axios.get(
        API_ENDPOINTS.services,
        requestConfig()
      );
      const responseJson = response.data;

      if (responseJson && responseJson.status) {
        setServices(responseJson.data.services || []);
        return;
      }

      throw new Error('Failed to load services.');
    } finally {
      setServicesLoading(false);
    }
  };

  const createServiceProvider = async (payload) => {
    const response = await axios.post(
      API_ENDPOINTS.serviceProviders,
      payload,
      requestConfig()
    );

    if (response.data && response.data.status) {
      navigate('/app/service-providers');
      return;
    }

    throw new Error(
      response.data && response.data.message
        ? response.data.message
        : 'Failed to create service provider.'
    );
  };

  const updateServiceProvider = async (payload) => {
    const submitPayload = {
      ...payload,
      _method: 'PUT'
    };

    const response = await axios.post(
      API_ENDPOINTS.serviceProviders + '/' + id,
      submitPayload,
      requestConfig()
    );

    if (response.data && response.data.status) {
      navigate('/app/service-providers/' + id + '/details');
      return;
    }

    throw new Error(
      response.data && response.data.message
        ? response.data.message
        : 'Failed to update service provider.'
    );
  };

  const handleAddressChange = (value) => {
    setAddress(value);
    setLatLng({
      lat: '',
      lng: ''
    });
  };

  const handleAddressSelect = async (value) => {
    try {
      setAddress(value);

      const results = await geocodeByAddress(value);
      const coordinates = await getLatLng(results[0]);

      setLatLng({
        lat: String(coordinates.lat),
        lng: String(coordinates.lng)
      });
    } catch (error) {
      console.error('Error selecting address:', error);
    }
  };

  const loadPageData = async () => {
    setPageLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await Promise.all([
        getServices(),
        getSpecialties(),
        id ? getDetails(id) : Promise.resolve()
      ]);
    } catch (error) {
      console.error(error);
      setMessage({
        type: 'error',
        text: getErrorMessage(error, 'Failed to load form data.')
      });
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, [id]);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <Box style={pageBackground}>
        <Container maxWidth="lg">
          <Card style={headerCardStyle}>
            <CardContent style={{ padding: 28 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography
                    variant="h3"
                    style={{ color: '#ffffff', fontWeight: 700 }}
                  >
                    {headerTitle}
                  </Typography>

                  <Typography
                    variant="body1"
                    style={{ color: 'rgba(255,255,255,0.85)', marginTop: 8 }}
                  >
                    Capture provider identity, professional details,
                    consultation setup, address, and service coverage in one
                    polished admin form.
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 12,
                      flexWrap: 'wrap'
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBackIcon />}
                      onClick={() => navigate('/app/service-providers')}
                      style={{
                        borderColor: 'rgba(255,255,255,0.35)',
                        color: '#ffffff',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        borderRadius: 12,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Back to list
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {message.text ? (
            <Box
              style={{
                ...getMessageStyle(message.type),
                borderRadius: 14,
                padding: '14px 16px',
                marginBottom: 20
              }}
            >
              <Typography variant="body2" style={{ fontWeight: 600 }}>
                {message.text}
              </Typography>
            </Box>
          ) : null}

          {pageLoading ? (
            <Paper
              style={{
                padding: 40,
                borderRadius: 18,
                textAlign: 'center'
              }}
            >
              <CircularProgress />
              <Typography
                variant="body1"
                style={{ marginTop: 16, color: '#6b7280' }}
              >
                Loading form data...
              </Typography>
            </Paper>
          ) : (
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setMessage({ type: '', text: '' });

                if (!address) {
                  setMessage({
                    type: 'error',
                    text: 'Provider address is required.'
                  });
                  setSubmitting(false);
                  return;
                }

                const payload = {
                  ...values,
                  phone: String(values.phone || '').replace(/\D/g, ''),
                  specialty_id: String(values.specialty_id || ''),
                  address: address,
                  latitude: latLng.lat ? latLng.lat : values.latitude,
                  longitude: latLng.lng ? latLng.lng : values.longitude,
                  services: selectedServices
                };

                try {
                  if (mode === 'edit') {
                    await updateServiceProvider(payload);
                  } else {
                    await createServiceProvider(payload);
                  }
                } catch (error) {
                  console.error(error);
                  setMessage({
                    type: 'error',
                    text: getErrorMessage(
                      error,
                      'Something went wrong. Please try again.'
                    )
                  });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                setFieldValue,
                touched,
                values
              }) => {
                const submitButtonText = getModeText(
                  mode,
                  isSubmitting ? 'submitLoading' : 'submitIdle'
                );

                let submitButtonIcon = <SaveIcon />;

                if (isSubmitting) {
                  submitButtonIcon = (
                    <CircularProgress size={18} color="inherit" />
                  );
                }

                return (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Paper style={{ ...fieldCardStyle, padding: 24 }}>
                          <Typography variant="h6" style={sectionTitleStyle}>
                            Personal Information
                          </Typography>
                          <Typography
                            variant="body2"
                            style={sectionSubtitleStyle}
                          >
                            Add the provider’s identity and primary contact
                            details.
                          </Typography>

                          <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                              <TextField
                                error={Boolean(
                                  touched.first_name && errors.first_name
                                )}
                                fullWidth
                                helperText={
                                  touched.first_name && errors.first_name
                                }
                                label="First Name"
                                name="first_name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.first_name}
                                variant="outlined"
                              />
                            </Grid>

                            <Grid item xs={12} md={4}>
                              <TextField
                                error={Boolean(
                                  touched.last_name && errors.last_name
                                )}
                                fullWidth
                                helperText={
                                  touched.last_name && errors.last_name
                                }
                                label="Last Name"
                                name="last_name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.last_name}
                                variant="outlined"
                              />
                            </Grid>

                            <Grid item xs={12} md={4}>
                              <Box>
                                <Typography
                                  variant="body2"
                                  style={{
                                    color: '#4b5563',
                                    marginBottom: 8,
                                    fontWeight: 600
                                  }}
                                >
                                  Phone Number
                                </Typography>

                                <PhoneInput
                                  country="tz"
                                  onlyCountries={['tz']}
                                  masks={{ tz: '(...) ... - ...' }}
                                  prefix="+"
                                  countryCodeEditable={false}
                                  value={String(values.phone || '').replace(
                                    /\D/g,
                                    ''
                                  )}
                                  onChange={(value) => {
                                    setFieldValue(
                                      'phone',
                                      String(value || '').replace(/\D/g, '')
                                    );
                                  }}
                                  inputStyle={{
                                    width: '100%',
                                    height: 56,
                                    borderRadius: 4,
                                    borderColor:
                                      touched.phone && errors.phone
                                        ? '#f44336'
                                        : '#c4c4c4'
                                  }}
                                  containerStyle={{ width: '100%' }}
                                  specialLabel=""
                                />

                                {touched.phone && errors.phone ? (
                                  <Typography
                                    variant="body2"
                                    color="error"
                                    style={{ marginTop: 8 }}
                                  >
                                    {errors.phone}
                                  </Typography>
                                ) : null}
                              </Box>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>

                      <Grid item xs={12}>
                        <Paper style={{ ...fieldCardStyle, padding: 24 }}>
                          <Typography variant="h6" style={sectionTitleStyle}>
                            Professional Details
                          </Typography>
                          <Typography
                            variant="body2"
                            style={sectionSubtitleStyle}
                          >
                            Record specialty, registration, board status, and
                            consultation pricing.
                          </Typography>

                          <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                              <TextField
                                select
                                error={Boolean(
                                  touched.specialty_id && errors.specialty_id
                                )}
                                fullWidth
                                helperText={
                                  touched.specialty_id && errors.specialty_id
                                }
                                label="Specialty"
                                name="specialty_id"
                                onBlur={handleBlur}
                                onChange={(event) => {
                                  setFieldValue(
                                    'specialty_id',
                                    event.target.value
                                  );
                                }}
                                value={values.specialty_id}
                                variant="outlined"
                                disabled={specialtiesLoading}
                              >
                                <MenuItem value="" disabled>
                                  Select specialty
                                </MenuItem>

                                {specialties.map((specialty) => (
                                  <MenuItem
                                    key={specialty.id}
                                    value={String(specialty.id)}
                                  >
                                    {(specialty.category && specialty.category.name
                                      ? specialty.category.name
                                      : '') + ' - ' + specialty.name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>

                            <Grid item xs={12} md={4}>
                              <TextField
                                error={Boolean(
                                  touched.qualification &&
                                  errors.qualification
                                )}
                                fullWidth
                                helperText={
                                  touched.qualification &&
                                  errors.qualification
                                }
                                label="Qualification"
                                name="qualification"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.qualification}
                                variant="outlined"
                              />
                            </Grid>

                            <Grid item xs={12} md={4}>
                              <TextField
                                error={Boolean(
                                  touched.reg_number && errors.reg_number
                                )}
                                fullWidth
                                helperText={
                                  touched.reg_number && errors.reg_number
                                }
                                label="Registration Number"
                                name="reg_number"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.reg_number}
                                variant="outlined"
                              />
                            </Grid>

                            <Grid item xs={12} md={4}>
                              <TextField
                                select
                                error={Boolean(
                                  touched.board_status && errors.board_status
                                )}
                                fullWidth
                                helperText={
                                  touched.board_status && errors.board_status
                                }
                                label="Board Status"
                                name="board_status"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.board_status}
                                variant="outlined"
                              >
                                <MenuItem value="">Select board status</MenuItem>
                                <MenuItem value="registered">
                                  Not allowed to practice
                                </MenuItem>
                                <MenuItem value="allowed">
                                  Allowed to practice
                                </MenuItem>
                              </TextField>
                            </Grid>

                            <Grid item xs={12} md={4}>
                              <TextField
                                error={Boolean(
                                  touched.current_hospital &&
                                  errors.current_hospital
                                )}
                                fullWidth
                                helperText={
                                  touched.current_hospital &&
                                  errors.current_hospital
                                }
                                label="Current Hospital"
                                name="current_hospital"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.current_hospital}
                                variant="outlined"
                              />
                            </Grid>

                            <Grid item xs={12} md={4}>
                              <TextField
                                error={Boolean(touched.cost && errors.cost)}
                                fullWidth
                                helperText={touched.cost && errors.cost}
                                label="Consultation Cost"
                                name="cost"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="number"
                                value={values.cost}
                                variant="outlined"
                              />
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>

                      <Grid item xs={12}>
                        <Paper style={{ ...fieldCardStyle, padding: 24 }}>
                          <Typography variant="h6" style={sectionTitleStyle}>
                            Practice Location
                          </Typography>
                          <Typography
                            variant="body2"
                            style={sectionSubtitleStyle}
                          >
                            Search and select the provider’s working address.
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
                                              style={{
                                                color: '#111827',
                                                fontWeight: 600
                                              }}
                                            >
                                              {getSuggestionText(suggestion)}
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

                          <Grid container spacing={3} style={{ marginTop: 8 }}>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Selected Address"
                                margin="normal"
                                name="address"
                                variant="outlined"
                                value={address}
                                onChange={(event) => {
                                  handleAddressChange(event.target.value);
                                }}
                                helperText="You can still type the address manually if needed."
                              />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="Latitude"
                                margin="normal"
                                name="latitude"
                                variant="outlined"
                                value={latLng.lat}
                                InputProps={{
                                  readOnly: true
                                }}
                              />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="Longitude"
                                margin="normal"
                                name="longitude"
                                variant="outlined"
                                value={latLng.lng}
                                InputProps={{
                                  readOnly: true
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>

                      <Grid item xs={12}>
                        <Paper style={{ ...fieldCardStyle, padding: 24 }}>
                          <Typography variant="h6" style={sectionTitleStyle}>
                            Provider Bio
                          </Typography>
                          <Typography
                            variant="body2"
                            style={sectionSubtitleStyle}
                          >
                            Add a short professional profile for the provider.
                          </Typography>

                          <TextField
                            multiline
                            rows={5}
                            error={Boolean(touched.bio && errors.bio)}
                            fullWidth
                            helperText={touched.bio && errors.bio}
                            label="Professional Bio"
                            name="bio"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.bio}
                            variant="outlined"
                          />
                        </Paper>
                      </Grid>

                      <Grid item xs={12}>
                        <Paper style={{ ...fieldCardStyle, padding: 24 }}>
                          <Typography variant="h6" style={sectionTitleStyle}>
                            Services Offered
                          </Typography>
                          <Typography
                            variant="body2"
                            style={sectionSubtitleStyle}
                          >
                            Select all visible services this provider can offer.
                          </Typography>

                          <Divider style={{ marginBottom: 16 }} />

                          {servicesLoading ? (
                            <Box
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12
                              }}
                            >
                              <CircularProgress size={20} />
                              <Typography
                                variant="body2"
                                style={{ color: '#6b7280' }}
                              >
                                Loading services...
                              </Typography>
                            </Box>
                          ) : (
                            <Grid container spacing={1}>
                              {services
                                .filter((service) => service.visible)
                                .map((service) => (
                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    key={service.id}
                                  >
                                    <Box
                                      style={{
                                        border: '1px solid #e5e7eb',
                                        borderRadius: 12,
                                        padding: '8px 12px',
                                        background: selectedServices.includes(
                                          service.id
                                        )
                                          ? '#eff6ff'
                                          : '#ffffff'
                                      }}
                                    >
                                      <FormControlLabel
                                        style={{ margin: 0, width: '100%' }}
                                        label={service.name}
                                        control={(
                                          <Checkbox
                                            color="primary"
                                            checked={selectedServices.includes(
                                              service.id
                                            )}
                                            onChange={() => {
                                              onServiceChecked(service.id);
                                            }}
                                            inputProps={{
                                              'aria-label': service.name
                                            }}
                                          />
                                        )}
                                      />
                                    </Box>
                                  </Grid>
                                ))}
                            </Grid>
                          )}
                        </Paper>
                      </Grid>

                      <Grid item xs={12}>
                        <Paper
                          style={{
                            ...fieldCardStyle,
                            padding: 20,
                            position: 'sticky',
                            bottom: 16,
                            zIndex: 5
                          }}
                        >
                          <Box
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
                                variant="body1"
                                style={{ fontWeight: 700, color: '#111827' }}
                              >
                                Ready to save?
                              </Typography>
                              <Typography
                                variant="body2"
                                style={{ color: '#6b7280', marginTop: 4 }}
                              >
                                Review the information, then save the provider
                                record.
                              </Typography>
                            </Box>

                            <Box
                              style={{
                                display: 'flex',
                                gap: 12,
                                flexWrap: 'wrap'
                              }}
                            >
                              <Button
                                variant="outlined"
                                onClick={() => navigate('/app/service-providers')}
                                disabled={isSubmitting}
                              >
                                Cancel
                              </Button>

                              <Button
                                color="primary"
                                variant="contained"
                                type="submit"
                                disabled={isSubmitting}
                                startIcon={submitButtonIcon}
                              >
                                {submitButtonText}
                              </Button>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </form>
                );
              }}
            </Formik>
          )}
        </Container>
      </Box>
    </>
  );
};

export default CreateServiceProvider;