import React, { useState } from 'react';
import { FaHome, FaList, FaBoxOpen, FaUser , FaLifeRing } from 'react-icons/fa';
import './Hodnavigationbar.css';

const Navbar = ({ setCurrentPage, privileges }) => {
  const [dropdownsOpen, setDropdownsOpen] = useState({
    request: false,
    requisitions: false,
    requisitionsstatus: false,
    fuelrequisitionsstatus: false,
  });

  const toggleDropdown = (dropdownName) => {
    setDropdownsOpen((prevState) => ({
      ...prevState,
      [dropdownName]: !prevState[dropdownName],
    }));
  };

  return (
    <div className="navigation">
      <div className="nav-logo">
        <h1>Lmis</h1>
      </div>
      <ul>
        {privileges.includes('view_overview') && (
          <li onClick={() => setCurrentPage('overview')}><FaHome /> Overview</li>
        )}
        {privileges.includes('view_items') && (
          <li onClick={() => setCurrentPage('view-items')}><FaList /> Available Items</li>
        )}
        {privileges.includes('request_item') && (
          <li onClick={() => setCurrentPage('requisition')}><FaBoxOpen /> Request Item</li>
        )}
        {privileges.includes('request_fuel') && (
          <li onClick={() => setCurrentPage('fuel-request')}><FaBoxOpen /> Request Fuel</li>
        )}
        {privileges.includes('update_car_data') && (
          <li onClick={() => setCurrentPage('fill-cardata')}><FaBoxOpen /> Update Car Data</li>
        )}
      </ul>
      <u><h2>Settings</h2></u>
      <ul>
        {privileges.includes('view_profile') && (
          <li onClick={() => setCurrentPage('user-profile')}><FaUser  /> Profile</li>
        )}
        {privileges.includes('view_help_center') && (
          <li onClick={() => setCurrentPage('help-center')}><FaLifeRing /> Help Center</li>
        )}
      </ul>
    </div>
  );
};

export default Navbar;