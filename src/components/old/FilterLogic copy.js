import React, { useState, useEffect } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';
import VarList from '../VarList';
import varListData from '../VarList.json';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';


const FilterLogic = ({ setFilterLogicData, setFilterNames, filterNames }) => {
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [selectedChoice, setSelectedChoice] = useState('');
  const [addedLogics, setAddedLogics] = useState([]);
  const [firstFilterText, setFirstFilterText] = useState('');
  const [choicesByQuestion, setChoicesByQuestion] = useState({});
  const [customFilterName, setCustomFilterName] = useState('');
  const [filterNameSet, setFilterNameSet] = useState(false);
 


  useEffect(() => {
    const fetchChoicesByQuestion = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/data/option-list/', {
          params: {
            question: selectedQuestion
          }
        });
        setChoicesByQuestion(response.data);
      } catch (error) {
        console.error('Error fetching choices:', error);
      }
    };


    fetchChoicesByQuestion();
  }, [selectedQuestion, firstFilterText]);


  const filterOptions = (options, filter) => {
    return options.filter(option => option.label.toLowerCase().includes(filter.toLowerCase()));
  };


  const filteredOptions = filterOptions(varListData, firstFilterText);
  const filteredLabel = filteredOptions.length > 0 ? filteredOptions[0].label : "";
  const handleAddLogic = () => {
    if (selectedQuestion && selectedChoice) {
      const newLogic = { question: selectedQuestion, choice: selectedChoice, logicalOperator: 'AND' };
     
      if (!filterNameSet) {
        const isDuplicate = filterNames.some(filter => filter.name === customFilterName);
        if (isDuplicate) {
          alert("Filter name already exists. Please provide a unique filter name.");
          return; // Prevent further execution
        }
        setFilterNameSet(true); // Set flag to indicate filter name has been set
      }
 
      setAddedLogics([...addedLogics, newLogic]);
 
      if (customFilterName) {
        const existingFilter = filterNames.find(filter => filter.name === customFilterName);
        if (existingFilter) {
          existingFilter.filterLogic = [...existingFilter.filterLogic, newLogic];
          setFilterNames([...filterNames]); // Update existing filter
        } else {
          setFilterNames(prevFilterNames => [
            ...prevFilterNames,
            { name: customFilterName, filterLogic: [newLogic] },
          ]); // Create new filter
        }
      }
   
      setFilterLogicData([...addedLogics, newLogic]);
      setSelectedQuestion('');
      setSelectedChoice('');
    }
  };
 


  const handleRemoveLogic = (index) => {
    const updatedLogics = [...addedLogics];
    updatedLogics.splice(index, 1);
    setAddedLogics(updatedLogics);
    setFilterLogicData(updatedLogics);
  };


  const handleLogicalOperatorChange = (index, operator) => {
    const updatedLogics = [...addedLogics];
    updatedLogics[index].logicalOperator = operator;
    setAddedLogics(updatedLogics);
    setFilterLogicData(updatedLogics);
  };


return (
    <div>
      <Form>
        <Form.Group>
          <Form.Label><strong>Filter Name:</strong></Form.Label>
          <Form.Control
            type="text"
            value={customFilterName}
            onChange={(e) => setCustomFilterName(e.target.value)}
            placeholder="Enter a name for the filter"
          />
        </Form.Group>


        <Form.Group controlId="filter-dropdown">
          <Form.Label><strong>Filter:</strong></Form.Label>
          <Form.Control
            type="text"
            placeholder="Search"
            value={firstFilterText}
            onChange={e => setFirstFilterText(e.target.value)}
            multiple
          />
        </Form.Group>


        <Form.Group>
          <Form.Label><strong>Select Question:</strong></Form.Label>
          <Form.Control
            as="select"
            value={selectedQuestion}
            onChange={(e) => setSelectedQuestion(e.target.value)}
            multiple
          >
            <option hidden>{filteredLabel}</option>
            {filteredOptions.map((item, index) => (
              <option key={index} value={item.value}>{item.label}</option>
            ))}
          </Form.Control>
        </Form.Group>


        {selectedQuestion && choicesByQuestion && (
          <Form.Group>
            <Form.Label><strong>Select Choice:</strong></Form.Label>
            <Form.Control
              as="select"
              value={selectedChoice}
              onChange={(e) => setSelectedChoice(Array.from(e.target.selectedOptions, option => option.value))}
              multiple
              size={Object.keys(choicesByQuestion).length}
            >
              {Array.isArray(choicesByQuestion) ? (
                choicesByQuestion.map(choice => (
                  <option key={choice} value={choice}>{choice}</option>
                ))
              ) : (
                Object.values(choicesByQuestion).map(choice => (
                  <option key={choice} value={choice}>{choice}</option>
                ))
              )}
            </Form.Control>
          </Form.Group>
        )}


        <br />


        <Button variant="secondary" onClick={handleAddLogic}>Add Filter</Button>
      </Form>

<div>
        <br />
        <h3>Added Filters:</h3>
        <br />
        <ListGroup>
  {addedLogics.map((logic, index) => (
    <ListGroup.Item key={index}>
    {logic.question}: {logic.choice}
    {index !== addedLogics.length - 1 && (
      <select
        value={logic.logicalOperator}
        onChange={(e) => handleLogicalOperatorChange(index, e.target.value)}
        style={{ marginLeft: '10px' }}
      >
        <option value="AND">AND</option>
        <option value="OR">OR</option>
      </select>
    )}
    <FaTimes
      style={{
        color: 'red',
        cursor: 'pointer',
        position: 'absolute',
        top: '50%',
        right: '5px',
        transform: 'translateY(-50%)',
        border: '1px solid red',
        borderRadius: '50%',
        padding: '2px',
        fontSize: '1.3em',
        color: 'white',
        backgroundColor: 'red'
      }}
      onClick={() => handleRemoveLogic(index)}
    />
  </ListGroup.Item>
  ))}
</ListGroup>
      </div>
    </div>
  );
};


export default FilterLogic;