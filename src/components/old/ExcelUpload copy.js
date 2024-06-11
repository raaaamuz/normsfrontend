import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Importing xlsx library

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

const ExcelUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileData, setFileData] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDone,setIsComplete]=useState(false);
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (selectedFile) {
            try {
               
                setUploadedFiles(prevFiles => [...prevFiles, selectedFile.name]);                
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
            },
            
            body: JSON.stringify(jsonData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to post data");
            }
            return response.json(); 
        })
        .then(data => {
            setIsLoading(false);
            setIsComplete(true)
            //alert("Successfully uploaded!");
            console.log('Response:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };
    const postFileDetails = (filename, username, datetime) => {
        const fileDetails = {
            filename: filename,
            username: username,
            datetime: datetime
        };

        fetch("http://127.0.0.1:8000/your/other/endpoint", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fileDetails),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to post file details");
            }
            return response.json(); 
        })
        .then(data => {
            console.log('File details posted:', data);
        })
        .catch(error => {
            console.error('Error posting file details:', error);
        });
    };
    const readFile = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
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
                //console.log("TTR",row)
                return obj;
            });

            console.log('JSON data:', jsonData);
            console.log('Type of JSON data:', typeof jsonData);
            const modifiedData = jsonData.map(row => ({                 
                ...row, 
                filename: selectedFile.name }));
            setFileData(modifiedData);
            postJSONData(modifiedData);
            postFileDetails(selectedFile.name, "", new Date().toISOString());
        };
        reader.readAsBinaryString(file);
    };

    
    return (    
        <div>
            {isLoading && <FontAwesomeIcon icon={faCircleNotch} color='blue' spin />}
            {isDone && <div>File has been uploaded successfully</div>}
            <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                <input type="file" accept='.xlsx' onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload</button>
            </div>
            <div style={{ position: 'absolute', top: '10px', right: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                <h2 style={{marginTop:"60px"}}>Uploaded Files:</h2>
                <ul>
                    {uploadedFiles.map((fileName, index) => (
                        <li key={index}>{fileName}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ExcelUpload;
