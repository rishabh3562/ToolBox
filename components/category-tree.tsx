'use client';

import { Category } from '@/types/snippet';
import { Button } from '@/components/ui/button';
import { ChevronRight, FolderOpen, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryTreeProps {
  categories: Category[];
  selectedCategory?: string;
  onSelect: (categoryId: string) => void;
  onAdd?: (parentId?: string) => void;
  className?: string;
}

export function CategoryTree({
  categories,
  selectedCategory,
  onSelect,
  onAdd,
  className
}: CategoryTreeProps) {
  const renderCategory = (category: Category, depth = 0) => {
    const hasSubCategories = category.subCategories && category.subCategories.length > 0;
    
    return (
      <div key={category.id} className="space-y-1">
        <div
          className={cn(
            'flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer',
            selectedCategory === category.id && 'bg-accent',
            depth > 0 && 'ml-4'
          )}
          onClick={() => onSelect(category.id)}
        >
          {hasSubCategories && <ChevronRight className="w-4 h-4" />}
          <FolderOpen className="w-4 h-4" />
          <span className="flex-1">{category.name}</span>
          {onAdd && (
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onAdd(category.id);
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
        {hasSubCategories && (
          <div className="pl-4">
            {category.subCategories?.map((subCategory) =>
              renderCategory(subCategory, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn('space-y-2', className)}>
      {categories.map((category) => renderCategory(category))}
      {onAdd && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onAdd()}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      )}
    </div>
  );
}