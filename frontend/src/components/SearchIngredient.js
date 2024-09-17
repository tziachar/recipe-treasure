import React, { useState } from 'react';
import axios from 'axios';
import styles from './SearchIngredient.module.css'; // Import CSS module

const SearchIngredient = ({ onSelectBaseTerm }) => {
  const [data, setData] = useState([]);
  const [param, setParam] = useState(''); // State for the dynamic parameter
  const [selectedData, setSelectedData] = useState(null); // State for the selected data

  const fetchData = async () => {
    try {
      // Make a GET request to the API endpoint with the dynamic parameter
      const response = await axios.get(`http://localhost:8000/search_terms/${param}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = () => {
    if (param !== '') {
      fetchData();
    }
  };

  const handleSelectData = (item) => {
    setSelectedData(item);
    setData([]); // Clear the search results
    setParam(''); // Clear the search field
  };

  const handleClear = () => {
    setData([]); // Clear the search results
    setParam(''); // Clear the search field
    setSelectedData(null); // Clear the selected data
  };

  const handleSelectBaseTerm = () => {
    if (selectedData) {
      const [code, extendedName] = selectedData.split(': ');
      onSelectBaseTerm({ code: code, name: extendedName });
    }
    setSelectedData(null);
  };

  return (
    <div className={styles.container}>
      <br></br><br></br>
      <h5><strong>Ingredient search machine</strong></h5>
      <input
        type="text"
        value={param}
        onChange={(event) => setParam(event.target.value)} // Update the param state when input changes
        placeholder="Enter ingredient"
        className={styles.inputField} // Apply the inputField style
      />
      <button
        onClick={handleSearch}
        className={styles.searchButton}
      >
        Search
      </button>
      {/* Render the fetched data */}
      {data.length > 0 && (
        <div>
          <ul>
            {data.map((item, index) => (
              <li
                key={index}
                className={styles.listItem}
                onClick={() => handleSelectData(item)}
              >
                {JSON.stringify(item)}
              </li>
            ))}
          </ul>
          <button onClick={handleClear} className={styles.clearButton}>Clear</button>
        </div>
      )}
      {selectedData && (
        <div>
          <br></br><br></br>
          <h5><strong>Selected Data:</strong></h5>
          <pre>
            Code Term: {selectedData.split(': ')[0]} <br />
            Extended Name: {selectedData.split(': ')[1]}
          </pre>
          <button onClick={handleSelectBaseTerm} className={styles.selectButton}>
            Select Base Term
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchIngredient;
