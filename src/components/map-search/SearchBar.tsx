import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onExplore: () => void;
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onExplore, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="flex gap-2">
      <form onSubmit={handleSubmit} className="flex-1 flex">
        <div className="relative flex-1">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for parks, trails, or outdoor spaces..."
            className="pr-10 bg-white/80 backdrop-blur-sm border-green-100 focus:border-green-300"
          />
          <Button 
            type="submit" 
            variant="ghost" 
            size="sm" 
            className="absolute right-1 top-1 h-8 w-8 p-0"
          >
            <Search className="h-4 w-4 text-green-600" />
          </Button>
        </div>
      </form>
      <Button 
        onClick={onExplore}
        className="bg-green-500 hover:bg-green-600"
      >
        Explore
      </Button>
    </div>
  );
};

export default SearchBar;
