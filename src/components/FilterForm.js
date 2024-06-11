import React, { useState } from 'react';

function FilterNamesComponent() {
  const [email, setEmail] = useState('');
  const [filterNames, setFilterNames] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/filter/filter-names/?email=${email}`,{
        headers: {
          Authorization: `Token ${localStorage.getItem('Token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setFilterNames(data.filter_names);
    } catch (error) {
      console.error('Error fetching filter names:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Filter Names</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={handleChange} required />
        </label>
        <button type="submit">Get Filter Names</button>
      </form>
      {loading && <p>Loading...</p>}
      {filterNames.length > 0 ? (
        <div>
          <h3>Filter Names:</h3>
          <ul>
            {filterNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default FilterNamesComponent;
