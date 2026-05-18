/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Divider,
  LinearProgress
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SaveIcon from '@material-ui/icons/Save';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { makeGetRequest } from 'src/services/httpservice';
import { storage } from '../../firebase';

const pageBackground = {
  minHeight: '100%',
  paddingTop: 24,
  paddingBottom: 32,
  background: 'linear-gradient(180deg, #f8fbff 0%, #eef6fb 45%, #f4f6f8 100%)'
};

const headerCardStyle = {
  borderRadius: 22,
  overflow: 'hidden',
  marginBottom: 24,
  boxShadow: '0 14px 40px rgba(15, 23, 42, 0.08)',
  background: 'linear-gradient(135deg, #0f172a 0%, #0b5ed7 55%, #0ea5e9 100%)'
};

const formCardStyle = {
  borderRadius: 20,
  padding: 28,
  boxShadow: '0 12px 34px rgba(15, 23, 42, 0.08)'
};

const previewBoxStyle = {
  width: '100%',
  minHeight: 260,
  borderRadius: 18,
  border: '1px dashed #cbd5e1',
  background: '#f8fafc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden'
};

const CreateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

  const [message, setMessage] = useState('');
  const [generics, setGenerics] = useState([]);
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [imageValue, setImageValue] = useState('');
  const [mode, setMode] = useState('create');
  const [initialValues, setInitialValues] = useState({
    generic: '',
    name: '',
    images: []
  });

  const progressText = 'Upload progress: ' + progress + '%';

  const getResponseJson = (response) => {
    if (!response) {
      return null;
    }

    if (response.data) {
      return response.data;
    }

    return response;
  };

  const isSuccessfulResponse = (responseJson) => {
    if (!responseJson) {
      return false;
    }

    if (responseJson.status === true) {
      return true;
    }

    if (responseJson.success === true) {
      return true;
    }

    return false;
  };

  const getErrorMessage = (error, fallbackMessage) => {
    if (error && error.response && error.response.data) {
      if (error.response.data.message) {
        return error.response.data.message;
      }
    }

    if (error && error.message) {
      return error.message;
    }

    return fallbackMessage;
  };

  const getGenericsArray = (responseJson) => {
    if (!responseJson) {
      return [];
    }

    if (responseJson.data) {
      if (responseJson.data.generics) {
        if (Array.isArray(responseJson.data.generics)) {
          return responseJson.data.generics;
        }
      }

      if (Array.isArray(responseJson.data)) {
        return responseJson.data;
      }
    }

    if (responseJson.generics) {
      if (Array.isArray(responseJson.generics)) {
        return responseJson.generics;
      }
    }

    return [];
  };

  const getProductObject = (responseJson) => {
    if (!responseJson) {
      return null;
    }

    if (responseJson.data) {
      if (responseJson.data.product) {
        return responseJson.data.product;
      }
    }

    if (responseJson.product) {
      return responseJson.product;
    }

    return null;
  };

  const handlerFile = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(selectedFiles);
    setImages(selectedFiles);
  };

  const getPreviewUrl = () => {
    if (files.length > 0) {
      return URL.createObjectURL(files[0]);
    }

    if (imageValue) {
      return imageValue;
    }

    return '';
  };

  function uploadSingleImage(image) {
    return new Promise((resolve, reject) => {
      const uploadTask = storage.ref('images/' + image.name).put(image);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const uploadProgress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(uploadProgress);
        },
        (error) => {
          console.error(error);
          reject(error);
        },
        async () => {
          try {
            const downloadUrl = await storage
              .ref('images')
              .child(image.name)
              .getDownloadURL();

            resolve(downloadUrl);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  const uploadImages = async () => {
    if (!images.length) {
      return [];
    }

    const uploadedUrls = await Promise.all(
      images.map((image) => uploadSingleImage(image))
    );

    return uploadedUrls;
  };

  const getGenerics = async () => {
    try {
      setMessage('');

      const response = await makeGetRequest('admin/generics');
      const responseJson = getResponseJson(response);
      const items = getGenericsArray(responseJson);

      console.log('Generics response:', responseJson);

      if (items.length > 0) {
        setGenerics(items);
        return;
      }

      setGenerics([]);
      setMessage('No generics were returned from the server.');
    } catch (error) {
      console.error(error);
      setGenerics([]);
      setMessage(getErrorMessage(error, 'Failed to load generics.'));
    }
  };

  const getDetails = async (productId) => {
    try {
      setMessage('');

      const response = await makeGetRequest('admin/products/' + productId);
      const responseJson = getResponseJson(response);

      console.log('Product details response:', responseJson);

      if (!isSuccessfulResponse(responseJson)) {
        if (responseJson && responseJson.message) {
          setMessage(responseJson.message);
        } else {
          setMessage('Failed to load product details.');
        }
        return;
      }

      const product = getProductObject(responseJson);

      if (!product) {
        setMessage('Product details returned in an unexpected format.');
        return;
      }

      setMode('edit');

      const productImages = Array.isArray(product.images) ? product.images : [];
      const firstImage = productImages.length > 0 ? productImages[0] : null;
      let nextImageValue = '';

      if (firstImage && firstImage.img_url) {
        nextImageValue = firstImage.img_url;
      }

      setImageValue(nextImageValue);

      setInitialValues({
        generic: product.generic && product.generic.id ? product.generic.id : '',
        name: product.brand && product.brand.name ? product.brand.name : '',
        images: product.images || []
      });
    } catch (error) {
      console.error(error);
      setMessage(getErrorMessage(error, 'Failed to load product details.'));
    }
  };

  useEffect(() => {
    getGenerics();
  }, []);

  useEffect(() => {
    if (id) {
      getDetails(id);
    }
  }, [id]);

  const createProduct = async (values) => {
    try {
      setMessage('');
      setProgress(0);

      const uploadedUrls = await uploadImages();
      const imageUrl = uploadedUrls.length > 0 ? uploadedUrls[0] : '';

      const payload = {
        generic: values.generic,
        name: values.name,
        images: imageUrl
      };

      const token = localStorage.getItem('token');

      const response = await axios.post(
        API_BASE + '/admin/products',
        payload,
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );

      console.log('Create product response:', response.data);

      if (response.data && response.data.status === true) {
        navigate('/app/products');
        return;
      }

      if (response.data && response.data.message) {
        setMessage(response.data.message);
        return;
      }

      setMessage('Failed to create product.');
    } catch (error) {
      console.error(error);
      setMessage(
        getErrorMessage(error, 'Something went wrong. Please try again.')
      );
    }
  };

  const updateProduct = async (values) => {
    try {
      setMessage('');
      setProgress(0);

      let imageUrl = '';

      if (imageValue) {
        imageUrl = imageValue;
      }

      if (images.length > 0) {
        const uploadedUrls = await uploadImages();
        imageUrl = uploadedUrls.length > 0 ? uploadedUrls[0] : '';
      }

      const payload = {
        generic: values.generic,
        name: values.name,
        images: imageUrl
      };

      const token = localStorage.getItem('token');

      const response = await axios.post(
        API_BASE + '/admin/products/' + id,
        payload,
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );

      console.log('Update product response:', response.data);

      if (response.data && response.data.status === true) {
        navigate('/app/products/' + id + '/details');
        return;
      }

      if (response.data && response.data.message) {
        setMessage(response.data.message);
        return;
      }

      setMessage('Failed to update product.');
    } catch (error) {
      console.error(error);
      setMessage(
        getErrorMessage(error, 'Something went wrong. Please try again.')
      );
    }
  };

  const previewUrl = getPreviewUrl();

  return (
    <>
      <Helmet>
        <title>{mode === 'edit' ? 'Update Product' : 'Create Product'}</title>
      </Helmet>

      <Box style={pageBackground}>
        <Container maxWidth={false}>
          <Paper style={headerCardStyle}>
            <Box style={{ padding: 28 }}>
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
                    {mode === 'edit' ? 'Update Product' : 'Create Product'}
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 700 }}
                  >
                    Manage healthcare products with a cleaner, professional admin form
                    for brand details, generic selection and product image upload.
                  </Typography>
                </Box>

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
              </Box>
            </Box>
          </Paper>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper style={formCardStyle}>
                <Formik
                  enableReinitialize
                  initialValues={initialValues}
                  validationSchema={Yup.object().shape({
                    name: Yup.string().required('Brand name is required'),
                    generic: Yup.string().required('Generic is required')
                  })}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      if (mode === 'edit') {
                        await updateProduct(values);
                      } else {
                        await createProduct(values);
                      }
                    } finally {
                      setSubmitting(false);
                    }
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
                      <Box style={{ marginBottom: 20 }}>
                        <Typography
                          variant="h5"
                          style={{ fontWeight: 700, color: '#111827', marginBottom: 6 }}
                        >
                          Product Information
                        </Typography>
                        <Typography variant="body2" style={{ color: '#6b7280' }}>
                          Enter the brand details and link the product to the correct generic.
                        </Typography>
                      </Box>

                      <Divider style={{ marginBottom: 24 }} />

                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            select
                            error={Boolean(touched.generic && errors.generic)}
                            fullWidth
                            helperText={touched.generic && errors.generic}
                            label="Generic"
                            margin="normal"
                            name="generic"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.generic}
                            variant="outlined"
                          >
                            <MenuItem value="">Select generic</MenuItem>
                            {generics.map((generic) => (
                              <MenuItem key={generic.id} value={generic.id}>
                                {generic.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField
                            error={Boolean(touched.name && errors.name)}
                            fullWidth
                            helperText={touched.name && errors.name}
                            label="Brand Name"
                            margin="normal"
                            name="name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.name}
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>

                      <Box style={{ marginTop: 28 }}>
                        <Typography
                          variant="h6"
                          style={{ fontWeight: 700, color: '#111827', marginBottom: 8 }}
                        >
                          Product Image
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{ color: '#6b7280', marginBottom: 16 }}
                        >
                          Upload a clean product image for a better clinical and pharmacy dashboard display.
                        </Typography>

                        <Grid container spacing={3}>
                          <Grid item xs={12} md={5}>
                            <Paper
                              elevation={0}
                              style={{
                                padding: 20,
                                borderRadius: 18,
                                border: '1px solid #e5e7eb',
                                backgroundColor: '#f8fafc'
                              }}
                            >
                              <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="flex-start"
                                style={{ gap: 14 }}
                              >
                                <Box
                                  style={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: 14,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#dbeafe',
                                    color: '#1d4ed8'
                                  }}
                                >
                                  <CloudUploadIcon />
                                </Box>

                                <Box>
                                  <Typography
                                    variant="subtitle1"
                                    style={{ fontWeight: 700, color: '#111827' }}
                                  >
                                    Upload Product Image
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    style={{ color: '#6b7280', marginTop: 4 }}
                                  >
                                    PNG, JPG or GIF supported.
                                  </Typography>
                                </Box>

                                <Button
                                  variant="contained"
                                  component="label"
                                  startIcon={<PhotoLibraryIcon />}
                                  style={{
                                    borderRadius: 12,
                                    textTransform: 'none',
                                    fontWeight: 600
                                  }}
                                >
                                  Choose Image
                                  <input
                                    type="file"
                                    hidden
                                    multiple
                                    accept="image/png, image/gif, image/jpeg"
                                    onChange={handlerFile}
                                  />
                                </Button>
                              </Box>
                            </Paper>
                          </Grid>

                          <Grid item xs={12} md={7}>
                            <Box style={previewBoxStyle}>
                              {previewUrl ? (
                                <img
                                  src={previewUrl}
                                  alt="product"
                                  style={{
                                    width: '100%',
                                    height: 260,
                                    objectFit: 'cover'
                                  }}
                                />
                              ) : (
                                <Box textAlign="center" style={{ padding: 20 }}>
                                  <PhotoLibraryIcon
                                    style={{
                                      fontSize: 42,
                                      color: '#94a3b8',
                                      marginBottom: 10
                                    }}
                                  />
                                  <Typography
                                    variant="subtitle1"
                                    style={{ color: '#334155', fontWeight: 600 }}
                                  >
                                    No image selected
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    style={{ color: '#64748b', marginTop: 6 }}
                                  >
                                    Upload a product image to preview it here.
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>

                      {progress > 0 && (
                        <Box style={{ marginTop: 24 }}>
                          <Typography
                            variant="body2"
                            style={{ color: '#475569', marginBottom: 8 }}
                          >
                            {progressText}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            style={{
                              height: 10,
                              borderRadius: 999
                            }}
                          />
                        </Box>
                      )}

                      {message && (
                        <Box
                          style={{
                            marginTop: 24,
                            padding: 14,
                            borderRadius: 12,
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca'
                          }}
                        >
                          <Typography style={{ color: '#b91c1c', fontWeight: 600 }}>
                            {message}
                          </Typography>
                        </Box>
                      )}

                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        flexWrap="wrap"
                        style={{ gap: 12, marginTop: 28 }}
                      >
                        <Button
                          variant="outlined"
                          onClick={() => navigate('/app/products')}
                          style={{
                            borderRadius: 12,
                            textTransform: 'none',
                            fontWeight: 600
                          }}
                        >
                          Cancel
                        </Button>

                        <Button
                          color="primary"
                          disabled={isSubmitting}
                          size="large"
                          type="submit"
                          variant="contained"
                          startIcon={<SaveIcon />}
                          style={{
                            borderRadius: 12,
                            minWidth: 180,
                            textTransform: 'none',
                            fontWeight: 700,
                            boxShadow: '0 10px 24px rgba(37, 99, 235, 0.22)'
                          }}
                        >
                          {mode === 'edit' ? 'Update Product' : 'Create Product'}
                        </Button>
                      </Box>
                    </form>
                  )}
                </Formik>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper style={formCardStyle}>
                <Typography
                  variant="h6"
                  style={{ fontWeight: 700, color: '#111827', marginBottom: 10 }}
                >
                  Guidance
                </Typography>

                <Typography
                  variant="body2"
                  style={{ color: '#6b7280', marginBottom: 16 }}
                >
                  Use clear brand names, select the correct generic and upload a high-quality image
                  for a more professional medical inventory experience.
                </Typography>

                <Divider style={{ marginBottom: 16 }} />

                <Box style={{ marginBottom: 14 }}>
                  <Typography style={{ fontWeight: 700, color: '#111827' }}>
                    Current Mode
                  </Typography>
                  <Typography variant="body2" style={{ color: '#6b7280', marginTop: 4 }}>
                    {mode === 'edit' ? 'Editing an existing product' : 'Creating a new product'}
                  </Typography>
                </Box>

                <Box style={{ marginBottom: 14 }}>
                  <Typography style={{ fontWeight: 700, color: '#111827' }}>
                    Image Status
                  </Typography>
                  <Typography variant="body2" style={{ color: '#6b7280', marginTop: 4 }}>
                    {files.length > 0
                      ? files.length + ' new file(s) selected'
                      : imageValue
                        ? 'Existing image loaded'
                        : 'No image selected yet'}
                  </Typography>
                </Box>

                <Box>
                  <Typography style={{ fontWeight: 700, color: '#111827' }}>
                    Generic Records
                  </Typography>
                  <Typography variant="body2" style={{ color: '#6b7280', marginTop: 4 }}>
                    {generics.length + ' generics available'}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default CreateProduct;