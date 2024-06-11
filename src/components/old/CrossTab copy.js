import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Form, Row, Col, Button, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import VarList from '../VarList';
import FilterModal from '../FilterModal';

const CrossTab = () => {
  const [crossTabData, setCrossTabData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [firstDropdownValue, setFirstDropdownValue] = useState('');
  const [secondDropdownValue, setSecondDropdownValue] = useState('');
  const [firstFilterText, setFirstFilterText] = useState('');
  const [secondFilterText, setSecondFilterText] = useState('');
  const [filterLogicData, setFilterLogicData] = useState(null);
  const [radioButton, setRadioButton] = useState('Percentage');
  const [filterNames, setFilterNames] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);


  const handleFilterNameAdded = (newFilterName, newFilterData) => {
    const existingFilterIndex = filterNames.findIndex((filter) => filter.name === newFilterName);

    if (existingFilterIndex !== -1) {
      const updatedFilter = { ...filterNames[existingFilterIndex] };
      updatedFilter.filterLogic = [...updatedFilter.filterLogic, ...newFilterData];
      const updatedFilterNames = [...filterNames];
      updatedFilterNames[existingFilterIndex] = updatedFilter;
      setFilterNames(updatedFilterNames);
    } else {
      setFilterNames((prevFilterNames) => [...prevFilterNames, { name: newFilterName, filterLogic: newFilterData }]);
    }
  };

  const handleRemoveFilter = (filterNameToRemove) => {
    alert("Rama")
    setFilterNames(filterNames.filter((filter) => filter.name !== filterNameToRemove));

    setSelectedFilter(null);
    setFilterLogicData(filterNames.filter((filter) => filter.name !== filterNameToRemove).map((filter) => filter.filterLogic).flat());
  };

  useEffect(() => {
    const fetchFilterNames = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/filter/filter/');
        setFilterNames(response.data);
      } catch (error) {
        console.error('Error fetching filter names:', error);
      }
    };

    fetchFilterNames();
  }, []);
  useEffect(() => {
    alert(selectedFilter);
  }, [selectedFilter]);
  const handleSelectedFilter = (selectedItem) => {
    // Do whatever you want with the selected item
    console.log("rads",selectedItem);
    alert(selectedItem.filter_name)
  };
  const handleFilterSelection = (filter) => {
   
    setSelectedFilter(filter);
    alert(selectedFilter)
    if (filter.filterLogic) {
      setFilterLogicData(filter.filterLogic);
    } else {
      setFilterLogicData(null);
    }
  };

  useEffect(() => {
    alert("Moorthy")
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/crosstab/crosstab/', {
          params: {
            parameter1: firstDropdownValue,
            parameter2: secondDropdownValue,
            parameter3: filterLogicData || null,
            parameter4: radioButton,
          },
        });
        alert(filterLogicData)
        const parsedData = JSON.parse(response.data.cross_tab_data);
        console.log(response.data.cross_tab_data)
        setCrossTabData(parsedData);

        if (filterLogicData && filterLogicData.length > 0) {
          applyFilterLogic(parsedData);
        } else {
          setFilteredData(parsedData);
        }
      } catch (error) {
        console.error('Error fetching cross-tab data:', error);
        setCrossTabData([]);
        setFilteredData([]);
      }
    };

    fetchData();
  }, [firstDropdownValue, secondDropdownValue, filterLogicData, radioButton]);

  const applyFilterLogic = (data) => {
    if (filterLogicData && filterLogicData.length > 0) {
      let filteredData = { ...data }; // Shallow copy of the data object
  
      filterLogicData.forEach((filter) => {
        for (const key in filteredData) {
          if (Object.hasOwnProperty.call(filteredData, key)) {
            if (filteredData[key][filter.question] !== filter.choice) {
              delete filteredData[key];
            }
          }
        }
      });
  
      setFilteredData(filteredData);
    } else {
      setFilteredData(data); // No filtering applied, set to original data
    }
  };
  
  


  return (
    <div className="container">
      <h3 style={{ marginLeft: '10px' }}>Cross Tabulation:</h3>
      <Row>
        <Col xs={12} md={6}>
          <div style={{ marginLeft: '20px' }}>
            <Row>
              <Form.Control type="text" placeholder="Search for side break" value={firstFilterText} onChange={(e) => setFirstFilterText(e.target.value)} />
            </Row>
            <Row>
              <Form.Control type="text" placeholder="Search for top break" value={secondFilterText} onChange={(e) => setSecondFilterText(e.target.value)} />
            </Row>
          </div>
        </Col>
        <Col xs={12} md={6}>
          <Row>
            <Form.Control as="select" value={firstDropdownValue} onChange={(e) => setFirstDropdownValue(e.target.value)}>
              <VarList filterText={firstFilterText} />
            </Form.Control>
          </Row>
          <Row>
            <Form.Control as="select" value={secondDropdownValue} onChange={(e) => setSecondDropdownValue(e.target.value)}>
              <VarList filterText={secondFilterText} />
            </Form.Control>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row style={{ margin: '0 auto' }}>
            <h4 style={{ margin: '0 auto' }}>Filters:</h4>
          </Row>
          <Row>
            <Col>
              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-basic" disabled={filterNames.length === 0}>
                  {selectedFilter?.filter_name || 'Choose Filter'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {filterNames.map((filter, index) => (
                    <Dropdown.Item key={index} onClick={() => { handleFilterSelection(filter); handleSelectedFilter(filter); }}>
                      {filter.filter_name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col>
              {selectedFilter && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveFilter(selectedFilter.filter_name)}
                  style={{ marginLeft: '8px' }}
                >
                  X
                </Button>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      <br />
      <div style={{ marginLeft: '10px' }} className="table-responsive mt-4">
        <h3>Table:</h3>
        <Form.Check
          inline
          label="Percentage"
          type="radio"
          id="flexRadioDefault1"
          checked={radioButton === 'Percentage'}
          onChange={() => setRadioButton('Percentage')}
        />
        <Form.Check
          inline
          label="Absolute"
          type="radio"
          id="flexRadioDefault2"
          checked={radioButton === 'Absolute'}
          onChange={() => setRadioButton('Absolute')}
        />
        <br />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th className="first-column"></th>
              {crossTabData && Object.entries(crossTabData).length > 0 && (
                Object.keys(Object.values(crossTabData)[0]).map((key1, index) => (
                  <th key={index}>{key1}</th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData && Object.entries(filteredData).map(([rowKey, rowData], rowIndex) => (
              <tr key={rowKey} className={rowIndex === filteredData.length - 1 ? 'last-row' : ''}>
                <td>{rowKey}</td>
                {Object.values(rowData).map((value, index) => (
                  <td key={index} className={index === Object.keys(rowData).length - 1 ? 'last-column' : ''}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div>
        <FilterModal handleFilterNameAdded={handleFilterNameAdded} />
      </div>
    </div>
  );
};

export default CrossTab;
