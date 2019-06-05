import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';

class Home extends Component {
  render() {
    return (
      <Jumbotron>
        <h1>Clutch Baseball: Open Source</h1>
        <p>
          Welcome to Clutch Baseball: Open Source, where you can view players, create teams, lineups, and even simulate at bats!
        </p>
      </Jumbotron>
    );
  }
}

export default Home;
