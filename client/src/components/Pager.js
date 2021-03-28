import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import Truncate from 'react-truncate';
import { withRouter, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../App.css";

const Pager = ({ posts, loading, postsPerPage }) => {
  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <Container  id="contentcard" className="px-3 py-3" fluid style={{ height:'100%'}}>
    {posts.length === 0
      ? <p> No Content </p>
      :  postsPerPage === 4
          ?posts.map((post,i) => (
            <Link key={i} style={{ 'textDecoration':'none', 'color': 'black'}} to={`/content/${post.id}`}>
            <Card style={{ height:'22%', 'overflowY':'auto', backgroundColor: '#faf9f9' }} className="shadow-sm p-3 mb-3 rounded">
              <Card.Body style={{ 'padding':'1vh'}}>
                <Row style={{ height: '100%', width: '100%', 'margin': '0%' }}>
                <Col >
                  <Card.Text  style={{ 'fontSize':'2.5vmin'}} className="my-0"> {post.title} </Card.Text>
                </Col>
                <Col id="description" xs={8}>
                  <Card.Text>
                  <Truncate lines={2} style={{ 'fontSize':'1.5vh', 'marginBottom':'0vh'}} ellipsis={<span>...</span>}>
                  {post.description}
                  </Truncate>
                  </Card.Text>
                </Col>
                <Col style={{ width: '10%' }}>
                  <Card.Text style={{ 'fontSize':'2vh'}} className=" float-right text-muted">Author: {post.author} </Card.Text>
                </Col>
                </Row>
              </Card.Body>
            </Card>
            </Link>
          ))
          : posts.map((post,i) => (
            <Link key={i} style={{ 'textDecoration':'none', 'color': 'black'}} to={`/content/${post.id}`}>
            <Card  key={post.id} style={{ height:'17.5%', 'fontsize':'100%', 'overflowY':'auto', backgroundColor: '#faf9f9' }} className="shadow-sm p-3 mb-3 rounded">
              <Card.Body style={{ 'padding':'1vh'}}>
              <Row style={{ width: '100%' }}>
              <Col >
                <Card.Text  style={{ 'fontSize':'2.5vh'}} className="my-0"> {post.title} </Card.Text>
              </Col>
              <Col className="custom-description" xs={8}>
                <Card.Text>
                <Truncate lines={2} style={{ 'fontSize':'1.5vh', 'marginBottom':'0vh'}} ellipsis={<span>...</span>}>
                {post.description}
                </Truncate>
                </Card.Text>
              </Col>
              <Col style={{ width: '10%' }}>
                <Card.Text style={{ 'fontSize':'2vh'}} className=" float-right text-muted">Author: {post.author} </Card.Text>
              </Col>
              </Row>
              </Card.Body>
            </Card>
            </Link>
          ))

    }

      </Container>
  );
};

export default withRouter(Pager);
