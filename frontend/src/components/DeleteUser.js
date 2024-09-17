import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const DeleteUser = () => {
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.delete(`http://localhost:8000/users/${userId}`);
      setSuccess(true);
      alert(response.data['message']);
      console.log(response.data['message']);
      console.log(`User with id ${userId} deleted successfully!`);

      // Επαναφορά της φόρμας μετά από 3 δευτερόλεπτα
      setTimeout(() => {
        setSuccess(false);
        setUserId('');
      }, 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setUserId(e.target.value);
  };

  const handleLogout = () => {
    setUser(null); // Clear the user information from the context
    localStorage.removeItem('user'); // Clear the user information from localStorage
    console.log(`user ${user ? user.username : ''} with id: ${user.id} is logged out`);
    navigate('/login');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black'}}>
        <h8 style={{color:'white'}}>Welcome <strong style={{color:'green'}}>{user ? user.username : ''}</strong> to the Recipe Treasure App</h8>
        <h1 style={{ textAlign: 'center', marginTop: '10px', flex: '1' , color: 'white'}}>Delete user</h1>
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <button style={{ margin: '10px', width: '60%', backgroundColor:'blue', color: 'white', marginRight: '80px'}}>Home</button>
        </Link>
        <button onClick={handleLogout} style={{ margin: '10px', width: '5%', backgroundColor:'red'}}>Logout</button>
      </div>
      <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', width: '300px', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', marginBottom: '10px' }}>Enter the user ID you want to delete:</p>
        <input
          type="text"
          value={userId}
          onChange={handleChange}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          placeholder="User ID"
        />
        <button onClick={handleDelete} disabled={isLoading || userId === ''} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '10px 20px', textAlign: 'center', textDecoration: 'none', display: 'inline-block', fontSize: '16px', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s' }}>
          {isLoading ? 'Deleting...' : 'Delete User'}
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '10px' }}>User deleted successfully!</p>}
      </div>
    </div>
  );
};

export default DeleteUser;
