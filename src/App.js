import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes , Navigate} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUpForm from './components/SignUpForm';
import DisplayData from './components/DisplayData';
import CrossTab from './components/CrossTab';
import SideNavbar from './components/SideNavbar';
import NavigationBar from './components/NavigationBar'
import Chatbot from './components/Chatbot';
import Norms from './components/Norms';
import Filters from './components/Filters';
import FileUpload from './components/ExcelUpload';

import './Application.css';
//import'./components/norms.css'



const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [fileData, setFileData] = useState([]);
  useEffect(() => {
    const loggedInState = localStorage.getItem('isLoggedIn');
    //console.log("XXXX",loggedInState)
    const storedUsername = localStorage.getItem('username');
    
    setIsLoggedIn(prevIsLoggedIn => {
      //console.log("CLOG",prevIsLoggedIn);
      if (loggedInState === 'true') {
        console.log("XAD");
        console.log("CLOGss",!prevIsLoggedIn);
        setUsername(storedUsername)
        return true;
      }
      return prevIsLoggedIn;
    });
  }, []);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username)
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    //console.log("aaaaaaaaaa")
    localStorage.setItem('isLoggedIn', 'false');
  };

  return (
    <Router>
    <NavigationBar isloggedIn={isLoggedIn} onLogout={handleLogout} username={username} />
      <Container fluid>
        <Row>
      {isLoggedIn && <Col sm={1} className='p-0'><SideNavbar /></Col>}
          <Col sm={11} className='p-0'>
          <Routes>
  {isLoggedIn ? (
    <>
      <Route path="/home" element={<Home onLogout={handleLogout} />} />
      <Route path="/display-data/:fileName" element={<DisplayData fileData={fileData} />} />
      <Route path="/upload" element={<FileUpload setFileData={setFileData} />} />
      <Route path="/cross-tab" element={<CrossTab />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/norms" element={<Norms />} />
      <Route path="/filters" element={<Filters />} />
      <Route path="/logout" element={<Navigate to="/login" />} />
    </>
  ) : (
    <>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      
    </>
  )}
</Routes>
          </Col>
          </Row>
          <Col sm={0} className='p-0'>
            <Row>

            </Row>
          </Col>
      </Container>
    </Router>
  );
};

export default App;