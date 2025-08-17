import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { POKEMON_TYPES, POKEMON_GENERATIONS, SORT_OPTIONS } from '@/constants';
import type { FilterOptions, SortOption } from '@/types';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  onClearAll: () => void;
}

export function SearchFilters({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  sort,
  onSortChange,
  showFavoritesOnly,
  onToggleFavorites,
  onClearAll
}: SearchFiltersProps) {
  const handleTypeChange = (type: string) => {
    onFilterChange({
      ...filters,
      type: type || undefined
    });
  };

  const handleGenerationChange = (generation: string) => {
    onFilterChange({
      ...filters,
      generation: generation || undefined
    });
  };

  const handleSortChange = (value: string) => {
    const option = SORT_OPTIONS.find(opt => 
      `${opt.value.field}-${opt.value.order}` === value
    );
    if (option) {
      onSortChange(option.value);
    }
  };

  const hasActiveFilters = filters.type || 
                          filters.generation || 
                          showFavoritesOnly || 
                          searchQuery ||
                          (sort.field !== 'id' || sort.order !== 'asc');

  const clearFilters = () => {
    onClearAll();
  };

  return (
    <div className="space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search Pokémon by name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
          aria-label="Search Pokémon"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select
          label="Type"
          value={filters.type || ''}
          onChange={(e) => handleTypeChange(e.target.value)}
          aria-label="Filter by type"
          options={POKEMON_TYPES.map(type => ({
            label: type.charAt(0).toUpperCase() + type.slice(1),
            value: type
          }))}
        />

        <Select
          label="Generation"
          value={filters.generation || ''}
          onChange={(e) => handleGenerationChange(e.target.value)}
          options={POKEMON_GENERATIONS.map(gen => ({
            label: gen.label,
            value: gen.value
          }))}
        />

        <Select
          label="Sort By"
          value={`${sort.field}-${sort.order}`}
          onChange={(e) => handleSortChange(e.target.value)}
          options={SORT_OPTIONS.map(opt => ({
            label: opt.label,
            value: `${opt.value.field}-${opt.value.order}`
          }))}
        />

        <div className="flex items-end">
          <Button
            variant={showFavoritesOnly ? 'primary' : 'secondary'}
            onClick={onToggleFavorites}
            className="w-full"
          >
            <Filter className="w-4 h-4 mr-2" />
            Favorites Only
          </Button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {(() => {
              const activeItems = [];
              if (searchQuery) activeItems.push('Search');
              if (filters.type) activeItems.push('Type');
              if (filters.generation) activeItems.push('Generation');
              if (showFavoritesOnly) activeItems.push('Favorites');
              if (sort.field !== 'id' || sort.order !== 'asc') activeItems.push('Sort');
              return `Active: ${activeItems.join(', ')}`;
            })()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
          >
            <X className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
