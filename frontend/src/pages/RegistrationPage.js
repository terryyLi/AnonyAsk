import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token } = data;

        // Store the JWT token in local storage
        localStorage.setItem('token', token);

        // Registration successful, perform necessary actions (e.g., redirect)
        console.log('Registration successful');
        navigate('/home'); // Redirect to homepage
      } else {
        const data = await response.json();
        // Registration failed, handle error (e.g., display error message)
        console.error(data.error);
      }
    } catch (error) {
      // Error occurred during registration request
      console.error('An error occurred:', error);
    }
  };

  return (
    <Container className="text-center mt-5">
      <h2 className="mb-4">Registration Page</h2>
      <Form>
        <Form.Group controlId="username">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="button" onClick={handleRegister}>
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default RegistrationPage;
