import React from "react";
import { Link } from "react-router-dom";
import myImage from "../images/helping.png";
import secondImage from "../images/carousel1.png";
import thirdImage from "../images/business09.jpg";
import fourthImage from "../images/cardpic.png";

//MUI
import { Grid, Typography, Button } from "@mui/material";
import { Carousel } from "react-bootstrap";
import NavBar from "../components/NavBar";

const HomePage = () => {
  return (
    <div className="home">
      <div style={{ marginBottom: "10px" }}>
        <NavBar />
      </div>

      <div className="d-flex ">
        <Carousel style={{ width: "100%", display: "flex" }}>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={secondImage}
              
              alt="First slide"
              style={{ objectFit: "cover", maxHeight: "450px", width: "100%" }}
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={fourthImage}
              alt="Second slide"
              style={{ objectFit: "object-fit-cover", maxHeight: "450px", width: "100%" }}
            />
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100"
              src={thirdImage}
              alt="Third slide"
               style={{ objectFit: "cover", maxHeight: "450px", width: "100%" }}
            />
          </Carousel.Item>
        </Carousel>
      </div>

      

      <Grid container spacing={1} style={{ textAlign: "center",marginTop: "50px"  }}>
        <Grid
          item
          xs={12}
          sm={6}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft:'3em'
          }}
        >
          <Typography variant="h3" style={{ marginBottom: "0.5em" }} sx={{ fontWeight: 'bold' }}>
            UManitoba Lost and Found
          </Typography>
          <div style={{ marginBottom: "1em" }}>
            <p>
              The chances of finding your lost items have never been higher.
              Powered by advanced AI technology, our website transforms the
              search into a seamless and highly effective journey towards
              reclaiming what's yours!
            </p>
          </div>
          <div className="buttons">
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/lost-item"
              sx={{
                backgroundColor: "#D8824A",
                margin: "8px",
                padding: "10px 20px",
                fontSize: '1rem',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: "#cc6a36"
                }
              }}
            >
              I have lost an item
            </Button>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/found-item"
              sx={{
                backgroundColor: "#D8824A",
                margin: "8px",
                padding: "10px 20px",
                fontSize: '1rem',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: "#cc6a36"
                }
              }}
            >
              I have found an item
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <img
            src={myImage}
            alt="lost and found picture"
            style={{ width: "50%", height: "auto" }}
          />
        </Grid>
      </Grid>
      
      
      <footer style={{ backgroundColor: "#D8824A", padding: "10px", textAlign: "center" }}>
  <p style={{ margin: "0" }}>
    &copy; 2024 UofM. All rights reserved.
  </p>
</footer>
    </div>
  );
};

export default HomePage;
