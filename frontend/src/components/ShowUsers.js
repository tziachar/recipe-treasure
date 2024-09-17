import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import { useContext } from 'react';
import { UserContext } from './UserContext';


const ShowUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/users/');
        setUsers(response.data);
      } catch (error) {
        setError('Error fetching users.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null); // Clear the user information from the context
    localStorage.removeItem('user'); // Clear the user information from localStorage
    console.log(`user ${user ? user.username : ''} with id: ${user.id} is logged out`);
    navigate('/login');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black', padding: '10px' }}>
      <h8 style={{color:'white'}}>Welcome <strong style={{color:'green'}}>{user ? user.username : ''}</strong> to the Recipe Treasure App</h8>
        <h1 style={{ textAlign: 'center', marginTop: '10px', flex: '1', color: 'white' }}>Users</h1>
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <button style={{ margin: '10px', width: '60%', backgroundColor:'blue', color: 'white', marginRight: '80px'}}>Home</button>
        </Link>
        <button onClick={handleLogout} style={{ margin: '10px', width: '5%', backgroundColor: 'red' }}>Logout</button>
      </div>
      <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', width: '400px', margin: '20px auto' }}>
        {isLoading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>Error fetching users.</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            {users.map(user => (
              <li key={user.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                {user.id} - <strong>{user.username}</strong> - {user.email}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ShowUsers;
