import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { FaClipboard } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';
import jwt_decode from 'jwt-decode';
import './HomePage.css';

const formatDateTime = (dateTimeString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };

  return new Date(dateTimeString).toLocaleString(undefined, options);
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  } catch (error) {
    console.error('Failed to copy text: ', error);
    // Handle error
  }
};

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Retrieve token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // Decode the token to retrieve the username
      const decodedToken = jwt_decode(token);
      setUsername(decodedToken.username);
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      if (username) {
        try {
          const response = await fetch(`http://localhost:3001/api/posts/user/${username}`);
          if (response.ok) {
            const data = await response.json();
            setPosts(data);
          } else {
            // Handle error response
          }
        } catch (error) {
          console.error(error);
          // Handle error
        }
      }
    };

    fetchPosts();
  }, [username]);

  return (
    <Container className="text-center">
      <h1 className="mt-5">Welcome, {username}</h1>

      {posts.length === 0 ? (
        <p>There are no posts yet.</p>
      ) : (
        <Container className="mt-5">
          {posts.map((post) => (
            <Row key={post._id} className="mb-3">
              <Col>
                <Link to={`/post/${post._id}`} className="link-style">
                  <Card className="py-4 d-flex flex-column custom-card">
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="text-center">{post.title}</Card.Title>
                      <div className="mt-auto text-muted ml-0 text-left">
                        <small className="post-time">{formatDateTime(post.time)}</small>
                      </div>
                      <div
                        className="copy-icon"
                        onClick={(event) => {
                          event.preventDefault(); // Prevent default behavior
                          event.stopPropagation(); // Stop event propagation
                          const uniqueLink = `${window.location.origin}/createConversation/${post._id}`;
                          copyToClipboard(uniqueLink);
                        }}
                      >
                        <FaClipboard size={18} />
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            </Row>
          ))}
        </Container>
      )}

      <Link to="/createPost" className="add-icon">
        <MdAdd size={64} />
      </Link>
    </Container>
  );
}

export default HomePage;
