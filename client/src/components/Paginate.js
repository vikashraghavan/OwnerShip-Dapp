import React from "react";
import { ArrowLeft } from "react-bootstrap-icons";
//import { Button, Nav, Card, Container, Pagination } from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


const Paginate = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav style={{width:'50%'}}>
      <ul className='pagination'>
        {pageNumbers.map(number => (
          <li key={number} className='page-item'>
            <a href="#" onClick={(event) => {event.preventDefault();paginate(number)}} className={currentPage === number ? 'active page-link' : 'page-link'}>
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};


export default withRouter(Paginate);
