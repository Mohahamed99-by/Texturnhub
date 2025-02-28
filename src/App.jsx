import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AddOffer from './pages/AddOffer';
import Offers from './pages/Offers';


function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/dashboard',
          element: <Dashboard />,
        },
        {
          path: '/offers',
          element: <Offers />,
        },
        {
          path: '/offers/add',
          element: <AddOffer />,
        },
      ],
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
  ]);

  return (
  
    
        <RouterProvider router={router} />
   
  
  );
}

export default App;