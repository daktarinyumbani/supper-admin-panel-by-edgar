import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import CategoriesListToolbar from 'src/components/categories/CategoriesListToolbar';
import CategoriesListResults from 'src/components/categories/CategoriesListResults';
import { makeGetRequest } from 'src/services/httpservice';

const Categories = () => {
  const [categories, setCategories] = useState([]);

  function getCategories() {
    makeGetRequest('categories')
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status) {
          setCategories(responseJson.data.categories);
        } else {
          console.log('bad status returned for categories');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <Helmet>
        <title>Requests</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <CategoriesListToolbar />
          <Box sx={{ pt: 3 }}>
            <CategoriesListResults categories={categories} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Categories;
