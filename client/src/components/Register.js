import React, { Component } from "react";
import { Card, Button, Form, Alert } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

class Register extends Component {

  constructor(props) {

    super(props)

    this.state = { rshow: false }
    this.makeRegister = this.makeRegister.bind(this);

  }

  makeRegister = async (username, password, confirmpassword) => {

    if (password === confirmpassword) {
      this.setState({rshow: false});
      this.props.createUser(username, password).then(await this.props.history.push('/'));
    } else {
      this.setState({rshow: true});
      console.log('tst');
    }

  };

  render() {
    return (
      <div id="register" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}} >
      <Card id="title" style={{  width:'100%'}} border="dark" className="shadow-lg mt-3 mb-3 border-0 rounded">
        <Card.Body style={{ 'padding':'2.25vh'}}>
          <Card.Title className="my-0" >Register </Card.Title>
        </Card.Body>
      </Card>
      <Card className="shadow-lg mt-3 mb-3 border-0 rounded" border="0">
      <Card.Body id="custom-register" style={{ height:'40vh', width:'40vw'}}>
      <Form onSubmit={async (e) => {
        e.preventDefault();
        await this.makeRegister(this.username.value, this.password.value, this.confirmpassword.value);}}
      >
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control ref={(input) => {this.username = input}} type="text" />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control ref={(input) => {this.password = input}} required type="password" />
      </Form.Group>
      <Form.Group controlId="formBasicCPassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control ref={(input) => {this.confirmpassword = input}} required type="password" />
      </Form.Group>
      <Button variant="outline-secondary" type="submit">
        Submit
      </Button>
      </Form>
      </Card.Body>
      </Card>
      <Alert show={this.state.rshow} variant="danger">
        Password mismatch!
      </Alert>
      </div>
    );
  }
}

export default withRouter(Register);
