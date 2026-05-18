import { Helmet } from 'react-helmet';
import { Box, Container, Typography } from '@material-ui/core';
import RequestListToolbar from 'src/components/requests/RequestListToolbar';

const ViewRequest = () => (
  <>
    <Helmet>
      <title>View Request</title>
    </Helmet>

    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <RequestListToolbar />
        <Box sx={{ pt: 3 }}>
          <Typography variant="h4">Inner request view</Typography>
        </Box>
      </Container>
    </Box>
  </>
);

export default ViewRequest;
