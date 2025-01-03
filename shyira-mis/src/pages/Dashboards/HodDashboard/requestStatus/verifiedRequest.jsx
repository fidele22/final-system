import React, { useState, useEffect } from 'react';
import { FaQuestionCircle,FaTimesCircle, FaEdit, FaCheckCircle,FaTimes, FaTrash,FaCheck } from 'react-icons/fa';
import axios from 'axios';
//import './ViewRequest.css'; // Import CSS for styling


const ForwardedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [forwardedRequests, setForwardedRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [logisticUsers, setLogisticUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); //
  const [isSuccess, setIsSuccess] = useState(true);

    // Search parameters state
    const [searchParams, setSearchParams] = useState({
      department: '',
      date: ''
    });
  

  useEffect(() => {
    fetchForwardedRequests();
    fetchLogisticUsers(); // Fetch logistic users on component mount
  }, []);
  const fetchLogisticUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/logistic-users`);
      setLogisticUsers(response.data);
    } catch (error) {
      console.error('Error fetching logistic users:', error);
    }
  };


  const fetchForwardedRequests = async () => {
    try {
     // Get the current tab's ID from sessionStorage
     const currentTab = sessionStorage.getItem('currentTab');

     if (!currentTab) {
       setError('No tab ID found in sessionStorage');
       return;
     }

     // Retrieve the token using the current tab ID
     const token = sessionStorage.getItem(`token_${currentTab}`);
     if (!token) {
       setError('Token not found');
       return;
     } 

      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/forwardedrequests/user-verified`, {
        headers: { Authorization: `Bearer ${token}` } // Send token with request
      });
      setForwardedRequests(response.data);
      setFilteredRequests(response.data)
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error fetching requests');
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleRequestClick = (requestId) => {
    const request = forwardedRequests.find(req => req._id === requestId);
    setSelectedRequest(request);
    setFormData(request);
  };

  //fetching signature
  const [user, setUser] = useState(null);

  useEffect(() => {
   const fetchUserProfile = async () => {
      try {
        // Get the current tab's ID from sessionStorage
        const currentTab = sessionStorage.getItem('currentTab');

        if (!currentTab) {
          setError('No tab ID found in sessionStorage');
          return;
        }

        // Retrieve the token using the current tab ID
        const token = sessionStorage.getItem(`token_${currentTab}`);
        if (!token) {
          setError('Token not found');
          return;
        }

        // Use Axios to fetch user profile
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Invalid token or unable to fetch profile data');
      }
    };

    fetchUserProfile();
  }, []);

//search logic

const handleSearchChange = (e) => {
  const { name, value } = e.target;
  setSearchParams({
    ...searchParams,
    [name]: value
  });
};

const handleSearchSubmit = (e) => {
  e.preventDefault();
  const { department, date } = searchParams;
  const filtered = requests.filter(request => {
    return (!department || request.department.toLowerCase().includes(department.toLowerCase())) &&
           (!date || new Date(request.date).toDateString() === new Date(date).toDateString());
  });
  setFilteredRequests(filtered);
};
if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;


  return (
    <div className={`requist ${selectedRequest ? 'dim-background' : ''}`}>
       
      <div className="verified-request-navigation">
      <h4>Your Requisition for Items Verified</h4>
      <form onSubmit={handleSearchSubmit} className="search-form">
      
        <div className='search-by-date'>
        <label htmlFor="">Search by date</label>
        <input
          type="date"
          name="date"
          placeholder="Search by date"
          value={searchParams.date}
          onChange={handleSearchChange}
        />
        </div>
        
        <button type="submit" className='search-btn'>Search</button>
      </form>
     
      
        <ul className='request-link'>
          {forwardedRequests.slice().reverse().map((request, index) => (
            <li key={index}>
              <p onClick={() => handleRequestClick(request._id)}>
          Requisition Form from department of <b>{request.department}</b> verified  on {new Date(request.updatedAt).toDateString()}
         <label htmlFor=""><FaCheck /> Verified</label>
        </p>
            </li>
          ))}
        </ul>
      </div>
      
      {selectedRequest && (
        <div className="request-details-overlay">
          <div className="request-details">
           
               <div className="form-navigation">
          
             <label className='request-close-btn' onClick={() => setSelectedRequest(null)}><FaTimes /></label>
          </div>
              <div className="image-request-recieved">
          <img src="/image/logo2.png" alt="Logo" className="logo" />
          </div>
          <div className="request-recieved-heading">
            <h4>DISTRIC: NYABIHU</h4>
            <h4>HEALTH FACILITY: SHYIRA DISTRICT HOSPITAL</h4>
            <h4>WESTERN PROVINCE</h4>
            <h4>DEPARTMENT: <span>{selectedRequest.department}</span>  </h4>
           

          </div>

            <h3>REQUISITON FORM</h3>
              
                <table>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Item Name</th>
                      <th>Quantity Requested</th>
                      <th>Quantity Received</th>
                      <th>Observation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRequest.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{item.itemName}</td>
                        <td>{item.quantityRequested}</td>
                        <td>{item.quantityReceived}</td>
                        <td>{item.observation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
 {/* Modal pop message on success or error message */}
 {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            {isSuccess ? (
              <div className="modal-success">
                <FaCheckCircle size={54} color="green" />
                <p>{modalMessage}</p>
              </div>
            ) : (
              <div className="modal-error">
                <FaTimesCircle size={54} color="red" />
                <p>{modalMessage}</p>
              </div>
            )}
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

                <div className="signature-section">
                <div className="hod-signature">
                  <h3 htmlFor="hodName">Name of HOD:</h3>
                  <label htmlFor="">Prepared By:</label>
                     <p >{selectedRequest.hodName}</p>
              
                    {selectedRequest.hodSignature ? (
                      <img src={`${process.env.REACT_APP_BACKEND_URL}/${selectedRequest.hodSignature}`} alt="HOD Signature" />
                    ) : (
                      <p>No HOD signature available</p>
                    )}

                  </div>
                  <div className='logistic-signature'>
                  <h3>Logistic Office:</h3>
                  <label htmlFor="">verified By:</label>
                    {logisticUsers.map(user => (
                      <div key={user._id} className="logistic-user">
                        <p>{user.firstName} {user.lastName}</p>
                        {user.signature ? (
                          <img src={`${process.env.REACT_APP_BACKEND_URL}/${user.signature}`}  />
                        ) : (
                          <p>No signature available</p>
                        )}
                      </div>
                    ))}
                  </div>
                 
                </div>
             
                


       
          </div>
        </div>
      )}

   
    </div>
  );
};

export default ForwardedRequests;
