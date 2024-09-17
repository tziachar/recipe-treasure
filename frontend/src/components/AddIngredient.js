import React, { useState, useContext, useRef } from 'react';
import { UserContext } from './UserContext';
import styles from './AddIngredients.module.css';
import TreeComponent from './TreeComponent';
import SearchIngredient from './SearchIngredient';
import data from '../data/final_extracted_data.json';
import { Link, useNavigate } from 'react-router-dom';
import PlaceOfOriginDropdown from './PlaceOfOriginDropdown';

const AddIngredient = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [existingIngredient, setExistingIngredient] = useState(null);
  const [showUpdateDescription, setShowUpdateDescription] = useState(false);

  const [ingredient, setIngredient] = useState({
    ingredient_name: '',
    ingredient_base_term: '',
    ingredient_base_term_name: '',
    ingredient_with_facets: [],
    place_of_origin: '',
    is_POP: false,
    is_PGE: false,
    latin_name: '',
    greek_name: '',
    greek_alter_name: '',
    description: [{ user_input: '' }]
  });

  const dropdownRef = useRef(null); // Create a ref for the dropdown component

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'description') {
        setIngredient({
            ...ingredient,
            description: [{ user_input: value }]
        });
    } else {
        setIngredient({
            ...ingredient,
            [name]: type === 'checkbox' ? checked : value
        });
    }
  };

  const handleFacetChange = (index, e) => {
    const { name, value } = e.target;
    const newFacets = ingredient.ingredient_with_facets.map((facet, i) =>
      i === index ? { ...facet, [name]: value } : facet
    );
    setIngredient({ ...ingredient, ingredient_with_facets: newFacets });
  };

  const addFacet = () => {
    setIngredient({
      ...ingredient,
      ingredient_with_facets: [...ingredient.ingredient_with_facets, { name: '', code: '' }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      console.log('User ID:', user.id); // Log the user ID to ensure it's being retrieved correctly
      try {
        const response = await fetch(`http://localhost:8000/ingredients/?user_id=${user.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(ingredient)
        });

        const data = await response.json();   

        if (!response.ok) {
          alert(data.detail['message'] || 'Failed to update description.'); // Show error message in alert
          setShowUpdateDescription(true);
          setExistingIngredient(data.detail['ingredient_id']);
          alert('Ingredient already exists. You can update the description.');
          throw new Error('Network response was not ok');
        }

        alert('Ingredient added successfully!');
        handleClear(); // Clear the form after successful submission
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
      }
    } else {
      alert('User is not logged in.');
    }
  };

  const handleUpdateDescription = async (e) => {
    e.preventDefault();
    if (user && existingIngredient) {
      try {
        const response = await fetch(`http://localhost:8000/ingredients/${existingIngredient}/description/${ingredient.description[0].user_input}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_input: ingredient.description[0].user_input })
        });
        const data = await response.json();
        if (!response.ok) {
          alert(data.detail || 'Failed to update description.'); // Show error message in alert
          throw new Error('Network response was not ok');
        }
        // Handle successful response
        alert('Description updated successfully!');
        setShowUpdateDescription(false);
        handleClear(); // Clear the form after successful update
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
      }
    } else {
      alert('User is not logged in or no existing ingredient found.');
    }
  };

  const handleClear = () => {
    setIngredient({
      ingredient_name: '',
      ingredient_base_term: '',
      ingredient_base_term_name: '',
      ingredient_with_facets: [],
      place_of_origin: '',
      is_POP: false,
      is_PGE: false,
      latin_name: '',
      greek_name: '',
      greek_alter_name: '',
      description: [{ user_input: '' }]
    });
    dropdownRef.current.resetDropdown(); // Reset the dropdown component
  };

  const handleLogout = () => {
    setUser(null); // Clear the user information from the context
    localStorage.removeItem('user'); // Clear the user information from localStorage
    console.log(`user ${user ? user.username : ''} with id: ${user.id} is logged out`);
    navigate('/login');
  };

  const handleSubmitData = (jsonData) => {
    if (jsonData.length > 0) {
      setIngredient({
        ...ingredient,
        ingredient_base_term: jsonData[0].code,
        ingredient_base_term_name: jsonData[0].name
      });
    }
  };

  const handleSubmitFacet = (facetData) => {
    setIngredient((prevState) => {
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
    setIngredient({
      ...ingredient,
      ingredient_base_term: selectedData.code,
      ingredient_base_term_name: selectedData.name
    });
  };

  const handleSelectRegion = (region) => {
    setIngredient((prevState) => ({
        ...prevState,
        place_of_origin: region
    }));
  };

  const handleCancelFacet = (index) => {
    const newFacets = [...ingredient.ingredient_with_facets];
    newFacets.splice(index, 1);
    setIngredient({ ...ingredient, ingredient_with_facets: newFacets });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black'}}>
        <h8 style={{color:'white'}}>Welcome <strong style={{color:'green'}}>{user ? user.username : ''}</strong> to the Recipe Treasure App</h8>
        <h1 style={{ textAlign: 'center', marginTop: '10px', flex: '1' , color: 'white'}}>Add Ingredient Page</h1>
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <button style={{ margin: '10px', width: '60%', backgroundColor:'blue', color: 'white', marginRight: '80px'}}>Home</button>
        </Link>
        <button onClick={handleLogout} style={{ margin: '10px', width: '5%', backgroundColor:'red'}}>Logout</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SearchIngredient onSelectBaseTerm={handleSelectBaseTerm} />       
      </div>
      <div className={styles.container}>
        <div className={styles.treeContainer}>
          <TreeComponent data={data} onSubmitData={handleSubmitData} onSubmitFacet={handleSubmitFacet} /> {/* Render the tree component */}
        </div>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>Ingredient Name:</label>
              <input type="text" name="ingredient_name" value={ingredient.ingredient_name} onChange={handleChange} required />
            </div>
            <div className={styles.inputGroup}>
              <label>Ingredient Base Term:</label>
              <input type="text" name="ingredient_base_term" value={ingredient.ingredient_base_term} onChange={handleChange} required readOnly />
            </div>
            <div className={styles.inputGroup}>
              <label>Ingredient Base Term Name:</label>
              <input type="text" name="ingredient_base_term_name" value={ingredient.ingredient_base_term_name} onChange={handleChange} required readOnly />
            </div>
            <div className={styles.inputGroup}>
              <br></br>
              <PlaceOfOriginDropdown onSelectRegion={handleSelectRegion} ref={dropdownRef} /> {/* Use the ref here */}
              <br></br>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Is POP:
                <input type="checkbox" name="is_POP" checked={ingredient.is_POP} onChange={handleChange} className={styles.checkbox} />
              </label>
              <label className={styles.label}>
                Is PGE:
                <input type="checkbox" name="is_PGE" checked={ingredient.is_PGE} onChange={handleChange} className={styles.checkbox} />
              </label>
            </div>
            <div>
              
            </div>
            <div className={styles.inputGroup}>
              <label>Latin Name:</label>
              <input type="text" name="latin_name" value={ingredient.latin_name} onChange={handleChange} />
            </div>
            <div className={styles.inputGroup}>
              <label>Greek Name:</label>
              <input type="text" name="greek_name" value={ingredient.greek_name} onChange={handleChange} required />
            </div>
            <div className={styles.inputGroup}>
              <label>Greek Alter Name:</label>
              <input type="text" name="greek_alter_name" value={ingredient.greek_alter_name} onChange={handleChange} required />
            </div>
            <div className={styles.inputGroup}>
              <label>Description:</label>
              <textarea 
                name="description" 
                value={ingredient.description[0].user_input} 
                onChange={handleChange} 
                style={{ height: '50px', width: '100%', resize: 'vertical' }}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Facets:</label>
              {ingredient.ingredient_with_facets.map((facet, index) => (
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
                  <button style={{ margin: '5px', width: '60%', backgroundColor:'red', color: 'white', marginRight: '15px'}} type="button" onClick={() => handleCancelFacet(index)} className={styles.cancelButton}>Remove</button>

                </div>
              ))}
              <button type="button" onClick={addFacet} style={{ margin: '5px', width: '50%', backgroundColor:'green', color: 'white', marginRight: '15px', fontSize: '0.8rem', padding: '5px 10px', borderRadius: '5px'}}>Add Another Facet</button>
            </div>
            <div className={styles.buttonGroup}>
              <button type="submit" style={{ margin: '5px', width: '60%', backgroundColor:'blue', color: 'white', marginRight: '15px'}}>Add Ingredient</button>
              <button type="button" onClick={handleClear} style={{ margin: '5px', width: '30%', backgroundColor:'blue', color: 'white', marginRight: '5px'}}>Clear</button>
            </div>
          </form>
          {showUpdateDescription && (
            <div>
                <h5>Ingredient already exists. Add another description:</h5>
                <form onSubmit={handleUpdateDescription}>
                    <div className={styles.inputGroup}>
                        <label>New Description:</label>
                        <textarea
                            name="description"
                            value={ingredient.description[0].user_input}
                            onChange={handleChange}
                            style={{ height: '50px', width: '100%', resize: 'vertical' }}
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="submit" style={{ margin: '5px', width: '60%', backgroundColor:'blue', color: 'white', marginRight: '15px'}}>Add Description</button>
                    </div>
                </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AddIngredient;
