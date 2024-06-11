import React, { useState, useEffect } from 'react';
import {Col, Container} from 'react-bootstrap'
import { json, useParams } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './DisplayData.css';
import FileUpload from './ExcelUpload';
 
function DisplayData() {
  const [data, setData] = useState(null);
  const {fileName}=useParams();
  useEffect(() => {
    fetchData();
  }, []);
 
  const fetchData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/data/getdata/?fName=${fileName}`,{
        params:{
          fName :fileName
        },
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
    <div style={{width:"1200px"}}>
    <br />
   
       <div className="table-container mt-4 p-0 mb-10 bg-default" data-bs-spy="scroll" data-bs-target=".data-table" data-bs-offset="0" style={{height:"600px"}}>    
      <h3>NORMS Data for {fileName}</h3>
     
        <table className="data-table">
        <thead>
          <tr>
          <th>  Projectname:  </th>
          <th>  File Name</th>
          <th>  Jobno </th>
          <th>  Year  </th>
          <th>  Clientname  </th>
          <th>  Countrycode </th>
          <th>  Category  </th>
          <th>  Nationality </th>
          <th>  City  </th>
          <th> Respondent ID </th>
          <th>  Overall Opinion </th>
          <th>  Liking  </th>
 
 
 
          </tr>
        </thead>
        <tbody>
          {data ? (
            data.map((item, rowIndex) => (
              <tr key={rowIndex}>
                <td>{item.  projectname   }</td>
                <td>{item.  filename}</td>
                <td>{item.  jobno }</td>
                <td>{item.  year  }</td>
                <td>{item.  clientname  }</td>
                <td>{item.  countrycode }</td>
                <td>{item.  category  }</td>
                <td>{item.  nationality }</td>
                <td>{item.  city  }</td>
                <td>{item.  respondentid  }</td>
                <td>{item.  overallopinion  }</td>
                <td>{item.  liking}</td>
               
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">Loading...</td>
            </tr>
          )}
        </tbody>
      </table>
   
    </div>
    </div>
 
 
  );
 
}
 
export default DisplayData;