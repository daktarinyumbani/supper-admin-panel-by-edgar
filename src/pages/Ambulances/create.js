/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/Save';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete';

import {
  makeGetRequest,
  makePostRequest,
  makePutRequest
} from 'src/services/httpservice';

const ADMIN_AMBULANCES_ENDPOINT = '/admin/ambulances';

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

const defaultInitialValues = {
  first_name: '',
  last_name: '',
  company_name: '',
  phone: '',
  password: '000000000',
  qualification: '',
  reg_number: '',
  board_status: '',
  current_hospital: '',
  latitude: '',
  longitude: '',
  address: '',
  bio: '',
  cost: 0
};

const extractAmbulanceFromResponse = (response) => {
  if (
    response &&
    response.data &&
    response.data.ambulance
  ) {
    return response.data.ambulance;
  }

  if (response && response.ambulance) {
    return response.ambulance;
  }

  if (response && response.data && !Array.isArray(response.data)) {
    return response.data;
  }

  return null;
};

const getUserData = (ambulance) => {
  if (ambulance && ambulance.user) {
    return ambulance.user;
  }

  return {};
};

const mapAmbulanceToFormValues = (ambulance) => {
  const user = getUserData(ambulance);

  return {
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    company_name: ambulance && ambulance.company_name ? ambulance.company_name : '',
    phone: user.phone || '',
    password: '000000000',
    qualification: ambulance && ambulance.qualification ? ambulance.qualification : '',
    reg_number: ambulance && ambulance.reg_number ? ambulance.reg_number : '',
    board_status: ambulance && ambulance.board_status ? ambulance.board_status : '',
    current_hospital:
      ambulance && ambulance.current_hospital ? ambulance.current_hospital : '',
    latitude: ambulance && ambulance.latitude ? String(ambulance.latitude) : '',
    longitude: ambulance && ambulance.longitude ? String(ambulance.longitude) : '',
    address: ambulance && ambulance.address ? ambulance.address : '',
    bio: ambulance && ambulance.bio ? ambulance.bio : '',
    cost:
      ambulance &&
      ambulance.cost !== undefined &&
      ambulance.cost !== null
        ? ambulance.cost
        : 0
  };
};

const isSuccessfulResponse = (response) => {
  if (!response) {
    return false;
  }

  if (response.status === true) {
    return true;
  }

  if (response.data && response.data.status === true) {
    return true;
  }

  return false;
};

const getResponseMessage = (response, fallbackMessage) => {
  if (response && response.message) {
    return response.message;
  }

  if (response && response.data && response.data.message) {
    return response.data.message;
  }

  return fallbackMessage;
};

const CreateAmbulance = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;

  const [message, setMessage] = useState('');
  const [address, setAddress] = useState('');
  const [latLng, setLatLng] = useState({
    lat: '',
    lng: ''
  });
  const [initialValues, setInitialValues] = useState(defaultInitialValues);
  const [mode, setMode] = useState(id ? 'edit' : 'create');
  const [loadingDetails, setLoadingDetails] = useState(false);

  const getDetails = async (ambulanceId) => {
    try {
      setLoadingDetails(true);
      setMessage('');

      const response = await makeGetRequest(
        ADMIN_AMBULANCES_ENDPOINT + '/' + ambulanceId
      );

      const ambulance = extractAmbulanceFromResponse(response);

      if (!response || !response.status || !ambulance) {
        setMessage('Failed to fetch ambulance details.');
        return;
      }

      setMode('edit');
      setAddress(ambulance.address || '');
      setLatLng({
        lat: ambulance.latitude ? String(ambulance.latitude) : '',
        lng: ambulance.longitude ? String(ambulance.longitude) : ''
      });
      setInitialValues(mapAmbulanceToFormValues(ambulance));
    } catch (error) {
      console.error(error);
      setMessage(error.message || 'Failed to fetch ambulance details.');
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (id) {
      getDetails(id);
      return;
    }

    setMode('create');
    setInitialValues(defaultInitialValues);
    setAddress('');
    setLatLng({ lat: '', lng: '' });
  }, [id]);

  const handleAddressChange = (nextAddress) => {
    setAddress(nextAddress);
  };

  const handleAddressSelect = (selectedAddress) => {
    setAddress(selectedAddress);

    geocodeByAddress(selectedAddress)
      .then((results) => getLatLng(results[0]))
      .then((coords) => {
        setLatLng({
          lat: String(coords.lat),
          lng: String(coords.lng)
        });
      })
      .catch((error) => {
        console.error('Address geocode error:', error);
      });
  };

  const createAmbulance = async (values) => {
    try {
      setMessage('');

      const response = await makePostRequest(ADMIN_AMBULANCES_ENDPOINT, values);
      console.log('Create ambulance response:', response);

      if (isSuccessfulResponse(response)) {
        navigate('/app/ambulances');
        return;
      }

      setMessage(
        getResponseMessage(
          response,
          'Ambulance was not created. Please check the submitted details.'
        )
      );
    } catch (error) {
      console.error(error);
      setMessage(error.message || 'Something went wrong. Please try again.');
    }
  };

  const updateAmbulance = async (values) => {
    try {
      setMessage('');

      const response = await makePutRequest(
        ADMIN_AMBULANCES_ENDPOINT + '/' + id,
        values
      );

      console.log('Update ambulance response:', response);

      if (isSuccessfulResponse(response)) {
        navigate('/app/ambulances/' + id + '/details');
        return;
      }

      setMessage(
        getResponseMessage(
          response,
          'Something went wrong updating details. Please try again.'
        )
      );
    } catch (error) {
      console.error(error);
      setMessage(
        error.message || 'Something went wrong updating details. Please try again.'
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>{mode === 'edit' ? 'Update Ambulance' : 'Create Ambulance'}</title>
      </Helmet>

      <Box style={pageBackground}>
        <Container maxWidth="lg">
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
                    {mode === 'edit' ? 'Update Ambulance' : 'Register Ambulance'}
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 720 }}
                  >
                    Manage ambulance provider records with a cleaner professional
                    admin form for personnel, registration, hospital and location details.
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/app/ambulances')}
                  style={{
                    borderColor: 'rgba(255,255,255,0.35)',
                    color: '#ffffff',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    borderRadius: 12,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Back to Ambulances
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
                      first_name: Yup.string()
                        .max(64)
                        .required('First name is required'),
                      last_name: Yup.string()
                        .max(64)
                        .required('Last name is required'),
                      company_name: Yup.string()
                        .required('Company name is required'),
                      phone: Yup.string()
                        .required('Phone is required'),
                      reg_number: Yup.string()
                        .max(64)
                        .required('Registration number is required'),
                      board_status: Yup.string()
                        .required('Board status is required'),
                      current_hospital: Yup.string()
                        .max(128)
                        .required('Current hospital is required'),
                      bio: Yup.string()
                        .required('Bio is required'),
                      cost: Yup.number()
                        .typeError('Cost must be a number')
                        .min(0, 'Cost cannot be negative')
                    })}
                    onSubmit={async (values, { setSubmitting }) => {
                      setMessage('');

                      if (!address) {
                        setMessage('Ambulance address is required.');
                        setSubmitting(false);
                        return;
                      }

                      const payload = {
                        first_name: values.first_name,
                        last_name: values.last_name,
                        company_name: values.company_name,
                        phone: values.phone,
                        password: values.password,
                        qualification: values.qualification,
                        reg_number: values.reg_number,
                        board_status: values.board_status,
                        current_hospital: values.current_hospital,
                        latitude: latLng.lat ? latLng.lat : values.latitude,
                        longitude: latLng.lng ? latLng.lng : values.longitude,
                        address: address,
                        bio: values.bio,
                        cost: values.cost
                      };

                      if (mode === 'edit') {
                        await updateAmbulance(payload);
                      } else {
                        await createAmbulance(payload);
                      }

                      setSubmitting(false);
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
                            Ambulance Information
                          </Typography>
                          <Typography variant="body2" style={{ color: '#6b7280' }}>
                            Enter the ambulance provider details, board status,
                            hospital assignment and location information.
                          </Typography>
                        </Box>

                        <Divider style={{ marginBottom: 24 }} />

                        <Grid container spacing={3}>
                          <Grid item lg={4} md={6} sm={6} xs={12}>
                            <TextField
                              error={Boolean(touched.first_name && errors.first_name)}
                              fullWidth
                              helperText={touched.first_name && errors.first_name}
                              label="First Name"
                              margin="normal"
                              name="first_name"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.first_name}
                              variant="outlined"
                            />
                          </Grid>

                          <Grid item lg={4} md={6} sm={6} xs={12}>
                            <TextField
                              error={Boolean(touched.last_name && errors.last_name)}
                              fullWidth
                              helperText={touched.last_name && errors.last_name}
                              label="Last Name"
                              margin="normal"
                              name="last_name"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.last_name}
                              variant="outlined"
                            />
                          </Grid>

                          <Grid item lg={4} md={12} sm={12} xs={12}>
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
                                  setFieldValue('phone', value);
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
                                  color="error"
                                  variant="caption"
                                  style={{ display: 'block', marginTop: 8 }}
                                >
                                  {errors.phone}
                                </Typography>
                              ) : null}
                            </Box>
                          </Grid>

                          <Grid item lg={4} md={6} sm={6} xs={12}>
                            <TextField
                              error={Boolean(touched.company_name && errors.company_name)}
                              fullWidth
                              helperText={touched.company_name && errors.company_name}
                              label="Company Name"
                              margin="normal"
                              name="company_name"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.company_name}
                              variant="outlined"
                            />
                          </Grid>

                          <Grid item lg={4} md={6} sm={6} xs={12}>
                            <TextField
                              error={Boolean(touched.reg_number && errors.reg_number)}
                              fullWidth
                              helperText={touched.reg_number && errors.reg_number}
                              label="Registration Number"
                              margin="normal"
                              name="reg_number"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.reg_number}
                              variant="outlined"
                            />
                          </Grid>

                          <Grid item lg={4} md={6} sm={6} xs={12}>
                            <TextField
                              select
                              error={Boolean(touched.board_status && errors.board_status)}
                              fullWidth
                              helperText={touched.board_status && errors.board_status}
                              label="Board Status"
                              margin="normal"
                              name="board_status"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.board_status}
                              variant="outlined"
                            >
                              <MenuItem value="registered">Not allowed to practice</MenuItem>
                              <MenuItem value="allowed">Allowed to practice</MenuItem>
                            </TextField>
                          </Grid>

                          <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                              error={Boolean(
                                touched.current_hospital && errors.current_hospital
                              )}
                              fullWidth
                              helperText={
                                touched.current_hospital && errors.current_hospital
                              }
                              label="Current Hospital"
                              margin="normal"
                              name="current_hospital"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.current_hospital}
                              variant="outlined"
                            />
                          </Grid>

                          <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                              error={Boolean(touched.cost && errors.cost)}
                              fullWidth
                              helperText={touched.cost && errors.cost}
                              label="Cost"
                              margin="normal"
                              name="cost"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              type="number"
                              value={values.cost}
                              variant="outlined"
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <Typography
                              variant="h6"
                              style={{ fontWeight: 700, color: '#111827', marginBottom: 8 }}
                            >
                              Ambulance Location
                            </Typography>
                            <Typography
                              variant="body2"
                              style={{ color: '#6b7280', marginBottom: 12 }}
                            >
                              Search and select the ambulance address to improve location accuracy.
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
                              fullWidth
                              label="Selected Address"
                              margin="normal"
                              name="address"
                              variant="outlined"
                              value={address}
                              onChange={handleAddressChange}
                              helperText="You can still type the address manually if needed."
                            />
                          </Grid>

                          <Grid item md={6} xs={12}>
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

                          <Grid item md={6} xs={12}>
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

                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              margin="normal"
                              name="qualification"
                              label="Qualification"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.qualification}
                              variant="outlined"
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              multiline
                              minRows={4}
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
                            onClick={() => navigate('/app/ambulances')}
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
                            disabled={isSubmitting || loadingDetails}
                            size="large"
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            style={{
                              borderRadius: 12,
                              minWidth: 190,
                              textTransform: 'none',
                              fontWeight: 700,
                              boxShadow: '0 10px 24px rgba(37, 99, 235, 0.22)'
                            }}
                          >
                            {mode === 'edit' ? 'Update Ambulance' : 'Register Ambulance'}
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
                    <LocalShippingIcon />
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
                      Keep ambulance provider records complete, registration accurate and locations properly selected.
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
                    {mode === 'edit' ? 'Editing an existing ambulance' : 'Creating a new ambulance'}
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
                    Supported Board Status
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ color: '#6b7280', marginTop: 4 }}
                  >
                    Registered, Allowed
                  </Typography>
                </Box>

                <Box style={{ marginTop: 18 }}>
                  <Typography style={{ fontWeight: 700, color: '#111827' }}>
                    Location Coordinates
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ color: '#6b7280', marginTop: 4 }}
                  >
                    Latitude: {latLng.lat || '-'}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ color: '#6b7280', marginTop: 2 }}
                  >
                    Longitude: {latLng.lng || '-'}
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

export default CreateAmbulance;