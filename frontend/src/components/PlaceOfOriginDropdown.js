import React, { useState, forwardRef, useImperativeHandle } from 'react';

const regions = {
  'Ανατολική Μακεδονία και Θράκη': ['Έβρου', 'Καβάλας', 'Ξάνθης', 'Ροδόπης', 'Δράμας'],
  'Κεντρική Μακεδονία': ['Ημαθίας', 'Θεσσαλονίκης', 'Κιλκίς', 'Πέλλας', 'Πιερίας', 'Σερρών', 'Χαλκιδικής'],
  'Δυτική Μακεδονία': ['Γρεβενών', 'Καστοριάς', 'Κοζάνης', 'Φλώρινας'],
  'Ήπειρος': ['Άρτας', 'Θεσπρωτίας', 'Ιωαννίνων', 'Πρεβέζης'],
  'Θεσσαλία': ['Καρδίτσας', 'Λάρισας', 'Μαγνησίας', 'Τρικάλων'],
  'Ιόνια Νησιά': ['Ζακύνθου', 'Κερκύρας', 'Κεφαλληνίας', 'Λευκάδος'],
  'Δυτική Ελλάδα': ['Αιτωλοακαρνανίας', 'Αχαΐας', 'Ηλείας'],
  'Στερεά Ελλάδα': ['Βοιωτίας', 'Ευβοίας', 'Ευρυτανίας', 'Φθιώτιδας', 'Φωκίδας'],
  'Αττική': ['Αττικής'],
  'Πελοπόννησος': ['Αργολίδος', 'Αρκαδίας', 'Κορινθίας', 'Λακωνίας', 'Μεσσηνίας'],
  'Βόρειο Αιγαίο': ['Λέσβου', 'Σάμου', 'Χίου'],
  'Νότιο Αιγαίο': ['Δωδεκανήσου', 'Κυκλάδων'],
  'Κρήτη': ['Ηρακλείου', 'Λασιθίου', 'Ρεθύμνης', 'Χανίων'],
  'Άγιον Όρος': ['Άγιον Όρος'],
  'Ελλάδα': ['Ελλάδα']
};

const PlaceOfOriginDropdown = forwardRef(({ onSelectRegion }, ref) => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedPrefecture, setSelectedPrefecture] = useState('');

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    setSelectedPrefecture('');
    onSelectRegion(region);
  };

  const handlePrefectureChange = (e) => {
    const prefecture = e.target.value;
    setSelectedPrefecture(prefecture);
    onSelectRegion(`${selectedRegion} - ${prefecture}`);
  };

  useImperativeHandle(ref, () => ({
    resetDropdown() {
      setSelectedRegion('');
      setSelectedPrefecture('');
    }
  }));

  return (
    <div>
      <label>Place of Origin:&emsp;</label>
      <select value={selectedRegion} onChange={handleRegionChange}>
        <option value="">Select Region</option>
        {Object.keys(regions).map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>

      {selectedRegion && (
        <select value={selectedPrefecture} onChange={handlePrefectureChange}>
          <option value="">Select Prefecture</option>
          {regions[selectedRegion].map((prefecture) => (
            <option key={prefecture} value={prefecture}>
              {prefecture}
            </option>
          ))}
        </select>
      )}
    </div>
  );
});

export default PlaceOfOriginDropdown;
