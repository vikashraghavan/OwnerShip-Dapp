import React, { Component } from "react";
import { Card, Button, Form, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

class AddContent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      type: null,
      fileName: 'Select File'
    }

    //this.toggleCompleted = this.toggleCompleted.bind(this)
  }

  render() {
    return (
      <div style={{ width:'60%', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -45%)'}} >
      <Card id="title" style={{  width:'100%'}} border="dark" className="shadow-lg mt-3 mb-3 border-0 rounded">
        <Card.Body style={{ 'padding':'2.25vh'}}>
          <Card.Title className="my-0" >Add Content </Card.Title>
        </Card.Body>
      </Card>
      <Card  className="shadow-lg mt-3 mb-3 border-0 rounded" border="0">
      <Card.Body className="d-flex flex-column" >
      <Form onSubmit={async (event) => {event.preventDefault();await this.props.updateContract(this.title.value, this.description.value, this.state.type, this.file).then(this.props.history.push('/')); }} className="d-flex flex-column" style={{ height:'100%'}}  action="/">
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Title</Form.Label>
        <Form.Control require ref={(input) => {this.title = input}} type="text" />
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlTextarea1">
        <Form.Label>Description</Form.Label>
        <Form.Control require ref={(input) => {this.description = input}} as="textarea" rows={4} />
      </Form.Group>
      <Form.Group>
      <Form.Label>Type</Form.Label><br/>
      <ToggleButtonGroup require type="radio" name="options">
        <ToggleButton variant="outline-secondary"  onClick={async () => {await this.setState({type: 'Project' })} } value={1}>Project</ToggleButton>
        <ToggleButton variant="outline-secondary"  onClick={ async () => {await this.setState({type: 'Paper' })} } value={2}>Paper</ToggleButton>
        <ToggleButton variant="outline-secondary"  onClick={ async () => {await this.setState({type: 'Article' })} } value={3}>Article</ToggleButton>
      </ToggleButtonGroup>
      </Form.Group >
      <Form.Group>
      <Form.Label>Choose File</Form.Label><br/>
      <Form.File id="formcheck-api-custom" custom>
      <Form.File.Input require onChange={(e) => {this.file =  e.target.files[0]; this.props.captureFile(this.file); this.setState({fileName: this.file.name});}} />
      <Form.File.Label data-browse="Upload">
      {this.state.fileName}
      </Form.File.Label>
      </Form.File>
      </Form.Group>
      <Button style={{ 'marginTop': '8%' }} className="align-self-end" variant="outline-secondary" type="submit">
        Submit
      </Button>
      </Form>
      </Card.Body>
      </Card>
      </div>
    );
  }
}

export default withRouter(AddContent);
