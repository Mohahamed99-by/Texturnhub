import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AddOffer from './pages/AddOffer';
import Offers from './pages/Offers';
import Subscribe from './pages/SubscriptionComponent';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'offers', element: <Offers /> },
        {
          path: 'offers/add',
          element: (
            <ProtectedRoute>
              <AddOffer />
            </ProtectedRoute>
          ),
        },
        { path: 'subscribe', element: <Subscribe /> },
      ],
    },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/success', element: <Success /> },
    { path: '/cancel', element: <Cancel /> },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;