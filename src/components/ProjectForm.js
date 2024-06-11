import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    project_name: '',
    project_no: '',
    year: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit =  (e) => {
    e.preventDefault();
    try {
      const response =  fetch('http://localhost:8000/norms/projects/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Project details submitted successfully!');
        // Optionally, reset the form fields after successful submission
        setFormData({ project_name: '', project_no: '', year: '' });
      } else {
        // Display error message from the server response
        const data = response.json();
        alert(`Failed to submit project details: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit project details. Please try again later.');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="project_name">
        <Form.Label>Project Name:</Form.Label>
        <Form.Control type="text" name="project_name" value={formData.project_name} onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="project_no">
        <Form.Label>Project Number:</Form.Label>
        <Form.Control type="text" name="project_no" value={formData.project_no} onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="year">
        <Form.Label>Year:</Form.Label>
        <Form.Control as="select" name="year" value={formData.year} onChange={handleChange} required>
          <option value="">Select Year</option>
          {Array.from({ length: 31 }, (_, index) => {
            const year = 2020 + index;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </Form.Control>
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default ProjectForm;
