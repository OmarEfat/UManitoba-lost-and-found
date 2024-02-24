import React, { useState } from 'react';
import { Button, Container, Col, Row, Form } from 'react-bootstrap';
import {Typography} from '@mui/material';
import NavBar from '../components/NavBar'; // Assuming NavBar is your header component
import lostImage from '../images/confused.jpg'; // Ensure this path is correct for your project

const LostItemForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    whereFound: '',
    dateFound: '',
    contactEmail: '',
    itemDescription: ''
  });

  const [validated, setValidated] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      // Form submission logic here
    }
    setValidated(true);
  };
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
    
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyD8MvdCoT8UpjOj1YmvFTEwsQtEi20Xtg0`)
          .then(response => response.json())
          .then(data => {
            if (data.status === "OK") {
              if (data.results[0]) {
                const address = data.results[0].formatted_address;
                setFormData({
                  ...formData,
                  whereFound: address // Use the actual address here
                });
              } else {
                console.log("No results found");
              }
            } else {
              console.log("Geocoder failed due to: " + data.status);
            }
          });
      }, (error) => {
        console.warn(`ERROR(${error.code}): ${error.message}`);
      }, {
        maximumAge: 60000,
        timeout: 5000,
        enableHighAccuracy: true
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
    
  };
  return (
    <div>
    <NavBar />{/* Including the NavBar at the top */}
    <Container style={{ marginTop: '20px'}}>
      <Row>
        <Col xs={12} md={6}>
        <Typography variant="h4" gutterBottom>
              I have Lost an item
            </Typography>
            <Typography variant="body1" gutterBottom>
            Disclaimer: Our website utilizes Artificial Intelligence (AI) to optimize the pairing of items. The accuracy and efficacy of the matching process are greatly influenced by the quantity and specificity of the information you provide. You will receive email notifications regarding any updates related to your lost item.
            </Typography>   
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                required
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a title.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="whereLost">
              <Form.Label>Where found</Form.Label>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <Form.Control
                    required
                    type="text"
                    name="whereLost"
                    placeholder="Where was the item Lost"
                    value={formData.whereFound}
                    onChange={handleChange}
                  />
                </div>
                <Button 
                  variant="outline" 
                  style={{ marginLeft: "8px", backgroundColor: "#D8824A" }} 
                  onClick={handleUseCurrentLocation}
                >
                  Use Current Location
                </Button>
              </div>
              <Form.Control.Feedback type="invalid">
                Please provide where you found it.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control
                required
                type="date"
                name="date"
                placeholder="The date the item was found"
                value={formData.date}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid date.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Contact Email (Optional)"
                value={formData.email}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              
                <Form.Control
                  as="textarea" // Use textarea for multiline input
                  rows={6} // Set the number of rows to make the textarea taller
                  name="description"
                  placeholder="Detailed Item Description"
                  value={formData.description}
                  onChange={handleChange}
                  style={{ resize: 'vertical' }} // Allow vertical resizing
                />
              <Form.Control.Feedback type="invalid">
                Please provide a description.
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit" style={{ margin: "8px", backgroundColor: "#D8824A" }} >
              Submit
            </Button>
          </Form>
        </Col>
        <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
          <img src={lostImage} alt="Your Image" style={{ maxWidth: '100%', maxHeight: '400px' }} />
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default LostItemForm;