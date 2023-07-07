import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      if (!validateEmail(email)) {
        setError('Invalid email format');
        return;
      }

      if (password.length < 8) {
        setError('Password should be at least 8 characters');
        return;
      }

      const response = await fetch('https://anonyask-odnuj43iea-uc.a.run.app/api/users/register', {
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
        const { errorCode } = data;
        let errorMessage = 'An error occurred during registration';
  
        // Check the error code and update the error message accordingly
        if (errorCode === 'USERNAME_TAKEN') {
          errorMessage = 'Username is already taken, please choose another username';
        } else if (errorCode === 'EMAIL_TAKEN') {
          errorMessage = 'Email is already taken, please choose another email';
        }
  
        // Set the error message state
        setError(errorMessage);
      }
    } catch (error) {
      // Error occurred during registration request
      console.error('An error occurred:', error);
    }
  };

  const validateEmail = (email) => {
    // Basic email format validation using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <Container className="text-center mt-5">
      <h2 className="mb-4">Registration Page</h2>
      {error && <Alert variant="danger">{error}</Alert>}
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
            isInvalid={!!error && !validateEmail(email)} // Add isInvalid prop when error exists or email format is invalid
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isInvalid={!!error && password.length < 8} // Add isInvalid prop when error exists or password is too short
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
