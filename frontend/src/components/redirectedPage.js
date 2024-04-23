import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
// Import fs module to read the JSON file


const MatchesPage = ( ) => {
  const { ID } = useParams();

  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const preLoad = async () => {
      try {
        const responseMatches = await fetch(`http://127.0.0.1:5000/match/${ID}`, {
          method: 'GET',
        });

        if (!responseMatches.ok) {
          throw new Error(`HTTP error! status: ${responseMatches.status}`);
        }

        const data = await responseMatches.json();
  
        setMatches(data);
        console.log('get matches success:', data);
      } catch (error) {
        console.error('Find matches: There was an error with the find matches:', error);
      }
    };

    preLoad();
  }, []); // Empty dependency array ensures that this effect runs only once after the component mounts

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
                <p>Place Found: {match.place_found}</p>
                <p>Date Found: {match.date_found}</p>
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