import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios'; // Import Axios for making HTTP requests
 
const SignUpForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
 
  // const handleSubmit = async (e) => {
  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     try {
  //       const response = await fetch('http://localhost:8000/users/signup/', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(formData),
  //       });
  //       if (response.ok) {
  //         alert('Project details submitted successfully!');
  //         // Optionally, reset the form fields after successful submission
  //         setFormData({ project_name: '', project_no: '', year: '' });
  //       } else {
  //         // Display error message from the server response
  //         const data = await response.json();
  //         alert(`Failed to submit project details: ${data.error}`);
  //       }
  //     } catch (error) {
  //       console.error('Error:', error);
  //       alert('Failed to submit project details. Please try again later.');
  //     }
  //   };
 
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {  
      const response = await fetch('http://localhost:8000/users/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Sign Up successful!');
        setFormData({ email: '', username: '', password: '' });
      } else {
        // Handle non-JSON response
        const data = await response.text();
        alert(`Failed to sign up: ${data}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to sign up. Please try again later.');
    }
  };

return (
    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', marginLeft:'50px'}}>
      <div style={{ width: '50%' }}>
        <h1 style={{ textAlign: 'center' }}>Sign Up</h1>
        <hr />
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>


          <Form.Group controlId="formBasicUsername">
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>


          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <br />


          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="success" type="submit" style={{ width: '50%' }}>
              Sign Up
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};


export default SignUpForm;