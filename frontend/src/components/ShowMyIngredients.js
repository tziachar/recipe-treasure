import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import { Link, useNavigate } from 'react-router-dom';

const ShowMyIngredients = () => {
  const { user, setUser } = useContext(UserContext);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setLoading(true);
      axios.get(`http://localhost:8000/ingredients/user/${user.id}`)
        .then(response => {
          setIngredients(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching ingredients:', error);
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
        <h1 style={{ textAlign: 'center', marginTop: '10px', flex: '1', color: 'white' }}>My Ingredients</h1>
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
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>ID</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>Ingredient Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>Foodex Code</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>Base Term</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>Base Term Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>Place of Origin</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>Facets</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>POP</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>PGE</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>Latin Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>Greek Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>Alternative Greek Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>Description</th>
                
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>Final Foodex Code</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', color: 'black' }}>Foodex Code for Recipes</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ingredient, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f2f2f2' }}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ingredient.id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ingredient.ingredient_name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ingredient.final_Foodex_code}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ingredient.ingredient_base_term}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ingredient.ingredient_base_term_name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ingredient.place_of_origin}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {ingredient.ingredient_with_facets.map((facet, index) => (
                      <div key={index}>
                        <strong>{facet.name}</strong> ({facet.code})
                      </div>
                    ))}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ingredient.is_POP ? 'Yes' : 'No'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ingredient.is_PGE ? 'Yes' : 'No'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ingredient.latin_name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ingredient.greek_name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ingredient.greek_alter_name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {ingredient.description.map((desc, index) => (
                      <div key={index}>{desc.user_input}</div>
                    ))}
                  </td>
                  
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ingredient.final_Foodex_code}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ingredient.foodex_Code_for_recipes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShowMyIngredients;
