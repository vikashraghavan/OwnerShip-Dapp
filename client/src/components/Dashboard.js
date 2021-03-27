import React, { useState } from 'react';
import { Button, Nav, Card, Form, FormControl, Container } from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import Fuse from 'fuse.js';
import Pager from "./Pager";
import Paginate from "./Paginate";
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = ({username, allContent, projectContent, articleContent, paperContent}) => {
  const [posts, setPosts] = useState(allContent);
  const [currentPage, setCurrentPage] = useState(1);
  const [active, setActive] = useState('all');
  const [postsPerPage] = useState(5);

  const fuse = new Fuse(posts, {
    tokenize: false,
    keys: [
      'title'
    ],
    //includeScore: true
  });

  const onSearch = async ({ currentTarget }) => {
    //updateQuery(currentTarget.value);
    //console.log(currentTarget.value);
    if (currentTarget.value === '') {
      if (active === 'all') {
        await setPosts(allContent);
        return;
      } else if (active === 'project') {
        await setPosts(projectContent);
        return;
      } else if (active === 'paper') {
        await setPosts(paperContent);
        return;
      }else if (active === 'article') {
        await setPosts(articleContent);
        return;
      }
    }
    const results = await fuse.search(currentTarget.value);
    //console.log(results);
    await setPosts(results.map(r => r.item));

  };

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (

    <Container fluid style={{ height:'calc(100% - 56px)'}} className="py-3 px-5" >
    <Card id="title" style={{  height:'8%', width:'85%'}} className="shadow-lg mt-3 mb-3 border-0 rounded">
      <Card.Body  style={{ 'padding':'2.25vh'}}>

        <Card.Title className="d-inline-block" style={{ 'fontSize':'1.25rem', 'marginRight':'0%', 'marginBottom':'0%'}} > Welcome, {username}</Card.Title>
        <Link style={{ 'textDecoration':'none', 'color': 'white'}} to="/addContent">
        <Card.Subtitle className="d-inline-block float-right my-auto" style={{ 'fontSize':'2vh'}}  >Add Content</Card.Subtitle>
        </Link>
        <Link style={{ 'textDecoration':'none', 'color': 'white'}} to="/profile">
        <Card.Subtitle className="d-inline-block float-right my-auto" style={{ 'fontSize':'2vh', 'marginRight': '3vmin'}}  >Profile</Card.Subtitle>
        </Link>
      </Card.Body>
    </Card>


    <Card id="cardNav" style={{  height:'83%', width:'85%'}} className="shadow-lg border-0 rounded">
      <Card.Header  style={{ backgroundColor: '#faf9f9', 'borderBottom':'0px' }} className="navHeader bottom-0">
        <Nav variant="pills" defaultActiveKey="#first">
        <Nav.Item>
          <Button className={active === 'all' ? 'active mx-1' : 'mx-1'} onClick={() => {setPosts(allContent); setCurrentPage(1); setActive('all')} } variant="outline-secondary" id="#first" >All</Button>
        </Nav.Item>
        <Nav.Item>
          <Button className={active === 'project' ? 'active mx-1' : 'mx-1'} onClick={() => {setPosts(projectContent); setCurrentPage(1); setActive('project')} } variant="outline-secondary" >Projects</Button>
        </Nav.Item>
        <Nav.Item>
          <Button className={active === 'paper' ? 'active mx-1' : 'mx-1'} onClick={() => {setPosts(paperContent); setCurrentPage(1); setActive('paper')} } variant="outline-secondary">Papers</Button>
        </Nav.Item>
        <Nav.Item>
          <Button className={active === 'article' ? 'active mx-1' : 'mx-1'} onClick={() => {setPosts(articleContent); setCurrentPage(1); setActive('article')} } variant="outline-secondary">Articles</Button>
        </Nav.Item>
          <Nav.Item className="float-right ml-auto">
          <Form className="float-right" inline>
        <FormControl type="text" onChange={onSearch} placeholder="Search" className="float-right" />
      </Form>
      </Nav.Item>
        </Nav>

      </Card.Header>
      <Card.Body className="px-0 py-0">
        <Pager posts={currentPosts} postsPerPage={postsPerPage}  />
      </Card.Body>
      <Card.Footer style={{ height:'65px', backgroundColor: '#faf9f9', 'borderTop':'0px' }} className="position-static">
        <Paginate
          postsPerPage={postsPerPage}
          totalPosts={posts.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </Card.Footer>
    </Card>
    </Container>
  );
};

export default withRouter(Dashboard);
