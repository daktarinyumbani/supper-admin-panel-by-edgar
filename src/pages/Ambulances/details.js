import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Typography
} from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { makeGetRequest } from 'src/services/httpservice';

const ADMIN_AMBULANCES_ENDPOINT = 'admin/ambulances';

const extractAmbulance = (response) => {
  if (
    response
    && response.data
    && response.data.ambulance
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

const getUserData = (details) => {
  if (details && details.user) {
    return details.user;
  }

  return {};
};

const getBoardStatusLabel = (status) => {
  if (status === 'allowed') {
    return 'Allowed to practice';
  }

  if (status === 'registered') {
    return 'Not allowed to practice';
  }

  return status || 'Unknown';
};

const getStatusChipColor = (value) => {
  if (value === true) {
    return 'primary';
  }

  return 'secondary';
};

const DetailItem = ({ label, value }) => (
  <Box
    style={{
      padding: 16,
      borderRadius: 12,
      backgroundColor: '#fafafa',
      border: '1px solid #eeeeee',
      height: '100%'
    }}
  >
    <Typography
      color="textSecondary"
      variant="body2"
      style={{ marginBottom: 8 }}
    >
      {label}
    </Typography>

    <Typography color="textPrimary" variant="h6">
      {value || 'N/A'}
    </Typography>
  </Box>
);

DetailItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node
  ])
};

DetailItem.defaultProps = {
  value: 'N/A'
};

const AmbulanceDetails = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getDetails = useCallback(async (ambulanceId) => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await makeGetRequest(
        `${ADMIN_AMBULANCES_ENDPOINT}/${ambulanceId}`
      );

      console.log('Admin ambulance details response:', response);

      const ambulance = extractAmbulance(response);

      if (!ambulance) {
        setDetails(null);
        setErrorMessage('Ambulance details were not found.');
        return;
      }

      setDetails(ambulance);
    } catch (error) {
      console.error(error);
      setDetails(null);
      setErrorMessage(error.message || 'Failed to fetch ambulance details.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      getDetails(id);
    }
  }, [id, getDetails]);

  const user = getUserData(details);

  return (
    <Container maxWidth="lg">
      <Box style={{ paddingTop: 24, paddingBottom: 24 }}>
        <Card
          {...props}
          style={{
            borderRadius: 16,
            boxShadow: '0 10px 30px rgba(0,0,0,0.07)',
            marginBottom: 24
          }}
        >
          <CardContent>
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
                <Typography color="textPrimary" gutterBottom variant="h4">
                  Ambulance Provider Details
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  View complete provider profile and operational information.
                </Typography>
              </Box>

              <Box style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/app/ambulances')}
                >
                  Back to List
                </Button>

                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => navigate(`/app/ambulances/${id}/edit`)}
                >
                  Update Details
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {loading ? (
          <Card
            style={{
              borderRadius: 16,
              boxShadow: '0 10px 30px rgba(0,0,0,0.07)'
            }}
          >
            <CardContent>
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 220,
                  flexDirection: 'column',
                  gap: 12
                }}
              >
                <CircularProgress color="primary" />
                <Typography color="textSecondary" variant="body2">
                  Loading ambulance details...
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ) : null}

        {!loading && errorMessage ? (
          <Card
            style={{
              borderRadius: 16,
              boxShadow: '0 10px 30px rgba(0,0,0,0.07)'
            }}
          >
            <CardContent>
              <Typography color="error" variant="body2">
                {errorMessage}
              </Typography>
            </CardContent>
          </Card>
        ) : null}

        {!loading && !errorMessage && details ? (
          <Card
            style={{
              borderRadius: 16,
              boxShadow: '0 10px 30px rgba(0,0,0,0.07)',
              overflow: 'hidden'
            }}
          >
            <CardContent style={{ padding: 24 }}>
              <Box style={{ marginBottom: 24 }}>
                <Typography color="textPrimary" variant="h5" gutterBottom>
                  {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A'}
                </Typography>

                <Box
                  style={{
                    display: 'flex',
                    gap: 12,
                    flexWrap: 'wrap',
                    marginTop: 8
                  }}
                >
                  <Chip
                    label={getBoardStatusLabel(details.board_status)}
                    color="primary"
                    size="small"
                  />
                  <Chip
                    label={details.available ? 'Available' : 'Not Available'}
                    color={getStatusChipColor(details.available)}
                    size="small"
                  />
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item lg={4} md={6} sm={6} xs={12}>
                  <DetailItem label="Company Name" value={details.company_name} />
                </Grid>

                <Grid item lg={4} md={6} sm={6} xs={12}>
                  <DetailItem label="Registration Number" value={details.reg_number} />
                </Grid>

                <Grid item lg={4} md={6} sm={6} xs={12}>
                  <DetailItem label="Phone Number" value={user.phone} />
                </Grid>

                <Grid item lg={4} md={6} sm={6} xs={12}>
                  <DetailItem
                    label="Current Hospital"
                    value={details.current_hospital}
                  />
                </Grid>

                <Grid item lg={4} md={6} sm={6} xs={12}>
                  <DetailItem label="Cost" value={details.cost} />
                </Grid>

                <Grid item lg={4} md={6} sm={6} xs={12}>
                  <DetailItem
                    label="Created At"
                    value={
                      details.created_at
                        ? moment(details.created_at).format('DD MMM YYYY, hh:mm A')
                        : 'N/A'
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <DetailItem label="Address" value={details.address} />
                </Grid>

                <Grid item xs={12}>
                  <DetailItem label="Bio" value={details.bio} />
                </Grid>
              </Grid>
            </CardContent>

            <Divider />

            <CardActions style={{ padding: 16 }}>
              <Button
                color="primary"
                variant="text"
                onClick={() => navigate(`/app/ambulances/${id}/edit`)}
              >
                Update Ambulance Provider Details
              </Button>
            </CardActions>
          </Card>
        ) : null}
      </Box>
    </Container>
  );
};

export default AmbulanceDetails;
