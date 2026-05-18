/* eslint-disable */
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Typography
} from '@material-ui/core';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import SaveIcon from '@material-ui/icons/Save';

const SettingsNotifications = (props) => {
  const [values, setValues] = useState({
    notificationsEmail: true,
    notificationsPush: true,
    notificationsText: false,
    notificationsCalls: true,
    messagesEmail: true,
    messagesPush: false,
    messagesCalls: true
  });

  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.checked
    });

    setSuccess('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    /*
      Connect your notifications settings API here if needed.
    */

    setSuccess('Notification preferences saved locally.');
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
          title="Notifications"
          subheader="Manage how you receive alerts and communication"
          avatar={<NotificationsActiveIcon style={{ color: '#10b981' }} />}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item md={6} sm={6} xs={12}>
              <Typography
                variant="h6"
                style={{ color: '#111827', fontWeight: 700, marginBottom: 12 }}
              >
                Notifications
              </Typography>

              <FormControlLabel
                control={(
                  <Checkbox
                    color="primary"
                    checked={values.notificationsEmail}
                    onChange={handleChange}
                    name="notificationsEmail"
                  />
                )}
                label="Email"
              />

              <FormControlLabel
                control={(
                  <Checkbox
                    color="primary"
                    checked={values.notificationsPush}
                    onChange={handleChange}
                    name="notificationsPush"
                  />
                )}
                label="Push Notifications"
              />

              <FormControlLabel
                control={(
                  <Checkbox
                    color="primary"
                    checked={values.notificationsText}
                    onChange={handleChange}
                    name="notificationsText"
                  />
                )}
                label="Text Messages"
              />

              <FormControlLabel
                control={(
                  <Checkbox
                    color="primary"
                    checked={values.notificationsCalls}
                    onChange={handleChange}
                    name="notificationsCalls"
                  />
                )}
                label="Phone Calls"
              />
            </Grid>

            <Grid item md={6} sm={6} xs={12}>
              <Typography
                variant="h6"
                style={{ color: '#111827', fontWeight: 700, marginBottom: 12 }}
              >
                Messages
              </Typography>

              <FormControlLabel
                control={(
                  <Checkbox
                    color="primary"
                    checked={values.messagesEmail}
                    onChange={handleChange}
                    name="messagesEmail"
                  />
                )}
                label="Email"
              />

              <FormControlLabel
                control={(
                  <Checkbox
                    color="primary"
                    checked={values.messagesPush}
                    onChange={handleChange}
                    name="messagesPush"
                  />
                )}
                label="Push Notifications"
              />

              <FormControlLabel
                control={(
                  <Checkbox
                    color="primary"
                    checked={values.messagesCalls}
                    onChange={handleChange}
                    name="messagesCalls"
                  />
                )}
                label="Phone Calls"
              />
            </Grid>
          </Grid>

          {success ? (
            <Box
              style={{
                marginTop: 20,
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
            startIcon={<SaveIcon />}
            style={{
              borderRadius: 12,
              textTransform: 'none',
              fontWeight: 700,
              minWidth: 160
            }}
          >
            Save Preferences
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default SettingsNotifications;