import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useSearchParams } from 'react-router-dom';

const sortOptions = {
  newest: 'Newest First',
  oldest: 'Oldest First',
} as const;

type SortOption = keyof typeof sortOptions;

export function SortControls() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSort = (searchParams.get('sort') as SortOption) || 'newest';

  const handleSort = (sort: SortOption) => {
    searchParams.set('sort', sort);
    setSearchParams(searchParams);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowUpDown className="h-4 w-4" />
          <span className="hidden sm:inline">{sortOptions[currentSort]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(sortOptions).map(([value, label]) => (
          <DropdownMenuItem
            key={value}
            onClick={() => handleSort(value as SortOption)}
            className="flex items-center gap-2"
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 