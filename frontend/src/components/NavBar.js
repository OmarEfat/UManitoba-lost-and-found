// NavBar.js
import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#00A3E0' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My Website
        </Typography>
        <Button color="inherit" component={Link} to="/lost-item">Lost Item</Button>
        <Button color="inherit" component={Link} to="/found-item">Found Item</Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
