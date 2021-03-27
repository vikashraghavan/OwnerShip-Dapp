import React, { Component } from "react";
import { Navbar, Form, Button, Nav } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import "../App.css";
import logo from "./logo/logo.png";
import 'bootstrap/dist/css/bootstrap.min.css';

class MyNavbar extends Component {

  render() {
    return (
      <div>

        <Navbar className="navbar-custom" variant="dark" expand="lg">
            <Link to = "/"><Navbar.Brand>
            <img
              alt=""
              src={logo}
              width="40"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Owner<span style={{ 'textDecoration':'none' ,'color': '#fff' }}>Ship</span></Navbar.Brand></Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
            </Nav>
            { this.props.isLogged
                ? <Form inline>
                  <Link to = "/"><Button onClick={ (event) => {event.preventDefault(); this.props.logout(); this.props.history.push('/');}} variant="outline-dark">Logout</Button></Link>
                  </Form>
                : <Form inline>
                  <Link to = "/register"><Button className="mr-sm-2" variant="outline-dark">Register</Button></Link>
                  <Link to = "/login"><Button variant="dark">Login</Button></Link>
                  </Form>
            }
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default withRouter(MyNavbar);
