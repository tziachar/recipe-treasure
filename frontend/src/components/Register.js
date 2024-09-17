import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    try {
      await axios.post('http://localhost:8000/users/', {
        username,
        email,
        password,
      });
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        setErrorMessage(error.response.data.detail);
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    }
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Register</button>
        </form>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        <br></br>
        <button onClick={() => navigate('/login')} className={styles.loginButton}>
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default Register;
