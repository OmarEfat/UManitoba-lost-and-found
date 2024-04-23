import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import lostImage from '../images/confused.jpg';

const MAX_EMAIL = 100;
const MAX_TITLE = 100;
const MAX_DESCRIPTION = 1000;
const MAX_PLACE_LOST = 1000;
const MAX_DATE = 12;


const LostItemForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    placeLost: '',
    dateFound: '',
    contactEmail: '',
    itemDescription: ''
  });
  const navigate = useNavigate();




  const [validated, setValidated] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [isEmailDomainValid, setIsEmailDomainValid] = useState(true);
  const [maxReached, setMaxReached] = useState({
    title: false,
    placeLost: false,
    date: false,
    email: false,
    description: false
  });


  useEffect(() => {
    window.recaptchaCallback = () => setRecaptchaVerified(true);
  }, []);


  const handleChange = (event) => {
    const { name, value } = event.target;


    if (name === "email") {
      setIsEmailDomainValid(value.endsWith("@myumanitoba.ca") || value.endsWith("@umanitoba.ca"));
    }


    // Define maximum lengths for each field
    const maxLengths = {
      title: MAX_TITLE,
      placeLost: MAX_PLACE_LOST,
      date: MAX_DATE,
      email: MAX_EMAIL, // Adjust as needed
      description: MAX_DESCRIPTION // Adjust as needed
    };

    event.target.maxLength = maxLengths[name];


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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!isEmailDomainValid) {
      alert("Please use a valid @myumanitoba.ca or @umanitoba.ca email address.");
      return;
    }

    if (!form.checkValidity()) {
      event.stopPropagation();
    } else {

      postData();
    // window.location.href = '/redirected-page';

    }
    setValidated(true);
  };


  const onReCAPTCHAChange = (value) => {
    setRecaptchaVerified(value !== null);
  };

  const postData = async () => {
    console.log("Posting lost item data");
    try {
      const response = await fetch('http://127.0.0.1:5000/add_lost_item', { // Make sure this matches your Flask endpoint for lost items
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          placeLost: formData.placeLost, // Make sure this key matches what your backend expects
          dateLost: formData.date, // Make sure this key matches what your backend expects
          contactEmail: formData.email,
          itemDescription: formData.description,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success:', data);
      alert("Item added, thanks");
      const ID=data["id"];
      console.log("the item id is ", ID);
      navigate(`/redirected-page/${ID}`); 
      // Reset the form or navigate the user to a success page, etc.



    } catch (error) {
      console.error('There was an error with the form submission:', error);
    }
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
                  placeLost: address // Use the actual address here
                });
              } else {
                console.log("No results Lost");
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
              I have Lost an item
            </Typography>
            <Typography variant="body1" gutterBottom>
              Disclaimer: Our website utilizes Artificial Intelligence (AI) to optimize the pairing of items. The accuracy and efficacy of the matching process are greatly influenced by the quantity and specificity of the information you provide. You will receive email notifications regarding any updates related to your lost item.
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

              <Form.Group className="mb-3" controlId="placeLost">
                <Form.Label>Where Lost (optional, {MAX_PLACE_LOST} characters max)</Form.Label>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <Form.Control

                      type="text"
                      name="placeLost"
                      placeholder="Where was the item Lost"
                      value={formData.placeLost}
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
                {maxReached.placeLost && <small className="text-danger">Maximum {MAX_PLACE_LOST} characters reached</small>}
                <Form.Control.Feedback type="invalid">
                  Please provide where you Lost it.
                </Form.Control.Feedback>
              </Form.Group>


              <Form.Group className="mb-3" controlId="date">
                <Form.Label>Date (optional)</Form.Label>
                <Form.Control

                  type="date"
                  name="date"
                  placeholder="The date the item was Lost"
                  value={formData.date}
                  onChange={handleChange}
                  max={getCurrentDate()}
                />
                {maxReached.date && <small className="text-danger">Maximum {MAX_DATE} characters reached</small>}
                <Form.Control.Feedback type="invalid">
                  Please provide a valid date.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email (required, {MAX_EMAIL} characters max)</Form.Label>
                <Form.Control
                  required
                  type="email"
                  name="email"
                  placeholder="Contact Email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {!isEmailDomainValid && <small className="text-danger">Email must be from a @myumanitoba.ca or @umanitoba.ca domain</small>}

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
            <img src={lostImage} alt="Your Image" style={{ maxWidth: '100%', maxHeight: '400px' }} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LostItemForm;