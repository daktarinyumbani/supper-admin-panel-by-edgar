/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  TextField,
  Typography
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import SearchIcon from '@material-ui/icons/Search';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import { useNavigate } from 'react-router-dom';

const AmbulancesListToolbar = ({
  searchTerm,
  onSearchChange,
  onRefresh,
  totalCount,
  loading,
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
            style={{ gap: 16, marginBottom: 20 }}
          >
            <Box>
              <Chip
                label="Emergency Transport Management"
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
                Ambulance Management
              </Typography>

              <Typography
                variant="body1"
                style={{
                  color: 'rgba(255,255,255,0.84)',
                  maxWidth: 760
                }}
              >
                Manage ambulance providers, track operational records and keep your
                emergency transport dashboard clean, fast and professional.
              </Typography>

              <Typography
                variant="body2"
                style={{
                  color: 'rgba(255,255,255,0.72)',
                  marginTop: 12
                }}
              >
                Showing <strong>{totalCount}</strong> record{totalCount === 1 ? '' : 's'}
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
                disabled={loading}
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
                Add Ambulance
              </Button>
            </Box>
          </Box>

          <Box
            display="flex"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="space-between"
            style={{ gap: 16 }}
          >
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Search ambulance records"
              placeholder="Search provider, phone, plate number, hospital or location"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              style={{
                maxWidth: 520,
                backgroundColor: '#ffffff',
                borderRadius: 10
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />

            <Box
              display="flex"
              alignItems="center"
              style={{
                padding: '10px 14px',
                borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.10)',
                color: '#ffffff'
              }}
            >
              <LocalShippingIcon style={{ marginRight: 8 }} />
              <Typography variant="body2" style={{ fontWeight: 600 }}>
                Emergency transport records overview
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

AmbulancesListToolbar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  totalCount: PropTypes.number,
  loading: PropTypes.bool
};

AmbulancesListToolbar.defaultProps = {
  totalCount: 0,
  loading: false
};

export default AmbulancesListToolbar;