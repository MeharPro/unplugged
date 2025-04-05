import React from 'react';
import { MapPin, Copy } from 'lucide-react';
import { SearchResult } from '@/types/map-search';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface ResultsListProps {
  results: SearchResult[];
  onResultSelect: (result: SearchResult) => void;
}

const ResultsList: React.FC<ResultsListProps> = ({ results, onResultSelect }) => {
  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Address copied",
        description: "The address has been copied to your clipboard.",
      });
    } catch (err) {
      console.error('Failed to copy address:', err);
      toast({
        title: "Failed to copy",
        description: "Could not copy the address to clipboard.",
        variant: "destructive"
      });
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
        <Card
          key={result.id}
          className="p-4 hover:shadow-md transition-shadow cursor-pointer border-green-100"
        >
          <div className="flex items-start justify-between">
            <div
              className="flex-1"
              onClick={() => onResultSelect(result)}
            >
              <h3 className="font-semibold text-lg">{result.name}</h3>
              <p className="text-gray-600 text-sm flex items-center gap-1">
                <MapPin size={14} className="text-green-600" />
                {result.address}
              </p>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                copyAddress(result.address);
              }}
              variant="ghost"
              size="sm"
              className="p-2 text-gray-500 hover:text-gray-700"
              title="Copy address"
            >
              <Copy size={16} />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ResultsList;
