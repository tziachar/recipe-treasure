import React, { useState } from 'react';
import axios from 'axios';

const SearchInventoryPI = ({ onSelectFacet }) => {
    const [searchItem, setSearchItem] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:8000/search_processed_ingredient/', {
                params: { search_item: searchItem }
            });
            setResults(response.data);
            setError(null);
        } catch (error) {
            setError('Failed to fetch data');
            setResults([]);
        }
    };

    const handleSelectProcessedIngredient = (processed_ingredientName, processed_ingredientCode) => {
        onSelectFacet(processed_ingredientName, processed_ingredientCode);
        setResults([]); // Clear the results
        setSearchItem('')
    };

    const handleClear = () => {
        setResults([]);
        setSearchItem('');
        setError(null);
    };

    return (
        <div className="container">
            <input
                type="text"
                className="inputField"
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                placeholder="Search Processed ingredient"
            />
            <button style={{ margin: '5px', width: '50%', backgroundColor:'green', color: 'white', marginRight: '15px', fontSize: '0.8rem', padding: '5px 10px', borderRadius: '5px'}} className="searchButton" onClick={handleSearch}>Find</button>
            

            {error && <div style={{ color: 'red' }}>{error}</div>}

            {results.length > 0 && (
                <div>
                    <h4>Search Results:</h4>
                    <ul>
                        {results.map((result, index) => (
                            <li key={index} className="listItem">
                                <p><strong>Name:</strong> {result.processed_ingredient_name}</p>
                                <p><strong>Base Term Code:</strong> {result.processed_ingredient_base_term}</p>
                                <p><strong>Foodex code:</strong> {result.final_Foodex_code}</p>
                                <p><strong>Descriptions:</strong> {Array.isArray(result.description) ? result.description.map((desc, idx) => <span key={idx}>{desc.user_input}</span>) : result.description}</p>

                                
                                <button style={{ margin: '5px', width: '50%', backgroundColor:'green', color: 'white', marginRight: '15px', fontSize: '0.8rem', padding: '5px 10px', borderRadius: '5px'}} className="searchButton" onClick={() => handleSelectProcessedIngredient(result.processed_ingredient_name, result.final_Foodex_code)}>Select Processed Ingredient</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <br></br><br></br>
            <button style={{ margin: '5px', width: '50%', backgroundColor:'blue', color: 'white', marginRight: '15px', fontSize: '0.8rem', padding: '5px 10px', borderRadius: '5px'}} className="clearButton" onClick={handleClear}>Clear</button>
        </div>
    );
};

export default SearchInventoryPI;
