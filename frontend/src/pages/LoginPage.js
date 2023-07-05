import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        const { token } = data;
  
        // Store the JWT token in local storage
        localStorage.setItem('token', token);
  
        // Login successful, perform necessary actions (e.g., redirect)
        console.log('Login successful');
        navigate('/home'); // Redirect to homepage
      } else {
        const data = await response.json();
        const { errorCode } = data;
        let errorMessage = 'An error occurred during login';
  
        // Check the error code and update the error message accordingly
        if (errorCode === 'EMAIL_NOT_FOUND') {
          errorMessage = 'Email does not exist, please try another email';
        } else if (errorCode === 'INVALID_PASSWORD') {
          errorMessage = 'Password is incorrect';
        }
  
        // Set the error message state
        setError(errorMessage);
      }
    } catch (error) {
      // Error occurred during login request
      console.error('An error occurred:', error);
      setError('An error occurred during login');
    }
  };
  

  return (
    <Container className="text-center mt-5">
      <h2>Login Page</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form>
        <Form.Group controlId="email">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={!!error} // Add isInvalid prop when error exists
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isInvalid={!!error} // Add isInvalid prop when error exists
          />
        </Form.Group>
        <Button variant="primary" type="button" onClick={handleLogin}>
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default LoginPage;
