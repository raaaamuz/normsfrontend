import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import VarList from './VarList';


function FilterLogic({ setAddedLogics, onCustomFilterNameChange,setLogicalOperator }) {
  const [filterNameValue, setFilterNameValue] = useState('');
  const [questionValue, setQuestionValue] = useState('');
  const [optionListValue, setOptionListValue] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [labels, setLabels] = useState([]);
  const [questionList, setQuestionList] = useState([]);
  const [logicOperators, setLogicOperators] = useState([]);
  const [addFilterCount, setAddFilterCount] = useState(0);
  const [filterSearchValue, setFilterSearchValue] = useState('');
 
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/data/fields/',{
          headers: {
            Authorization: `Token ${localStorage.getItem('Token')}`,
          },
        });
        setQuestionList(response.data);
      } catch (error) {
        console.log("Error fetching questions:", error);
      }
    };
    fetchQuestion();
  }, []);


  useEffect(() => {
    const fetchOptionList = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/data/option-list/', {
          params: { question: questionValue },
          headers: {
            Authorization: `Token ${localStorage.getItem('Token')}`,
        },
        });
        setOptionListValue(response.data);
      } catch (error) {
        console.log("Error fetching options:", error);
      }
    };


    if (questionValue) {
      fetchOptionList();
    }
  }, [questionValue]);


  const handleQuestionChange = (event) => {
    setQuestionValue(event.target.value);
  };


  const handleOptionListChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedOptions(selectedOptions);
  };


  const handleFilterNameChange = (event) => {
    setFilterNameValue(event.target.value);
    onCustomFilterNameChange(event.target.value);
  };


  const handleFilterSearchChange = (event) => {
    setFilterSearchValue(event.target.value);
  };

const filterSet = () => {
    if (!questionValue || selectedOptions.length === 0) {
      alert("Please select both a question and options before adding the filter.");
      return;
    }
    
    const selectedValues = selectedOptions.join(', ');
    const newLabelValue = `${questionValue} - ${selectedValues}`;
  
    setLabels((prevLabels) => [...prevLabels, newLabelValue]);
    


    const newLogic = { question: questionValue, optionList: selectedOptions };
    
    setAddedLogics((prevLogics) => [...prevLogics, newLogic]);
    setQuestionValue('');
    setOptionListValue([]);
    setSelectedOptions([]);
    


    const newOperator = addFilterCount > 0 ? logicOperators[logicOperators.length - 1] : 'AND'; // Default to 'AND' if it's the first filter
    setLogicOperators([...logicOperators, newOperator]);
    setAddFilterCount(addFilterCount + 1);
    //alert("1")
  };
  
  
const handleLogicOperatorChange = (event, index) => {
  //alert(event.target.value)
  //alert(index)
  const updatedOperators = [...logicOperators];
  updatedOperators[index] = event.target.value; // Update the logic operator based on the selected option value
  //alert(event.target.value)
  setLogicOperators(updatedOperators);
  //alert('5',updatedOperators)
  setLogicalOperator(updatedOperators)
};

const handleLogicOperatorChange2 = (event, index) => {
  const selectedValue = event.target.value;
  const updatedOperators = logicOperators.map((operator, i) => {
    return i === index ? selectedValue : operator;
  });
  setLogicOperators(updatedOperators);
};

const handleRemoveLogic = (indexToRemove) => {
  //('3')
    setLabels((prevLabels) => prevLabels.filter((label, index) => index !== indexToRemove));
    setLogicOperators((prevOperators) => prevOperators.filter((operator, index) => index !== indexToRemove));
    setAddedLogics((prevLogics) => prevLogics.filter((_, index) => index !== indexToRemove));
  };


return (
    <div>
      <Form>
        <Form.Group>
          <Form.Label>Filter Name:</Form.Label>
          <Form.Control
            type="text"
            value={filterNameValue}
            onChange={handleFilterNameChange}
            placeholder="Enter filter name.."
          />
        </Form.Group>


        <div>
          <Form.Group controlId="filter-dropdown">
            <Form.Label>
              <strong>Filter:</strong>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Search"
              value={filterSearchValue}
              onChange={handleFilterSearchChange}
              multiple
            />
          </Form.Group>

<Form.Group>
            <Form.Label>
              <strong>Select Question:</strong>
            </Form.Label>
            <Form.Control
              as="select"
              value={questionValue}
              onChange={handleQuestionChange}
              multiple
            >
              <option hidden>{questionValue}</option>
              <VarList filterText={filterSearchValue} selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />
            </Form.Control>
          </Form.Group>
        </div>


        <Form.Group>
          <Form.Label>Select Option(s):</Form.Label>
          <Form.Control
            as="select"
            multiple
            style={{ minWidth: '200px' }}
            value={selectedOptions}
            onChange={handleOptionListChange}
          >
            {optionListValue.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </Form.Control>
        </Form.Group>


<Button variant='secondary' onClick={filterSet}>ADD Filter</Button>
      </Form>
      <br />
      <h3>Added Filters:</h3>


      <Form.Group>
        {labels.map((label, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <div>{index + 1}. {label}</div>
            {index !== labels.length - 1 && logicOperators[index] && (
              <Form.Control
                as="select"
                value={logicOperators[index]}
                onChange={(event) => handleLogicOperatorChange(event, index)}
                style={{ marginLeft: '10px', width: '60px', fontSize: '0.8rem' }}
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </Form.Control>
            )}
            <FaTimes
              style={{
                color: 'red',
                cursor: 'pointer',
                position: 'absolute',
                top: '50%',
                right: '5px',
                transform: 'translateY(-50%)',
              }}
              onClick={() => handleRemoveLogic(index)}
            />
          </div>
        ))}
      </Form.Group>
    </div>
  );
}


export default FilterLogic;