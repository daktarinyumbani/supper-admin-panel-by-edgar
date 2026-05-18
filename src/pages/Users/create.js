import { useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

const useStyles = makeStyles((theme) => ({
  page: {
    backgroundColor: '#f4f7fb',
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(4)
  },
  container: {
    width: '100%',
    maxWidth: 1200,
    margin: '0 auto',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  hero: {
    color: '#fff',
    padding: theme.spacing(3),
    borderRadius: 20,
    marginBottom: theme.spacing(3),
    background: 'linear-gradient(135deg, #0f4c81 0%, #1d7bb8 100%)',
    boxShadow: '0 16px 40px rgba(15, 76, 129, 0.18)'
  },
  formCard: {
    borderRadius: 20,
    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
    overflow: 'hidden'
  },
  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  sectionTitle: {
    fontWeight: 700,
    color: '#0f172a'
  },
  sectionSubtitle: {
    color: '#64748b',
    marginTop: theme.spacing(0.5)
  },
  inputLabel: {
    fontWeight: 600,
    color: '#334155',
    marginBottom: theme.spacing(0.8)
  },
  phoneWrapper: {
    marginTop: theme.spacing(1),
    '& .react-tel-input': {
      width: '100%'
    },
    '& .react-tel-input .form-control': {
      width: '100%',
      height: 56,
      borderRadius: 10,
      border: '1px solid #cbd5e1',
      fontSize: 16,
      paddingLeft: 52
    },
    '& .react-tel-input .selected-flag': {
      borderRadius: '10px 0 0 10px'
    }
  },
  messageBox: {
    borderRadius: 12,
    padding: theme.spacing(1.5, 2),
    marginTop: theme.spacing(1),
    fontSize: 14
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fecaca'
  },
  successBox: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    border: '1px solid #bbf7d0'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(3),
    flexWrap: 'wrap'
  },
  backButton: {
    borderRadius: 10
  },
  submitButton: {
    borderRadius: 10,
    minWidth: 180,
    boxShadow: 'none'
  }
}));

const validationSchema = Yup.object().shape({
  first_name: Yup.string()
    .max(64)
    .required('First name is required'),
  last_name: Yup.string()
    .max(64)
    .required('Last name is required'),
  phone: Yup.string().required('Phone is required'),
  email: Yup.string()
    .email('Must be a valid email')
    .max(255)
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

const CreateUser = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');

  const createUser = async (values, helpers) => {
    setMessage('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}admin/users/create-admin`,
        values,
        {
          responseType: 'json'
        }
      );

      if (response && response.data && response.data.status) {
        setMessageType('success');
        setMessage(response.data.message || 'Admin user created successfully.');
        helpers.setSubmitting(false);

        navigate('/app/users');
        return;
      }

      setMessageType('error');
      setMessage(
        (response && response.data && response.data.message)
          || 'Something went wrong. Please try again.'
      );
    } catch (error) {
      const apiMessage = error
        && error.response
        && error.response.data
        && error.response.data.message;

      setMessageType('error');
      setMessage(apiMessage || 'Something went wrong. Please try again.');
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Admin User</title>
      </Helmet>

      <Box className={classes.page}>
        <Container maxWidth={false} className={classes.container}>
          <Box className={classes.hero}>
            <Typography variant="h4" style={{ fontWeight: 700 }}>
              Create Admin User
            </Typography>

            <Typography
              variant="body1"
              style={{ marginTop: 8, opacity: 0.92, maxWidth: 760 }}
            >
              Register a new administrator with a clean, secure and responsive form.
            </Typography>
          </Box>

          <Card className={classes.formCard}>
            <CardContent>
              <Box className={classes.formHeader}>
                <Box>
                  <Typography className={classes.sectionTitle} variant="h5">
                    Admin Registration Form
                  </Typography>
                  <Typography className={classes.sectionSubtitle} variant="body2">
                    Fill in the details below to create a new admin account.
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ArrowBackIcon />}
                  className={classes.backButton}
                  onClick={() => navigate('/app/users')}
                >
                  Back to Users
                </Button>
              </Box>

              <Formik
                initialValues={{
                  first_name: '',
                  last_name: '',
                  email: '',
                  phone: '',
                  password: ''
                }}
                validationSchema={validationSchema}
                onSubmit={(values, helpers) => {
                  createUser(values, helpers);
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
                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <Typography className={classes.inputLabel} variant="body2">
                          First Name
                        </Typography>
                        <TextField
                          error={Boolean(touched.first_name && errors.first_name)}
                          fullWidth
                          helperText={touched.first_name && errors.first_name}
                          name="first_name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="text"
                          value={values.first_name}
                          variant="outlined"
                          placeholder="Enter first name"
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Typography className={classes.inputLabel} variant="body2">
                          Last Name
                        </Typography>
                        <TextField
                          error={Boolean(touched.last_name && errors.last_name)}
                          fullWidth
                          helperText={touched.last_name && errors.last_name}
                          name="last_name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="text"
                          value={values.last_name}
                          variant="outlined"
                          placeholder="Enter last name"
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Typography className={classes.inputLabel} variant="body2">
                          Email Address
                        </Typography>
                        <TextField
                          error={Boolean(touched.email && errors.email)}
                          fullWidth
                          helperText={touched.email && errors.email}
                          name="email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="email"
                          value={values.email}
                          variant="outlined"
                          placeholder="Enter email address"
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Typography className={classes.inputLabel} variant="body2">
                          Phone Number
                        </Typography>
                        <Box className={classes.phoneWrapper}>
                          <PhoneInput
                            country="tz"
                            onlyCountries={['tz']}
                            masks={{ tz: '(...) ... - ...' }}
                            prefix="+"
                            countryCodeEditable={false}
                            value={values.phone.replace(/^\+/, '')}
                            onChange={(value) => {
                              setFieldValue('phone', `+${value}`);
                            }}
                          />
                        </Box>
                        {touched.phone && errors.phone && (
                          <Typography
                            variant="caption"
                            style={{ color: '#d32f2f', marginTop: 6, display: 'block' }}
                          >
                            {errors.phone}
                          </Typography>
                        )}
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Typography className={classes.inputLabel} variant="body2">
                          Password
                        </Typography>
                        <TextField
                          error={Boolean(touched.password && errors.password)}
                          fullWidth
                          helperText={touched.password && errors.password}
                          name="password"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="password"
                          value={values.password}
                          variant="outlined"
                          placeholder="Enter password"
                        />
                      </Grid>
                    </Grid>

                    {message && (
                      <Box
                        className={`${classes.messageBox} ${
                          messageType === 'success'
                            ? classes.successBox
                            : classes.errorBox
                        }`}
                      >
                        {message}
                      </Box>
                    )}

                    <Box className={classes.actions}>
                      <Button
                        variant="outlined"
                        color="default"
                        className={classes.backButton}
                        onClick={() => navigate('/app/users')}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>

                      <Button
                        color="primary"
                        disabled={isSubmitting}
                        size="large"
                        type="submit"
                        variant="contained"
                        startIcon={
                          isSubmitting ? <CircularProgress size={18} color="inherit" /> : <PersonAddIcon />
                        }
                        className={classes.submitButton}
                      >
                        {isSubmitting ? 'Creating...' : 'Create Admin User'}
                      </Button>
                    </Box>
                  </form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default CreateUser;
