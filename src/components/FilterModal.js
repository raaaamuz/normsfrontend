
import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import FilterLogic from './FilterLogic';
import axios from 'axios';


const FilterModal = ({ showModal, setShowModal }) => {
  const [customFilterName, setCustomFilterName] = useState('');
  const [addedLogics, setAddedLogics] = useState([]);
  const [isValid, setIsValid] = useState(true); 
  const [errorMessage, setErrorMessage] = useState('');
  const [logicOperators, setLogicOperators] = useState([]); 


  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);


  useEffect(() => {
    if (showModal) {
      setErrorMessage('');
    }
  }, [showModal]);


  const validateForm = () => {
    if (!customFilterName.trim()) {
      setErrorMessage('Filter name cannot be empty.');
      return false;
    }
  
    if (addedLogics.length === 0) {
      setErrorMessage('At least one filter logic must be added.');
      return false;
    }
  
    return true;
  };


  const handleOkModal = async () => {
    const formIsValid = validateForm();
    setIsValid(formIsValid);
  
    if (formIsValid) {
      try {
        const existingFilters = await axios.get('http://127.0.0.1:8000/filter/filter/',{
          headers: {
            Authorization: `Token ${localStorage.getItem('Token')}`,
          },
        });
        console.log(existingFilters.data)
        const filterExists = existingFilters.data.some(filter => filter.filter_name === customFilterName);
  
        if (filterExists) {
          setErrorMessage('Filter name already exists. Please choose a different name.');
          return;
        }
  
        const filtersString = addedLogics.map((logic, index) => {
          const operator = logicOperators[index] || 'AND'; 
          return `${logic.question}:${logic.optionList.join(',')} ${operator}`;
        }).join(' ');
  
        const lastSpaceIndex = filtersString.lastIndexOf(' ');
        const filteredFiltersString = filtersString.slice(0, lastSpaceIndex);
  
        const dataToSend = {
          filter_name: customFilterName,
          filters: filteredFiltersString.trim(),
          email: localStorage.getItem('username'),
        };
  
        await axios.post('http://127.0.0.1:8000/filter/filter/', dataToSend, {
          headers: {
            Authorization: `Token ${localStorage.getItem('Token')}`,
          },
        });
  
        handleCloseModal();
        setErrorMessage('');
        setAddedLogics([]);
      } catch (error) {
        console.error('Error sending data to URL:', error.response ? error.response.data : error);
        setErrorMessage('Failed to create filter. An error occurred while sending data.');
      }
    }
  };
  
    
  const handleAddedLogicsChange = (data) => {
  
    //console.log('New added logics:', data);
    setAddedLogics(data);
  };

const handleLogicalOperator=(data)=>{
 // console.log(data,"xx",typeof(data))
  //alert('6',typeof(data))
  //alert("SSS",data[0])
  setLogicOperators(data)
}
  const handleCustomFilterNameChange = (data) => {


    setCustomFilterName(data);
  };

return (
    <>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <div className="error-message" style={{ color: 'red' }}>{errorMessage}</div>}
          <FilterLogic
            setAddedLogics={handleAddedLogicsChange}
            customFilterName={customFilterName}
            onCustomFilterNameChange={handleCustomFilterNameChange}
            setLogicalOperator={handleLogicalOperator}
            logicOperators={logicOperators}
          />
          {!isValid && <div>Error: Please fill in all required fields.</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleOkModal}>
            Create
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};


export default FilterModal;