/* eslint-disable linebreak-style */
/* eslint-disable import/prefer-default-export */
/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable import/no-unresolved */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyAuF70B-wFEiCAGP0Rv9DYrf5u0Wf5m8Fk',
    authDomain: 'admin-product-images.firebaseapp.com',
    projectId: 'admin-product-images',
    databaseURL: 'gs://admin-product-images.appspot.com',
    storageBucket: 'admin-product-images.appspot.com',
    messagingSenderId: '332042496241',
    appId: '1:332042496241:web:5a59f38014e324f321a150',
    measurementId: 'G-PEE97PHDCM'
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
