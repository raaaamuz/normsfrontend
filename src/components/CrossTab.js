import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Form, Row, Col, Button, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import VarList from './VarList';
import FilterModal from './FilterModal';
import * as XLSX from 'xlsx';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

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
  const [savedDataName, setSavedDataName] = useState('');

  const handleNameChange = (e) => {
    setSavedDataName(e.target.value);
  };

  const handleRemoveFilter = (filterNameToRemove) => {
    setFilterNames(filterNames.filter((filter) => filter.name !== filterNameToRemove));
    setSelectedFilter(null);
    setFilterLogicData(null);
  };

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
  }, []);

  const handleSelectedFilter = (selectedItem) => {
    setFilterLogicData(selectedItem.filter_name);
  };

  const handleFilterSelection = (filter) => {
    setSelectedFilter(filter);
    if (filter.filterLogic) {
      setFilterLogicData(filter.filter_name);
    } else {
      setFilterLogicData(null);
    }
  };

  // Initialize state from localStorage
  useEffect(() => {
    const savedFirstDropdownValue = localStorage.getItem('firstDropdownValue');
    const savedSecondDropdownValue = localStorage.getItem('secondDropdownValue');
    const savedRadioButton = localStorage.getItem('radioButton');
    const savedSelectedFilter = localStorage.getItem('selectedFilter');
    
    if (savedFirstDropdownValue) setFirstDropdownValue(savedFirstDropdownValue);
    if (savedSecondDropdownValue) setSecondDropdownValue(savedSecondDropdownValue);
    if (savedRadioButton) setRadioButton(savedRadioButton);
    if (savedSelectedFilter) setSelectedFilter(JSON.parse(savedSelectedFilter));
  }, []);

  // Save data to localStorage whenever an input changes
  useEffect(() => {
    localStorage.setItem('firstDropdownValue', firstDropdownValue);
    localStorage.setItem('secondDropdownValue', secondDropdownValue);
    localStorage.setItem('radioButton', radioButton);
    if (selectedFilter) {
      localStorage.setItem('selectedFilter', JSON.stringify(selectedFilter));
    } else {
      localStorage.removeItem('selectedFilter');
    }
  }, [firstDropdownValue, secondDropdownValue, radioButton, selectedFilter]);

  useEffect(() => {
    const axiosConfig = {
      headers: {
        Authorization: `Token ${localStorage.getItem('Token')}`,
      },
    };

    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/crosstab/crosstab/', {
          params: {
            parameter1: firstDropdownValue,
            parameter2: secondDropdownValue,
            parameter3: filterLogicData || null,
            parameter4: radioButton,
          },
          ...axiosConfig
        });

        const parsedData = JSON.parse(response.data.cross_tab_data);
        setCrossTabData(parsedData);
        setFilteredData(parsedData);
      } catch (error) {
        console.error('Error fetching cross-tab data:', error);
        setCrossTabData([]);
        setFilteredData([]);
      }
    };

    if (firstDropdownValue && secondDropdownValue) {
      fetchData();
    }
  }, [firstDropdownValue, secondDropdownValue, filterLogicData, radioButton]);

  const handleExport = () => {
    const dataArray = [];
    for (const key in filteredData) {
      dataArray.push({ key, ...filteredData[key] });
    }

    const worksheet = XLSX.utils.json_to_sheet(dataArray);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CrossTab");
    XLSX.writeFile(workbook, "CrossTab.xlsx");
  };

  useEffect(() => {
    if (firstDropdownValue && secondDropdownValue) {
      setSavedDataName(`${firstDropdownValue} X ${secondDropdownValue}`);
    }
  }, [firstDropdownValue, secondDropdownValue]);

  const handleSave = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/savetabs/', {
        name: savedDataName,
        SideBreak: firstDropdownValue,
        TopBreak: secondDropdownValue,
        filterLogicData: filterLogicData || null,
        radioButton: radioButton
      });
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again later.');
    }
  };

  return (
    <div className="container-fluid">
      <h3 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Cross Tabulation</h3>
      <hr />
      <Row>
        <Col sm={10}>
          <Row>
            <Col sm={6}>
              <Form.Control
                type="text"
                placeholder="Search for side break"
                value={firstFilterText}
                onChange={(e) => setFirstFilterText(e.target.value)}
              />
              <Form.Control
                type="text"
                placeholder="Search for top break"
                value={secondFilterText}
                onChange={(e) => setSecondFilterText(e.target.value)}
              />
            </Col>
            <Col sm={6}>
              <Form.Control as="select" value={firstDropdownValue} onChange={(e) => setFirstDropdownValue(e.target.value)}>
                <VarList filterText={firstFilterText} />
              </Form.Control>
              <Form.Control as="select" value={secondDropdownValue} onChange={(e) => setSecondDropdownValue(e.target.value)}>
                <VarList filterText={secondFilterText} />
              </Form.Control>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Row>
                <h4 style={{ margin: '0 auto' }}>Filters:</h4>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Dropdown>
                      <Dropdown.Toggle variant="light" id="dropdown-basic" disabled={filterNames.length === 0 || firstDropdownValue.length === 0 || secondDropdownValue.length === 0}>
                        {selectedFilter?.filter_name || 'Apply Filter'}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {filterNames.map((filter, index) => (
                          <Dropdown.Item key={index} onClick={() => { handleFilterSelection(filter); handleSelectedFilter(filter); }}>
                            {index + 1}. {filter.filter_name}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
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
            </Col>
          </Row>

          <Row>
            <div className="table-responsive mt-4">
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

              {crossTabData && Object.entries(crossTabData).length > 0 && (
                <ReactHTMLTableToExcel
                  id="test-table-xls-button"
                  className="btn btn-primary"
                  table="table-to-xls"
                  filename="CrossTab"
                  sheet="CrossTab"
                  buttonText="Export to Excel"
                />
              )}

              <br />
              <Row>
                <Col>
                  <div>
                    <Table striped bordered hover style={{ marginTop: '5px' }} id="table-to-xls">
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
                </Col>
              </Row>
            </div>
          </Row>
        </Col>
      </Row>
      <div>
        <FilterModal />
      </div>
    </div>
  );
};

export default CrossTab;
