import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './components/HomePage';
import AddIngredient from './components/AddIngredient';
import AddRecipe from './components/AddRecipe';
import AddProcessedIngredient from './components/AddProcessedIngredient';
import ShowMyRecipes from './components/ShowMyRecipes';
import DeleteUser from './components/DeleteUser';
import DeleteRecipe from './components/DeleteRecipe';
import DeleteIngredient from './components/DeleteIngredient';
import DeleteProcessedIngredient from './components/DeleteProcessedIngredient';
import UpdateIngredient from './components/UpdateIngredient';
import RecipesByRegion from './components/RecipesByRegion';
import ShowMyIngredients from './components/ShowMyIngredients';
import ShowMyProcessedIngredients from './components/ShowMyProcessedIngredients';
import RecipesByName from './components/RecipesByName';
import ShowUsers from './components/ShowUsers';

const App = () => { 
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/add-ingredient" element={<AddIngredient />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/add-processed-ingredient" element={<AddProcessedIngredient />} />
          <Route path="/my-recipes" element={<ShowMyRecipes />} />
          <Route path="/delete-user" element={<DeleteUser />} />
          <Route path="/delete-ingredient" element={<DeleteIngredient />} />
          <Route path="/delete-recipe" element={<DeleteRecipe />} />
          <Route path="/delete-processed-ingredient" element={<DeleteProcessedIngredient />} />
          <Route path="/update-ingredient" element={<UpdateIngredient />} />
          <Route path="/recipes-per-region" element={<RecipesByRegion />} />
          <Route path="/my-ingredients" element={<ShowMyIngredients />} />
          <Route path="/my-processed-ingredients" element={<ShowMyProcessedIngredients />} />
          <Route path="/recipes-per-name" element={<RecipesByName />} />
          <Route path="/users/" element={<ShowUsers />} />
          
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
