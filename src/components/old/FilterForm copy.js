import React, { useState } from 'react';

function FilterComponent() {
  const [formData, setFormData] = useState({
    email: '',
    filter_name: '',
    filters: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/filter/filter/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Handle successful response here
      console.log('Filter data sent successfully:', formData);
    } catch (error) {
      console.error('Error sending filter data:', error);
    }
  };

  return (
    <div>
      <h2>Filter Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Filter Name:</label>
          <input type="text" name="filter_name" value={formData.filter_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Filters:</label>
          <textarea name="filters" value={formData.filters} onChange={handleChange} required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default FilterComponent;
