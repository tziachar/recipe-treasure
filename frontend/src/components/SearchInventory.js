import React, { useState } from 'react';
import axios from 'axios';

const SearchInventory = ({ onSelectFacet }) => {
    const [searchItem, setSearchItem] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:8000/search_ingredient/', {
                params: { search_item: searchItem }
            });
            setResults(response.data);
            setError(null);
        } catch (error) {
            setError('Failed to fetch data');
            setResults([]);
        }
    };

    const handleSelectFacet = (ingredientName, ingredientCode, ingredientFinalFoodexCode) => {
        onSelectFacet(ingredientName, ingredientCode, ingredientFinalFoodexCode);
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
                placeholder="Search Ingredient"
            />
            <button style={{ margin: '5px', width: '50%', backgroundColor:'green', color: 'white', marginRight: '15px', fontSize: '0.8rem', padding: '5px 10px', borderRadius: '5px'}} className="searchButton" onClick={handleSearch}>Find</button>
            

            {error && <div style={{ color: 'red' }}>{error}</div>}

            {results.length > 0 && (
                <div>
                    <h4>Search Results:</h4>
                    <ul>
                        {results.map((result, index) => (
                            <li key={index} className="listItem">
                                <p><strong>Name:</strong> {result.ingredient_name}</p>
                                <p><strong>Base Term Code:</strong> {result.ingredient_base_term}</p>
                                <p><strong>Foodex code:</strong> {result.final_Foodex_code}</p>
                                <p><strong>Origin:</strong> {result.place_of_origin}</p>
                                <div>
                                    <strong>Descriptions:</strong>
                                    <ul>
                                        {result.description.map((detail, detailIndex) => (
                                            <li key={detailIndex}>
                                                {Object.entries(detail).map(([key, value]) => (
                                                    <p key={key}> {value} </p>
                                                    
                                                ))}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <button style={{ margin: '5px', width: '50%', backgroundColor:'green', color: 'white', marginRight: '15px', fontSize: '0.8rem', padding: '5px 10px', borderRadius: '5px'}} className="searchButton" onClick={() => handleSelectFacet(result.ingredient_name, result.ingredient_base_term, result.final_Foodex_code)}>Select Facet</button>
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

export default SearchInventory;
