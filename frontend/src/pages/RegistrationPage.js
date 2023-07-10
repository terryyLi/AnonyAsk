import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import AnonyaskImage from "../assets/anonyask.png";
import './style.css';

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
    <section className="h-100vh gradient-form" style={{ backgroundColor: '#eee' }}>
      <Container className="py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-xl-10">
            <div className="card rounded-3 text-black">
              <div className="row g-0">
                <div className="col-lg-6">
                  <div className="card-body p-md-5 mx-md-4">
                    <div className="text-center">
                      <img
                        className="img-fluid larger-image"
                        src={AnonyaskImage}
                        alt="empty"
                        style={{ width: '185px' }} 
                      />
                    </div>
                    <Form>
                      <p>Please create a new account</p>
                      {error && <Alert variant="danger">{error}</Alert>}

                      <div className="form-outline mb-3">
                        <input
                          type="username"
                          id="form2Example11"
                          className="form-control"
                          placeholder="Username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          isInvalid={!!error} // Add isInvalid prop when error exists
                        />
                      </div>
  
                      <div className="form-outline mb-3">
                        <input
                          type="email"
                          id="form2Example11"
                          className="form-control"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          isInvalid={!!error} // Add isInvalid prop when error exists
                        />
                      </div>
  
                      <div className="form-outline mb-3">
                        <input
                          type="password"
                          id="form2Example22"
                          className="form-control"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          isInvalid={!!error} // Add isInvalid prop when error exists
                        />
                      </div>
  
                      <div className="text-center pt-1 mb-5 pb-1">
                        <Button
                          className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                          type="button"
                          onClick={handleRegister}
                        >
                          Register
                        </Button>
                      </div>
  
                      <div className="d-flex align-items-center justify-content-center pb-4">
                        <p className="mb-0 me-2">Already have an account?</p>
                        <Link to="/" type="button" className="btn btn-outline-danger">Sign in</Link>
                      </div>
                    </Form>
  
                  </div>
                </div>
                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default RegistrationPage;
