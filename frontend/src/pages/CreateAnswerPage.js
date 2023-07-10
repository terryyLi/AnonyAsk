import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { MdKeyboardBackspace } from 'react-icons/md';
import './style.css';

function CreateAnswerPage() {
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const { conversationId, postId } = useParams(); // Retrieve the conversationId and postId from the URL parameters
  const [error, setError] = useState('');

  useEffect(() => {
    // Retrieve token from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      // Decode the token to retrieve the username
      navigate(`/`); 
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://anonyask-odnuj43iea-uc.a.run.app/api/conversations/${conversationId}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/post/${postId}`); // Redirect to the previous post page
      } else {
        // Handle error response
        const data = await response.json();
        const { error } = data;
        setError(error);
      }
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <Container className="text-center">
      <h1 className="mt-5">Add Answer</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Container className="mt-5">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control
              as="textarea"
              placeholder="Enter your answer"
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
          <MdKeyboardBackspace size={64} />
      </Link>
    </Container>
  );
}

export default CreateAnswerPage;
