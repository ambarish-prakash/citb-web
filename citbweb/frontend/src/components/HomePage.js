import React from 'react';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';

const HomePage = () => {
  const navigate = useNavigate();

  const createGame = () => {
    fetch("/api/game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({}),
    }).then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
      .then(data => {
        console.log(data);
        navigate(`/game/${data.code}`);
    })
      .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
        alert("Error occured. Please try again later.")
      });
  }

  const createSpans = () => {
    const spans = [];
    for (let i = 0; i < 24; i++) {
      spans.push(<span key={i} style={{ '--i': i }}></span>);
    }
    return spans;
  };

  return (
    //   <h1>Home Page</h1>
    //   <p>W to the home page!</p>
    //   <Button variant="contained" color="primary" onClick={createGame}>
    //     Start Game
    //   </Button>
    // </div>
    // <div>
    <div className="hp-container">
      <div className="hp-background">
          {createSpans()}
      </div>
      <div className="hp-content">
          <img src="/static/images/CITB_Logo.png" alt="Image" />
          <Button variant="contained" color="primary" onClick={createGame}>Start Game</Button>
      </div>
    </div>
  );
};

export default HomePage;
