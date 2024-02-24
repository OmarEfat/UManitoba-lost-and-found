import React from 'react';
import { TextField, Button, Typography, Container, Grid } from '@mui/material';
import NavBar from '../components/NavBar'; // Assuming NavBar is your header component
import confusedImage from '../images/confused.jpg'; // Ensure this path is correct for your project

const LostItemForm = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Form submission logic here
  };

  return (
    <div>
      <NavBar /> {/* Including the NavBar at the top */}
      <Container maxWidth="lg" style={{ marginTop: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              I have lost an item
            </Typography>
            <Typography variant="body1" gutterBottom>
              Disclaimer: We utilize Artificial Intelligence (AI) to enhance the pairing of items on our website. The accuracy and effectiveness of the matching process are significantly improved by the amount and detail of information you provide. Upon any update regarding your lost item, you will be notified via email.
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Where Lost"
                name="whereLost"
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Date Lost"
                name="dateLost"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Contact Email"
                name="contactEmail"
                type="email"
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Detailed Item Description"
                name="itemDescription"
                multiline
                rows={4}
                variant="outlined"
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ margin: "8px", backgroundColor: "#D8824A" }}
              >
                Submit
              </Button>
            </form>
          </Grid>
          <Grid item xs={12} md={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={confusedImage} alt="Confused" style={{ maxWidth: '100%', maxHeight: '500px' }} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default LostItemForm;
