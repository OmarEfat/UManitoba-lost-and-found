import React, { useEffect, useState } from 'react';
import { Button, Container, Col, Row, Form } from 'react-bootstrap';
import { Typography } from '@mui/material';
import NavBar from '../components/NavBar';
import foundImage from '../images/found.JPG';
import ReCAPTCHA from "react-google-recaptcha";


const FoundItemForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    placeFound: '',
    placeHanded: '',
    dateFound: '',
    contactEmail: '',
    itemDescription: ''
  });

  const [validated, setValidated] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);

  useEffect(() => {
    window.recaptchaCallback = () => setRecaptchaVerified(true);
  }, []);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    console.log('start')
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      setValidated(true);
      postData();
    }
  };

  const onReCAPTCHAChange = (value) => {
    setRecaptchaVerified(value !== null);
  };

  const postData = async () => {

    console.log("post found")
    try {
      const response = await fetch('http://127.0.0.1:5000/add_found_item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          placeFound: formData.placeFound,
          placeHanded: formData.placeHanded,
          dateFound: formData.date,
          contactEmail: formData.email,
          itemDescription: formData.description,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Success:', data);
      alert("Item added, thanks")
    } catch (error) {
      console.error('There was an error with the form submission:', error);
    }
  };

  const handleUseCurrentLocation = (fieldName) => {
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
                  [fieldName]: address
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
      <Container style={{ marginTop: '20px' }}>
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

              <Form.Group className="mb-3" controlId="placeFound">
                <Form.Label>Where found</Form.Label>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <Form.Control
                      required
                      type="text"
                      name="placeFound"
                      placeholder="Where was the item found"
                      value={formData.placeFound}
                      onChange={handleChange}
                    />
                  </div>
                  <Button
                    variant="outline"
                    style={{ marginLeft: "8px", backgroundColor: "#D8824A" }}
                    onClick={() => handleUseCurrentLocation('placeFound')}
                  >
                    Use Current Location
                  </Button>
                </div>
                <Form.Control.Feedback type="invalid">
                  Please provide where you found it.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="placeHanded">
                <Form.Label>Where you handed the item to (optional)</Form.Label>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <Form.Control
                      type="text"
                      name="placeHanded"
                      placeholder="Where was the item handed to"
                      value={formData.placeHanded}
                      onChange={handleChange}
                    />
                  </div>
                  <Button
                    variant="outline"
                    style={{ marginLeft: "8px", backgroundColor: "#D8824A" }}
                    onClick={() => handleUseCurrentLocation('placeHanded')}
                  >
                    Use Current Location
                  </Button>
                </div>
                <Form.Control.Feedback type="invalid">
                  Please provide where you found it.
                </Form.Control.Feedback>
              </Form.Group>

              {<Form.Group className="mb-3" controlId="date">
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
              </Form.Group>}
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
                  as="textarea"
                  rows={6}
                  name="description"
                  placeholder="Detailed Item Description"
                  value={formData.description}
                  onChange={handleChange}
                  style={{ resize: 'vertical' }}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a description.
                </Form.Control.Feedback>
              </Form.Group>

              <ReCAPTCHA
                sitekey="6LcgFIQpAAAAAAZekgmPwlrFNaTr0bqLQ1FOd7or"
                onChange={onReCAPTCHAChange}
              />
              <Button variant="primary" type="submit" disabled={!recaptchaVerified} style={{ margin: "8px", backgroundColor: "#D8824A" }} >
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