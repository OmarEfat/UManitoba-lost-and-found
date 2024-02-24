import React, { useState } from 'react';
import { Button, Container, Col, Row, Form } from 'react-bootstrap';
import {Typography} from '@mui/material';
import NavBar from '../components/NavBar'; // Assuming NavBar is your header component
import foundImage from '../images/found.JPG'; // Ensure this path is correct for your project

const FoundItemForm = () => {
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
        setFormData({
          ...formData,
          whereFound: `${position.coords.latitude}, ${position.coords.longitude}`
        });
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
              I have found an item
            </Typography>
            <Typography variant="body1" gutterBottom>
            Disclaimer: Our website utilizes Artificial Intelligence (AI) to optimize the pairing of items. The accuracy and efficacy of the matching process are greatly influenced by the quantity and specificity of the information you provide. You will receive email notifications regarding any updates.
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

            <Form.Group className="mb-3" controlId="whereFound">
              <Form.Label>Where found</Form.Label>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <Form.Control
                    required
                    type="text"
                    name="whereFound"
                    placeholder="Where was the item found"
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
                required
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
          <img src={foundImage} alt="Your Image" style={{ maxWidth: '100%', maxHeight: '400px' }} />
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default FoundItemForm;