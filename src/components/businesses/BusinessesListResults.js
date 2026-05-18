/* eslint-disable */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import axios from 'axios';
import {
  Avatar,
  Box,
  Card,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography
} from '@material-ui/core';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton
} from '@material-ui/data-grid';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import BusinessIcon from '@material-ui/icons/Business';
import { useNavigate } from 'react-router-dom';

const BusinessSearchToolbar = React.memo(function BusinessSearchToolbar(props) {
  const { value, onChange, clearSearch } = props;

  return (
    <GridToolbarContainer
      style={{
        padding: 16,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        borderBottom: '1px solid #eef2f7',
        background: 'linear-gradient(180deg, #ffffff 0%, #f9fbfd 100%)'
      }}
    >
      <Box display="flex" alignItems="center" style={{ gap: 8, flexWrap: 'wrap' }}>
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </Box>

      <TextField
        value={value}
        onChange={onChange}
        placeholder="Search business, phone, type or location"
        variant="outlined"
        size="small"
        style={{
          minWidth: 340,
          backgroundColor: '#ffffff'
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={clearSearch}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null
        }}
      />
    </GridToolbarContainer>
  );
});

BusinessSearchToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

const BusinessesListResults = ({ businesses, onRefresh, ...rest }) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

  const formatBusinessType = function (value) {
    if (!value) {
      return 'Unknown';
    }

    const text = String(value);
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const formatDate = function (value) {
    if (!value) {
      return '-';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString();
  };

  const filteredRows = useMemo(function () {
    const q = searchText.trim().toLowerCase();

    if (!q) {
      return businesses || [];
    }

    return (businesses || []).filter(function (row) {
      const name = row && row.name ? row.name : '';
      const phone = row && row.phone ? row.phone : '';
      const type = row && row.business_type ? row.business_type : '';
      const address = row && row.address ? row.address : '';

      return [name, phone, type, address]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [businesses, searchText]);

  const handleDelete = async function (event, row) {
    event.stopPropagation();

    const confirmed = window.confirm(
      'Delete "' + (row && row.name ? row.name : 'this business') + '"?'
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.delete(
        API_BASE + '/admin/businesses/' + row.id,
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Delete business error:', error);
      alert('Failed to delete business.');
    }
  };

  const columns = [
    {
      field: 'business',
      headerName: 'Business',
      width: 340,
      sortable: true,
      renderCell: function (params) {
        const name =
          params &&
          params.row &&
          params.row.name
            ? params.row.name
            : 'Unnamed Business';

        const type =
          params &&
          params.row &&
          params.row.business_type
            ? formatBusinessType(params.row.business_type)
            : 'Unknown';

        return (
          <Box
            display="flex"
            alignItems="center"
            style={{
              width: '100%',
              paddingTop: 12,
              paddingBottom: 12
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
              <BusinessIcon />
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
                {name}
              </Typography>

              <Typography
                variant="body2"
                style={{
                  color: '#6b7280',
                  marginTop: 4
                }}
              >
                {type}
              </Typography>
            </Box>
          </Box>
        );
      }
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 160,
      valueGetter: function (params) {
        if (params && params.row && params.row.phone) {
          return params.row.phone;
        }

        return '-';
      }
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 170,
      renderCell: function (params) {
        const type =
          params &&
          params.row &&
          params.row.business_type
            ? formatBusinessType(params.row.business_type)
            : 'Unknown';

        return (
          <Chip
            label={type}
            size="small"
            style={{
              borderRadius: 8,
              fontWeight: 600,
              backgroundColor: '#eff6ff',
              color: '#1d4ed8'
            }}
          />
        );
      }
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 220,
      valueGetter: function (params) {
        if (params && params.row && params.row.address) {
          return params.row.address;
        }

        return '-';
      }
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 150,
      valueGetter: function (params) {
        if (params && params.row && params.row.created_at) {
          return formatDate(params.row.created_at);
        }

        return '-';
      }
    },
    {
      field: 'active',
      headerName: 'Status',
      width: 150,
      renderCell: function (params) {
        const isActive =
          params &&
          params.row &&
          params.row.active;

        return (
          <Chip
            label={isActive ? 'Active' : 'Inactive'}
            size="small"
            style={{
              borderRadius: 8,
              fontWeight: 600,
              backgroundColor: isActive ? '#ecfdf5' : '#fef2f2',
              color: isActive ? '#047857' : '#b91c1c'
            }}
          />
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 190,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: function (params) {
        return (
          <Box display="flex" alignItems="center">
            <Tooltip title="Details">
              <IconButton
                size="small"
                style={{ color: '#0284c7' }}
                onClick={function (event) {
                  event.stopPropagation();
                  navigate(String(params.row.id) + '/details');
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Update">
              <IconButton
                size="small"
                style={{ color: '#0f766e' }}
                onClick={function (event) {
                  event.stopPropagation();
                  navigate(String(params.row.id) + '/edit');
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
                  handleDelete(event, params.row);
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
        overflow: 'hidden',
        boxShadow: '0 14px 38px rgba(15, 23, 42, 0.08)'
      }}
    >
      <PerfectScrollbar>
        <Box style={{ minWidth: 1220 }}>
          <DataGrid
            autoHeight
            rows={filteredRows}
            columns={columns}
            getRowId={function (row) {
              return row.id;
            }}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            rowHeight={86}
            disableSelectionOnClick
            onRowClick={function (params) {
              navigate(String(params.row.id) + '/details');
            }}
            components={{
              Toolbar: BusinessSearchToolbar
            }}
            componentsProps={{
              toolbar: {
                value: searchText,
                onChange: function (event) {
                  setSearchText(event.target.value);
                },
                clearSearch: function () {
                  setSearchText('');
                }
              }
            }}
            style={{
              border: 'none',
              backgroundColor: '#ffffff'
            }}
          />
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

BusinessesListResults.propTypes = {
  businesses: PropTypes.array.isRequired,
  onRefresh: PropTypes.func
};

BusinessesListResults.defaultProps = {
  onRefresh: function () {}
};

export default BusinessesListResults;