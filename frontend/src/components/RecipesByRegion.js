import React, { useState, useCallback, useRef, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import PlaceOfOriginDropdown from './PlaceOfOriginDropdown';
import { UserContext } from './UserContext';

const RecipesByRegion = () => {
  const { user, setUser } = useContext(UserContext);
  const [selectedPlaceOfOrigin, setSelectedPlaceOfOrigin] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 10;
  const navigate = useNavigate();
  const componentRef = useRef();

  const handlePlaceOfOriginSelect = useCallback((place) => {
    setSelectedPlaceOfOrigin(place);
  }, []);

  const fetchRecipes = useCallback(() => {
    if (selectedPlaceOfOrigin) {
      setLoading(true);
      console.log(`Fetching recipes for region: ${selectedPlaceOfOrigin}`);
      axios.get(`http://localhost:8000/recipes/from_region/${selectedPlaceOfOrigin}`)
        .then(response => {
          console.log('Recipes fetched:', response.data);
          setRecipes(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching recipes:', error);
          setLoading(false);
        });
    }
  }, [selectedPlaceOfOrigin]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    console.log(`user ${user ? user.username : ''} with id: ${user.id} is logged out`);
    navigate('/login');
  };

  const handleRecipeSelect = (recipeId) => {
    setSelectedRecipe(recipeId);
  };

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const nextPage = () => {
    if (currentPage < Math.ceil(recipes.length / recipesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black', padding: '10px' }}>
        <span style={{ color: 'white' }}>Welcome <strong style={{ color: 'green' }}>{user ? user.username : ''}</strong> to the Recipe Treasure App</span>
        <h1 style={{ textAlign: 'center', marginTop: '10px', flex: '1', color: 'white' }}>Recipes by Region</h1>
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <button style={{ margin: '10px', width: '100px', backgroundColor: 'blue', color: 'white' }}>Home</button>
        </Link>
        <button onClick={handleLogout} style={{ margin: '10px', width: '100px', backgroundColor: 'red', color: 'white' }}>Logout</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '20px' }}>
        <div style={{ width: '30%', marginRight: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
          <PlaceOfOriginDropdown onSelectRegion={handlePlaceOfOriginSelect} />
          <button onClick={fetchRecipes} style={{ marginTop: '10px', padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Search</button>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Recipe Name</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecipes.map(recipe => (
                    <tr key={recipe.id} onClick={() => handleRecipeSelect(recipe.id)} style={{ cursor: 'pointer' }}>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{recipe.recipe_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <button onClick={prevPage} disabled={currentPage === 1} style={{ padding: '5px 10px', fontSize: '14px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Previous</button>
                <button onClick={nextPage} disabled={currentPage === Math.ceil(recipes.length / recipesPerPage)} style={{ padding: '5px 10px', fontSize: '14px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Next</button>
              </div>
            </>
          )}
        </div>

        {selectedRecipe !== null && recipes.find(recipe => recipe.id === selectedRecipe) && (
          <div style={{ width: '50%', border: '1px solid #ccc', padding: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9', fontSize: '14px' }}>
            <div ref={componentRef}>
              <h4 style={{ textAlign: 'center', fontSize: '16px' }}>{recipes.find(recipe => recipe.id === selectedRecipe).recipe_name}</h4>
              <p style={{ marginBottom: '10px' }}><strong>Place of Origin:</strong> {recipes.find(recipe => recipe.id === selectedRecipe).place_of_origin}</p>
              <p style={{ marginBottom: '10px' }}><strong>Foodex Code:</strong> {recipes.find(recipe => recipe.id === selectedRecipe).final_Foodex_code}</p>
              <p style={{ marginBottom: '10px' }}><strong>Instructions:</strong> {recipes.find(recipe => recipe.id === selectedRecipe).instructions}</p>
              <p style={{ marginBottom: '10px' }}><strong>NOVA:</strong> {recipes.find(recipe => recipe.id === selectedRecipe).nova_system_category}</p>
              <p style={{ marginBottom: '10px' }}><strong>Mediterranean Diet Category:</strong> {recipes.find(recipe => recipe.id === selectedRecipe).mediterranean_diet_category}</p>
              <p><strong>Description:</strong></p>
              <ul>
                {recipes.find(recipe => recipe.id === selectedRecipe).description.map((desc, index) => (
                  <li key={index}>{desc.user_input}</li>
                ))}
              </ul>
              <p><strong>Analyze facet F26 into Foodex Code of recipe:</strong></p>
              <ul>
                {recipes.find(recipe => recipe.id === selectedRecipe).ingredients
                  .filter(ingredient => ingredient.foodex_Code_for_recipes.includes("F26"))
                  .map((ingredient, index) => (
                    <li key={index}>{ingredient.foodex_Code_for_recipes} = {ingredient.ingredient_name}</li>
                  ))}
              </ul>
              <h4 style={{ textAlign: 'center', fontSize: '18px', marginTop: '20px' }}>Ingredients & Measuring</h4>
              <div style={{ width: '80%', margin: '0 auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'left', backgroundColor: '#4CAF50', color: 'white', fontSize: '14px' }}>Ingredient Name</th>
                      <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'left', backgroundColor: '#4CAF50', color: 'white', fontSize: '14px' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipes.find(recipe => recipe.id === selectedRecipe).recipe_with_facets
                      .filter(facet => facet.amount !== '0')
                      .map((facet, index) => (
                        <tr key={index}>
                          <td style={{ border: '1px solid #ddd', padding: '4px', fontSize: '12px' }}>{facet.name}</td>
                          <td style={{ border: '1px solid #ddd', padding: '4px', fontSize: '12px' }}>{facet.amount}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {selectedRecipe !== null && (
                <div>
                  <br></br>
                  <h4 style={{ textAlign: 'center', fontSize: '18px', marginTop: '20px' }}>Processed Ingredients Info</h4>
                  <div style={{ width: '100%', border: '1px solid #ccc', padding: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9', fontSize: '14px', marginTop: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#4CAF50', color: 'white' }}>Name of processed ingredient</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#4CAF50', color: 'white' }}>Foodex code</th>
                          
                        </tr>
                      </thead>
                      <tbody>
                        {recipes.find(recipe => recipe.id === selectedRecipe)?.processed_ingredients_info?.map((ingredient, index) => (
                          <tr key={index}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ingredient.processed_ingredient_name}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ingredient.final_Foodex_code}</td>
                            
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <ReactToPrint
                trigger={() => <button style={{ padding: '10px 20px', fontSize: '14px', backgroundColor: '#008CBA', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '10%' }}>Print</button>}
                content={() => componentRef.current}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipesByRegion;
