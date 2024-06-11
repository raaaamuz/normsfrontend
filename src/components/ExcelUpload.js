    import React, { useState, useEffect } from 'react';
    import * as XLSX from 'xlsx';
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    import { faTrash, faEye, faEllipsisV, faCircleNotch, faDownload, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
    import { Link, useNavigate } from 'react-router-dom';
    import { Table, Button, Dropdown, Alert, Form } from 'react-bootstrap';
    import './DisplayData';
    import './ExcelUpload.css';

    const ExcelUpload = () => {
        const [selectedFile, setSelectedFile] = useState(null);
        const [isLoading, setIsLoading] = useState(false);
        const [isDone, setIsComplete] = useState(false);
        const [isDuplicate, setIsDuplicate] = useState(false);
        const [fetchedData, setFetchedData] = useState(null);
        const [isDownloadError,setDownloadError]=useState(false)
        const [selectedItems, setSelectedItems] = useState({});
        const [uploadedFiles, setUploadedFiles] = useState([]);
        const [fileData, setFileData] = useState([]);
        const [showTable, setShowTable] = useState(true);
        const [openMenuIndex, setOpenMenuIndex] = useState(null);
        const [showCheckboxes, setShowCheckboxes] = useState(false);
        const navigate = useNavigate();

        useEffect(() => {
            fetchFetchedData();
        }, []);

        const handleFileChange = (e) => {
            setSelectedFile(e.target.files[0]);
        };

        const toggleCheckboxes = () => {
            setSelectedItems({});
            setShowCheckboxes(!showCheckboxes);
            if (showCheckboxes==true){
                getSelectedFilenames()
            }
            if (!showCheckboxes) {
                // When turning checkboxes on, reset selections
                setSelectedItems({});
            }
        };
        const getSelectedFilenames = () => {
            const selectedFilenames = Object.entries(selectedItems)
                .filter(([filename, isSelected]) => isSelected)
                .map(([filename]) => filename);
            if (selectedFilenames.length===0){
                setDownloadError(true)
                setShowCheckboxes(true)
            }
            else{
                setDownloadError(false)
            }
            downloadData(selectedFilenames);
            return selectedFilenames;
        };

        const downloadData = (filenames) => {
            fetch('http://127.0.0.1:8000/data/download_data/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ filenames })
            })
            .then(response => {
                if (response.ok) {
                    return response.blob(); // assuming the response is a blob for downloading
                }
                throw new Error('Network response was not ok.');
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'downloaded_data.csv'; // or 'downloaded_data.xlsx' if the backend sends an Excel file
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                alert('Your file has started downloading.');
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
        };

        const toggleSelectAll = (checked) => {
            const newSelectedItems = {};
            if (checked) {
                fetchedData.forEach(file => {
                    newSelectedItems[file.filename] = true;
                });
            }
            setSelectedItems(newSelectedItems);
        };
        const handleCheckboxChange = (filename, isChecked) => {
            const newSelectedItems = { ...selectedItems, [filename]: isChecked };
            if (!isChecked) {
                delete newSelectedItems[filename];
            }
            setSelectedItems(newSelectedItems);
        };
        const handleUpload = () => {
            setIsComplete(false)
            setIsDuplicate(false)
            setIsLoading(false)
            if (selectedFile) {
                try {
                    const fileName = selectedFile.name;
                    const uploadedBy = localStorage.getItem('username');

                    setUploadedFiles(prevFiles => [
                        ...prevFiles,
                        { fileName: selectedFile.name, uploadedBy: uploadedBy }
                    ]);

                    readFile(selectedFile);
                } catch (error) {
                    console.error('Error reading file:', error);
                }
            } else {
                console.error('No file selected.');
            }
        };

        const postJSONData = (jsonData) => {
            setIsLoading(true);
            fetch("http://127.0.0.1:8000/data/data/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${localStorage.getItem('Token')}`,
                },
                body: JSON.stringify(jsonData),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to post data");
                    }
                    console.log(response);
                    return response.json();
                })
                .then(data => {
                    if (data.message === 'Duplicated entry') {
                        console.log('Duplicated entry:', data.message);
                        //setIsDuplicate(true)
                        setIsComplete(false);
                        //alert("hi")
                        return false;
                    } else {
                        console.log('File details posted successfully:', data);
                        setIsLoading(false);
                        setIsComplete(true);
                        setIsDuplicate(false);
                        fetchFetchedData();
                        return true;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        };


        const postDetails = () => {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('filename', selectedFile.name);
            formData.append('creator', sessionStorage.getItem('username'));

            return fetch("http://127.0.0.1:8000/data/file-details/", {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Token ${localStorage.getItem('Token')}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        if (response.status === 400) {
                            return response.json().then(data => {
                                console.log(data)
                                throw new Error(data.message);
                            });
                        } else if (response.status === 500) {
                            throw new Error("Internal server error occurred. Please try again later.");
                        } else {
                            throw new Error("Failed to post data. Please try again later.");
                        }
                    }

                    return response.json();
                })
                .then(data => {
                    setIsLoading(false);
                    console.log('Response data:', data);
                    return true;
                })
                .catch(error => {
                    console.error('Error:', error.message);
                    if(error.message==='Duplicate entry')
                    {
                        setIsLoading(false)
                        setIsDuplicate(true)
                        setIsComplete(false)
                    }
                    return false;
                });
        };
        const readFile = async (file) => {
            const reader = new FileReader();
            reader.onload = async () => {
                const content = reader.result;
                const workbook = XLSX.read(content, { type: 'binary' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                const columns = data[0];
                const jsonData = data.slice(1).map(row => {
                    const obj = {};
                    columns.forEach((column, index) => {
                        obj[column] = row[index];
                    });
                    obj["filename"] = selectedFile.name;
                    obj["creator"] = sessionStorage.getItem('username');
                    return obj;
                });

                setFileData(jsonData);

                try {
                    const detailsRes = await postDetails();

                    if (detailsRes) {
                        const jsonRes = await postJSONData(jsonData);
                        setShowTable(true);
                    } else {
                        setIsLoading(false);
                        //   setIsComplete(true);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    //setIsComplete(true);
                }
            };
            reader.readAsBinaryString(file);
        };

        const handleDeleteRow1 = (index) => {
            const updatedFiles = [...uploadedFiles];
            updatedFiles.splice(index, 1);

            setUploadedFiles(updatedFiles);
        };
        const handleDeleteRow = (filename) => {
            fetch(`http://127.0.0.1:8000/data/deleteProject/?fName=${filename}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Token ${localStorage.getItem('Token')}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to delete file");
                    }

                    const updatedFiles = [...uploadedFiles];
                    // updatedFiles.splice(index, 1);
                    setUploadedFiles(updatedFiles);

                    setFetchedData(prevData => prevData.filter(file => file.filename !== filename));
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        };

        const handleView = (fileName) => {
            setShowCheckboxes(true);
            navigate(`/display-data/${fileName}`);
        };

        const handleViewSelected = () => {
            setShowCheckboxes(true);
            const selectedFilenames = Object.keys(selectedItems);
            selectedFilenames.forEach(filename => {
                navigate(`/display-data/${filename}`);
            });
        };

        const handleDeleteSelected = () => {
            setShowCheckboxes(true);
            const selectedFilenames = Object.keys(selectedItems);
            selectedFilenames.forEach(filename => {
                handleDeleteRow(filename);
            });
        };

        const toggleMenu = (index) => {
            setOpenMenuIndex(openMenuIndex === index ? null : index);
        };

        const closeMenu = () => {
            setOpenMenuIndex(null);
        };

        const fetchFetchedData = () => {
            fetch("http://127.0.0.1:8000/data/getPrDetails/", {
                headers: {
                    Authorization: `Token ${localStorage.getItem('Token')}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch data");
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data)
                    setFetchedData(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        };

        return (
            <div>

                {isDuplicate && (
                    <Alert variant="danger" dismissible onClose={() => setIsDuplicate(false)} style={{display:'flex', justifyContent:'center', alignItems:'center', marginLeft:'500px', marginRight:'500px'}}>
                        <p style={{ color: 'red' }}>Duplicate entry Please check!</p>
                    </Alert>
                )}
                {isDownloadError && (
                    <Alert variant="danger" dismissible onClose={() => setDownloadError(false)} style={{display:'flex', justifyContent:'center', alignItems:'center', marginLeft:'500px', marginRight:'500px'}}>
                        <p style={{ color: 'red' }}>Check the projects you want to download and try again!</p>
                    </Alert>
                )}

                {isDone && (
                    <Alert variant="success" dismissible onClose={() => setIsComplete(false)} style={{display:'flex', justifyContent:'center', alignItems:'center', marginLeft:'500px', marginRight:'500px'}}>
                        File has been uploaded successfully
                    </Alert>
                )}

                {isLoading && <FontAwesomeIcon icon={faCircleNotch} color='blue' spin />}

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0px', padding: "10" }}>
                <Form.Control type="file" onChange={handleFileChange}  style={{width:'500px'}} />
                    <button onClick={handleUpload} className="upload-button">Upload</button>
                </div>
                <hr />

                <div style={{display:'flex', border:'1px solid white', borderRadius:'15px', width:'30%', marginLeft: '450px', justifyContent:'space-evenly', backgroundColor:'white', boxShadow:'2px 2px 4px  rgba(10, 10, 10, 10)'}}>
                    <Button variant='success' onClick={toggleCheckboxes} style={{ margin: '10px' }}>
                        <FontAwesomeIcon icon={faDownload} /> 
                    </Button>
                    <Button variant='info' onClick={handleViewSelected} style={{ margin: '10px' }} >
                    <FontAwesomeIcon icon={faEye} /> 
                    </Button>
                    <Button variant='danger' onClick={handleDeleteSelected} style={{ margin: '10px' }}>
                    <FontAwesomeIcon icon={faTrashAlt} /> 
                    </Button>
                </div>

                {showTable && (
                    <Table striped bordered hover style={{ width: '95%', marginLeft: '20px', marginRight: 'auto', marginTop: '20px' }}>
                        <thead>
                            <tr>
                                {showCheckboxes && (
                                    <th>
                                        <input
                                            type="checkbox"
                                            onChange={e => toggleSelectAll(e.target.checked)}
                                            checked={Object.keys(selectedItems).length === fetchedData?.length}
                                            disabled={!fetchedData?.length}
                                        />
                                    </th>
                                )}
                                <th>File Name</th>
                                <th>Uploaded At</th>
                                <th>Uploaded By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fetchedData && fetchedData.map((file, index) => (
                                <tr key={index}>
                                    {showCheckboxes && (
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={!!selectedItems[file.filename]}
                                                onChange={e => handleCheckboxChange(file.filename, e.target.checked)}
                                            />
                                        </td>
                                    )}
                                    <td>{file.filename}</td>
                                    <td>{file.uploaded_at}</td>
                                    <td>{file.uploaded_by}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
        );
    };

    export default ExcelUpload;