import React, { useEffect, useState } from 'react';
import { Button, Container, Col, Row, Form } from 'react-bootstrap';
import { Typography } from '@mui/material';
import NavBar from '../components/NavBar';
import foundImage from '../images/found.JPG';
import ReCAPTCHA from "react-google-recaptcha";


const MAX_EMAIL=100;
const MAX_TITLE=100;
const MAX_DESCRIPTION=1000;
const MAX_PLACE_FOUND =1000;
const MAX_PLACE_HANDED =1000;

const MAX_DATE=12;


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
  const [maxReached, setMaxReached] = useState({
    title: false,
    placeFound: false,
    placeHanded: false,
    date: false,
    email: false,
    description: false
});



  useEffect(() => {
    window.recaptchaCallback = () => setRecaptchaVerified(true);
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Define maximum lengths for each field
    const maxLengths = {
        title: MAX_TITLE,
        placeFound: MAX_PLACE_FOUND,
        placeHanded: MAX_PLACE_HANDED,
        date: MAX_DATE,
        email: MAX_EMAIL, // Adjust as needed
        description: MAX_DESCRIPTION // Adjust as needed
    };

   e.target.maxLength = maxLengths[name];


    // Update the form data with the truncated value
    setFormData({
        ...formData,
        [name]: value//truncatedValue
    });

    if (value.length >= maxLengths[name]) {
      setMaxReached({
          ...maxReached,
          [name]: true
      });
  } else {
      setMaxReached({
          ...maxReached,
          [name]: false
      });
  }
};


const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  // Append leading zero if month or day is single digit
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }

  return `${year}-${month}-${day}`;
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
                <Form.Label>Title (required, {MAX_TITLE} characters max)</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleChange}
                />
                  {maxReached.title && <small className="text-danger">Maximum {MAX_TITLE} characters reached</small>}
                <Form.Control.Feedback type="invalid">
                  Please provide a title.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="placeFound">
                <Form.Label>Where found (optional, {MAX_PLACE_FOUND} characters max)</Form.Label>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <Form.Control
                   
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
                {maxReached.placeFound && <small className="text-danger">Maximum {MAX_PLACE_FOUND} characters reached</small>}
                
                <Form.Control.Feedback type="invalid">
                  Please provide where you found it.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="placeHanded">
                <Form.Label>Where you handed the item to (required, {MAX_PLACE_HANDED} characters max)</Form.Label>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <Form.Control
                      required
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
                {maxReached.placeHanded && <small className="text-danger">Maximum {MAX_PLACE_HANDED} characters reached</small>}
                <Form.Control.Feedback type="invalid">
                  Please provide where you found it.
                </Form.Control.Feedback>
              </Form.Group>

              {<Form.Group className="mb-3" controlId="date">
                <Form.Label>Date (optional)</Form.Label>
                <Form.Control
                
                  type="date"
                  name="date"
                  placeholder="The date the item was found"
                  value={formData.date}
                  onChange={handleChange}
                  max={getCurrentDate()}
                />
                {maxReached.date && <small className="text-danger">Maximum {MAX_DATE} characters reached</small>}
                <Form.Control.Feedback type="invalid">
                  Please provide a valid date.
                </Form.Control.Feedback>
              </Form.Group>}
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email (optional, {MAX_EMAIL} characters max))</Form.Label>
                <Form.Control
         
                  type="email"
                  name="email"
                  placeholder="Contact Email (Optional)"
                  value={formData.email}
                  onChange={handleChange}
                />
                {maxReached.email && <small className="text-danger">Maximum {MAX_EMAIL} characters reached</small>}
                <Form.Control.Feedback type="invalid">
                  Please provide a valid email.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description (required, {MAX_DESCRIPTION} characters max)</Form.Label>

                <Form.Control
                  as="textarea"
                  required
                  rows={6}
                  name="description"
                  placeholder="Detailed Item Description"
                  value={formData.description}
                  onChange={handleChange}
                  style={{ resize: 'vertical' }}
                />
                      {maxReached.description && <small className="text-danger">Maximum {MAX_DESCRIPTION} characters reached</small>}
                
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