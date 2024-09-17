import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import styles from './AuthForm.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login', null, {
        params: { username, password },
      });
      const { user_id, is_admin } = response.data;
      setUser({ username, id: user_id, isAdmin: is_admin });
      navigate('/home');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('Invalid username or password. Please try again. Or register');
      } else {
        setErrorMessage('An error occurred during login.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2>Login</h2>
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
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        <button onClick={() => navigate('/register')} className={styles.registerButton}>
          Go to Register
        </button>
        <h10>If you do not have an account, please register</h10>
      </div>
    </div>
  );
};

export default Login;
