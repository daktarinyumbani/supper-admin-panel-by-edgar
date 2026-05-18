import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Box, Card } from '@material-ui/core';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport
} from '@material-ui/data-grid';
import { useNavigate } from 'react-router-dom';

const CategoriesListResults = ({ categories, ...rest }) => {
  const navigate = useNavigate();

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
            rows={categories}
            columns={columns}
            checkboxSelection
            disableSelectionOnClick
            components={{
              Toolbar: CustomToolbar
            }}
            onRowClick={(params, event) => {
              console.log(params.row.id);
              navigate(params.row.id.toString());
              // eslint-disable-next-line no-param-reassign
              event.defaultMuiPrevented = true;
            }}
          />
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

CategoriesListResults.propTypes = {
  categories: PropTypes.array.isRequired
};

export default CategoriesListResults;
