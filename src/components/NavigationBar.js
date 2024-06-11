import React from 'react';
import { Navbar, Nav, NavDropdown ,Container, Button} from 'react-bootstrap';
import { Link,useNavigate } from 'react-router-dom';
import './NavigationBar.css';
import logo from '../components/4sightlogo.png';

const NavigationBar = ({ isloggedIn, onLogout, username }) => {
  //console.log(username)
  const navigate = useNavigate();
  //alert(isloggedIn)

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };


  
  return (
    

    <div>
    <Navbar style={{backgroundColor:"#0D3A4B"}}>
      <Container fluid>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav.Item style={{ width: '200%', height:'75px'}}>
        <img src={logo} alt="4sightlogo" className="logo" style={{ width: '100px', height:'100px', transform: 'scale(1.5)'}}/>
        </Nav.Item>
        <div style={{color:'white'}}>NORMS</div>
          <Nav style={{display:'flex', justifyContent:'end', alignItems:'end', marginLeft:'500px'}} className="me-auto" >
          <NavDropdown title={isloggedIn ? <span className="username">Hi - {username}</span> : "Login"} id="basic-nav-dropdown" className="custom-dropdown" >
              {isloggedIn ? (
                <></>
              ) : (
                <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
              )}
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>           
    </Navbar>
    </div>
    
  );
};

export default NavigationBar;
