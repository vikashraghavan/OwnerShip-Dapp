import React, { useState } from 'react';
import { Button, Nav, Card, Form, FormControl, Container, Dropdown } from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import Fuse from 'fuse.js';
import Pager from "./Pager";
import Paginate from "./Paginate";
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = ({username, allContent, projectContent, articleContent, paperContent}) => {
  const [posts, setPosts] = useState(allContent);
  const [currentPage, setCurrentPage] = useState(1);
  const [active, setActive] = useState('All');
  const [postsPerPage] = useState(5);

  const fuse = new Fuse(posts, {
    tokenize: false,
    keys: [
      'title'
    ],
    //includeScore: true
  });

  const contentMapping = {

    'All': allContent,
    'Project': projectContent,
    'Paper': paperContent,
    'Article':articleContent

  }

  const onSearch = async ({ currentTarget }) => {
    //updateQuery(currentTarget.value);
    //console.log(currentTarget.value);

    if(currentTarget.value === '' && Object.keys(contentMapping).includes(active) ){

      await setPosts(contentMapping[active]);
      return;

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

    <Container id="content" fluid style={{ height:'calc(100% - 56px)'}} className="py-3 px-5" >
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
        <Nav className="custom-tab1" variant="pills" defaultActiveKey="#first">
        <Nav.Item>
          <Button className={active === 'All' ? 'active mx-1' : 'mx-1'} onClick={() => {setPosts(allContent); setCurrentPage(1); setActive('All')} } variant="outline-secondary" id="#first" >All</Button>
        </Nav.Item>
        <Nav.Item>
          <Button className={active === 'Project' ? 'active mx-1' : 'mx-1'} onClick={() => {setPosts(projectContent); setCurrentPage(1); setActive('Project')} } variant="outline-secondary" >Projects</Button>
        </Nav.Item>
        <Nav.Item>
          <Button className={active === 'Paper' ? 'active mx-1' : 'mx-1'} onClick={() => {setPosts(paperContent); setCurrentPage(1); setActive('Paper')} } variant="outline-secondary">Papers</Button>
        </Nav.Item>
        <Nav.Item>
          <Button className={active === 'Article' ? 'active mx-1' : 'mx-1'} onClick={() => {setPosts(articleContent); setCurrentPage(1); setActive('Article')} } variant="outline-secondary">Articles</Button>
        </Nav.Item>
          <Nav.Item className="float-right ml-auto">
          <Form className="float-right" inline>
        <FormControl type="text" onChange={onSearch} placeholder="Search" className="float-right" />
      </Form>
      </Nav.Item>
        </Nav>

        <Nav className="custom-tab2" variant="pills" defaultActiveKey="#first">
          <Nav.Item style={{width:'30%', float:'left'}}>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" active>
            {active}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item className={active === 'All' ? 'd-none' : ''} onClick={() => {setPosts(allContent); setCurrentPage(1); setActive('All')} }>All</Dropdown.Item>
              <Dropdown.Item className={active === 'Project' ? 'd-none' : ''} onClick={() => {setPosts(projectContent); setCurrentPage(1); setActive('Project')} }>Project</Dropdown.Item>
              <Dropdown.Item className={active === 'Paper' ? 'd-none' : ''} onClick={() => {setPosts(paperContent); setCurrentPage(1); setActive('Paper')} }>Paper</Dropdown.Item>
              <Dropdown.Item className={active === 'Article' ? 'd-none' : ''} onClick={() => {setPosts(articleContent); setCurrentPage(1); setActive('Article')} } >Article</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          </Nav.Item>
          <Nav.Item style={{width:'70%'}} className="float-right ml-auto">
          <Form  className="float-right">
        <FormControl id="extend"  type="text" onChange={onSearch} placeholder="Search" />
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
