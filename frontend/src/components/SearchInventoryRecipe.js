import React, { useState } from 'react';
import axios from 'axios';

const SearchInventoryRecipe = ({ onSearch }) => {
  const [searchItem, setSearchItem] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:8000/search_recipe/', {
        params: { search_item: searchItem }
      });
      onSearch(response.data);
    } catch (error) {
      onSearch([], 'Failed to fetch data');
    }
  };

  return (
    <div>
      <h2>Search Recipes</h2>
      <div>
        <input
          type="text"
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
          placeholder="Enter search term"
          style={{ padding: '10px', fontSize: '16px', marginRight: '10px' }}
        />
        <button onClick={handleSearch} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
          Find
        </button>
      </div>
    </div>
  );
};

export default SearchInventoryRecipe;
