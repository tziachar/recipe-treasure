import React from 'react';

const QuantityDropdown = ({ onSelectQuantity }) => {
  const quantities = [
    'Τεμάχια (Τεμ.)',
    'Κιλά (Κλγ.)',
    'Γραμμάρια (Γρ.)',
    'Λίτρα (Λ)',
    'Μιλιλίτρα (ml)',
    'Κούπες (Κούπα)',
    'Κουταλιές της σούπας (Κ.σ.)',
    'Κουταλάκια του γλυκού (Κ.γ.)',
    'Φλιτζάνια (Φλ.)',
    'Σταγόνες (Στ.)',
    'Πακέτα (Πακ.)',
    'Δοχεία (Δοχ.)',
    'Κουτιά (Κουτ.)',
    'Σακούλες (Σακ.)',
    'Μπουκάλια (Μπουκ.)',
  ];

  const handleChange = (event) => {
    const selectedQuantity = event.target.value;
    onSelectQuantity(selectedQuantity);
  };

  return (
    <div>
      <label htmlFor="quantity">Επιλέξτε μονάδα μέτρησης:</label>
      <select id="quantity" onChange={handleChange}>
        {quantities.map((quantity, index) => (
          <option key={index} value={quantity}>
            {quantity}
          </option>
        ))}
      </select>
    </div>
  );
};

export default QuantityDropdown;
