import React, { useState } from 'react';
import { FaHome, FaList, FaBoxOpen, FaUser,FaPlus,
  FaChartBar,FaClipboardCheck, FaLifeRing } from 'react-icons/fa';
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

        {/* links supposed to logistic role */}

        {privileges.includes('Manage_item_stock') && (
          <li onClick={() => setCurrentPage('view-items-stock')}> <FaList /> Item stock </li>
        )}
        {privileges.includes('Make_item_order') && (
          <li onClick={() => setCurrentPage('make-order')}><FaClipboardCheck /> Order Supplies  </li>
        )}
        {privileges.includes('view_request_item') && (
          <li onClick={() => setCurrentPage('view-requisition')}><FaClipboardCheck /> Item Requisition</li>
        )}
        {privileges.includes('view_request_fuel') && (
          <li onClick={() => setCurrentPage('fuel-requisition')}><FaClipboardCheck /> Fuel Requisition</li>
        )}
        {privileges.includes('View_car_data') && (
          <li onClick={() => setCurrentPage('view-cars')}> <FaChartBar /> view cars data</li>
        )}
        {privileges.includes('view_fuel_stock') && (
         <li onClick={() => setCurrentPage('fuel-stock')}><FaPlus /> Fuel stock</li>
        )}
         {privileges.includes('view_item_report') && (
          <li onClick={() => setCurrentPage('report')}><FaChartBar /> Item Report</li>
        )} 
        {privileges.includes('view_fuel_report') && (
          <li onClick={() => setCurrentPage('fuel-report')}><FaChartBar /> Fuel Report </li>
        )}   
       {privileges.includes('view_fuel_report') && (
          <li onClick={() => setCurrentPage('fuel-report')}><FaChartBar /> Fuel Report </li>
        )}

         {/*links supposed to go on daf  */}
         
      </ul>
    </div>
  );
};

export default Navbar;