/* eslint-disable */
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
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
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0 14px 38px rgba(15, 23, 42, 0.08)',
    border: '1px solid #edf2f7'
  },
  toolbar: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
    borderBottom: '1px solid #eef2f7',
    background: 'linear-gradient(180deg, #ffffff 0%, #f9fbfd 100%)'
  },
  toolbarActions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    flexWrap: 'wrap'
  },
  searchField: {
    minWidth: 260,
    maxWidth: 420,
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      minWidth: '100%'
    }
  },
  tableWrap: {
    width: '100%',
    overflowX: 'auto',
    backgroundColor: '#fff'
  },
  gridRoot: {
    border: 'none',
    minWidth: 1180,
    backgroundColor: '#fff',
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e5e7eb'
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 700,
      color: '#374151'
    },
    '& .MuiDataGrid-cell': {
      borderBottom: '1px solid #f1f5f9',
      outline: 'none !important',
      display: 'flex',
      alignItems: 'center'
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: '#f9fbff'
    }
  },
  providerCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    minWidth: 0
  },
  providerInfo: {
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  providerName: {
    fontWeight: 700,
    color: '#111827',
    fontSize: 14,
    lineHeight: '18px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  providerMeta: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: '16px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  textCell: {
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: 13,
    color: '#374151'
  },
  actionsCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    width: '100%',
    flexWrap: 'nowrap'
  }
}));

const formatDate = (value) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

const getInitials = (name) => {
  if (!name || name === '—') {
    return 'SP';
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
};

const humanize = (value) => {
  if (!value) {
    return '—';
  }

  return value
    .toString()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
};

const StatusBadge = ({ value, type }) => {
  let styles = {
    background: '#eef2ff',
    color: '#3730a3'
  };

  if (type === 'active') {
    if (value) {
      styles = { background: '#dcfce7', color: '#166534' };
    } else {
      styles = { background: '#fee2e2', color: '#b91c1c' };
    }
  }

  if (type === 'board') {
    const normalized = String(value || '').toLowerCase();

    if (
      normalized.indexOf('registered') !== -1 ||
      normalized.indexOf('approved') !== -1
    ) {
      styles = { background: '#dcfce7', color: '#166534' };
    } else if (normalized.indexOf('pending') !== -1) {
      styles = { background: '#fef3c7', color: '#92400e' };
    } else {
      styles = { background: '#e5e7eb', color: '#374151' };
    }
  }

  return (
    <span
      style={{
        background: styles.background,
        color: styles.color,
        borderRadius: 999,
        padding: '6px 10px',
        fontSize: 12,
        fontWeight: 700,
        display: 'inline-block',
        whiteSpace: 'nowrap'
      }}
    >
      {type === 'active' ? (value ? 'Active' : 'Inactive') : value}
    </span>
  );
};

StatusBadge.propTypes = {
  value: PropTypes.any,
  type: PropTypes.string
};

StatusBadge.defaultProps = {
  value: '',
  type: ''
};

const QuickSearchToolbar = React.memo(function QuickSearchToolbar(props) {
  const { classes, value, onChange, onClear } = props;

  return (
    <GridToolbarContainer className={classes.toolbar}>
      <Box className={classes.toolbarActions}>
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </Box>

      <TextField
        className={classes.searchField}
        value={value}
        onChange={onChange}
        placeholder="Search by name, phone, hospital, category, status..."
        variant="outlined"
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={onClear}
                style={{ visibility: value ? 'visible' : 'hidden' }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </GridToolbarContainer>
  );
});

QuickSearchToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired
};

const ServiceProvidersListResults = ({ providers, loading, onDelete, ...rest }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const mappedRows = (providers || []).map(function (provider, index) {
      const firstName =
        provider && provider.user && provider.user.first_name
          ? provider.user.first_name
          : '';

      const lastName =
        provider && provider.user && provider.user.last_name
          ? provider.user.last_name
          : '';

      const fullName = (firstName + ' ' + lastName).trim() || '—';

      const phone =
        provider && provider.user && provider.user.phone
          ? provider.user.phone
          : '—';

      const regNumber =
        provider && provider.reg_number ? provider.reg_number : '—';

      const boardStatus = humanize(
        provider && provider.board_status ? provider.board_status : ''
      );

      const currentHospital =
        provider && provider.current_hospital
          ? provider.current_hospital
          : '—';

      const location =
        provider && provider.address ? provider.address : '—';

      const categoryName =
        provider &&
        provider.specialty &&
        provider.specialty.category &&
        provider.specialty.category.name
          ? provider.specialty.category.name
          : '';

      const specialtyName =
        provider &&
        provider.specialty &&
        provider.specialty.name
          ? provider.specialty.name
          : '';

      let category = '—';

      if (categoryName && specialtyName) {
        category = categoryName + ' - ' + specialtyName;
      } else if (categoryName) {
        category = categoryName;
      } else if (specialtyName) {
        category = specialtyName;
      }

      const createdAt = formatDate(
        provider && provider.created_at ? provider.created_at : ''
      );

      const active = Boolean(provider && provider.active);

      return {
        id: provider && provider.id ? provider.id : 'provider-row-' + index,
        name: fullName,
        phone: phone,
        reg_number: regNumber,
        board_status: boardStatus,
        current_hospital: currentHospital,
        location: location,
        category: category,
        created_at: createdAt,
        active: active,
        raw: provider
      };
    });

    setRows(mappedRows);
  }, [providers]);

  const filteredRows = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) {
      return rows;
    }

    return rows.filter(function (row) {
      const searchableValues = [
        row.name,
        row.phone,
        row.reg_number,
        row.board_status,
        row.current_hospital,
        row.location,
        row.category,
        row.created_at,
        row.active ? 'active' : 'inactive'
      ];

      return searchableValues.some(function (value) {
        return String(value || '').toLowerCase().includes(keyword);
      });
    });
  }, [rows, searchText]);

  const handleView = (id) => navigate(String(id) + '/details');
  const handleEdit = (id) => navigate(String(id) + '/update');

  const columns = [
    {
      field: 'name',
      headerName: 'Provider',
      width: 240,
      renderCell: (params) => (
        <Box className={classes.providerCell}>
          <Avatar
            style={{
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              fontWeight: 700,
              width: 40,
              height: 40
            }}
          >
            {getInitials(params.row.name)}
          </Avatar>

          <Box className={classes.providerInfo}>
            <Typography className={classes.providerName}>
              {params.row.name}
            </Typography>
            <Typography className={classes.providerMeta}>
              {params.row.reg_number}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 140,
      renderCell: (params) => (
        <span className={classes.textCell}>{params.value}</span>
      )
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 220,
      renderCell: (params) => (
        <span className={classes.textCell}>{params.value}</span>
      )
    },
    {
      field: 'board_status',
      headerName: 'Board Status',
      width: 160,
      renderCell: (params) => (
        <StatusBadge value={params.value} type="board" />
      )
    },
    {
      field: 'current_hospital',
      headerName: 'Hospital',
      width: 180,
      renderCell: (params) => (
        <span className={classes.textCell}>{params.value}</span>
      )
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 170,
      renderCell: (params) => (
        <span className={classes.textCell}>{params.value}</span>
      )
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 130,
      renderCell: (params) => (
        <span className={classes.textCell}>{params.value}</span>
      )
    },
    {
      field: 'active',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <StatusBadge value={params.value} type="active" />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box className={classes.actionsCell}>
          <Tooltip title="Details">
            <IconButton
              size="small"
              style={{ color: '#0284c7' }}
              onClick={(event) => {
                event.stopPropagation();
                handleView(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Update">
            <IconButton
              size="small"
              style={{ color: '#0f766e' }}
              onClick={(event) => {
                event.stopPropagation();
                handleEdit(params.row.id);
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              style={{ color: '#dc2626' }}
              onClick={(event) => {
                event.stopPropagation();
                onDelete(params.row.raw);
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Card className={classes.card} {...rest}>
      <Box className={classes.tableWrap}>
        <DataGrid
          autoHeight
          rows={filteredRows}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          disableSelectionOnClick
          rowHeight={74}
          headerHeight={56}
          onRowClick={(params) => handleView(params.row.id)}
          className={classes.gridRoot}
          components={{
            Toolbar: QuickSearchToolbar
          }}
          componentsProps={{
            toolbar: {
              classes: classes,
              value: searchText,
              onChange: function (event) {
                setSearchText(event.target.value);
              },
              onClear: function () {
                setSearchText('');
              }
            }
          }}
        />
      </Box>
    </Card>
  );
};

ServiceProvidersListResults.propTypes = {
  providers: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onDelete: PropTypes.func
};

ServiceProvidersListResults.defaultProps = {
  loading: false,
  onDelete: function () {}
};

export default ServiceProvidersListResults;