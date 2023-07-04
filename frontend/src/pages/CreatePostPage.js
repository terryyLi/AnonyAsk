import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

function CreatePostPage() {
  const [title, setTitle] = useState('');
  const username = 'sample_user';
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/api/posts/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Post created successfully');
        navigate('/'); // Redirect to homepage
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
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-4">
            Submit
          </Button>
        </Form>
      </Container>
    </Container>
  );
}

export default CreatePostPage;
