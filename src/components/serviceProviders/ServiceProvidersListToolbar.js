/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import { useNavigate } from 'react-router-dom';

const ServiceProvidersListToolbar = ({
  total,
  loading,
  onRefresh,
  ...props
}) => {
  const navigate = useNavigate();

  return (
    <Box {...props}>
      <Card
        style={{
          borderRadius: 22,
          overflow: 'hidden',
          boxShadow: '0 14px 40px rgba(15, 23, 42, 0.08)',
          background:
            'linear-gradient(135deg, #0f172a 0%, #0b5ed7 50%, #0ea5e9 100%)'
        }}
      >
        <CardContent style={{ padding: 28 }}>
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="center"
            style={{ gap: 16 }}
          >
            <Box>
              <Chip
                label="Healthcare Provider Management"
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
                Service Providers Dashboard
              </Typography>

              <Typography
                variant="body1"
                style={{
                  color: 'rgba(255,255,255,0.84)',
                  maxWidth: 760
                }}
              >
                Manage healthcare professionals, review provider records and keep
                consultation data clean, searchable and professional.
              </Typography>

              <Typography
                variant="body2"
                style={{
                  color: 'rgba(255,255,255,0.72)',
                  marginTop: 12
                }}
              >
                <strong>{total}</strong> provider{total === 1 ? '' : 's'} available
              </Typography>
            </Box>

            <Box display="flex" flexWrap="wrap" style={{ gap: 12 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={onRefresh}
                disabled={loading}
                style={{
                  borderRadius: 12,
                  borderColor: 'rgba(255,255,255,0.35)',
                  color: '#ffffff',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Refresh
              </Button>

              <Button
                color="primary"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('create')}
                style={{
                  borderRadius: 12,
                  minWidth: 190,
                  backgroundColor: '#ffffff',
                  color: '#0b5ed7',
                  textTransform: 'none',
                  fontWeight: 700,
                  boxShadow: 'none'
                }}
              >
                Add Service Provider
              </Button>
            </Box>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            style={{
              marginTop: 18,
              padding: '10px 14px',
              borderRadius: 12,
              backgroundColor: 'rgba(255,255,255,0.10)',
              color: '#ffffff',
              width: 'fit-content'
            }}
          >
            <LocalHospitalIcon style={{ marginRight: 8 }} />
            <Typography variant="body2" style={{ fontWeight: 600 }}>
              Provider directory overview
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

ServiceProvidersListToolbar.propTypes = {
  total: PropTypes.number,
  loading: PropTypes.bool,
  onRefresh: PropTypes.func
};

ServiceProvidersListToolbar.defaultProps = {
  total: 0,
  loading: false,
  onRefresh: function () {}
};

export default ServiceProvidersListToolbar;