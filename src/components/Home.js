import React, { useState, useEffect } from 'react';
import FileUpload from './ExcelUpload';


function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/data/data/', {
        method: 'GET',
        headers: {
            Authorization: `Token ${localStorage.getItem('Token')}`,
        },
      });
      const jsonData = await response.json();
      setData(jsonData);
      console.log(jsonData)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  
  return (
    <div style={{ textAlign: "center", margin: "auto" }}>
      <br />
      <FileUpload />
    </div>
  );
  
}



export default Home;
