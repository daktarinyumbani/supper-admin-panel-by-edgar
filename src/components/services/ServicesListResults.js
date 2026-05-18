import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Box, Card } from '@material-ui/core';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport
} from '@material-ui/data-grid';

const ServicesListResults = ({ services, ...rest }) => {
  const columns = [{ field: 'name', headerName: 'Name', width: 150 }];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <DataGrid
            autoHeight
            rows={services}
            columns={columns}
            checkboxSelection
            disableSelectionOnClick
            components={{
              Toolbar: CustomToolbar
            }}
          />
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

ServicesListResults.propTypes = {
  services: PropTypes.array.isRequired
};

export default ServicesListResults;
