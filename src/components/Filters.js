import React, { useState, useEffect } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { AiOutlineFunnelPlot, AiOutlineDelete } from 'react-icons/ai'; // Import icons
import FilterModal from './FilterModal';
import axios from 'axios';
import './Filters.css'
 
 
function Filters() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterNames, setFilterNames] = useState([]);
  const [deleteFilter,setDeleteFilter]=useState(false)
 
 
 useEffect(() => {
    const fetchFilterNames = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/filter/filter-names/', {
          headers: {
            Authorization: `Token ${localStorage.getItem('Token')}`,
          }
        });
        setFilterNames(response.data);
      } catch (error) {
        console.error('Error fetching filter names:', error);
      }
    };
 
    fetchFilterNames();
  }, [showFilterModal,deleteFilter]);
 
 
 const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };
 
 
 const handleButtonClick = () => {
 
    setShowFilterModal(!showFilterModal);
  };
 
 
 const handleDeleteFilter = (index,filter) => {
   
 
 
   fetch(`http://127.0.0.1:8000/filter/delete-filter/?filter_name=${filter.filter_name}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Token ${localStorage.getItem('Token')}`,
        },
    })
    .then(response => {
       
        if (!response.ok) {
            throw new Error("Failed to delete file");
        }
        setDeleteFilter(true);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    //setDeleteFilter(true)
  };
 
 
 return (
    <div>
      <Container>
        <div style={{ height: '50px' }}>
          <Button className='custom-button' variant='info' onClick={handleButtonClick} style={{marginLeft:'500px', marginTop:'10px'}} >Create Filters +</Button>
        </div>
 
 
       <h2>Filters</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Filter Name</th>
              <th>Filter Definition</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filterNames.map((filter, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{filter.filter_name}</td>
                <td>{filter.filter_data}</td>
                <td>
                  <AiOutlineDelete onClick={() => handleDeleteFilter(index,filter)} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
      <FilterModal showModal={showFilterModal} setShowModal={setShowFilterModal} />
    </div>
  );
}
 
 
export default Filters;