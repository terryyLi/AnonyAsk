import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Container, Form, Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';

function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // Decode the token to retrieve the username
      const decodedToken = jwt_decode(token);
      setUsername(decodedToken.username);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://anonyask-odnuj43iea-uc.a.run.app/api/posts/user/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate('/home'); // Redirect to homepage
      } else {
        // Handle error response
      }
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <Container className="text-center">
      <h1 className="mt-5"> Create post </h1>
      <Container className="mt-5">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Control
              as="textarea"
              placeholder="Enter post"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ minHeight: '20vw' }}
            />
          </Form.Group>
          <div style={{ textAlign: 'right' }}>
            <Button variant="dark" type="submit" size="lg" className="mt-3">
              Submit
            </Button>
          </div>
        </Form>
      </Container>
      <Link to="/home" className="back-icon">
          <FaArrowLeft size={64} />
      </Link>
    </Container>
  );
}

export default CreatePostPage;
