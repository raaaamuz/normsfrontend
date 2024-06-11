import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import VarList from './VarList';
import varListData from './VarList.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, Col, Row, Button, Form } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import FilterModal from './FilterModal';
import { FaUndo } from 'react-icons/fa';
import ReactHTMLTableToExcel from 'react-html-table-to-excel'; 
import { BsChevronDown } from 'react-icons/bs';
import './norms.css';
const Norms = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [result, setResult] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meanValue, setMean] = useState();
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filterLogicData, setFilterLogicData] = useState(null);
  const [filterNames, setFilterNames] = useState([]);
  const [questionValue, setQuestionValue] = useState(''); 
  const [optionListValue, setOptionListValue] = useState([]);
  const [isValid,setValid]=useState(false)
  const [clientNameOptions, setClientNameOptions] = useState([]);
  const [studyTypeOptions, setStudyTypeOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [countryCodeOptions, setCountryCodeOptions] = useState([]);
  const [superCategoryOptions, setSuperCategoryOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [studyDesignOptions, setStudyDesignOptions] = useState([]);
  const [placeOfInterviewOptions, setPlaceOfInterviewOptions] = useState([]);
  const [blindOrBrandedOptions, setBlindOrBrandedOptions] = useState([]);
  const [scaleOverallOpinionOptions, setScaleOverallOpinionOptions] = useState([]);
  const [scalePurchaseIntentionOptions, setScalePurchaseIntentionOptions] = useState([]);
  const [scaleProductAttributesOptions, setScaleProductAttributesOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [openAccordion, setOpenAccordion] = useState(null);
  const [static_filters,setFilters]=useState(null);
  const dropdownsFetched = useRef(false);

  const handleAccordionToggle = (accordionId) => {
    setOpenAccordion(openAccordion === accordionId ? null : accordionId);
  };

  
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedOption) return;
      setLoading(true);
      setError(null);
  
      try {
        const selectedOptionsString = Object.keys(selectedOptions).map(question => {
          const options = selectedOptions[question].join(', ');
          return options ? `${question}: ${options}` : ''; 
        }).filter(Boolean).join(' (AND) ');
  
        setFilters(selectedOptionsString);
  
        const response = await axios.get(`http://127.0.0.1:8000/norms/percentiles/?normsVar=${selectedOption}`, {
          params: {
            filter_name: filterLogicData,
            filters: selectedOptionsString
          },
          headers: {
            Authorization: `Token ${localStorage.getItem('Token')}`,
          },
        });
        setResult(response.data);
        const values = Object.values(response.data);
        const mean_value = values[3];
        setMean(mean_value);
        setValid(true);
      } catch (error) {
        setError('Invalid attribute | Blank attribute');
        setValid(false);
      }
  
      setLoading(false);
    };
  
    fetchData();
  }, [selectedOption, filterLogicData, openAccordion]);
  
  

  
  
  // Separate useEffect for fetching filter names
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
  const filteredVarListData = varListData.filter(item =>
    item.label && item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelectedFilter = (selectedItem) => {
    //console.log("SSSSSSS",selectedItem.filter_name)
    setFilterLogicData(selectedItem.filter_name)

 
 
  };


  const [selectedOptionsString, setSelectedOptionsString] = useState(''); 
  useEffect(() => {
    const optionsString = Object.keys(selectedOptions).map(question => {
      const options = selectedOptions[question].join(', ');
      return options ? `${question}: ${options}` : ''; 
    }).filter(Boolean).join(' (AND) ');
    setSelectedOptionsString(optionsString);
  }, [selectedOptions]);


  useEffect(() => {
    const fetchDropdownOptions = async (question) => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/data/option-list/', {
          params: {
            question: question,
            filter_name: filterLogicData,
            filters: selectedOptionsString,
          },
          headers: {
            Authorization: `Token ${localStorage.getItem('Token')}`,
          },
        });
        switch (question) {
          case 'clientname':
            setClientNameOptions(response.data);
            break;
          case 'studytype':
            setStudyTypeOptions(response.data);
            break;
          case 'year':
            setYearOptions(response.data);
            break;
          case 'countrycode':
            setCountryCodeOptions(response.data);
            break;
          case 'supercategory':
            setSuperCategoryOptions(response.data);
            break;
          case 'category':
            setCategoryOptions(response.data);
            break;
          case 'subcategory':
            setSubCategoryOptions(response.data);
            break;
          case 'studydesign':
            setStudyDesignOptions(response.data);
            break;
          case 'placeofinterview':
            setPlaceOfInterviewOptions(response.data);
            break;
          case 'blindbranded':
            setBlindOrBrandedOptions(response.data);
            break;
            case 'scaleoverallopinion':
              setScaleOverallOpinionOptions(response.data);
                break;
            case 'scalepurchaseintention':
              setScalePurchaseIntentionOptions(response.data);
                break;
            case 'scaleproductattributes':
              setScaleProductAttributesOptions(response.data);
                break;
          default:
            break;
        }
      } catch (error) {
        console.error('Error fetching dropdown options:', error);
      }
    };

    if (!dropdownsFetched.current) {
      fetchDropdownOptions('clientname');
      fetchDropdownOptions('studytype');
      fetchDropdownOptions('year');
      fetchDropdownOptions('countrycode');
      fetchDropdownOptions('supercategory');
      fetchDropdownOptions('category');
      fetchDropdownOptions('subcategory');
      fetchDropdownOptions('studydesign');
      fetchDropdownOptions('placeofinterview');
      fetchDropdownOptions('blindbranded');
      fetchDropdownOptions('scaleoverallopinion');
    fetchDropdownOptions('scalepurchaseintention');
    fetchDropdownOptions('scaleproductattributes');
      dropdownsFetched.current = true; 
    }
  }, [filterLogicData, selectedOptionsString]);
  

  const handleOptionToggle = (option, question) => {
    if (selectedOptions[question] && selectedOptions[question].includes(option)) {
      // Option is already selected, deselect it
      setSelectedOptions(prevOptions => ({
        ...prevOptions,
        [question]: prevOptions[question].filter(item => item !== option)
      }));
    } else {
      // Option is not selected, select it
      setSelectedOptions(prevOptions => ({
        ...prevOptions,
        [question]: [...(prevOptions[question] || []), option]
      }));
    }
  };

  const handleReset = () => {
    setSelectedOptions({});
    alert(" 'Click OK To Reset' ");
  };

  const getSelectedCount = (optionType) => {
    if (selectedOptions[optionType] && selectedOptions[optionType].length > 0) {
      return ` (${selectedOptions[optionType].length})`;
    } else {
      return '';
    }
  };
  
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    setFilterLogicData(null);
//    alert("hi")
    //setFilterLogicData(filterLogicData)
  };

  const handleSearchChange = (event) => {
    
    setSearchText(event.target.value);
  };

  
  const handleFilterSelection = (filter) => {
    //alert("hi2",filter)
    setSelectedFilter(filter.filter_name);
    if (filter) {
      
      setFilterLogicData(filter.filter_name);
    } else {
      
      setFilterLogicData(null);
    }
  };

  const handleRemoveFilter = (filterNameToRemove) => {
    
    //setFilterNames(filterNames.filter((filter) => filter.name !== filterNameToRemove));
    setSelectedFilter(null);
    setFilterLogicData(filterNames.filter((filter) => filter.name !== filterNameToRemove).map((filter) => filter.filterLogic).flat());
  };

  const handleFilterNameAdded = (newFilterName, newFilterData) => {
   //alert("hi5") 
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

  const getHeaderColor = (index, headersLength) => {
    if (index < 5) {
      return '#C00000';
    } else if (index < 7) {
      return '#FFC000';
    } else {
      return '#92D050';
    }
  };

  const renderTable = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!result) return null;

    const percentiles = Object.keys(result).slice(1);
    const values = Object.values(result);
    const headers = values[0];
    const mean_value = values[3].toFixed(2);
    const ssize = values[5];
    const nop = values[6];
    const noprojects = values[7];
    const filteredPercentiles = percentiles.filter(percentile => (percentile !== 'Mean Value' && percentile !== 'Samples considered'&& percentile !== 'Number of products'&& percentile !== 'Number of projects'));

    return (
      <div className='container'>
      <Row>
      <Col sm={12}>
  <table id="normsTable" className="table-container table table-bordered table-striped" style={{ width: "100%", borderCollapse: 'collapse', border: '1px groove black', marginLeft: '0' }}>
    <thead>
      <tr>
        <th>Percentile</th>
        {headers.map((header, index) => (
          <th key={index} style={{ backgroundColor: getHeaderColor(index, headers.length), color: "white", fontSize: "12px", border: '1px groove black' }}>{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {filteredPercentiles.map((percentile, index) => (
        <tr key={index}>
          <td style={{ border: '1px groove black' }}>{percentile}</td>
          {Object.values(result[percentile]).map((value, index) => (
            <td key={index} style={{ textAlign: 'center', border: '1px groove black' }}>{value}</td>
          ))}
        </tr>
      ))}
    </tbody>
    <thead><tr></tr></thead>
    <thead>
      <br></br>
      <tr>
        <td style={{ textAlign: 'left', border: '1px groove black' }}><strong>Overall mean</strong></td>
        <td colSpan={headers.length} style={{ textAlign: 'left', border: '1px groove black' }}>{mean_value}</td>
      </tr>
      <tr>
        <td style={{ textAlign: 'left', border: '1px groove black' }}><strong>Samples Considered</strong></td>
        <td colSpan={headers.length} style={{ textAlign: 'left', border: '1px groove black' }}>{ssize}</td>
      </tr>
      <tr>
        <td style={{ textAlign: 'left', border: '1px groove black' }}><strong>Number of products</strong></td>
        <td colSpan={headers.length} style={{ textAlign: 'left', border: '1px groove black ' }}>{nop}</td>
      </tr>
    </thead>
  </table>
  </Col>
  </Row>
</div>

    );
  };

  
  const renderFiltersDropdown = () => (
    <div>
        <Col sm={9}>
        <br></br>
          <Row style={{ margin: '0 auto' }}>
            <h4 style={{ margin: '0 auto' }}>Filters:</h4>
          </Row>
          <br />
          <Row>
                    <Dropdown style={{marginLeft:'5px'}}>
                      <Dropdown.Toggle variant="light" id="dropdown-basic" disabled={filterNames.length === 0||selectedOption.length===0}>
                        {selectedFilter || 'Apply Filter'}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {filterNames.map((filter, index) => (
                          <Dropdown.Item key={index} onClick={() => {handleFilterSelection(filter);handleSelectedFilter(filter); } }>
                            {index + 1}. {filter.filter_name}
                          </Dropdown.Item>
                        ))}
                        
                      </Dropdown.Menu>
                    </Dropdown>
                    <br />
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
        <br />
    </div>
  );
  
  return (
    <div className='container' style={{ marginLeft: '0', marginTop: '10px' }}>
    <div style={{ marginLeft: '20px', marginTop: '10px' }}>
    <Row>
    <Col sm={9}>
    <Row>
    <Col sm={6}>
      <label>
        Search
        <input
          type="text"
          placeholder="Search your attribute"
          value={searchText}
          onChange={handleSearchChange}
          className="form-control"
          style={{ width: '180%' }}
        />
      </label>
      </Col>
      <Col sm={3}>
      <label>
        Choose your attribute
        <select value={selectedOption} onChange={handleChange} className="form-select" style={{ width: '450px' }}>
          <option hidden>{searchText || "Select an option"}</option>
          {filteredVarListData.map((item, index) => (
            <option key={index} value={item.value}>{item.label}</option>
          ))}
        </select>
      </label>
      </Col>
      </Row>
      <br />
      <div style={{border:'1px solid grey', borderRadius:'10px', backgroundColor:'lightgrey', boxShadow: '0px 4px 8px rgba(10, 10, 10, 10)'}}>

      <Row>
      
  <Col sm={10}> {renderFiltersDropdown()}</Col>
  <Col  style={{marginTop:'75px'}}>
  {isValid && (
    <ReactHTMLTableToExcel
      id="exportButton"
      className="btn btn-success"
      table="normsTable"
      filename="NormsTable"
      sheet="Sheet"
      buttonText="Export to Excel"
      cell="B2"
    />
  )}
  </Col>
  </Row>
  </div>
  <br />


        <div>
      {renderTable()}
      </div>
      </Col>
      <Col sm={3}>
      <div className='dropsection' style={{borderRadius: '5px', padding: '20px', backgroundColor:'#0D3A4B', paddingTop:'5px', boxShadow: '0px 4px 8px rgba(10, 10, 10, 10)'}}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    {Object.values(selectedOptions).some(options => options.length > 0) ? (
            <span style={{ color: 'white', paddingTop:'5px', fontSize:'18px' }}>Static Filters:</span>
        ) : (
            <span style={{ color: 'gray', paddingTop:'5px', fontSize:'18px' }}>Static Filters:</span>
        )}
    <Button  variant="danger" onClick={handleReset} disabled={!Object.values(selectedOptions).some(options => options.length > 0)} style={{marginBottom:'5px'}} ><FaUndo style={{ fontSize: '14px' }}/></Button>
    </div>
      <Row>
      <div className="accordion-item" style={{ backgroundColor: 'white', color: 'black', padding: '10px', borderRadius: '4px' }}>
          <h2 className="accordion-header" id="clientAccordion">
            <button className={`accordion-button ${openAccordion === 'client' ? '' : 'collapsed'}`} type="button" onClick={() => handleAccordionToggle('client')} aria-expanded={openAccordion === 'client'} aria-controls="clientCollapse">
              Client {getSelectedCount('clientname')}<BsChevronDown />
            </button>
          </h2>
          <div id="clientCollapse" className={`accordion-collapse collapse ${openAccordion === 'client' ? 'show' : ''}`} aria-labelledby="clientAccordion" data-bs-parent="#accordion"  >
            <div className="accordion-body" style={{ maxHeight: '150px', overflowY: 'auto' }}>
      {clientNameOptions.map((option, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Check
            type="checkbox"
            id={`clientname-${index}`}
            label={option}
            checked={selectedOptions['clientname'] && selectedOptions['clientname'].includes(option)}
            onChange={() => handleOptionToggle(option, 'clientname')}
            style={{ fontSize: '14px', lineHeight: '1.5',marginRight: '10px', marginBottom: '5px', marginTop:'5px', cursor: 'pointer' }}
          />
        </div>
      ))}
   </div>
   </div>
   </div>

        </Row>
        <Row>
        <div className="accordion-item" style={{backgroundColor:'white', color:'black', padding:'10px', borderRadius:'4px', marginTop:'10px'}} >
    <h2 className="accordion-header" id="studytypeAccordion">
      <button className={`accordion-button ${openAccordion === 'studytype' ? '' : 'collapsed'}`} type="button" onClick={() => handleAccordionToggle('studytype')} aria-expanded={openAccordion === 'studytype'} aria-controls="studytypeCollapse">
        StudyType {getSelectedCount('studytype')}<BsChevronDown />
      </button>
    </h2>
    <div id="studytypeCollapse" className={`accordion-collapse collapse ${openAccordion === 'studytype' ? 'show' : ''}`} aria-labelledby="studytypeAccordion" data-bs-parent="#accordion">
      <div className="accordion-body" style={{maxHeight: '150px', overflowY: 'auto'}} >
      {studyTypeOptions.map((option, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Check
            type="checkbox"
            id={`studytype-${index}`}
            label={option}
            checked={selectedOptions['studytype'] && selectedOptions['studytype'].includes(option)}
            onChange={() => handleOptionToggle(option, 'studytype')}
            style={{ fontSize: '14px', lineHeight: '1.5',marginRight: '10px', marginBottom: '5px',marginTop:'5px', cursor: 'pointer' }}
          />
        </div>
      ))}
   </div>
   </div>
   </div>
</Row>

<Row>
<div className="accordion-item" style={{backgroundColor:'white', color:'black', padding:'10px', borderRadius:'4px', marginTop:'10px'}} >
    <h2 className="accordion-header" id="yearAccordion">
      <button className={`accordion-button ${openAccordion === 'year' ? '' : 'collapsed'}`} type="button" onClick={() => handleAccordionToggle('year')} aria-expanded={openAccordion === 'year'} aria-controls="yearCollapse">
        Year {getSelectedCount('year')}<BsChevronDown />
      </button>
    </h2>
    <div id="yearCollapse" className={`accordion-collapse collapse ${openAccordion === 'year' ? 'show' : ''}`} aria-labelledby="yearAccordion" data-bs-parent="#accordion">
      <div className="accordion-body" style={{maxHeight: '150px', overflowY: 'auto'}} >
      {yearOptions.map((option, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Check
            type="checkbox"
            id={`year-${index}`}
            label={option}
            checked={selectedOptions['year'] && selectedOptions['year'].includes(option)}
            onChange={() => handleOptionToggle(option, 'year')}
            style={{ fontSize: '14px', lineHeight: '1.5',marginRight: '10px', marginBottom: '5px',marginTop:'5px', cursor: 'pointer' }}
          />
        </div>
      ))}
    </div>
    </div>
    </div>
</Row>
<Row>
<div className="accordion-item" style={{backgroundColor:'white', color:'black', padding:'10px', borderRadius:'4px', marginTop:'10px'}} >
  <h2 className="accordion-header" id="countrycodeAccordion">
    <button className={`accordion-button ${openAccordion === 'countrycode' ? '' : 'collapsed'}`} type="button" onClick={() => handleAccordionToggle('countrycode')} aria-expanded={openAccordion === 'countrycode'} aria-controls="countrycodeCollapse">
      Country Code {getSelectedCount('countrycode')}<BsChevronDown />
    </button>
  </h2>
  <div id="countrycodeCollapse" className={`accordion-collapse collapse ${openAccordion === 'countrycode' ? 'show' : ''}`} aria-labelledby="countrycodeAccordion" data-bs-parent="#accordion">
    <div className="accordion-body" style={{maxHeight: '150px', overflowY: 'auto'}} >
      {countryCodeOptions.map((option, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Check
            type="checkbox"
            id={`countrycode-${index}`}
            label={option}
            checked={selectedOptions['countrycode'] && selectedOptions['countrycode'].includes(option)}
            onChange={() => handleOptionToggle(option, 'countrycode')}
            style={{ fontSize: '14px', lineHeight: '1.5',marginRight: '10px', marginBottom: '5px',marginTop:'5px', cursor: 'pointer' }}
          />
        </div>
      ))}
    </div>
  </div>
</div>
</Row>
<Row>
<div className="accordion-item" style={{backgroundColor:'white', color:'black', padding:'10px', borderRadius:'4px', marginTop:'10px'}} >
    <h2 className="accordion-header" id="supercategoryAccordion">
      <button className={`accordion-button ${openAccordion === 'supercategory' ? '' : 'collapsed'}`} type="button" onClick={() => handleAccordionToggle('supercategory')} aria-expanded={openAccordion === 'supercategory'} aria-controls="supercategoryCollapse">
        SuperCategory {getSelectedCount('supercategory')} <BsChevronDown />
      </button>
    </h2>
    <div id="supercategoryCollapse" className={`accordion-collapse collapse ${openAccordion === 'supercategory' ? 'show' : ''}`} aria-labelledby="supercategoryAccordion" data-bs-parent="#accordion">
      <div className="accordion-body" style={{maxHeight: '150px', overflowY: 'auto'}} >
      {superCategoryOptions.map((option, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Check
            type="checkbox"
            id={`supercategory-${index}`}
            label={option}
            checked={selectedOptions['supercategory'] && selectedOptions['supercategory'].includes(option)}
            onChange={() => handleOptionToggle(option, 'supercategory')}
            style={{ fontSize: '14px', lineHeight: '1.5',marginRight: '10px', marginBottom: '5px',marginTop:'5px', cursor: 'pointer' }}
          />
        </div>
      ))}
    </div>
    </div>
    </div>
</Row>
<Row>
<div className="accordion-item" style={{backgroundColor:'white', color:'black', padding:'10px', borderRadius:'4px', marginTop:'10px'}} >
    <h2 className="accordion-header" id="categoryAccordion">
      <button className={`accordion-button ${openAccordion === 'category' ? '' : 'collapsed'}`} type="button" onClick={() => handleAccordionToggle('category')} aria-expanded={openAccordion === 'category'} aria-controls="categoryCollapse">
        Category {getSelectedCount('category')}<BsChevronDown />
      </button>
    </h2>
    <div id="categoryCollapse" className={`accordion-collapse collapse ${openAccordion === 'category' ? 'show' : ''}`} aria-labelledby="categoryAccordion" data-bs-parent="#accordion">
      <div className="accordion-body" style={{maxHeight: '150px', overflowY: 'auto'}} >
      {categoryOptions.map((option, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Check
            type="checkbox"
            id={`category-${index}`}            
            label={option}
            checked={selectedOptions['category'] && selectedOptions['category'].includes(option)}
            onChange={() => handleOptionToggle(option, 'category')}
            style={{ fontSize: '14px', lineHeight: '1.5',marginRight: '10px', marginBottom: '5px',marginTop:'5px', cursor: 'pointer' }}
          />
        </div>
      ))}
    </div>
    </div>
    </div>
</Row>
<Row>
<div className="accordion-item" style={{backgroundColor:'white', color:'black', padding:'10px', borderRadius:'4px', marginTop:'10px'}} >
    <h2 className="accordion-header" id="subcategoryAccordion">
      <button className={`accordion-button ${openAccordion === 'subcategory' ? '' : 'collapsed'}`} type="button" onClick={() => handleAccordionToggle('subcategory')} aria-expanded={openAccordion === 'subcategory'} aria-controls="subcategoryCollapse">
        SubCategory {getSelectedCount('subcategory')}<BsChevronDown />
      </button>
    </h2>
    <div id="subcategoryCollapse" className={`accordion-collapse collapse ${openAccordion === 'subcategory' ? 'show' : ''}`} aria-labelledby="subcategoryAccordion" data-bs-parent="#accordion">
      <div className="accordion-body" style={{maxHeight: '150px', overflowY: 'auto'}} >
      {subCategoryOptions.map((option, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Check
            type="checkbox"
            id={`subcategory-${index}`}
            label={option}
            checked={selectedOptions['subcategory'] && selectedOptions['subcategory'].includes(option)}
            onChange={() => handleOptionToggle(option, 'subcategory')}
            style={{ fontSize: '14px', lineHeight: '1.5',marginRight: '10px', marginBottom: '5px',marginTop:'5px', cursor: 'pointer' }}
          />
        </div>
      ))}
   </div>
   </div>
   </div>
</Row>
<Row>
<div className="accordion-item" style={{backgroundColor:'white', color:'black', padding:'10px', borderRadius:'4px', marginTop:'10px'}} >
    <h2 className="accordion-header" id="studydesignAccordion">
      <button className={`accordion-button ${openAccordion === 'studydesign' ? '' : 'collapsed'}`} type="button" onClick={() => handleAccordionToggle('studydesign')} aria-expanded={openAccordion === 'studydesign'} aria-controls="studydesignCollapse">
        StudyDesign {getSelectedCount('studydesign')}<BsChevronDown />
      </button>
    </h2>
    <div id="studydesignCollapse" className={`accordion-collapse collapse ${openAccordion === 'studydesign' ? 'show' : ''}`} aria-labelledby="studydesignAccordion" data-bs-parent="#accordion">
      <div className="accordion-body" style={{maxHeight: '150px', overflowY: 'auto'}} >
      {studyDesignOptions.map((option, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Check
            type="checkbox"
            id={`studydesign-${index}`}
            label={option}
            checked={selectedOptions['studydesign'] && selectedOptions['studydesign'].includes(option)}
            onChange={() => handleOptionToggle(option, 'studydesign')}
            style={{ fontSize: '14px', lineHeight: '1.5',marginRight: '10px', marginBottom: '5px',marginTop:'5px', cursor: 'pointer' }}
          />
        </div>
      ))}
    </div>
    </div>
    </div>
</Row>
<Row>
<div className="accordion-item" style={{backgroundColor:'white', color:'black', padding:'10px', borderRadius:'4px', marginTop:'10px'}} >
    <h2 className="accordion-header" id="placeofinterviewAccordion">
      <button className={`accordion-button ${openAccordion === 'placeofinterview' ? '' : 'collapsed'}`} type="button" onClick={() => handleAccordionToggle('placeofinterview')} aria-expanded={openAccordion === 'placeofinterview'} aria-controls="placeofinterviewCollapse">
        PlaceOfInterview {getSelectedCount('placeofinterview')}<BsChevronDown />
      </button>
    </h2>
    <div id="placeofinterviewCollapse" className={`accordion-collapse collapse ${openAccordion === 'placeofinterview' ? 'show' : ''}`} aria-labelledby="placeofinterviewAccordion" data-bs-parent="#accordion">
      <div className="accordion-body" style={{maxHeight: '150px', overflowY: 'auto'}} >
      {placeOfInterviewOptions.map((option, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }} >
          <Form.Check
            type="checkbox"
            id={`placeofinterview-${index}`}
            label={option}
            checked={selectedOptions['placeofinterview'] && selectedOptions['placeofinterview'].includes(option)}
            onChange={() => handleOptionToggle(option, 'placeofinterview')}
            style={{ fontSize: '14px', lineHeight: '1.5',marginRight: '10px', marginBottom: '5px',marginTop:'5px', cursor: 'pointer' }}
          />
        </div>
      ))}
    </div>
    </div>
    </div>
</Row>
<Row>
<div className="accordion-item" style={{backgroundColor:'white', color:'black', padding:'10px', borderRadius:'4px', marginTop:'10px'}} >
    <h2 className="accordion-header" id="blindbrandedAccordion">
      <button className={`accordion-button ${openAccordion === 'blindbranded' ? '' : 'collapsed'}`} type="button" onClick={() => handleAccordionToggle('blindbranded')} aria-expanded={openAccordion === 'blindbranded'} aria-controls="blindbrandedCollapse">
        BlindBranded {getSelectedCount('blindbranded')}<BsChevronDown />
      </button>
    </h2>
    <div id="blindbrandedCollapse" className={`accordion-collapse collapse ${openAccordion === 'blindbranded' ? 'show' : ''}`} aria-labelledby="blindbrandedAccordion" data-bs-parent="#accordion">
      <div className="accordion-body" style={{maxHeight: '150px', overflowY: 'auto'}} >

      {blindOrBrandedOptions.map((option, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Check
            type="checkbox"
            id={`blindbranded-${index}`}
            label={option}
            checked={selectedOptions['blindbranded'] && selectedOptions['blindbranded'].includes(option)}
            onChange={() => handleOptionToggle(option, 'blindbranded')}
            style={{ fontSize: '14px', lineHeight: '1.5',marginRight: '10px', marginBottom: '5px',marginTop:'5px', cursor: 'pointer' }}
          />
        </div>
      ))}
    </div>
    </div>
    </div>
  
</Row>

<Row>
  <div className="accordion-item" style={{backgroundColor:'white', color:'black', padding:'10px', borderRadius:'4px', marginTop:'10px'}} >
    <h2 className="accordion-header" id="scaleoverallopinionAccordion">
      <button className={`accordion-button ${openAccordion === 'scaleoverallopinion' ? '' : 'collapsed'}`} type="button" onClick={() => handleAccordionToggle('scaleoverallopinion')} aria-expanded={openAccordion === 'scaleoverallopinion'} aria-controls="scaleoverallopinionCollapse">
      Scale Overall Opinion {getSelectedCount('scaleoverallopinion')}<BsChevronDown />
      </button>
    </h2>
    <div id="scaleoverallopinionCollapse" className={`accordion-collapse collapse ${openAccordion === 'scaleoverallopinion' ? 'show' : ''}`} aria-labelledby="scaleoverallopinionAccordion" data-bs-parent="#accordion">
      <div className="accordion-body" style={{maxHeight: '150px', overflowY: 'auto'}} >
        {scaleOverallOpinionOptions.map((option, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <Form.Check
              type="checkbox"
              id={`scaleoverallopinion-${index}`}
              label={option}
              checked={selectedOptions['scaleoverallopinion'] && selectedOptions['scaleoverallopinion'].includes(option)}
              onChange={() => handleOptionToggle(option, 'scaleoverallopinion')}
              style={{ fontSize: '14px', lineHeight: '1.5',marginRight: '10px', marginBottom: '5px',marginTop:'5px', cursor: 'pointer' }}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
</Row>

<Row>
  <div className="accordion-item" style={{backgroundColor:'white', color:'black', padding:'10px', borderRadius:'4px', marginTop:'10px'}} >
    <h2 className="accordion-header" id="scalepurchaseintentionAccordion">
      <button className={`accordion-button ${openAccordion === 'scalepurchaseintention' ? '' : 'collapsed'}`} type="button" onClick={() => handleAccordionToggle('scalepurchaseintention')} aria-expanded={openAccordion === 'scalepurchaseintention'} aria-controls="scalepurchaseintentionCollapse">
      Scale Purchase Intention {getSelectedCount('scalepurchaseintention')}<BsChevronDown />
      </button>
    </h2>
    <div id="scalepurchaseintentionCollapse" className={`accordion-collapse collapse ${openAccordion === 'scalepurchaseintention' ? 'show' : ''}`} aria-labelledby="scalepurchaseintentionAccordion" data-bs-parent="#accordion">
      <div className="accordion-body" style={{maxHeight: '150px', overflowY: 'auto'}} >
        {scalePurchaseIntentionOptions.map((option, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <Form.Check
              type="checkbox"
              id={`scalepurchaseintention-${index}`}
              label={option}
              checked={selectedOptions['scalepurchaseintention'] && selectedOptions['scalepurchaseintention'].includes(option)}
              onChange={() => handleOptionToggle(option, 'scalepurchaseintention')}
              style={{ fontSize: '14px', lineHeight: '1.5',marginRight: '10px', marginBottom: '5px',marginTop:'5px', cursor: 'pointer' }}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
</Row>

<Row>
  <div className="accordion-item" style={{backgroundColor:'white', color:'black', padding:'10px', borderRadius:'4px', marginTop:'10px'}} >
    <h2 className="accordion-header" id="scaleproductattributesAccordion">
      <button className={`accordion-button ${openAccordion === 'scaleproductattributes' ? '' : 'collapsed'}`} type="button" onClick={() => handleAccordionToggle('scaleproductattributes')} aria-expanded={openAccordion === 'scaleproductattributes'} aria-controls="scaleproductattributesCollapse">
      Scale Product Attributes {getSelectedCount('scaleproductattributes')}<BsChevronDown />
      </button>
    </h2>
    <div id="scaleproductattributesCollapse" className={`accordion-collapse collapse ${openAccordion === 'scaleproductattributes' ? 'show' : ''}`} aria-labelledby="scaleproductattributesAccordion" data-bs-parent="#accordion">
      <div className="accordion-body" style={{maxHeight: '150px', overflowY: 'auto'}} >
        {scaleProductAttributesOptions.map((option, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <Form.Check
              type="checkbox"
              id={`scaleproductattributes-${index}`}
              label={option}
              checked={selectedOptions['scaleproductattributes'] && selectedOptions['scaleproductattributes'].includes(option)}
              onChange={() => handleOptionToggle(option, 'scaleproductattributes')}
              style={{ fontSize: '14px', lineHeight: '1.5',marginRight: '10px', marginBottom: '5px',marginTop:'5px', cursor: 'pointer' }}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
</Row>


      </div>
</Col>

      <br />
      <br />
      
      </Row>
      </div>
      
      
    </div>
  );
};

export default Norms;




