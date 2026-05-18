/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography
} from '@material-ui/core';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport
} from '@material-ui/data-grid';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import { useNavigate } from 'react-router-dom';

const formatDate = function (value) {
  if (!value) {
    return 'N/A';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

const getBoardStatusStyle = function (status) {
  const value = String(status || '').toLowerCase();

  if (
    value === 'registered' ||
    value === 'approved' ||
    value === 'allowed' ||
    value === 'active'
  ) {
    return {
      backgroundColor: '#ecfdf5',
      color: '#047857'
    };
  }

  if (value === 'pending' || value === 'review') {
    return {
      backgroundColor: '#f3f4f6',
      color: '#374151'
    };
  }

  return {
    backgroundColor: '#fef2f2',
    color: '#b91c1c'
  };
};

const ExportToolbar = function () {
  return (
    <GridToolbarContainer
      style={{
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        borderBottom: '1px solid #eef2f7',
        background: 'linear-gradient(180deg, #ffffff 0%, #f9fbfd 100%)'
      }}
    >
      <Typography color="textSecondary" variant="body2">
        Export ambulance directory records
      </Typography>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

const EmptyState = function () {
  return (
    <Box
      style={{
        padding: 40,
        textAlign: 'center'
      }}
    >
      <Typography color="textPrimary" gutterBottom variant="h6">
        No ambulance records found
      </Typography>
      <Typography color="textSecondary" variant="body2">
        Try refreshing, changing the search keyword, or adding a new ambulance provider.
      </Typography>
    </Box>
  );
};

const AmbulancesListResults = ({
  providers,
  loading,
  errorMessage,
  onDelete,
  ...rest
}) => {
  const navigate = useNavigate();

  const handleDetails = function (event, id) {
    event.stopPropagation();
    navigate(String(id) + '/details');
  };

  const handleEdit = function (event, id) {
    event.stopPropagation();
    navigate(String(id) + '/edit');
  };

  const handleDelete = function (event, id) {
    event.stopPropagation();
    onDelete(id);
  };

  const columns = [
    {
      field: 'ambulanceProvider',
      headerName: 'Ambulance / Provider',
      minWidth: 260,
      flex: 1.2,
      renderCell: function (params) {
        return (
          <Box
            display="flex"
            alignItems="center"
            style={{
              width: '100%',
              paddingTop: 10,
              paddingBottom: 10
            }}
          >
            <Avatar
              style={{
                width: 52,
                height: 52,
                marginRight: 14,
                background: 'linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%)',
                color: '#0b5ed7'
              }}
            >
              <LocalShippingIcon />
            </Avatar>

            <Box style={{ overflow: 'hidden' }}>
              <Typography
                variant="subtitle1"
                style={{
                  fontWeight: 700,
                  color: '#111827',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {params.row.ambulanceProvider}
              </Typography>

              <Typography
                variant="body2"
                style={{
                  color: '#6b7280',
                  marginTop: 4
                }}
              >
                {params.row.contactName}
              </Typography>
            </Box>
          </Box>
        );
      }
    },
    {
      field: 'phone',
      headerName: 'Phone',
      minWidth: 150,
      flex: 0.9
    },
    {
      field: 'plateNumber',
      headerName: 'Plate Number',
      minWidth: 150,
      flex: 0.9
    },
    {
      field: 'currentHospital',
      headerName: 'Current Hospital',
      minWidth: 180,
      flex: 1
    },
    {
      field: 'location',
      headerName: 'Location',
      minWidth: 180,
      flex: 1
    },
    {
      field: 'boardStatus',
      headerName: 'Board Status',
      minWidth: 150,
      flex: 0.8,
      sortable: false,
      renderCell: function (params) {
        const chipStyle = getBoardStatusStyle(params.value);

        return (
          <Chip
            label={params.value || 'Unknown'}
            size="small"
            style={{
              borderRadius: 8,
              fontWeight: 600,
              backgroundColor: chipStyle.backgroundColor,
              color: chipStyle.color
            }}
          />
        );
      }
    },
    {
      field: 'active',
      headerName: 'Status',
      minWidth: 120,
      flex: 0.7,
      sortable: false,
      renderCell: function (params) {
        return (
          <Chip
            label={params.value ? 'Active' : 'Inactive'}
            size="small"
            style={{
              borderRadius: 8,
              fontWeight: 600,
              backgroundColor: params.value ? '#ecfdf5' : '#fef2f2',
              color: params.value ? '#047857' : '#b91c1c'
            }}
          />
        );
      }
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      minWidth: 180,
      flex: 1,
      valueFormatter: function (params) {
        return formatDate(params.value);
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 150,
      flex: 0.8,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: function (params) {
        return (
          <Box
            display="flex"
            alignItems="center"
            style={{
              gap: 4
            }}
          >
            <Tooltip title="Details">
              <IconButton
                size="small"
                style={{ color: '#0284c7' }}
                onClick={function (event) {
                  handleDetails(event, params.row.id);
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Edit">
              <IconButton
                size="small"
                style={{ color: '#0f766e' }}
                onClick={function (event) {
                  handleEdit(event, params.row.id);
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                size="small"
                style={{ color: '#dc2626' }}
                onClick={function (event) {
                  handleDelete(event, params.row.id);
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      }
    }
  ];

  return (
    <Card
      {...rest}
      style={{
        borderRadius: 20,
        boxShadow: '0 14px 38px rgba(15, 23, 42, 0.08)',
        overflow: 'hidden'
      }}
    >
      {loading ? <LinearProgress /> : null}

      <Box style={{ padding: '20px 24px 12px' }}>
        <Typography color="textPrimary" variant="h5" style={{ fontWeight: 700 }}>
          Ambulance Providers Directory
        </Typography>
        <Typography color="textSecondary" variant="body2">
          Clean, searchable and responsive records for your emergency transport operations.
        </Typography>
      </Box>

      <Divider />

      {errorMessage ? (
        <Box style={{ padding: 24 }}>
          <Typography color="error" variant="body2">
            {errorMessage}
          </Typography>
        </Box>
      ) : (
        <PerfectScrollbar>
          <Box style={{ minWidth: 1250 }}>
            <DataGrid
              autoHeight
              rows={providers}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              disableSelectionOnClick
              loading={loading}
              rowHeight={78}
              headerHeight={60}
              onRowClick={function (params) {
                navigate(String(params.row.id) + '/details');
              }}
              components={{
                Toolbar: ExportToolbar,
                NoRowsOverlay: EmptyState
              }}
              style={{
                border: 'none',
                backgroundColor: '#ffffff'
              }}
            />
          </Box>
        </PerfectScrollbar>
      )}
    </Card>
  );
};

AmbulancesListResults.propTypes = {
  providers: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  errorMessage: PropTypes.string,
  onDelete: PropTypes.func.isRequired
};

AmbulancesListResults.defaultProps = {
  loading: false,
  errorMessage: ''
};

export default AmbulancesListResults;