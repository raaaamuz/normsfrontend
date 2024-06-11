import React from 'react';
import { Form } from 'react-bootstrap';

function FilterItem({ questionList, questionValue, handleQuestionChange, optionListValue, selectedOptions, handleOptionListChange, logicOperator, handleLogicOperatorChange }) {
  return (
    <Form.Group>
      <Form.Label>Select Question:</Form.Label>
      <Form.Control as="select" value={questionValue} onChange={handleQuestionChange}>
        <option value="">Select an option</option>
        {questionList.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </Form.Control>

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

      {/* Add logic operator dropdown */}
      <Form.Label>Logic Operator:</Form.Label>
      <Form.Control 
        as="select" 
        value={logicOperator} 
        onChange={handleLogicOperatorChange}
      >
        <option value="AND">AND</option>
        <option value="OR">OR</option>
      </Form.Control>
    </Form.Group>
  );
}

export default FilterItem;
