import React, { useState, useEffect } from 'react';
import { FaTimes, FaBars } from 'react-icons/fa'; // Correctly import icons
import Navigation from '../navbar/Navbar';
import Navbar from '../navsidebar/leftNavigationbar';
import Footer from '../footer/Footer';
import Overview from './Overview';
import ViewItem from './addItem/parentStock';
import AddItem from './addItem/addingitem';
import MakeRequist from './OrderSupply/MakeRequist';
import FuelOrder from './OrderSupply/fuelorder';
import ViewCars from './fuelRequisition/viewcars';
import LogisticProfile from '../UserProfile/profile';
import StockReport from './StockReport/ItemReport';
import ViewRequisition from './UserRequisitions/RequisitionsPages';
import ViewFuelRequest from './fuelRequisition/fuelRequisitionPages';
import FuelStock from './fuelRequisition/fuelStock';
import FuelReport from './StockReport/FuelReport';
import RequisitionReceive from './receivedRequisitions/itemRequestReceived';
import HelpCenter from '../helpcenter/helpcenter';
import './contentCss/LogisticDashboard.css';

const LogisticDashboard = () => {
  const [currentPage, setCurrentPage] = useState('overview');
  const [privileges, setPrivileges] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const tabId = sessionStorage.getItem('currentTab');
    if (tabId) {
      const storedPrivileges = sessionStorage.getItem(`privileges_${tabId}`);
      if (storedPrivileges) {
        try {
          const parsedPrivileges = JSON.parse(storedPrivileges);
          setPrivileges(parsedPrivileges);
        } catch (error) {
          console.error('Error parsing privileges from sessionStorage:', error);
          setPrivileges([]);
        }
      } else {
        setPrivileges([]);
      }
    } else {
      setPrivileges([]);
    }
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'overview':
        return <Overview />;
      case 'add-item':
        return <AddItem />;
      case 'manage-items-stock':
        return <ViewItem />;
      case 'report':
        return <StockReport />;
      case 'fuel-report':
        return <FuelReport />;
      case 'fuel-stock':
        return <FuelStock />;
      case 'make-order':
        return <MakeRequist />;
      case 'make-fuel-order':
        return <FuelOrder />;
      case 'fuel-requisition':
        return <ViewFuelRequest />;
      case 'view-cars':
        return <ViewCars />;
      case 'user-profile':
        return <LogisticProfile />;
      case 'item-requisition':
        return <ViewRequisition />;
      case 'help-center':
        return <HelpCenter />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className={`admin-dashboard ${isMenuOpen ? 'open' : ''}`}>
      <div>
        <Navigation setCurrentPage={setCurrentPage} />
        <div className="menu-toggle" onClick={handleMenuToggle}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      <Navbar
        setCurrentPage={setCurrentPage}
        privileges={privileges}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <div className="Admincontent-page">
        <div className="Admincontent">{renderContent()}</div>
        <Footer />
      </div>
    </div>
  );
};

export default LogisticDashboard;
