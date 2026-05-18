import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/components/DashboardLayout';
import MainLayout from 'src/components/MainLayout';

import Account from 'src/pages/Account';
import Dashboard from 'src/pages/Dashboard';
import Login from 'src/pages/Login';
import NotFound from 'src/pages/NotFound';
import Register from 'src/pages/Register';
import Settings from 'src/pages/Settings';

import Ambulances from './pages/Ambulances';
import CreateAmbulance from './pages/Ambulances/create';
import AmbulanceDetails from './pages/Ambulances/details';

import Businesses from './pages/Businesses';
import CreateBusiness from './pages/Businesses/create';
import BusinessDetails from './pages/Businesses/details';

import Categories from './pages/Categories/index';
import ViewCategory from './pages/Categories/single';

import Requests from './pages/Requests/index';
import ViewRequest from './pages/Requests/view';

import CreateServiceProvider from './pages/ServiceProviders/create';
import ServiceProviderDetails from './pages/ServiceProviders/details';
import ServiceProviders from './pages/ServiceProviders/index';

import Services from './pages/Services/index';

import Users from './pages/Users/index';
import CreateUser from './pages/Users/create';

import Generics from './pages/generics';
import CreateGeneric from './pages/generics/create';

import Products from './pages/products';
import CreateProduct from './pages/products/create';
import ProductsDetails from './pages/products/details';

const isValidToken = (token) => !!token && token !== 'undefined' && token !== 'null';

const routes = (token, setToken, settings, setSettings) => [
  {
    path: '/app',
    element: isValidToken(token)
      ? <DashboardLayout />
      : <Navigate to="/login" replace />,
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },

      {
        path: 'service-providers',
        children: [
          {
            index: true,
            element: <ServiceProviders />
          },
          {
            path: 'create',
            element: <CreateServiceProvider />
          },
          {
            path: ':id/details',
            element: <ServiceProviderDetails />
          },
          {
            path: ':id/edit',
            element: <CreateServiceProvider />
          }
        ]
      },

      {
        path: 'ambulances',
        children: [
          {
            index: true,
            element: <Ambulances />
          },
          {
            path: 'create',
            element: <CreateAmbulance />
          },
          {
            path: ':id/details',
            element: <AmbulanceDetails />
          },
          {
            path: ':id/edit',
            element: <CreateAmbulance />
          }
        ]
      },

      {
        path: 'businesses',
        children: [
          {
            index: true,
            element: <Businesses />
          },
          {
            path: 'create',
            element: <CreateBusiness />
          },
          {
            path: ':id/details',
            element: <BusinessDetails />
          },
          {
            path: ':id/edit',
            element: <CreateBusiness />
          }
        ]
      },

      {
        path: 'requests',
        children: [
          {
            index: true,
            element: <Requests />
          },
          {
            path: ':id',
            element: <ViewRequest />
          }
        ]
      },

      {
        path: 'categories',
        children: [
          {
            index: true,
            element: <Categories />
          },
          {
            path: ':id',
            element: <ViewCategory />
          }
        ]
      },

      {
        path: 'products',
        children: [
          {
            index: true,
            element: <Products />
          },
          {
            path: 'create',
            element: <CreateProduct />
          },
          {
            path: ':id/details',
            element: <ProductsDetails />
          },
          {
            path: ':id/edit',
            element: <CreateProduct />
          }
        ]
      },

      {
        path: 'generics',
        children: [
          {
            index: true,
            element: <Generics />
          },
          {
            path: 'create',
            element: <CreateGeneric />
          },
          {
            path: ':id/details',
            element: <Generics />
          },
          {
            path: ':id/edit',
            element: <CreateGeneric />
          }
        ]
      },

      {
        path: 'services',
        children: [
          {
            index: true,
            element: <Services />
          }
        ]
      },

      {
        path: 'users',
        children: [
          {
            index: true,
            element: <Users />
          },
          {
            path: 'create',
            element: <CreateUser />
          }
        ]
      },

      {
        path: 'account',
        element: <Account />
      },
      {
        path: 'settings',
        element: <Settings />
      },
      {
        path: '*',
        element: <Navigate to="/404" replace />
      }
    ]
  },

  {
    path: '/',
    element: !isValidToken(token)
      ? <MainLayout />
      : <Navigate to="/app/dashboard" replace />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />
      },
      {
        path: 'login',
        element: <Login setToken={setToken} setSettings={setSettings} />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: '404',
        element: <NotFound />
      },
      {
        path: '*',
        element: <Navigate to="/404" replace />
      }
    ]
  }
];

export default routes;
