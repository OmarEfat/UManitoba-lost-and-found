import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FoundItemForm from './components/FoundItemForm';
import LostItemForm from './components/LostItemForm';
import "bootstrap/dist/css/bootstrap.css"
import FoundItemsList from './components/FoundItemsList';
import MatchesPage from './components/redirectedPage.js'; 

const App = () => {

  // State to store the fetched found items
  const [foundItems, setFoundItems] = useState([]);

  useEffect(() => {
    // Function to fetch found items
    const fetchFoundItems = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/get_found_items'); // Adjust the URL/port as necessary
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setFoundItems(data); // Store the found items in state
      } catch (error) {
        console.error("Failed to fetch found items:", error);
      }
    };

    fetchFoundItems(); // Call the function to fetch found items
  }, []); // Empty dependency array means this effect runs once on mount


  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/found-item" element={<FoundItemForm />} />
        <Route path="/lost-item" element={<LostItemForm />} />
        <Route path="/found-items" element={<FoundItemsList items={foundItems} />} />
        <Route path="/redirected-page" element={<MatchesPage />} />
        {/* Add additional routes here */}
      </Routes>
    </Router>
  );
};

export default App;