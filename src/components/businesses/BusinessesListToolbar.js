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
import { useNavigate } from 'react-router-dom';

const BusinessesListToolbar = ({ businessCount, onRefresh, ...props }) => {
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
                label="Healthcare Business Management"
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
                Businesses Dashboard
              </Typography>

              <Typography
                variant="body1"
                style={{
                  color: 'rgba(255,255,255,0.84)',
                  maxWidth: 720
                }}
              >
                Manage pharmacies, insurance providers and healthcare businesses
                with a clean clinical dashboard, quick actions and easier search.
              </Typography>

              <Typography
                variant="body2"
                style={{
                  color: 'rgba(255,255,255,0.72)',
                  marginTop: 12
                }}
              >
                Total records: <strong>{businessCount}</strong>
              </Typography>
            </Box>

            <Box display="flex" flexWrap="wrap" style={{ gap: 12 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={onRefresh}
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
                  minWidth: 170,
                  backgroundColor: '#ffffff',
                  color: '#0b5ed7',
                  textTransform: 'none',
                  fontWeight: 700,
                  boxShadow: 'none'
                }}
              >
                Add Business
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

BusinessesListToolbar.propTypes = {
  businessCount: PropTypes.number,
  onRefresh: PropTypes.func
};

BusinessesListToolbar.defaultProps = {
  businessCount: 0,
  onRefresh: function () {}
};

export default BusinessesListToolbar;