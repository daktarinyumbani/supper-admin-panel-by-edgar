/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography
} from '@material-ui/core';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import CategoryIcon from '@material-ui/icons/Category';
import { makeGetRequest } from 'src/services/httpservice';
import ProductsListToolbar from 'src/components/products/ProductsListToolbar';
import ProductsListResults from 'src/components/products/ProductsListResults';

const metricCardStyle = {
  height: '100%',
  borderRadius: 18,
  boxShadow: '0 10px 30px rgba(31, 41, 55, 0.08)'
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

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const response = await makeGetRequest('admin/products');
      console.log('Products response:', response);

      if (response && response.status) {
        let items = [];

        if (response.data && response.data.products) {
          items = response.data.products;
        } else if (response.data && response.data.data) {
          items = response.data.data;
        }

        setProducts(Array.isArray(items) ? items : []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Get products error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const metrics = useMemo(() => {
    const totalProducts = products.length;

    const withImages = products.filter((item) => item && item.images && item.images.length > 0).length;

    const genericNames = products
      .map((item) => {
        if (item && item.generic && item.generic.name) {
          return item.generic.name;
        }

        if (
          item
          && item.brand
          && item.brand.generic
          && item.brand.generic.name
        ) {
          return item.brand.generic.name;
        }

        return null;
      })
      .filter(Boolean);

    const uniqueGenerics = new Set(genericNames).size;

    return {
      totalProducts,
      withImages,
      uniqueGenerics
    };
  }, [products]);

  return (
    <>
      <Helmet>
        <title>Products | Health Admin</title>
      </Helmet>

      <Box
        style={{
          minHeight: '100%',
          paddingTop: 24,
          paddingBottom: 32,
          background:
            'linear-gradient(180deg, #f8fbff 0%, #eef5fb 40%, #f4f6f8 100%)'
        }}
      >
        <Container maxWidth={false}>
          <ProductsListToolbar
            productCount={metrics.totalProducts}
            onRefresh={fetchProducts}
          />

          <Box style={{ marginTop: 24, marginBottom: 24 }}>
            <Grid container spacing={3}>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <Card style={metricCardStyle}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography
                          variant="body2"
                          style={{ color: '#6b7280', marginBottom: 6 }}
                        >
                          Total Products
                        </Typography>
                        <Typography variant="h3" style={{ fontWeight: 700, color: '#111827' }}>
                          {metrics.totalProducts}
                        </Typography>
                      </Box>
                      <Box style={iconWrapStyle}>
                        <LocalHospitalIcon style={{ color: '#0284c7' }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item lg={4} md={4} sm={12} xs={12}>
                <Card style={metricCardStyle}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography
                          variant="body2"
                          style={{ color: '#6b7280', marginBottom: 6 }}
                        >
                          Products With Images
                        </Typography>
                        <Typography variant="h3" style={{ fontWeight: 700, color: '#111827' }}>
                          {metrics.withImages}
                        </Typography>
                      </Box>
                      <Box style={iconWrapStyle}>
                        <PhotoLibraryIcon style={{ color: '#10b981' }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item lg={4} md={4} sm={12} xs={12}>
                <Card style={metricCardStyle}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography
                          variant="body2"
                          style={{ color: '#6b7280', marginBottom: 6 }}
                        >
                          Generic Categories
                        </Typography>
                        <Typography variant="h3" style={{ fontWeight: 700, color: '#111827' }}>
                          {metrics.uniqueGenerics}
                        </Typography>
                      </Box>
                      <Box style={iconWrapStyle}>
                        <CategoryIcon style={{ color: '#0f766e' }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Box style={{ paddingTop: 8 }}>
            {loading ? (
              <Card style={{ borderRadius: 18 }}>
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
            ) : (
              <ProductsListResults
                products={products}
                onRefresh={fetchProducts}
              />
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Products;
