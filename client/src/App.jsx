import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import QuizTake from './components/QuizTake';
import LandingPage from './pages/LandingPage';
import PrivateRoute from './components/PrivateRoute';
import PageNotFound from './pages/PageNotFound';
import './app.css' 


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
      <Route path="/quiz/:id" element={<QuizTake />} />
      <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
