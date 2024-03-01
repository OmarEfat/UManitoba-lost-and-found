import React from 'react';
import NavBar from '../components/NavBar';

// Import fs module to read the JSON file


const MatchesPage = ({ matches }) => {
  return (
    <div>
      <NavBar />
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <h1>Matches Found</h1>
        {matches && matches.length > 0 ? (
          <ul>
            {matches.map((match, index) => (
              <li key={index}>
                {/* Render individual match data */}
                {/* Adjust this based on the structure of your matches data */}
                <p>Title: {match.title}</p>
                <p>Where Lost: {match.whereLost}</p>
                <p>Date Lost: {match.dateLost}</p>
                {/* Add more fields as needed */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No matches found.</p>
        )}
      </div>
    </div>
  );
};

export default MatchesPage;