import React, { useState, useEffect } from 'react';

function Chatbot() {
    const [text, setText] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleChange = (event) => {
        // Update the input field state as the user types
        setText(event.target.value);
    };
   
        
   
    const handleClick = () => {
        // Get the current value from the input field
        const inputValue = document.getElementById('textInput').value;
        // Append the new text to the existing text state with a line break
        const newText = text === '' ? inputValue : text + '\n' + inputValue;
    
        fetch(`http://127.0.0.1:8000/chatbot/chatbot/?query=${inputValue}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response error');
                }
                return response.json();
            })
            .then(data => {
                console.log(data['insights']);
                // Update the text state with the new query, result, and insights
                const updatedText = newText + '\n\n' + data['insights'] + '\n';
                setText(updatedText);
            })
            .catch(error => {
                console.error('There was a problem fetching data:', error);
            });
    };
    
    return (
        <div style={{paddingTop:'10px'}} >
            <div style={{ width: '1275px', height: '525px', margin: 'auto',  padding: '10px',  paddingTop:'5px'}}>
                <textarea
                id="textResult"
                    value={text}
                    readOnly // Make the textarea read-only
                    style={{ width: '100%', height: '100%', borderRadius: '20px', resize: 'none'}}
                    placeholder='Current accepting prompts are... 

                    Percentage for column liking | % for column liking filter secnew by sec a
                    
                    Absolute for column liking filter secnew by sec a 
                    
                    Abs for column liking filter secnew by sec a and secnew by sec b
                    
                    summary for column liking 
                    
                    summary for column liking filter secnew by sec a and secnew by sec b'
                />
            </div>
         
            <div style={{marginLeft:'20px', paddingTop:'5px'}}>
                <input
                    type="text"
                    id="textInput" // Add id to the input element
                    placeholder="Type something..."
                    style={{width: '93%', height: '100%',  resize: 'none' , marginBottom: '10px', borderRadius: '5px' }}
                />
                <button onClick={handleClick}>Submit</button>
            </div>
        </div>
    );
}

export default Chatbot;
