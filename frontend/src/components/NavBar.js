// NavBar.js
import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from "../images/logo.png";
import fourthImage from "../images/UMLearnLogo.png";

function NavBar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#FFFFFF' }}>
      <Toolbar>
        <Link to="/" style={{ flexGrow: 1 }}>
          <img src={fourthImage} alt="Logo" style={{ height: '70px' }} />
        </Link>
        <Button 
          color="primary"
          style={{ color: 'white', marginRight: '20px',borderColor: 'black', borderWidth: '0.5px', backgroundColor: '#0096FF' }} 
          component={Link} 
          to="/lost-item"
        >
          Lost Item
        </Button>
        <Button 
          color="primary"
          style={{ color: 'white', borderColor: 'black', borderWidth: '1px', backgroundColor: '#0096FF' }} 
          component={Link} 
          to="/found-item"
        >
          Found Item
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
