import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

function LandingPage() {
  return (
    <Container className="text-center mt-5">
      <h1 className="mb-4">Welcome to My App!</h1>
      <p className="lead">This is the landing page of the app.</p>
      <Link to="/login" className="btn btn-primary mr-2">
        Login
      </Link>
      <Button variant="secondary" as={Link} to="/registration">
        Register
      </Button>
    </Container>
  );
}

export default LandingPage;
