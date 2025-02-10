import React from 'react';
import { Button } from '../ui/button';
import { CheckSquare, Square, Trash2 } from 'lucide-react';
import { useSelection } from '../../contexts/SelectionContext';
import { SortControls } from './SortControls';
import { LayoutControls } from './LayoutControls';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { apiClient } from '../../utils/apiClient';

interface SelectionControlsProps {
  allVideoIds: string[];
  onDelete?: () => void;
}

export function SelectionControls({ allVideoIds, onDelete }: SelectionControlsProps) {
  const { selectedIds, selectAll, unselectAll } = useSelection();
  const allSelected = selectedIds.size === allVideoIds.length;
  const hasSelection = selectedIds.size > 0;

  const handleToggleAll = () => {
    if (allSelected) {
      unselectAll();
    } else {
      selectAll(allVideoIds);
    }
  };

  const handleDelete = async () => {
    try {
      // Temporarily log instead of making API call
      console.log('Would delete:', Array.from(selectedIds));
      
      // For now, just clear selection
      unselectAll();
      onDelete?.();
    } catch (error) {
      console.error('Failed to delete videos:', error);
    }
  };

  return (
    <div className="flex items-center justify-between py-4 border-b">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline"
          size="sm"
          onClick={handleToggleAll}
          className="flex items-center gap-2"
        >
          {allSelected ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            <Square className="h-4 w-4" />
          )}
          <span>{allSelected ? 'Unselect All' : 'Select All'}</span>
        </Button>
        {hasSelection && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive"
                size="sm"
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete {selectedIds.size === 1 ? 'Video' : `${selectedIds.size} Videos`}</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[400px]">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>
                    This will permanently delete {selectedIds.size === 1 
                      ? 'this video' 
                      : `these ${selectedIds.size} videos`
                    }.
                  </p>
                  <p>This action cannot be undone.</p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="sm:space-x-2">
                <AlertDialogCancel className="w-auto px-4">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="w-auto px-4 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <div className="flex items-center gap-2">
        <SortControls />
        <LayoutControls />
      </div>
    </div>
  );
} 