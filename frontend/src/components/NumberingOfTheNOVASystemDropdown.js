import React from 'react';

const NumberingOfTheNOVASystemDropdown = ({ onSelectSystem }) => {
  const systemOptions = [
    'Unprocessed or minimally processed foods',
    'Processed culinary ingredients',
    'Processed foods',
    'Ultra-processed foods',
    'None'
  ];

  const handleChange = (event) => {
    const selectedSystem = event.target.value;
    onSelectSystem(selectedSystem);
  };

  return (
    <div>
      <label htmlFor="novaSystem">Numbering of the NOVA System:</label>
      <select id="novaSystem" onChange={handleChange}>
      <option value="" disabled>Select a category</option>
        {systemOptions.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
      ))}
      </select>
    </div>
  );
};

export default NumberingOfTheNOVASystemDropdown;
