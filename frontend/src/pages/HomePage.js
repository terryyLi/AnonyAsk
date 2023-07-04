import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import jwt_decode from 'jwt-decode';

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

  return (
    <Container className="text-center">
      <h1 className="mt-5">Welcome, {username}</h1>

      <Container className="mt-5">
        {posts.map((post) => (
          <Row key={post._id} className="mb-3">
            <Col>
              <Card className="py-4 d-flex flex-column">
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-center">{post.title}</Card.Title>
                  <div className="mt-auto text-muted ml-0 text-left">
                    <small>{formatDateTime(post.time)}</small>
                  </div>
                  <Link
                    to={`/createConversation/${post._id}`} // Pass post ID as URL parameter
                    className="btn btn-primary btn-sm float-right"
                  >
                    Create Question
                  </Link>
                  <Link
                    to={`/post/${post._id}`} // Pass post ID as URL parameter
                    className="btn btn-primary btn-sm float-right"
                  >
                    View Conversations
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))}
      </Container>

      <Link to="/createPost">
        <Button variant="primary" className="mt-4">
          Add Post
        </Button>
      </Link>
    </Container>
  );
}

export default HomePage;
