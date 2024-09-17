import React, { useState, forwardRef, useImperativeHandle } from 'react';

const MediterraneanDietCategoryDropdown = forwardRef(({ onSelectCategory }, ref) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'Fruits: Fresh, in-season fruits consumed daily.',
    'Vegetables: A variety of vegetables consumed daily.',
    'Olive Oil: As the primary source of fat.',
    'Grains: Mostly whole grains and cereals.',
    'Legumes: Beans, lentils, and other legumes consumed frequently.',
    'Nuts and Seeds: Regular consumption of nuts and seeds.',
    'Dairy: Moderate consumption, mainly in the form of cheese and yogurt.',
    'Herbs and Spices: Used instead of salt to flavor foods.',
    'Fish and Seafood: Consumed several times a week.',
    'Poultry, Eggs, and Dairy: Consumed in moderate amounts.',
    'Red Meat and Sweets: Consumed less frequently and in smaller portions.',
    'Wine: In moderation, typically with meals (optional and not recommended for everyone).',
    'None'
  ];

  useImperativeHandle(ref, () => ({
    resetDropdown() {
      setSelectedCategory('');
    }
  }));

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    onSelectCategory(e.target.value);
  };

  return (
    <div>
      <label htmlFor="mediterranean-diet-category">Category in the Mediterranean Diet Pyramid:</label>
      <select
        id="mediterranean-diet-category"
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        <option value="" disabled>Select a category</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
});

export default MediterraneanDietCategoryDropdown;
