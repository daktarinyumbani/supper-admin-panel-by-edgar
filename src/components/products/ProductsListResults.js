/* eslint-disable */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
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
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import SearchIcon from '@material-ui/icons/Search';
import LocalPharmacyIcon from '@material-ui/icons/LocalPharmacy';
import ClearIcon from '@material-ui/icons/Clear';
import { useNavigate } from 'react-router-dom';

const ProductSearchToolbar = React.memo(function ProductSearchToolbar(props) {
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
        placeholder="Search product, generic, description or SKU"
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

ProductSearchToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

const getImageUrl = function (row) {
  if (
    row &&
    row.images &&
    row.images.length > 0 &&
    row.images[0] &&
    row.images[0].img_url
  ) {
    return row.images[0].img_url;
  }

  return '';
};

const getProductName = function (row) {
  if (row && row.name) {
    return row.name;
  }

  if (row && row.product_name) {
    return row.product_name;
  }

  if (row && row.brand && row.brand.name) {
    return row.brand.name;
  }

  return 'Unnamed Product';
};

const getGenericName = function (row) {
  if (row && row.generic && row.generic.name) {
    return row.generic.name;
  }

  if (
    row &&
    row.brand &&
    row.brand.generic &&
    row.brand.generic.name
  ) {
    return row.brand.generic.name;
  }

  return 'No Generic';
};

const getDescription = function (row) {
  if (row && row.description) {
    return row.description;
  }

  if (row && row.details) {
    return row.details;
  }

  if (row && row.summary) {
    return row.summary;
  }

  return '';
};

const getSku = function (row) {
  if (row && row.sku) {
    return row.sku;
  }

  if (row && row.code) {
    return row.code;
  }

  if (row && row.product_code) {
    return row.product_code;
  }

  return 'N/A';
};

const getPrice = function (row) {
  if (row && row.price) {
    return row.price;
  }

  if (row && row.selling_price) {
    return row.selling_price;
  }

  if (row && row.unit_price) {
    return row.unit_price;
  }

  if (row && row.amount) {
    return row.amount;
  }

  return null;
};

const getQuantity = function (row) {
  if (row && row.quantity) {
    return row.quantity;
  }

  if (row && row.stock) {
    return row.stock;
  }

  if (row && row.stock_quantity) {
    return row.stock_quantity;
  }

  if (row && row.available_quantity) {
    return row.available_quantity;
  }

  return 0;
};

const ProductsListResults = ({ products, onRefresh, ...rest }) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const filteredRows = useMemo(function () {
    const q = searchText.trim().toLowerCase();

    if (!q) {
      return products || [];
    }

    return (products || []).filter(function (row) {
      const productName = getProductName(row);
      const genericName = getGenericName(row);
      const description = getDescription(row);
      const sku = getSku(row);

      return [
        productName,
        genericName,
        description,
        sku,
        JSON.stringify(row)
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [products, searchText]);

  const handleDelete = async function (event, row) {
    event.stopPropagation();

    const confirmed = window.confirm(
      'Delete "' + getProductName(row) + '"?'
    );

    if (!confirmed) {
      return;
    }

    alert('Please connect the delete API after adding the backend delete route for admin products.');
  };

  const columns = [
    {
      field: 'visual',
      headerName: 'Product',
      width: 360,
      sortable: false,
      renderCell: function (params) {
        const imageUrl = getImageUrl(params.row);

        return (
          <Box
            display="flex"
            alignItems="center"
            style={{ width: '100%', paddingTop: 12, paddingBottom: 12 }}
          >
            <Box
              style={{
                width: 72,
                height: 72,
                borderRadius: 18,
                overflow: 'hidden',
                marginRight: 14,
                background: '#f8fafc',
                border: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(15, 23, 42, 0.06)'
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={getProductName(params.row)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <Avatar
                  style={{
                    width: 44,
                    height: 44,
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1'
                  }}
                >
                  <LocalPharmacyIcon />
                </Avatar>
              )}
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
                {getProductName(params.row)}
              </Typography>

              <Typography
                variant="body2"
                style={{
                  color: '#6b7280',
                  marginTop: 4,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {getDescription(params.row) || 'Healthcare product'}
              </Typography>
            </Box>
          </Box>
        );
      }
    },
    {
      field: 'generic',
      headerName: 'Generic',
      width: 220,
      valueGetter: function (params) {
        return getGenericName(params.row);
      }
    },
    {
      field: 'sku',
      headerName: 'SKU / Code',
      width: 160,
      valueGetter: function (params) {
        return getSku(params.row);
      }
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 140,
      valueGetter: function (params) {
        const price = getPrice(params.row);
        return price !== null ? price : '-';
      }
    },
    {
      field: 'quantity',
      headerName: 'Stock',
      width: 140,
      renderCell: function (params) {
        const qty = getQuantity(params.row);

        return (
          <Chip
            label={qty + ' in stock'}
            size="small"
            style={{
              borderRadius: 8,
              fontWeight: 600,
              backgroundColor: qty > 0 ? '#ecfdf5' : '#fef2f2',
              color: qty > 0 ? '#047857' : '#b91c1c'
            }}
          />
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 210,
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
                  navigate(params.row.id + '/details');
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
                  navigate(params.row.id + '/edit');
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
        <Box style={{ minWidth: 1180 }}>
          <DataGrid
            autoHeight
            rows={filteredRows}
            columns={columns}
            getRowId={function (row) {
              return row.id;
            }}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            rowHeight={96}
            disableSelectionOnClick
            onRowClick={function (params) {
              navigate(params.row.id + '/details');
            }}
            components={{
              Toolbar: ProductSearchToolbar
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

ProductsListResults.propTypes = {
  products: PropTypes.array,
  onRefresh: PropTypes.func
};

ProductsListResults.defaultProps = {
  products: [],
  onRefresh: function () {}
};

export default ProductsListResults;