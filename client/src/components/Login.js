import React, { Component } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

class Login extends Component {

  login = async (username,password) => {
    await this.props.loadUser(this.username.value, this.password.value).then(r => {const a=r});
    if (this.a) {
      console.log(this.a);
      this.props.history.push("/");
      this.props.stopLoading();
    }
  };

  render() {
    return (
      <div style={{ backgroundColor: '#ACC8E5' ,position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}} >
      <Card id="title" style={{  width:'100%'}} border="dark" className="shadow-lg mt-3 mb-3 border-0 rounded">
        <Card.Body style={{ 'padding':'2.25vh'}}>
          <Card.Title className="my-0" > Login </Card.Title>
        </Card.Body>
      </Card>
      <Card className="shadow-lg mt-3 mb-3 border-0 rounded" border="0">
      <Card.Body style={{ height:'30vh', width:'40vw'}}>
      <Form onSubmit={async (event) => {
          event.preventDefault(); await this.login(this.username.value, this.password.value).then(this.props.history.push("/"));
        }}
        action="/
      >
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control ref={(input) => {this.username = input}} type="text" />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control ref={(input) => {this.password = input}} required type="password" />
      </Form.Group>
      <Button variant="outline-secondary" type="submit">
        Submit
      </Button>
      </Form>
      </Card.Body>
      </Card>
      </div>
    );
  }
}

export default withRouter(Login);
