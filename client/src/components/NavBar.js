import React, { Component } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { HashRouter, Route } from "react-router-dom";

import Home from './Home';
import HitterList from './HitterList';

class NavBar extends Component {
  render() {
    return (
      <HashRouter>
        <Navbar bg="primary" variant="dark" style={{marginBottom: '20px'}}>
          <Navbar.Brand href="#/">Clutch Baseball OS</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="#/">Home</Nav.Link>
            <Nav.Link href="#/pitcher-list">Pitchers</Nav.Link>
            <Nav.Link href="#/hitter-list">Hitters</Nav.Link>
          </Nav>
        </Navbar>
        <Container>
          <Route path="/" exact component={Home} />
          { /* <Route path="/pitcher-list" component={PitcherList} /> */}
          <Route path="/hitter-list" component={HitterList} />
        </Container>
      </HashRouter>
    );
  }
}

export default NavBar;
