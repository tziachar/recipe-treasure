import React, { useState, useContext } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import styles from './AddIngredients.module.css';
import TreeComponent from './TreeComponent';
import data from '../data/final_extracted_data.json';

const AddProcessedIngredient = () => {
  const location = useLocation();
  const { name, code } = location.state || { name: '', code: '' };
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Χρησιμοποιούμε την τιμή του code απευθείας από το location.state
  const [processedIngredient, setProcessedIngredient] = useState({
    processed_ingredient_name: '',
    processed_ingredient_base_term: code,
    processed_ingredient_base_term_name: name,
    processed_ingredient_with_facets: [{ name: '', code: '' }],
    description: [{ user_input: '' }]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'user_input') {
      setProcessedIngredient({
        ...processedIngredient,
        description: [{ user_input: value }]
      });
    } else {
      setProcessedIngredient({
        ...processedIngredient,
        [name]: value
      });
    }
  };

  const handleFacetChange = (index, e) => {
    const { name, value } = e.target;
    const newFacets = processedIngredient.processed_ingredient_with_facets.map((facet, i) =>
      i === index ? { ...facet, [name]: value } : facet
    );
    setProcessedIngredient({ ...processedIngredient, processed_ingredient_with_facets: newFacets });
  };

  const addFacet = () => {
    setProcessedIngredient({
      ...processedIngredient,
      processed_ingredient_with_facets: [...processedIngredient.processed_ingredient_with_facets, { name: '', code: '' }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      console.log('User ID:', user.id); // Log the user ID to ensure it's being retrieved correctly
      try {
        const response = await fetch(`http://localhost:8000/processed_ingredients/?user_id=${user.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(processedIngredient)
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.detail['message'] || 'Failed to add processed ingredient.'); // Show error message in alert
          throw new Error('Network response was not ok');
        }

        alert('Processed Ingredient added successfully!');
        console.log(data); // Show the response data
        handleClear(); // Clear the form after successful submission

        // Navigate back to AddRecipe with the added ingredient
        navigate('/add-recipe', { state: { addedIngredient: data } });

      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
      }
    } else {
      alert('User is not logged in.');
    }
  };

  const handleClear = () => {
    setProcessedIngredient({
      processed_ingredient_name: '',
      processed_ingredient_base_term: code,
      processed_ingredient_base_term_name: name,
      processed_ingredient_with_facets: [{ name: '', code: '' }],
      description: [{ user_input: '' }]
    });
  };

  const handleLogout = () => {
    setUser(null); // Clear the user information from the context
    localStorage.removeItem('user'); // Clear the user information from localStorage
    console.log(`user ${user ? user.username : ''} with id: ${user.id} is logged out`);
    navigate('/login');
  };

  const handleSubmitData = (jsonData) => {
    if (jsonData.length > 0) {
      setProcessedIngredient({
        ...processedIngredient,
        processed_ingredient_base_term: jsonData[0].code,
        processed_ingredient_base_term_name: jsonData[0].name
      });
    }
  };

  const handleSubmitFacet = (facetData) => {
    setProcessedIngredient((prevState) => {
      const newFacets = [...prevState.processed_ingredient_with_facets];
      const lastFacetIndex = newFacets.length - 1;
      newFacets[lastFacetIndex] = {
        name: facetData.name,
        code: facetData.code
      };
      return {
        ...prevState,
        processed_ingredient_with_facets: newFacets
      };
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black' }}>
        <h8 style={{ color: 'white' }}>Welcome <strong style={{ color: 'green' }}>{user ? user.username : ''}</strong> to the Recipe Treasure App</h8>
        <h1 style={{ textAlign: 'center', marginTop: '10px', flex: '1', color: 'white' }}>Add Processed Ingredient Page</h1>
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <button style={{ margin: '10px', width: '60%', backgroundColor: 'blue', color: 'white', marginRight: '80px' }}>Home</button>
        </Link>
        <button onClick={handleLogout} style={{ margin: '10px', width: '5%', backgroundColor: 'red' }}>Logout</button>
      </div>
      <div className={styles.container}>
        <div className={styles.treeContainer}>
          <TreeComponent data={data} onSubmitData={handleSubmitData} onSubmitFacet={handleSubmitFacet} /> {/* Render the tree component */}
        </div>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>Processed Name:</label>
              <input type="text" name="processed_ingredient_name" value={processedIngredient.processed_ingredient_name} onChange={handleChange} required />
            </div>
            <div className={styles.inputGroup}>
              <label>Processed Base Term:</label>
              <input type="text" name="processed_ingredient_base_term" value={processedIngredient.processed_ingredient_base_term} onChange={handleChange} required readOnly />
            </div>
            <div className={styles.inputGroup}>
              <label>Processed Base Term Name:</label>
              <input type="text" name="processed_ingredient_base_term_name" value={processedIngredient.processed_ingredient_base_term_name} onChange={handleChange} required readOnly />
            </div>
            
            <div className={styles.inputGroup}>
              <label>Process Description:</label>
              <textarea
                name="user_input"
                value={processedIngredient.description[0].user_input}
                onChange={handleChange}
                style={{ height: '50px', width: '100%', resize: 'vertical' }}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Facets:</label>
              {processedIngredient.processed_ingredient_with_facets.map((facet, index) => (
                <div key={index} className={styles.facetGroup}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Facet Name"
                    value={facet.name}
                    onChange={(e) => handleFacetChange(index, e)}
                    required readOnly
                  />
                  <input
                    type="text"
                    name="code"
                    placeholder="Facet Code"
                    value={facet.code}
                    onChange={(e) => handleFacetChange(index, e)}
                    required readOnly
                  />
                </div>
              ))}
              <button type="button" onClick={addFacet} style={{ margin: '5px', width: '50%', backgroundColor: 'green', color: 'white', marginRight: '15px', fontSize: '0.8rem', padding: '5px 10px', borderRadius: '5px' }}>Add Another Facet</button>
            </div>
            <div className={styles.buttonGroup}>
              <button type="submit" style={{ margin: '5px', width: '60%', backgroundColor: 'blue', color: 'white', marginRight: '15px' }}>Add Processed Ingredient</button>
              <button type="button" onClick={handleClear} style={{ margin: '5px', width: '30%', backgroundColor: 'blue', color: 'white', marginRight: '5px' }}>Clear</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProcessedIngredient;
