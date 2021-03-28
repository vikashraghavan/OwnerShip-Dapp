import React, { useState, useEffect } from "react";
import { Card, Button, Form, Alert } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = ({history, loadUser, stopLoading, show}) => {

  const login = async (username,password) => {
    await loadUser(username, password).then(r => {
      if (r) {
        history.push("/");
        stopLoading();
      } else {

        stopLoading();

        console.log('wrong cred');

      }
    });
  };


    return (
      <div id="login" style={{ backgroundColor: '#ACC8E5' ,position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}} >
      <Card id="title" style={{  width:'100%'}} border="dark" className="shadow-lg mt-3 mb-3 border-0 rounded">
        <Card.Body style={{'padding':'2.25vh'}}>
          <Card.Title className="my-0" > Login </Card.Title>
        </Card.Body>
      </Card>
      <Card className="shadow-lg mt-3 mb-3 border-0 rounded" border="0">
      <Card.Body id="custom-login" style={{ height:'30vh', width:'40vw'}}>
      <Form onSubmit={async (event) => { event.preventDefault(); await login(event.target.username.value, event.target.password.value);}}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control name="username" type="text" />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control name="password" required type="password" />
      </Form.Group>
      <Button variant="outline-secondary" type="submit">
        Submit
      </Button>
      </Form>
      </Card.Body>
      </Card>
      <Alert show={show} variant="danger">
        Check user credentials!
      </Alert>
      </div>
    );

};

export default withRouter(Login);
