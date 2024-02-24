// NavBar.js
import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from "../images/logo.png";

function NavBar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#00A3E0' }}>
      <Toolbar>
      <Link to="/" style={{ flexGrow: 1 }}>
          <img src={logo} alt="Logo" style={{ height: '50px' }} />
        </Link>
        <Button color="inherit" component={Link} to="/lost-item">Lost Item</Button>
        <Button color="inherit" component={Link} to="/found-item">Found Item</Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
