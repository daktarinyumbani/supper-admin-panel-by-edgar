/* eslint-disable operator-linebreak */
import moment from 'moment';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  Container,
  Grid
} from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { makeGetRequest } from 'src/services/httpservice';

const BusinessDetails = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);

  function getDetails(serviceProviderId) {
    makeGetRequest(`businesses/${serviceProviderId}`)
      .then((response) => {
        if (response && response.status) {
          setDetails(
            response.data && response.data.business
              ? response.data.business
              : null
          );
        } else {
          console.log('bad status returned for business');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    getDetails(id);
  }, [id]);

  return (
    <>
      <Card {...props}>
        <CardContent>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography color="textPrimary" gutterBottom variant="h3">
              Business Details
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {details && (
        <Card>
          <CardContent>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Container maxWidth={false}>
                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <Typography color="textSecondary" variant="body1">
                      Business Name
                    </Typography>
                    <Typography color="textPrimary" gutterBottom variant="h4">
                      {details.name}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography color="textSecondary" variant="body1">
                      Business Type
                    </Typography>
                    <Typography color="textPrimary" gutterBottom variant="h5">
                      {details.business_type}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography color="textSecondary" variant="body1">
                      Phone Number
                    </Typography>
                    <Typography color="textPrimary" gutterBottom variant="h5">
                      {details.phone}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={3} style={{ paddingTop: 32 }}>
                  <Grid item xs={4}>
                    <Typography color="textSecondary" variant="body1">
                      Address
                    </Typography>
                    <Typography color="textPrimary" gutterBottom variant="h5">
                      {details.address}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography color="textSecondary" variant="body1">
                      Bio
                    </Typography>
                    <Typography color="textPrimary" gutterBottom variant="h5">
                      {details.bio}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography color="textSecondary" variant="body1">
                      Created At
                    </Typography>
                    <Typography color="textPrimary" gutterBottom variant="h5">
                      {`${moment().format('hh:mm A')} ${details.created_at}`}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={3} style={{ paddingTop: 64 }}>
                  <Grid item xs={8}>
                    <Typography color="textSecondary" variant="body1">
                      Business documents
                    </Typography>
                    <br />
                    <br />
                    <Box
                      component="img"
                      style={{
                        height: 300,
                        width: 350,
                        maxHeight: 300,
                        maxWidth: 350
                      }}
                      alt="Business document"
                      src={
                        details && details.doc_url
                          ? details.doc_url
                          : 'http://via.placeholder.com/300'
                      }
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Typography color="textSecondary" variant="body1">
                      Business status
                    </Typography>

                    <Typography color="textPrimary" gutterBottom variant="h5">
                      {details.active ? 'Active' : 'Inactive'}
                    </Typography>
                  </Grid>
                </Grid>
              </Container>
            </Box>
          </CardContent>

          <Divider />

          <CardActions>
            <Button
              onClick={() => {
                navigate(`/app/businesses/${id}/edit`);
              }}
              color="primary"
              fullWidth
              variant="text"
            >
              Edit Business Details
            </Button>
          </CardActions>
        </Card>
      )}
    </>
  );
};

export default BusinessDetails;
