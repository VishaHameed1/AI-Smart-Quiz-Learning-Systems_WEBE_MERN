import React, { useState } from 'react';

const BulkUploadForm = ({ onSubmit }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file && onSubmit) {
      onSubmit(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="file"
        accept=".json,.csv"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Upload Questions
      </button>
    </form>
  );
};

export default BulkUploadForm;
