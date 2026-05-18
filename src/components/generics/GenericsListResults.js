/* eslint-disable */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import axios from 'axios';
import {
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
import CategoryIcon from '@material-ui/icons/Category';
import { useNavigate } from 'react-router-dom';

const GenericSearchToolbar = React.memo(function GenericSearchToolbar(props) {
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
        placeholder="Search generic name"
        variant="outlined"
        size="small"
        style={{
          minWidth: 320,
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

GenericSearchToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

const GenericsListResults = ({ generics, onRefresh, ...rest }) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

  const filteredRows = useMemo(function () {
    const q = searchText.trim().toLowerCase();

    if (!q) {
      return generics || [];
    }

    return (generics || []).filter(function (row) {
      const genericName =
        row && row.name
          ? row.name
          : '';

      return genericName.toLowerCase().includes(q);
    });
  }, [generics, searchText]);

  const handleDelete = async function (event, row) {
    event.stopPropagation();

    const confirmed = window.confirm(
      'Delete "' + (row && row.name ? row.name : 'this generic') + '"?'
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.delete(
        API_BASE + '/admin/generics/' + row.id,
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
      console.error('Delete generic error:', error);
      alert('Failed to delete generic.');
    }
  };

  const columns = [
    {
      field: 'generic',
      headerName: 'Generic Name',
      width: 420,
      sortable: true,
      renderCell: function (params) {
        const genericName =
          params &&
          params.row &&
          params.row.name
            ? params.row.name
            : 'Unnamed Generic';

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
            <Box
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                marginRight: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%)',
                color: '#0b5ed7'
              }}
            >
              <CategoryIcon />
            </Box>

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
                {genericName}
              </Typography>

              <Typography
                variant="body2"
                style={{
                  color: '#6b7280',
                  marginTop: 4
                }}
              >
                Healthcare product classification
              </Typography>
            </Box>
          </Box>
        );
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: function () {
        return (
          <Chip
            label="Active Record"
            size="small"
            style={{
              borderRadius: 8,
              fontWeight: 600,
              backgroundColor: '#ecfdf5',
              color: '#047857'
            }}
          />
        );
      }
    },
    {
      field: 'id',
      headerName: 'Record ID',
      width: 160
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
                  navigate(String(params.row.id));
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
        <Box style={{ minWidth: 980 }}>
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
            onRowClick={function (params, event) {
              navigate(String(params.row.id));
              event.defaultMuiPrevented = true;
            }}
            components={{
              Toolbar: GenericSearchToolbar
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

GenericsListResults.propTypes = {
  generics: PropTypes.array.isRequired,
  onRefresh: PropTypes.func
};

GenericsListResults.defaultProps = {
  onRefresh: function () {}
};

export default GenericsListResults;