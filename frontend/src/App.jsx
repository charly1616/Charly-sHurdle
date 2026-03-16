import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import FormPage from './pages/FormPage';
import SuccessPage from './pages/SuccessPage';
import PQRPage from './pages/PQRPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/pqr" element={<PQRPage />} />
      </Routes>
    </Router>
  );
}
