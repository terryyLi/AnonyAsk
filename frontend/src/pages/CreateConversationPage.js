import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

function CreateConversationPage() {
  const [title, setTitle] = useState('');
  const username = 'sample_user';
  const navigate = useNavigate();
  const { postId } = useParams(); // Retrieve the postId from the URL parameter

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/api/conversations/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: title }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/post/${postId}`); // Redirect to homepage
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
      <h1 className="mt-5">Ask me any thing!</h1>
      <Container className="mt-5">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Control
              type="text"
              placeholder="Enter question"
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

export default CreateConversationPage;
