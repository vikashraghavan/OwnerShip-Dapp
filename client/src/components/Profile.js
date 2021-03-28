import React, { useState   } from 'react';
import { Button, Nav, Card, Container, Modal, Row, Col, Form, FormControl } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import Fuse from 'fuse.js';
import { ArrowLeft } from "react-bootstrap-icons";
import Pager from "./Pager";
import Paginate from "./Paginate";
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = ({ web3, userAllContent, userProjectContent, userArticleContent, userPaperContent, username, userRemovedContent }) => {
  const [posts, setPosts] = useState(userAllContent);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);
  const [active, setActive] = useState('all');
  const [show, setShow] = useState(false);
  const [privateKey, setPrivateKey] = useState(null);
  const [val, setVal] = useState("");

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
        await setPosts(userAllContent);
        return;
      } else if (active === 'project') {
        await setPosts(userProjectContent);
        return;
      } else if (active === 'paper') {
        await setPosts(userPaperContent);
        return;
      }else if (active === 'article') {
        await setPosts(userArticleContent);
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
  const handleClose = () => {setVal("");setPrivateKey(null);setShow(false)};
  const handleShow = () => {setShow(true)};

  // const localWallet = await web3.eth.accounts.wallet.load(password, username);setPrivateKey(localWallet[0].privateKey);

  return (

    <Container fluid style={{ height:'calc(100% - 56px)'}} className="py-3 px-5" >
    <Card id="title" style={{ height:'21%', width:'85%'}} border="dark" className="shadow-lg mt-3 mb-3 border-0 rounded">
      <Card.Body style={{ 'padding':'2.25vh'}}>
        <Row style={{ height:'100%', width:'100%', margin:'0'}}>
          <Col style={{ 'borderRight': '1px solid black'}}>
            <Card.Title style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}> {username} </Card.Title>
          </Col>
          <Col style={{ 'borderRight': '1px solid black'}}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
          <Card.Text className="mb-2">Projects : {userProjectContent.length}</Card.Text>
          <Card.Text className="mb-2">Papers   : {userPaperContent.length}</Card.Text>
          <Card.Text>Article  : {userArticleContent.length}</Card.Text>
          </div>
          </Col>
          <Col className="" >
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
            <center><Link to = "/addContent"><Button className="row mb-3" variant="outline-light">Add Content</Button></Link></center>
            <center><Button className="row" onClick={handleShow} variant="outline-light">View Privatekey</Button></center>
          </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>

    <Card id="cardNav" style={{  height:'70%', width:'85%'}}className="shadow-lg border-0 rounded">
      <Card.Header style={{ backgroundColor: '#faf9f9', 'borderBottom':'0px' }} className="navHeader bottom-0">
        <Nav variant="pills" defaultActiveKey="#first">
        <Nav.Item>
          <Button className={active === 'all' ? 'active mx-1' : 'mx-1'} onClick={() => {setPosts(userAllContent); setCurrentPage(1); setActive('all')} } variant="outline-secondary" id="#first" >All</Button>
        </Nav.Item>
        <Nav.Item>
          <Button className={active === 'project' ? 'active mx-1' : 'mx-1'} onClick={() => {setPosts(userProjectContent); setCurrentPage(1); setActive('project')} } variant="outline-secondary" >Projects</Button>
        </Nav.Item>
        <Nav.Item>
          <Button className={active === 'paper' ? 'active mx-1' : 'mx-1'} onClick={() => {setPosts(userPaperContent); setCurrentPage(1); setActive('paper')} } variant="outline-secondary">Papers</Button>
        </Nav.Item>
        <Nav.Item>
          <Button className={active === 'article' ? 'active mx-1' : 'mx-1'} onClick={() => {setPosts(userArticleContent); setCurrentPage(1); setActive('article')} } variant="outline-secondary">Articles</Button>
        </Nav.Item>
        <Nav.Item>
          <Button className={active === 'trash' ? 'active ml-3' : 'ml-3'} onClick={() => {setPosts(userRemovedContent); setCurrentPage(1); setActive('trash')} } variant="outline-danger">Trash</Button>
        </Nav.Item>
        <Nav.Item className="float-right ml-auto">
          <Form className="float-right" inline>
            <FormControl type="text" onChange={onSearch} placeholder="Search" className="float-right" />
          </Form>
        </Nav.Item>
        </Nav>
      </Card.Header>
      <Card.Body className="px-0 py-0">
        <Pager posts={currentPosts} postsPerPage={postsPerPage} />
      </Card.Body>
      <Card.Footer style={{ height:'65px', backgroundColor: '#faf9f9', 'borderTop':'0px' }} className="position-static">
<Link style={{ 'textDecoration':'none', 'color': 'black'}} to="/"><span className="float-right my-2 ml-2"><ArrowLeft width="25" height="25" className="float-left mr-2"/>Back</span></Link>
        <Paginate
          postsPerPage={postsPerPage}
          totalPosts={posts.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </Card.Footer >
    </Card>
    <Modal show={show} size="lg" backdrop="static" keyboard={false} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Private Key</Modal.Title>
        </Modal.Header>

        {privateKey != null
          ?<><Modal.Body style={{'wordWrap': 'break-word'}}>{privateKey}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={() =>  {navigator.clipboard.writeText(privateKey); handleClose()}}>
                Copy
              </Button>
            </Modal.Footer></>
          :<Modal.Body>
            <Form onSubmit={async (event) => {event.preventDefault();console.log(val);const localWallet = await web3.eth.accounts.wallet.load(val, username);setPrivateKey(localWallet[0].privateKey);}} action="/">
            <Form.Group controlId="formBasissword">
              <Form.Label>Password</Form.Label>
              <Form.Control value={val}
                            onChange={e => setVal( e.target.value )}
                            required
                            type="password" />
            </Form.Group>
            <Button variant="outline-dark" type="submit">
              Submit
            </Button>
            </Form>
            </Modal.Body>
        }

      </Modal>
    </Container>
  );
};

export default withRouter(Profile);
