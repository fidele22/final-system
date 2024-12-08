import React, { useState, useEffect } from 'react';
import Navigation from '../navbar/Navbar'
import Navbar from '../navsidebar/leftNavigationbar';
import Footer from '../footer/Footer'
import Overview from './Overview';
import ViewItem from './addItem/parentStock'
import AddItem from './addItem/addingitem';
import MakeRequist from './OrderSupply/MakeRequist'
import FuelOrder from './OrderSupply/fuelorder'
import OrderStatus from './OrderSupply/orderstatus'
import ReceivedOrder from './OrderSupply/RecievedOrder'
import ViewCars from './fuelRequisition/viewcars'
import LogisticProfile from '../UserProfile/profile'
import StockReport from './StockReport/ItemReport';
import ViewRequisition from './UserRequisitions/RequisitionsPages';
import ViewFuelRequest from './fuelRequisition/fuelRequisitionPages'
import FuelStock from './fuelRequisition/fuelStock'
import FuelReport from './StockReport/FuelReport'
//import ApprovedRequests from './Requests/approvedRequest';
import RequisitionReceive from './receivedRequisitions/itemRequestReceived';
import './contentCss/LogisticDashboard.css';
import HelpCenter from '../helpcenter/helpcenter';

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
      case 'add-item':
        return <AddItem />;
      case 'view-items':
        return <ViewItem />;
      case 'report':
        return <StockReport />;
      case 'fuel-report':
        return <FuelReport />  
      case 'fuel-stock':
        return <FuelStock />
      case 'make-order':
        return <MakeRequist />;
      case 'order-status':
          return <OrderStatus />;
      case 'received-order':
        return <ReceivedOrder />;
      case 'make-fuel-order':
        return <FuelOrder />   

      case 'fuel-requisition':
        return <ViewFuelRequest />;
     
      case 'view-cars':
        return <ViewCars />     
     
     
      case 'user-profile':
        return <LogisticProfile />;
      case 'view-requisition':
        return <ViewRequisition />;

      case 'help-center':
         return <HelpCenter />;
      //  
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
    <div className="Admincontent">
        {renderContent()}
     
      </div>
      <Footer />
    </div>
  </div>
  );
};

export default LogisticDashboard;
