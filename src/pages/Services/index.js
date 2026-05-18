import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import ServicesListToolbar from 'src/components/services/ServicesListToolbar';
import ServicesListResults from 'src/components/services/ServicesListResults';
import { makeGetRequest } from 'src/services/httpservice';

const Services = () => {
  const [services, setServices] = useState([]);

  function getServices() {
    makeGetRequest('services')
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status) {
          setServices(responseJson.data.services);
        } else {
          console.log('bad status returned for services');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    getServices();
  }, []);

  return (
    <>
      <Helmet>
        <title>Requests</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <ServicesListToolbar />
          <Box sx={{ pt: 3 }}>
            <ServicesListResults services={services} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Services;
