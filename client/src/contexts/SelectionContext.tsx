import React, { createContext, useContext, useState, useCallback } from 'react';

interface SelectionContextType {
  selectedIds: Set<string>;
  toggleSelection: (id: string) => void;
  isSelected: (id: string) => boolean;
  selectAll: (ids: string[]) => void;
  unselectAll: () => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isSelected = useCallback((id: string) => {
    return selectedIds.has(id);
  }, [selectedIds]);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const unselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return (
    <SelectionContext.Provider value={{ 
      selectedIds, 
      toggleSelection, 
      isSelected,
      selectAll,
      unselectAll 
    }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
} 