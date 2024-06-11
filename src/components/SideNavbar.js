import React, { useState } from 'react';
import { Container, Nav, NavbarBrand } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { AiOutlineHome, AiOutlineFunnelPlot, AiOutlineMessage, AiOutlineBook, AiOutlineTable } from 'react-icons/ai'; // Import icons
import FilterModal from './FilterModal';

import './SideNavbar.css';



const SideNavbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [showFilterModal, setShowFilterModal] = useState(false);
  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  return (
    <Container fluid>
      <div  className={`sidebar`}>
        <Nav defaultActiveKey="/" className="flex-column">
          <div className="nav-link-container">
            <Nav.Link href="/home" className={currentPath === '/home' ? 'nav-link active' : 'nav-link'}>
              <AiOutlineHome /> Home
            </Nav.Link>
          </div>
          <div className="nav-link-container">
            <Nav.Link href="/cross-tab" className={currentPath === '/cross-tab' ? 'nav-link active' : 'nav-link'}>
            <AiOutlineTable />
              <br />
               CrossTab
            </Nav.Link>
          </div>
          <div className="nav-link-container">
            <Nav.Link href="/chatbot" className={currentPath === '/chatbot' ? 'nav-link active' : 'nav-link'}>
              <AiOutlineMessage />
              <br />
               ChatBot
            </Nav.Link>
          </div>
          <div className="nav-link-container">
            <Nav.Link href="/norms" className={currentPath === '/norms' ? 'nav-link active' : 'nav-link'}>
              <AiOutlineBook />
              <br />
               Norms
            </Nav.Link>
          </div>
          <div className="nav-link-container">
            <Nav.Link href="/filters" className={currentPath === '/filters' ? 'nav-link active' : 'nav-link'}>
            <AiOutlineFunnelPlot />
              <br />
              Filters
            </Nav.Link>
          </div>
          {/* <div className="nav-link-container">
            <Nav.Link href="#" className="nav-link" onClick={toggleFilterModal}>
              <AiOutlineFunnelPlot />
              <br />
              Create Filters
            </Nav.Link>
          </div> */}
        </Nav>
      </div>
      <br />
      <FilterModal showModal={showFilterModal} setShowModal={setShowFilterModal} />
    </Container>
  );
};

export default SideNavbar;
