import React from 'react';
import varListData from './VarList.json'; 

const VarList = ({ filterText }) => {
  const filterOptions = (options, filter) => {
   
    return options.filter(option => option.label.toLowerCase().includes(filter.toLowerCase()));
  };

  const filteredOptions = filterOptions(varListData, filterText);
  const filteredLabel = filteredOptions.length > 0 ? filteredOptions[0].label : "Not available";

  return (
    <>
      <option hidden>{filteredLabel}</option>
      {filteredOptions.map((item, index) => (
        <option key={index} value={item.value}>{item.label}</option>
      ))}
    </>
  );
};

export default VarList;
