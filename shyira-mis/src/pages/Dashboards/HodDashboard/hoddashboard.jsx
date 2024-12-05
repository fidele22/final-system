import React, { useState, useEffect } from 'react';
import Navigation from '../navbar/Navbar';
import Footer from '../footer/Footer';
import Navbar from '../navsidebar/leftNavigationbar';
import Overview from './Overview';
import MakeRequest from './request/requisitionPages';
import FuelRequestPages from './fuelRequest/fuelRequisitionPages';
import RequestStatus from './requestStatus/requestStatus';
import Items from './items/viewItems';
import UserProfile from '../UserProfile/profile';
import HelpCenter from '../helpcenter/helpcenter';
import './hodDashboard.css';

const LogisticDashboard = () => {
  const [currentPage, setCurrentPage] = useState('overview');
  const [privileges, setPrivileges] = useState([]);

  useEffect(() => {
    const tabId = sessionStorage.getItem('currentTab');
    console.log('Current tab ID:', tabId); // Debugging log

    if (tabId) {
      const storedPrivileges = sessionStorage.getItem(`privileges_${tabId}`);
      console.log('Stored privileges:', storedPrivileges); // Debugging log

      if (storedPrivileges) {
        try {
          const parsedPrivileges = JSON.parse(storedPrivileges); // Parse the stored privileges
          setPrivileges(parsedPrivileges); // Update state with parsed privileges
        } catch (error) {
          console.error('Error parsing privileges from sessionStorage:', error);
          setPrivileges([]); // Set to an empty array if parsing fails
        }
      } else {
        console.warn('Privileges not found in sessionStorage');
        setPrivileges([]); // Set to an empty array if no privileges are found
      }
    } else {
      console.warn('No tab ID found in sessionStorage');
      setPrivileges([]); // Set to an empty array if no tab ID is found
    }
  }, []);

  const renderContent = () => {
    switch (currentPage) {
      case 'overview':
        return <Overview />;
      case 'view-items':
        return <Items />;
      case 'fuel-request':
        return <FuelRequestPages />;
      case 'requisition-status':
        return <RequestStatus />;
      case 'requisition':
        return <MakeRequest />;
      case 'user-profile':
        return <UserProfile />;
      case 'help-center':
        return <HelpCenter />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="daf-dashboards">
      <Navigation setCurrentPage={setCurrentPage} />
      <div className="content-navbar">
        <Navbar setCurrentPage={setCurrentPage} privileges={privileges} />
      </div>
      <div className="dafcontent-page">
        <div className='dafcontents'>
          {renderContent()}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default LogisticDashboard;