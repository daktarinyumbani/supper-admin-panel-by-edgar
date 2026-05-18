/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable operator-linebreak */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Grid,
  Typography,
  CircularProgress
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import LocalPharmacyIcon from '@material-ui/icons/LocalPharmacy';
import CategoryIcon from '@material-ui/icons/Category';
import ImageIcon from '@material-ui/icons/Image';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import { makeGetRequest } from 'src/services/httpservice';

const headerCardStyle = {
  borderRadius: 22,
  overflow: 'hidden',
  marginBottom: 24,
  boxShadow: '0 14px 40px rgba(15, 23, 42, 0.08)',
  background: 'linear-gradient(135deg, #0f172a 0%, #0b5ed7 55%, #0ea5e9 100%)'
};

const contentCardStyle = {
  borderRadius: 20,
  overflow: 'hidden',
  boxShadow: '0 12px 34px rgba(15, 23, 42, 0.08)'
};

const infoCardStyle = {
  height: '100%',
  borderRadius: 18,
  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
  border: '1px solid #eef2f7'
};

const iconWrapStyle = {
  width: 52,
  height: 52,
  borderRadius: 14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, rgba(14,165,233,0.14), rgba(16,185,129,0.14))'
};

const imagePanelStyle = {
  width: '100%',
  minHeight: 320,
  borderRadius: 18,
  overflow: 'hidden',
  border: '1px solid #e5e7eb',
  backgroundColor: '#f8fafc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const ProductsDetails = (props) => {
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  function getProductName(product) {
    if (product && product.brand && product.brand.name) {
      return product.brand.name;
    }

    if (product && product.name) {
      return product.name;
    }

    return 'Unnamed Product';
  }

  function getGenericName(product) {
    if (product && product.generic && product.generic.name) {
      return product.generic.name;
    }

    if (
      product &&
      product.brand &&
      product.brand.generic &&
      product.brand.generic.name
    ) {
      return product.brand.generic.name;
    }

    return 'No Generic';
  }

  function getImageUrl(product) {
    if (
      product &&
      product.images &&
      product.images.length > 0 &&
      product.images[0] &&
      product.images[0].img_url
    ) {
      return product.images[0].img_url;
    }

    return '';
  }

  function getImageCount(product) {
    if (product && product.images && Array.isArray(product.images)) {
      return product.images.length;
    }

    return 0;
  }

  function getDetails(productsId) {
    setLoading(true);
    setMessage('');

    makeGetRequest(`/admin/products/${productsId}`)
      .then((response) => {
        if (
          response &&
          response.status &&
          response.data &&
          response.data.product
        ) {
          setDetails(response.data.product);
          return;
        }

        setDetails(null);
        setMessage('Failed to load product details.');
        console.log('Bad status returned for product');
      })
      .catch((error) => {
        console.error(error);
        setDetails(null);
        setMessage('Something went wrong while loading product details.');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    if (id) {
      getDetails(id);
    }
  }, [id]);

  function renderBody() {
    if (loading) {
      return (
        <Card style={contentCardStyle}>
          <Box
            style={{
              minHeight: 360,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        </Card>
      );
    }

    if (message) {
      return (
        <Card style={contentCardStyle}>
          <CardContent>
            <Box
              style={{
                padding: 16,
                borderRadius: 12,
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca'
              }}
            >
              <Typography style={{ color: '#b91c1c', fontWeight: 600 }}>
                {message}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      );
    }

    if (!details) {
      return null;
    }

    const imageUrl = getImageUrl(details);
    const productName = getProductName(details);
    const genericName = getGenericName(details);
    const imageCount = getImageCount(details);

    return (
      <>
        <Box style={{ marginBottom: 24 }}>
          <Grid container spacing={3}>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <Card style={infoCardStyle}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography
                        variant="body2"
                        style={{ color: '#6b7280', marginBottom: 6 }}
                      >
                        Product Name
                      </Typography>
                      <Typography
                        variant="h4"
                        style={{ color: '#111827', fontWeight: 700 }}
                      >
                        {productName}
                      </Typography>
                    </Box>
                    <Box style={iconWrapStyle}>
                      <LocalPharmacyIcon style={{ color: '#0284c7' }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item lg={4} md={4} sm={12} xs={12}>
              <Card style={infoCardStyle}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography
                        variant="body2"
                        style={{ color: '#6b7280', marginBottom: 6 }}
                      >
                        Generic
                      </Typography>
                      <Typography
                        variant="h4"
                        style={{ color: '#111827', fontWeight: 700 }}
                      >
                        {genericName}
                      </Typography>
                    </Box>
                    <Box style={iconWrapStyle}>
                      <CategoryIcon style={{ color: '#10b981' }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item lg={4} md={4} sm={12} xs={12}>
              <Card style={infoCardStyle}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography
                        variant="body2"
                        style={{ color: '#6b7280', marginBottom: 6 }}
                      >
                        Images
                      </Typography>
                      <Typography
                        variant="h4"
                        style={{ color: '#111827', fontWeight: 700 }}
                      >
                        {imageCount}
                      </Typography>
                    </Box>
                    <Box style={iconWrapStyle}>
                      <ImageIcon style={{ color: '#0f766e' }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Card {...props} style={contentCardStyle}>
          <CardContent style={{ padding: 24 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Typography
                  variant="h5"
                  style={{ color: '#111827', fontWeight: 700, marginBottom: 8 }}
                >
                  Product Overview
                </Typography>
                <Typography
                  variant="body2"
                  style={{ color: '#6b7280', marginBottom: 24 }}
                >
                  Review the selected product information below.
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box
                      style={{
                        padding: 18,
                        borderRadius: 16,
                        border: '1px solid #eef2f7',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <Typography
                        variant="body2"
                        style={{ color: '#6b7280', marginBottom: 6 }}
                      >
                        Name
                      </Typography>
                      <Typography
                        variant="h6"
                        style={{ color: '#111827', fontWeight: 700 }}
                      >
                        {productName}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box
                      style={{
                        padding: 18,
                        borderRadius: 16,
                        border: '1px solid #eef2f7',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <Typography
                        variant="body2"
                        style={{ color: '#6b7280', marginBottom: 6 }}
                      >
                        Generic
                      </Typography>
                      <Typography
                        variant="h6"
                        style={{ color: '#111827', fontWeight: 700 }}
                      >
                        {genericName}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={5}>
                <Typography
                  variant="h5"
                  style={{ color: '#111827', fontWeight: 700, marginBottom: 8 }}
                >
                  Product Image
                </Typography>
                <Typography
                  variant="body2"
                  style={{ color: '#6b7280', marginBottom: 16 }}
                >
                  A cleaner preview for dashboard and inventory display.
                </Typography>

                <Box style={imagePanelStyle}>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={productName}
                      style={{
                        width: '100%',
                        height: 320,
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <Box textAlign="center" style={{ padding: 20 }}>
                      <ImageIcon
                        style={{
                          fontSize: 44,
                          color: '#94a3b8',
                          marginBottom: 10
                        }}
                      />
                      <Typography
                        variant="subtitle1"
                        style={{ color: '#334155', fontWeight: 600 }}
                      >
                        No product image
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ color: '#64748b', marginTop: 6 }}
                      >
                        No image is currently attached to this product.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </CardContent>

          <Divider />

          <CardActions style={{ padding: 16 }}>
            <Button
              onClick={() => {
                navigate(`/app/products/${id}/edit`);
              }}
              color="primary"
              variant="contained"
              startIcon={<EditIcon />}
              style={{
                borderRadius: 12,
                textTransform: 'none',
                fontWeight: 700,
                minWidth: 180
              }}
            >
              Edit Product Details
            </Button>
          </CardActions>
        </Card>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Product Details</title>
      </Helmet>

      <Box
        style={{
          minHeight: '100%',
          paddingTop: 24,
          paddingBottom: 32,
          background:
            'linear-gradient(180deg, #f8fbff 0%, #eef6fb 45%, #f4f6f8 100%)'
        }}
      >
        <Container maxWidth={false}>
          <Card style={headerCardStyle}>
            <CardContent style={{ padding: 28 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                style={{ gap: 16 }}
              >
                <Box>
                  <Typography
                    variant="h3"
                    style={{ color: '#ffffff', fontWeight: 700, marginBottom: 8 }}
                  >
                    Product Details
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 720 }}
                  >
                    View detailed product information in a clean healthcare admin
                    layout with quick access to update actions.
                  </Typography>
                </Box>

                <Box display="flex" flexWrap="wrap" style={{ gap: 12 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/app/products')}
                    style={{
                      borderColor: 'rgba(255,255,255,0.35)',
                      color: '#ffffff',
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      borderRadius: 12,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Back to Products
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/app/products/${id}/edit`)}
                    style={{
                      borderRadius: 12,
                      textTransform: 'none',
                      fontWeight: 700,
                      backgroundColor: '#ffffff',
                      color: '#0b5ed7',
                      boxShadow: 'none'
                    }}
                  >
                    Edit Product
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {renderBody()}
        </Container>
      </Box>
    </>
  );
};

export default ProductsDetails;
