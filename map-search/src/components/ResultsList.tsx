import React from 'react';
import { MapPin, Copy } from 'lucide-react';
import { SearchResult } from '../types';

interface ResultsListProps {
  results: SearchResult[];
  onResultSelect: (result: SearchResult) => void;
}

const ResultsList: React.FC<ResultsListProps> = ({ results, onResultSelect }) => {
  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      alert('Address copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  if (results.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No results found. Try a different search or explore nearby places!
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      {results.map((result) => (
        <div
          key={result.id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div
              className="flex-1"
              onClick={() => onResultSelect(result)}
            >
              <h3 className="font-semibold text-lg">{result.name}</h3>
              <p className="text-gray-600 text-sm flex items-center gap-1">
                <MapPin size={14} />
                {result.address}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyAddress(result.address);
              }}
              className="p-2 text-gray-500 hover:text-gray-700"
              title="Copy address"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsList;