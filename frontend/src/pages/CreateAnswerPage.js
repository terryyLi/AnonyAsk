import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

function CreateAnswerPage() {
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const { conversationId, postId } = useParams(); // Retrieve the conversationId and postId from the URL parameters

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/api/conversations/${conversationId}/answer`, {
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
      }
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <Container className="text-center">
      <h1 className="mt-5">Add Answer</h1>
      <Container className="mt-5">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter your answer"
              value={content}
              onChange={(e) => setContent(e.target.value)}
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

export default CreateAnswerPage;