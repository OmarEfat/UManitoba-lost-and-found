import React from "react";
import { Link } from "react-router-dom";
import myImage from "../images/helping.png";

//MUI
import { Grid, Typography, Button } from "@mui/material";

import NavBar from "../components/NavBar";

const HomePage = () => {
  return (
    <div className="home">
      <div style={{ marginBottom: "100px" }}>
        <NavBar />
      </div>

      <Grid container spacing={1} style={{ textAlign: "center" }}>
        <Grid
          item
          xs={12}
          sm={6}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft:'1em'
          }}
        >
          <Typography variant="h3" style={{ marginBottom: "0.5em" }} sx={{ fontWeight: 'bold' }}>
            UManitoba Found and Lost
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
            style={{ width: "70%", height: "auto" }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;
