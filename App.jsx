import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useRoute } from './hooks/useRoute';
import RoutePlanner from './components/RoutePlanner';
import MapView from './components/MapView';
import EcoScore from './components/EcoScore';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

const HomePage = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const { calculateRoute, saveRoute } = useRoute();
  const { isAuthenticated } = useAuth();

  const handleRouteCalculate = (calculatedRoutes) => {
    setRoutes(calculatedRoutes);
    setSelectedRoute(calculatedRoutes[0]);
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
  };

  const handleSaveRoute = async (route) => {
    const routeData = {
      startLocation: {
        name: 'Start Location',
        coordinates: {
          lat: route.geometry.coordinates[0][1],
          lng: route.geometry.coordinates[0][0],
        },
      },
      endLocation: {
        name: 'End Location',
        coordinates: {
          lat: route.geometry.coordinates[route.geometry.coordinates.length - 1][1],
          lng: route.geometry.coordinates[route.geometry.coordinates.length - 1][0],
        },
      },
      routeData: route,
      vehicleType: 'car', // This should come from the form
    };

    await saveRoute(routeData);
  };

  return (
    <div className="app">
      <Navigation />
      <div className="main-content">
        <div className="sidebar">
          <RoutePlanner onRouteCalculate={handleRouteCalculate} />
          {selectedRoute && (
            <EcoScore
              route={selectedRoute}
              onSaveRoute={handleSaveRoute}
              isAuthenticated={isAuthenticated}
            />
          )}
        </div>
        <div className="map-section">
          <MapView
            routes={routes}
            selectedRoute={selectedRoute}
            onRouteSelect={handleRouteSelect}
          />
        </div>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route 
        path="/login" 
        element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
      />
      <Route 
        path="/register" 
        element={!isAuthenticated ? <Register /> : <Navigate to="/" />} 
      />
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;