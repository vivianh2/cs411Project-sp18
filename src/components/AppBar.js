import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import Authentication from './Authentication'

function AppBar(props) {
  const { classes } = props;
  return (
    <Navbar inverse collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="/">Read Me Again</a>
        </Navbar.Brand>
      </Navbar.Header>
        <Nav pullRight>
          <NavItem eventKey={1} href="#">
            <Authentication />
          </NavItem>
        </Nav>
    </Navbar>
  );
}

AppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default AppBar;
