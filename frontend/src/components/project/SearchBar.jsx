import React, { useState } from 'react';

const SearchBar = ({ value, onSearch }) => {
  const [query, setQuery] = useState(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex">
      <input
        type="text"
        value={query}
        placeholder="Search..."
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 flex-1 rounded-l"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
