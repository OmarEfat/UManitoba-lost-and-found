import React from 'react';
import { Link } from 'react-router-dom';
import myImage from '../images/helping.png';

//MUI
import { Grid, Typography } from '@mui/material';

const HomePage = () => {
  return (
    <div className="home">
      <header>
        <div className="logo">SiteLogo</div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/team">Team</Link></li>
          </ul>
        </nav>
      </header>
      <Grid container spacing={2} style={{ textAlign: 'center' }} >
      <Grid item xs={12} md={6} style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <Typography variant="h3">UManitoba Found and Lost</Typography>
        <p>The chances of finding your lost items have never been higher. Powered by advanced AI technology, our website transforms the search into a seamless and highly effective journey towards reclaiming what's yours!</p>
        <div className="buttons">
          <Link to="/lost-item" className="button">I have lost an item</Link>
          <Link to="/found-item" className="button">I have found an item</Link>
        </div>
        </Grid>
      <Grid item xs={12} md={6}>
        <img src={myImage} alt="lost and found picture" style={{ width: '100%', height: 'auto' }} />
      </Grid>
    </Grid>
    </div>
  );
};

export default HomePage;
