import React, { useState, useContext, useEffect, useRef } from 'react';
import { UserContext } from './UserContext';
import styles from './AddRecipe.module.css';
import TreeComponent from './TreeComponent';
import SearchIngredient from './SearchIngredient';
import SearchIngredient2 from './SearchIngredient2';
import SearchInventory from './SearchInventory';
import SearchInventoryPI from './SearchInventoryPI';
import data from '../data/final_extracted_data.json';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PlaceOfOriginDropdown from  './PlaceOfOriginDropdown';
import MediterraneanDietCategoryDropdown from './MediterraneanDietCategoryDropdown';
import NumberingOfTheNOVASystemDropdown from './NumberingOfTheNOVASystemDropdown';


const AddRecipe = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(UserContext);
  const [existingRecipe, setExistingRecipe] = useState(null);
  const [showUpdateDescription, setShowUpdateDescription] = useState(false);

  const [recipe, setRecipe] = useState(() => {
    const savedRecipe = sessionStorage.getItem('recipe');
    return savedRecipe ? JSON.parse(savedRecipe) : {
      recipe_name: '',
      recipe_base_term: '',
      recipe_base_term_name: '',
      recipe_with_facets: [],
      place_of_origin: '',
      is_POP: false,
      is_PGE: false,
      mediterranean_diet_category: '',
      nova_system_category: '',
      latin_name: '',
      greek_name: '',
      greek_alter_name: '',
      instructions: '',
      description: [{ user_input: '' }],
      processed_ingredients_info: [],
      ingredientFinalFoodexCodes: ['']
    };
  });

  const dropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const novaSystemDropdownRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.addedIngredient) {
      const { processed_ingredient_name, final_Foodex_code } = location.state.addedIngredient;
  
      if (processed_ingredient_name.trim() !== '') {
        const newProcessedIngredient = {
          processed_ingredient_name: processed_ingredient_name,
          // amount: '',
          final_Foodex_code: final_Foodex_code
        };
  
        setRecipe((prevState) => ({
          ...prevState,
          processed_ingredients_info: [...prevState.processed_ingredients_info, newProcessedIngredient]
        }));
      }
    }
  }, [location.state]);
  

  useEffect(() => {
    sessionStorage.setItem('recipe', JSON.stringify(recipe));
  }, [recipe]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'description') {
      setRecipe({
        ...recipe,
        description: [{ user_input: value }]
      });
    } else {
      setRecipe({
        ...recipe,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleFacetChange = (index, e) => {
    const { name, value } = e.target;
    const newFacets = recipe.recipe_with_facets.map((facet, i) =>
      i === index ? { ...facet, [name]: value } : facet
    );
    setRecipe({ ...recipe, recipe_with_facets: newFacets });
  };

  const addFacet = () => {
    setRecipe({
      ...recipe,
      recipe_with_facets: [...recipe.recipe_with_facets, { name: '', code: '', amount: '' }],
      ingredientFinalFoodexCodes: [
        ...recipe.ingredientFinalFoodexCodes,
        "",
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      console.log('User ID:', user.id); // Log the user ID to ensure it's being retrieved correctly

      const updatedFacets = recipe.recipe_with_facets.map(facet => ({
        ...facet,
        amount: isValidFacetCode(facet.code) ? facet.amount : '0' // Έλεγχος του κωδικού του facet για το amount
      }));
      
      // Δημιουργία νέου αντικειμένου recipe με τα ενημερωμένα facets
      const updatedRecipe = {
        ...recipe,
        recipe_with_facets: updatedFacets
      };
      
      try { 
        const response = await fetch(`http://localhost:8000/recipes/?user_id=${user.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedRecipe)
        });

        const data = await response.json();   

        if (!response.ok) {
          alert(data.detail['message'] || 'Failed to add recipe.'); // Show error message in alert
          setShowUpdateDescription(true);
          setExistingRecipe(data.detail['recipe_id']);
          alert('Recipe already exists. You can update the description.');
          throw new Error('Network response was not ok');
        }

        alert('Recipe added successfully!');
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
    if (user && existingRecipe) {
      try {
        const response = await fetch(`http://localhost:8000/recipes/${existingRecipe}/description/${recipe.description[0].user_input}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_input: recipe.description[0].user_input })
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
      alert('User is not logged in or no existing recipe found.');
    }
  };

  const handleClear = () => {
    setRecipe({
      recipe_name: '',
      recipe_base_term: '',
      recipe_base_term_name: '',
      recipe_with_facets: [],
      place_of_origin: '',
      is_POP: false,
      is_PGE: false,
      mediterranean_diet_category: '',
      nova_system_category: '',
      latin_name: '',
      greek_name: '',
      greek_alter_name: '',
      instructions: '',
      description: [{ user_input: '' }],
      processed_ingredients_info: [],
      ingredientFinalFoodexCodes: ['']  
    });
    dropdownRef.current.resetDropdown();
    sessionStorage.removeItem('recipe');
  };

  const handleLogout = () => {
    setUser(null); // Clear the user information from the context
    localStorage.removeItem('user'); // Clear the user information from localStorage
    console.log(`user ${user ? user.username : ''} with id: ${user.id} is logged out`);
    handleClear();
    navigate('/login');
  };

  const handleSubmitData = (jsonData) => {
    if (jsonData.length > 0) {
      setRecipe({
        ...recipe,
        recipe_base_term: jsonData[0].code,
        recipe_base_term_name: jsonData[0].name
      });
    }
  };

  const handleSubmitFacet = (facetData) => {
    setRecipe((prevState) => {
      const newFacets = [...prevState.recipe_with_facets];
      const lastFacetIndex = newFacets.length - 1;
      newFacets[lastFacetIndex] = {
        name: facetData.name,
        code: facetData.code,
        
      };
      return {
        ...prevState,
        recipe_with_facets: newFacets
      };
    });
  };

  const handleSelectBaseTerm = (selectedData) => {
    setRecipe({
      ...recipe,
      recipe_base_term: selectedData.code,
      recipe_base_term_name: selectedData.name
    });
  };

  const handleSelectFacet = (name, code, ingredientFinalFoodexCode) => {
   
    const openFieldsIndex = recipe.recipe_with_facets.findIndex(facet => facet.name === '' && facet.code === '');
  
    if (openFieldsIndex !== -1) {
      
      const newFacets = [...recipe.recipe_with_facets];
      newFacets[openFieldsIndex] = {
        name: name,
        code: code
      };

      const newFoodexCodes = [...recipe.ingredientFinalFoodexCodes];
      newFoodexCodes[openFieldsIndex] = ingredientFinalFoodexCode;
  
      setRecipe({
        ...recipe,
        recipe_with_facets: newFacets,
        ingredientFinalFoodexCodes: newFoodexCodes,
      });
    }
  };

  const isValidProcessedIngredientCode = (baseTermCode) => {
    const facetCodes = recipe.recipe_with_facets.map((facet) => facet.code);
    return facetCodes.some((facetCode) => facetCode.includes(baseTermCode) || baseTermCode.includes(facetCode));
  };

  const handleSelectProcessedIngredient = (name, foodexCode) => {
    const baseTermCode = foodexCode.split('#')[0].split('.');
    if (isValidProcessedIngredientCode(baseTermCode)) {
      const newProcessedIngredient = {
        processed_ingredient_name: name,
        // amount: '',
        final_Foodex_code: foodexCode
      };

      setRecipe((prevState) => ({
        ...prevState,
        processed_ingredients_info: [...prevState.processed_ingredients_info, newProcessedIngredient]
      }));
    } else {
      alert(`The processed ingredient code ${foodexCode} is not valid based on the current facets.`);
    }
  };

  const handleProcessClick = (name, code, index) => {
    const finalFoodexCode = recipe.ingredientFinalFoodexCodes[index];
    const extractedCode = finalFoodexCode || (code.includes('.') ? code.split('.')[1] : code);
  
    navigate('/add-processed-ingredient', { state: { name, code: extractedCode } });
  };

  const isValidFacetCode = (code) => {
    return (!code.startsWith('F28') && !code.startsWith('F23') && !code.startsWith('F22')) || !code.includes('.');
  };

  // const handleAmountChange = (e, index) => {
  //   const { value } = e.target;
  //   setRecipe(prevState => {
  //     const updatedIngredients = [...prevState.processed_ingredients_info];
  //     updatedIngredients[index] = {
  //       ...updatedIngredients[index],
  //       amount: value
  //     };
  //     return {
  //       ...prevState,
  //       processed_ingredients_info: updatedIngredients
  //     };
  //   });
  // };

  const handleCancelFacet = (facetIndex) => {
    setRecipe((prevState) => {
      const newFacets = [...prevState.recipe_with_facets];
      newFacets.splice(facetIndex, 1);

      const newFoodexCodes = [...prevState.ingredientFinalFoodexCodes];
      newFoodexCodes.splice(facetIndex, 1); // Remove the corresponding foodex code

      return {
        ...prevState,
        recipe_with_facets: newFacets,
        ingredientFinalFoodexCodes: newFoodexCodes
      };
    });
  };

  const handleRemoveIngredient = (index) => {
    setRecipe(prevState => {
      const updatedIngredients = [...prevState.processed_ingredients_info];
      updatedIngredients.splice(index, 1);
      return {
        ...prevState,
        processed_ingredients_info: updatedIngredients
      };
    });
  };

  const handleSelectRegion = (region) => {
    setRecipe((prevRecipe) => ({
        ...prevRecipe,
        place_of_origin: region
    }));
  };

  const handleSelectCategory = (category) => {
    setRecipe({ ...recipe, mediterranean_diet_category: category });
  };

  const handleSelectNovaSystem = (system) => {
    setRecipe({ ...recipe, nova_system_category: system });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black'}}>
        <h8 style={{color:'white'}}>Welcome <strong style={{color:'green'}}>{user ? user.username : ''}</strong> to the Recipe Treasure App</h8>
        <h1 style={{ textAlign: 'center', marginTop: '10px', flex: '1' , color: 'white'}}>Add Recipe Page</h1>
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <button style={{ margin: '10px', width: '60%', backgroundColor:'blue', color: 'white', marginRight: '80px'}} onClick={handleClear}>Home</button>
        </Link>
        <button onClick={handleLogout} style={{ margin: '10px', width: '5%', backgroundColor:'red'}}>Logout</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <SearchIngredient onSelectBaseTerm={handleSelectBaseTerm} />    
      
    </div>
    <div>
      <SearchIngredient2 onSelectBaseTerm={handleSelectBaseTerm} />   
    </div>
    <div className={styles.container}>
      <div className={styles.treeContainer}>
        <TreeComponent data={data} onSubmitData={handleSubmitData} onSubmitFacet={handleSubmitFacet} /> {/* Render the tree component */}
      </div>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Recipe Name:</label>
            <input type="text" name="recipe_name" value={recipe.recipe_name} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label>Recipe Base Term:</label>
            <input type="text" name="recipe_base_term" value={recipe.recipe_base_term} onChange={handleChange} title="This field is filled in automatically." required readOnly />
          </div>
          <div className={styles.inputGroup}>
            <label>Recipe Base Term Name:</label>
            <input type="text" name="recipe_base_term_name" value={recipe.recipe_base_term_name} onChange={handleChange} title="This field is filled in automatically." required readOnly />
          </div>
          <div className={styles.inputGroup}>
            <br></br>
            <PlaceOfOriginDropdown onSelectRegion={handleSelectRegion} ref={dropdownRef} />
            <br></br>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Is POP:
              <input type="checkbox" name="is_POP" checked={recipe.is_POP} onChange={handleChange} className={styles.checkbox} />
            </label>
            <label className={styles.label}>
              Is PGE:
              <input type="checkbox" name="is_PGE" checked={recipe.is_PGE} onChange={handleChange} className={styles.checkbox} />
            </label>
          </div>
          <div className={styles.inputGroup}>
            <br></br>
            <MediterraneanDietCategoryDropdown
              ref={categoryDropdownRef}
              onSelectCategory={handleSelectCategory}
            />
            <br></br>
          </div>
          <div className={styles.inputGroup}>
            <br></br>
            <NumberingOfTheNOVASystemDropdown
              ref={novaSystemDropdownRef}
              onSelectSystem={handleSelectNovaSystem}
            />
            <br></br>
          </div>
          <div className={styles.inputGroup}>
            <label>Latin Name:</label>
            <input type="text" name="latin_name" value={recipe.latin_name} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Greek Name:</label>
            <input type="text" name="greek_name" value={recipe.greek_name} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label>Greek Alter Name:</label>
            <input type="text" name="greek_alter_name" value={recipe.greek_alter_name} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label>Instructions:</label>
            <textarea
              style={{ height: '200px', width: '100%', resize: 'vertical' }}
              name="instructions"
              value={recipe.instructions}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Description:</label>
            <textarea 
              name="description" 
              value={recipe.description[0].user_input} 
              onChange={handleChange} 
              style={{ height: '50px', width: '100%', resize: 'vertical' }} // Αλλαγή στιλ του textarea
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Facets:&emsp;</label>
            {recipe.recipe_with_facets.map((facet, index) => (
              <div key={index} className={styles.facetGroup}>
                <input
                  type="text"
                  name="name"
                  placeholder="Facet Name"
                  value={facet.name}
                  onChange={(e) => handleFacetChange(index, e)}
                  title="This field is filled in automatically."
                  required readOnly
                />
                <input
                  type="text"
                  name="code"
                  placeholder="Facet Code"
                  value={facet.code}
                  onChange={(e) => handleFacetChange(index, e)}
                  title="This field is filled in automatically."
                  required readOnly
                />
                {!isValidFacetCode(facet.code) && (
                <input
                  type="text"
                  name="amount"
                  placeholder="Amount"
                  value={facet.amount}
                  onChange={(e) => handleFacetChange(index, e)}
                  hidden
                  
                />
                )}
                {isValidFacetCode(facet.code) && (
                <input
                  type="text"
                  name="amount"
                  placeholder="Amount"
                  value={facet.amount}
                  onChange={(e) => handleFacetChange(index, e)}
                  required
                  
                />
                )}
                <input
                  type="text"
                  placeholder="Foodex Final"
                  value={recipe.ingredientFinalFoodexCodes[index] || ""}
                  title="This field is filled in automatically."
                  readOnly
                />
                <button  type="button" onClick={() => handleCancelFacet(index)} className={styles.cancelButton}>Remove</button>
                {isValidFacetCode(facet.code) && (
                  <button style={{ margin: '10px', width: '100%', backgroundColor:'green', color: 'white', marginRight: '15px'}} onClick={() => handleProcessClick(facet.name, facet.code, index)}>Go to process</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addFacet} style={{ margin: '5px', width: '60%', backgroundColor:'green', color: 'white', marginRight: '15px', fontSize: '0.8rem', padding: '5px 10px', borderRadius: '5px'}}>Add Another Facet</button>
          </div>

          <div>
          <label>Processed Ingredients:</label>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '14px' }}>
            <thead style={{ backgroundColor: '#f2f2f2' }}>
              <tr>
                <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
                {/* <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Amount</th> */}
                <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Foodex Code</th>
              </tr>
            </thead>
            <tbody>
              {recipe.processed_ingredients_info.map((ingredient, index) => (
                <tr key={index}>
                  <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{ingredient['processed_ingredient_name']}</td>
                  {/* <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                    <input
                      type="text"
                      value={ingredient['amount']}
                      onChange={(e) => handleAmountChange(e, index)}
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                  </td> */}
                  <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{ingredient['final_Foodex_code']}</td>
                  <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                    <button
                      style={{
                        backgroundColor: '#ff4c4c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        lineHeight: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
          <div className={styles.buttonGroup}>
            <button type="submit" style={{ margin: '5px', width: '60%', backgroundColor:'blue', color: 'white', marginRight: '15px'}}>Add Recipe</button>
            <button type="button" onClick={handleClear} style={{ margin: '5px', width: '30%', backgroundColor:'blue', color: 'white', marginRight: '5px'}}>Clear</button>
          </div>
        </form>
        {showUpdateDescription && (
          <div>
              <h5>Recipe already exists. Add another description:</h5>
              <form onSubmit={handleUpdateDescription}>
                  <div className={styles.inputGroup}>
                      <label>New Description:</label>
                      <textarea
                          name="description"
                          value={recipe.description[0].user_input}
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
      <div>
        <h5><strong>Search into inventory for an ingredient</strong></h5>
        <SearchInventory onSelectFacet={handleSelectFacet} />
        <br></br><br></br>
        <h5><strong>Search into inventory for a processed ingredient</strong></h5>
        <SearchInventoryPI onSelectFacet={handleSelectProcessedIngredient} />
      </div>
    </div>
  </div>
);
};

export default AddRecipe;
