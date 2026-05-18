/* eslint-disable */
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Typography
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import LockIcon from '@material-ui/icons/Lock';

const SettingsPassword = (props) => {
  const [values, setValues] = useState({
    currentPassword: '',
    password: '',
    confirm: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });

    setErrors({
      ...errors,
      [event.target.name]: ''
    });

    setMessage('');
    setSuccess('');
  };

  const validate = () => {
    const nextErrors = {};

    if (!values.currentPassword) {
      nextErrors.currentPassword = 'Current password is required';
    }

    if (!values.password) {
      nextErrors.password = 'New password is required';
    } else if (values.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters';
    }

    if (!values.confirm) {
      nextErrors.confirm = 'Please confirm your new password';
    } else if (values.password !== values.confirm) {
      nextErrors.confirm = 'Passwords do not match';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    setMessage('');
    setSuccess('');

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      /*
        Connect your password update API here.
        Example:
        await axios.post('/your-endpoint', values)
      */

      setSuccess('Password form validated successfully. Connect your update API to save changes.');
      setValues({
        currentPassword: '',
        password: '',
        confirm: ''
      });
    } catch (error) {
      setMessage('Failed to update password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form {...props} onSubmit={handleSubmit}>
      <Card
        style={{
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 12px 34px rgba(15, 23, 42, 0.08)'
        }}
      >
        <CardHeader
          title="Password"
          subheader="Update your password for better account security"
          avatar={<LockIcon style={{ color: '#0b5ed7' }} />}
        />
        <Divider />
        <CardContent>
          <TextField
            error={Boolean(errors.currentPassword)}
            fullWidth
            helperText={errors.currentPassword}
            label="Current Password"
            margin="normal"
            name="currentPassword"
            onChange={handleChange}
            type="password"
            value={values.currentPassword}
            variant="outlined"
          />

          <TextField
            error={Boolean(errors.password)}
            fullWidth
            helperText={errors.password}
            label="New Password"
            margin="normal"
            name="password"
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />

          <TextField
            error={Boolean(errors.confirm)}
            fullWidth
            helperText={errors.confirm}
            label="Confirm New Password"
            margin="normal"
            name="confirm"
            onChange={handleChange}
            type="password"
            value={values.confirm}
            variant="outlined"
          />

          {message ? (
            <Box
              style={{
                marginTop: 16,
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

          {success ? (
            <Box
              style={{
                marginTop: 16,
                padding: 14,
                borderRadius: 12,
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0'
              }}
            >
              <Typography style={{ color: '#047857', fontWeight: 600 }}>
                {success}
              </Typography>
            </Box>
          ) : null}
        </CardContent>
        <Divider />
        <Box
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: 16
          }}
        >
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={isSubmitting}
            startIcon={<SaveIcon />}
            style={{
              borderRadius: 12,
              textTransform: 'none',
              fontWeight: 700,
              minWidth: 180
            }}
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default SettingsPassword;