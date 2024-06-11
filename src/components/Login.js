import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SignUpForm from './SignUpForm';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleForgotPassword = () => {
    // Implement forgot password logic here
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/users/login/', {
        email: email,
        password: password
      });
      const { success, username,token } = response.data;
      //console.log(response.data)
      if (success) {
        const user = username || email;
        //sessionStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', user);
        localStorage.setItem('Token',token)
        
        onLogin(user);
        navigate('/home');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div style={{ width: '300px' }}>
        <Form onSubmit={handleLogin}>
          <h2>Login</h2>
          <Form.Group controlId="email">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" style={{ marginBottom: '10px' }}>Login</Button>
          <Button variant="secondary" onClick={handleSignup} style={{ marginBottom: '10px', float: 'right' }}>Sign Up</Button>
          <a href="#" onClick={handleForgotPassword} style={{ marginBottom: '10px', float: 'left' }}>Forgot Password?</a>
        </Form>
        {error && <Alert variant="danger">{error}</Alert>}
      </div>
    </Container>
    
  );
};

export default Login;
