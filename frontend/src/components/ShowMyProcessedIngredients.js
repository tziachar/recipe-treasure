import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import { Link, useNavigate } from 'react-router-dom';

const ShowMyProcessedIngredients = () => {
  const { user, setUser } = useContext(UserContext);
  const [processedIngredients, setProcessedIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setLoading(true);
      axios.get(`http://localhost:8000/processed_ingredients/${user.id}`)
        .then(response => {
          setProcessedIngredients(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching processed ingredients:', error);
          setLoading(false);
        });
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black', padding: '10px' }}>
        <span style={{ color: 'white' }}>Welcome <strong style={{ color: 'green' }}>{user ? user.username : ''}</strong> to the Recipe Treasure App</span>
        <h1 style={{ textAlign: 'center', marginTop: '10px', flex: '1', color: 'white' }}>My Processed Ingredients</h1>
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <button style={{ margin: '10px', width: '100px', backgroundColor: 'blue', color: 'white' }}>Home</button>
        </Link>
        <button onClick={handleLogout} style={{ margin: '10px', width: '100px', backgroundColor: 'red', color: 'white' }}>Logout</button>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>Loading...</div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>Processed ID</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>Processed Ingredient Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>Processed Foodex Code</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>Processed Base Term</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>Processed Base Term Name</th>
                
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>Processed Facets</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>Processed Description</th>
                
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>Processed Final Foodex Code</th>
              </tr>
            </thead>
            <tbody>
              {processedIngredients.map((processedIngredient, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f2f2f2' }}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{processedIngredient.id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{processedIngredient.processed_ingredient_name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{processedIngredient.final_Foodex_code}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{processedIngredient.processed_ingredient_base_term}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{processedIngredient.processed_ingredient_base_term_name}</td>
                  
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {processedIngredient.processed_ingredient_with_facets.map((facet, index) => (
                      <div key={index}>
                        <strong>{facet.name}</strong> ({facet.code})
                      </div>
                    ))}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {processedIngredient.description.map((desc, index) => (
                      <div key={index}>{desc.user_input}</div>
                    ))}
                  </td>
                  
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{processedIngredient.final_Foodex_code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShowMyProcessedIngredients;
