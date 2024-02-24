import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FoundItemForm from './components/FoundItemForm';
import LostItemForm from './components/LostItemForm';
import "bootstrap/dist/css/bootstrap.css"
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/found-item" element={<FoundItemForm />} />
        <Route path="/lost-item" element={<LostItemForm />} />
        {/* Add additional routes here */}
      </Routes>
    </Router>
  );
};

export default App;
