import React, { useState, useContext, useRef } from 'react';
import { UserContext } from './UserContext';
import styles from './UpdateIngredient.module.css';
import TreeComponent from './TreeComponent';
import SearchIngredient from './SearchIngredient';
import data from '../data/final_extracted_data.json';
import { Link, useNavigate } from 'react-router-dom';
import PlaceOfOriginDropdown from './PlaceOfOriginDropdown';

const UpdateIngredient = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [ingredientId, setIngredientId] = useState('');
  const [ingredientData, setIngredientData] = useState(null);
  const dropdownRef = useRef(null); // Create a ref for the dropdown component

  const fetchIngredientData = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/ingredients/${id}`);
      if (!response.ok) {
        throw new Error('Ingredient not found');
      }
      const data = await response.json();
      setIngredientData(data);
    } catch (error) {
      console.error('Failed to fetch ingredient:', error);
      alert('Failed to fetch ingredient. Please check the ID.');
    }
  };

  const handleIdChange = (e) => {
    setIngredientId(e.target.value);
  };

  const handleSearch = () => {
    fetchIngredientData(ingredientId);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('description')) {
      const index = parseInt(name.split('-')[1], 10);
      const newDescriptions = ingredientData.description.map((desc, i) =>
        i === index ? { user_input: value } : desc
      );
      setIngredientData({
        ...ingredientData,
        description: newDescriptions
      });
    } else {
      setIngredientData({
        ...ingredientData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleFacetChange = (index, e) => {
    const { name, value } = e.target;
    const newFacets = ingredientData.ingredient_with_facets.map((facet, i) =>
      i === index ? { ...facet, [name]: value } : facet
    );
    setIngredientData({ ...ingredientData, ingredient_with_facets: newFacets });
  };

  const addFacet = () => {
    setIngredientData({
      ...ingredientData,
      ingredient_with_facets: [...ingredientData.ingredient_with_facets, { name: '', code: '' }]
    });
  };

  const addDescription = () => {
    setIngredientData({
      ...ingredientData,
      description: [...ingredientData.description, { user_input: '' }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      console.log('User ID:', user.id); // Log the user ID to ensure it's being retrieved correctly
      try {
        const response = await fetch(`http://localhost:8000/ingredients/${ingredientId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(ingredientData)
        });

        if (!response.ok) {
          const data = await response.json();
          alert(data.detail || 'Failed to update ingredient.');
          throw new Error('Network response was not ok');
        }

        alert('Ingredient updated successfully!');
        setIngredientData(null)
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
      }
    } else {
      alert('User is not logged in.');
    }
  };

  const handleClear = () => {
    setIngredientData(null);
    setIngredientId('');
    if (dropdownRef.current) {
      dropdownRef.current.resetDropdown(); // Reset the dropdown component
    }
  };

  const handleLogout = () => {
    setUser(null); // Clear the user information from the context
    localStorage.removeItem('user'); // Clear the user information from localStorage
    console.log(`user ${user ? user.username : ''} with id: ${user.id} is logged out`);
    navigate('/login');
  };

  const handleSubmitData = (jsonData) => {
    if (jsonData.length > 0) {
      setIngredientData({
        ...ingredientData,
        ingredient_base_term: jsonData[0].code,
        ingredient_base_term_name: jsonData[0].name
      });
    }
  };

  const handleSubmitFacet = (facetData) => {
    setIngredientData((prevState) => {
      const newFacets = [...prevState.ingredient_with_facets];
      const lastFacetIndex = newFacets.length - 1;
      newFacets[lastFacetIndex] = {
        name: facetData.name,
        code: facetData.code
      };
      return {
        ...prevState,
        ingredient_with_facets: newFacets
      };
    });
  };

  const handleSelectBaseTerm = (selectedData) => {
    setIngredientData({
      ...ingredientData,
      ingredient_base_term: selectedData.code,
      ingredient_base_term_name: selectedData.name
    });
  };

  const handleSelectRegion = (region) => {
    setIngredientData((prevState) => ({
      ...prevState,
      place_of_origin: region
    }));
  };

  const handleCancelFacet = (index) => {
    const newFacets = [...ingredientData.ingredient_with_facets];
    newFacets.splice(index, 1);
    setIngredientData({ ...ingredientData, ingredient_with_facets: newFacets });
  };

  const handleCancelDescription = (index) => {
    const newDescriptions = [...ingredientData.description];
    newDescriptions.splice(index, 1);
    setIngredientData({ ...ingredientData, description: newDescriptions });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black' }}>
        <h8 style={{ color: 'white' }}>Welcome <strong style={{ color: 'green' }}>{user ? user.username : ''}</strong> to the Recipe Treasure App</h8>
        <h1 style={{ textAlign: 'center', marginTop: '10px', flex: '1', color: 'white' }}>Update Ingredient Page</h1>
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <button style={{ margin: '10px', width: '60%', backgroundColor: 'blue', color: 'white', marginRight: '80px' }}>Home</button>
        </Link>
        <button onClick={handleLogout} style={{ margin: '10px', width: '5%', backgroundColor: 'red' }}>Logout</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SearchIngredient onSelectBaseTerm={handleSelectBaseTerm} />
      </div>
      <div className={styles.container}>
        <div className={styles.treeContainer}>
          <TreeComponent data={data} onSubmitData={handleSubmitData} onSubmitFacet={handleSubmitFacet} />
        </div>
        <div className={styles.formContainer}>
          <div className={styles.inputGroup}>
            <label>Ingredient ID:</label>
            <input type="text" value={ingredientId} onChange={handleIdChange} />
            <button onClick={handleSearch} style={{ margin: '5px', width: '50%', backgroundColor: 'green', color: 'white', marginRight: '15px', fontSize: '0.8rem', padding: '5px 10px', borderRadius: '5px' }}>Search</button>
          </div>
          {ingredientData && (
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label>Ingredient Name:</label>
                <input type="text" name="ingredient_name" value={ingredientData.ingredient_name} onChange={handleChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Ingredient Base Term:</label>
                <input type="text" name="ingredient_base_term" value={ingredientData.ingredient_base_term} onChange={handleChange} required readOnly />
              </div>
              <div className={styles.inputGroup}>
                <label>Ingredient Base Term Name:</label>
                <input type="text" name="ingredient_base_term_name" value={ingredientData.ingredient_base_term_name} onChange={handleChange} required readOnly />
              </div>
              <div className={styles.inputGroup}>
                <br></br>
                <PlaceOfOriginDropdown onSelectRegion={handleSelectRegion} ref={dropdownRef} />
                <br></br>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Is POP:
                  <input type="checkbox" name="is_POP" checked={ingredientData.is_POP} onChange={handleChange} className={styles.checkbox} />
                </label>
                <label className={styles.label}>
                  Is PGE:
                  <input type="checkbox" name="is_PGE" checked={ingredientData.is_PGE} onChange={handleChange} className={styles.checkbox} />
                </label>
              </div>
              <div className={styles.inputGroup}>
                <h3>Description:</h3>
                {ingredientData.description.map((desc, index) => (
                  <div key={index} className={styles.description}>
                    <textarea
                      name={`description-${index}`}
                      value={desc.user_input}
                      onChange={handleChange}
                    />
                    <button type="button" onClick={() => handleCancelDescription(index)} style={{ margin: '5px', backgroundColor: 'red', color: 'white', fontSize: '0.8rem', padding: '5px 10px', borderRadius: '5px' }}>Cancel</button>
                  </div>
                ))}
                <button type="button" onClick={addDescription} style={{ margin: '5px', backgroundColor: 'blue', color: 'white', fontSize: '0.8rem', padding: '5px 10px', borderRadius: '5px' }}>Add Description</button>
              </div>
              <div className={styles.facets}>
                <h3>Facets:</h3>
                {ingredientData.ingredient_with_facets.map((facet, index) => (
                  <div key={index} className={styles.facet}>
                    <div className={styles.inputGroup}>
                      <label>Facet Name:</label>
                      <input type="text" name="name" value={facet.name} onChange={(e) => handleFacetChange(index, e)} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Facet Code:</label>
                      <input type="text" name="code" value={facet.code} onChange={(e) => handleFacetChange(index, e)} />
                    </div>
                    <button type="button" onClick={() => handleCancelFacet(index)} style={{ margin: '5px', backgroundColor: 'red', color: 'white', fontSize: '0.8rem', padding: '5px 10px', borderRadius: '5px' }}>Cancel</button>
                  </div>
                ))}
                <button type="button" onClick={addFacet} style={{ margin: '5px', backgroundColor: 'blue', color: 'white', fontSize: '0.8rem', padding: '5px 10px', borderRadius: '5px' }}>Add Facet</button>
              </div>
              <button type="submit" style={{ margin: '10px', width: '50%', backgroundColor: 'blue', color: 'white', fontSize: '1rem', padding: '10px 20px', borderRadius: '5px' }}>Update Ingredient</button>
            </form>
          )}
          <button onClick={handleClear} style={{ margin: '10px', width: '50%', backgroundColor: 'orange', color: 'white', fontSize: '1rem', padding: '10px 20px', borderRadius: '5px' }}>Clear</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateIngredient;
