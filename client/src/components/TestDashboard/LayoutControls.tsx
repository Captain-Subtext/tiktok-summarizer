import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { Button } from '../ui/button';
import { useSearchParams } from 'react-router-dom';

type LayoutType = 'grid' | 'list';

export function LayoutControls() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLayout = (searchParams.get('layout') as LayoutType) || 'grid';

  const toggleLayout = () => {
    const newLayout = currentLayout === 'grid' ? 'list' : 'grid';
    searchParams.set('layout', newLayout);
    setSearchParams(searchParams);
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={toggleLayout}
      className="flex items-center gap-2"
    >
      {currentLayout === 'grid' ? (
        <>
          <List className="h-4 w-4" />
          <span className="hidden sm:inline">List View</span>
        </>
      ) : (
        <>
          <LayoutGrid className="h-4 w-4" />
          <span className="hidden sm:inline">Grid View</span>
        </>
      )}
    </Button>
  );
} 