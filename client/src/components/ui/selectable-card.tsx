import React from 'react';
import { Card } from './card';
import { Checkbox } from './checkbox';
import { cn } from '../../lib/utils';
import { useSelection } from '../../contexts/SelectionContext';

interface SelectableCardProps {
  id: string;
  children: React.ReactNode;
  onSelect?: (id: string) => void;
}

export function SelectableCard({ id, children, onSelect }: SelectableCardProps) {
  const { isSelected, toggleSelection } = useSelection();
  const selected = isSelected(id);

  const handleSelect = () => {
    toggleSelection(id);
    onSelect?.(id);
  };

  return (
    <Card className={cn(
      "relative group overflow-hidden transition-all duration-200 border-2",
      selected 
        ? "bg-blue-50/80 border-blue-500" 
        : "border-transparent hover:border-slate-200"
    )}>
      <div className="absolute top-2 left-2 z-10">
        <Checkbox 
          checked={selected}
          onCheckedChange={handleSelect}
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center",
            "rounded-sm border border-slate-300",
            "transition-all duration-150",
            "hover:border-slate-400",
            "data-[state=checked]:bg-blue-500",
            "data-[state=checked]:border-blue-500",
            "[&_svg]:h-3 [&_svg]:w-3 [&_svg]:text-white"
          )}
        />
      </div>
      {children}
    </Card>
  );
} 