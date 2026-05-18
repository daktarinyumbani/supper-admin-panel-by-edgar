import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField
} from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { makeGetRequest } from 'src/services/httpservice';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DataGrid } from '@material-ui/data-grid';

const ViewCategory = () => {
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState(null);
  const { id } = useParams();
  const categoryId = id;

  const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'icon', headerName: 'Icon', width: 150 }
  ];

  function getCategory() {
    makeGetRequest(`categories/${categoryId}`)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status) {
          setCategory(responseJson.data.category);
        } else {
          console.log('bad status returned for category');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <>
      <Helmet>
        <title>Category</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Paper style={{ padding: 30 }}>
                <Typography color="textSecondary" gutterBottom variant="h2">
                  {category && category.name}
                </Typography>
                {category && (
                  <DataGrid
                    autoHeight
                    rows={category.specialties}
                    columns={columns}
                    checkboxSelection
                    disableSelectionOnClick
                  />
                )}
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper style={{ padding: 30 }}>
                <Formik
                  initialValues={{
                    name: '',
                    icon: '',
                    category_id: categoryId
                  }}
                  validationSchema={Yup.object().shape({
                    name: Yup.string().max(64).required('Name is required'),
                    icon: Yup.string().required('Icon is required')
                  })}
                  onSubmit={async (values, { resetForm }) => {
                    axios
                      .post(
                        `${process.env.REACT_APP_API_URL}specialties`,
                        values,
                        {
                          responseType: 'application/json'
                        }
                      )
                      .then((response) => {
                        console.log(response);
                        if (response.status) {
                          if (response.data.status) {
                            resetForm({});
                            getCategory();
                            console.log('Log in success.');
                          } else {
                            setMessage(response.data.message);
                            console.log(message);
                          }
                        } else {
                          setMessage('Something went wrong. Please try again.');
                        }
                      })
                      .catch((error) => {
                        console.error(error);
                        setMessage('Something went wrong. Please try again.');
                      });
                  }}
                >
                  {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <Box sx={{ mb: 3 }}>
                        <Typography color="textPrimary" variant="h2">
                          Add Specialties
                        </Typography>
                      </Box>
                      {message && <Box sx={{ mb: 3 }}>{message}</Box>}

                      <TextField
                        error={Boolean(touched.name && errors.name)}
                        fullWidth
                        helperText={touched.name && errors.name}
                        label="Name"
                        margin="normal"
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.name}
                        variant="outlined"
                      />

                      <TextField
                        error={Boolean(touched.icon && errors.icon)}
                        fullWidth
                        helperText={touched.icon && errors.icon}
                        label="Icon"
                        margin="normal"
                        name="icon"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.icon}
                        variant="outlined"
                      />

                      <Box sx={{ py: 2 }}>
                        <Button
                          color="primary"
                          disabled={isSubmitting}
                          fullWidth
                          size="large"
                          type="submit"
                          variant="contained"
                        >
                          Create Specialty
                        </Button>
                      </Box>
                    </form>
                  )}
                </Formik>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default ViewCategory;
