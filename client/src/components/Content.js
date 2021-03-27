import React, { useState, useEffect } from 'react';
import { Button, Card, Container } from "react-bootstrap";
import { ArrowLeft } from 'react-bootstrap-icons';
import { withRouter, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Content = ({ history, props, match, totalContent, userAccount, deleteContent, restoreContent}) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const index = match.params.id;
      console.log(totalContent);
       setContent(totalContent[index-1]);
      console.log(userAccount);
      setLoading(false);

    };

    fetchPosts();
  }, []);

  const downloadEmployeeData = () => {
		fetch(`https://ipfs.io/ipfs/${content.contentHash}`)
			.then(response => {
				response.blob().then(blob => {
					let url = window.URL.createObjectURL(blob);
					let a = document.createElement('a');
					a.href = url;
					a.download = content.title;
					a.click();
				});
				//window.location.href = response.url;
		});
	};

if (loading) {
  return <p>loading</p>
} else {


  return (
<Container fluid style={{ height:'calc(100% - 56px)'}} className="py-3 px-5" >

    {loading
      ? <p>loading</p>
      :<>
      <Card id="title" style={{  height:'8%', width:'85%'}} border="dark" className="shadow-lg mt-3 mb-3 border-0 rounded">

        <Card.Body style={{ marginRight:'auto',marginLeft:'auto',width:'100%','padding':'2.25vh'}}>
          <Card.Title id="contentTitle">{totalContent[match.params.id-1].title}<span onClick={history.goBack} className="float-right ml-2"><ArrowLeft width="25" height="25" className="float-left mr-2"/>Back</span></Card.Title>
        </Card.Body>
      </Card>
        <Card id="cardNav" style={{  maxHeight:'90%', width:'85%'}} className="shadow-lg mt-3 mb-3 border-0 rounded">
          <Card.Body style={{ 'padding':'2.25vh'}}>
            <Card.Subtitle className="text-muted mt-1">Author: {totalContent[match.params.id-1].author}</Card.Subtitle><br/>
            <Card.Subtitle className="text-muted mb-3">Type: {totalContent[match.params.id-1].contentType}</Card.Subtitle><br/>
            <Card.Text style={{ maxHeight:'55vh', "overflowY":'auto' }}>{totalContent[match.params.id-1].description}</Card.Text><br/>
            <Button onClick={downloadEmployeeData} target="_blank" variant="outline-secondary" download>Download</Button>
            {totalContent[match.params.id-1].authorAddress === userAccount
              ? totalContent[match.params.id-1].isRemoved
                ? <Link to="/profile">
                    <Button
                      className="mx-3"
                      onClick={async ()=> {
                        await restoreContent(totalContent[match.params.id-1].id,
                                            totalContent[match.params.id-1].contentHash,
                                            totalContent[match.params.id-1].title,
                                            totalContent[match.params.id-1].authorAddress)
                                          }}
                      target="_blank"
                      variant="outline-success"
                      download>Restore
                    </Button>
                  </Link>
                : <Link to="/profile">
                  <Button
                    className="mx-3"
                    onClick={async ()=> {
                      await deleteContent(totalContent[match.params.id-1].id,
                                          totalContent[match.params.id-1].contentHash,
                                          totalContent[match.params.id-1].title,
                                          totalContent[match.params.id-1].authorAddress)
                                        }}
                    target="_blank"
                    variant="outline-danger"
                    download>Delete
                  </Button>
                </Link>

              : <></>
            }
          </Card.Body>
        </Card>
        </>

  }
    </Container>
  );
}
};

export default withRouter(Content);
