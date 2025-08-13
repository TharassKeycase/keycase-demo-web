import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Search, Clear, ArrowUpward, ArrowDownward } from '@mui/icons-material';

export interface SearchFilterProps {
  searchPlaceholder?: string;
  sortByOptions: { value: string; label: string }[];
  onSearchChange: (search: string) => void;
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  defaultSortBy?: string;
  defaultSortOrder?: 'asc' | 'desc';
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchPlaceholder = 'Search...',
  sortByOptions,
  onSearchChange,
  onSortChange,
  defaultSortBy = '',
  defaultSortOrder = 'desc',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(defaultSortOrder);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    const timeout = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 500); // Debounce search
    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchTerm]);

  const handleSortByChange = (value: string) => {
    setSortBy(value);
    onSortChange(value, sortOrder);
  };

  const handleSortOrderToggle = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    onSortChange(sortBy, newOrder);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearchChange('');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        mb: 2,
        p: 2,
        backgroundColor: '#f5f5f5',
        borderRadius: 1,
      }}
    >
      <TextField
        id="search-filter-input"
        size="small"
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ flexGrow: 1, maxWidth: 400 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton id="search-clear-btn" size="small" onClick={handleClearSearch}>
                <Clear fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="sort-by-label">Sort By</InputLabel>
        <Select
          id="sort-by-select"
          labelId="sort-by-label"
          value={sortBy}
          label="Sort By"
          onChange={(e) => handleSortByChange(e.target.value)}
        >
          {sortByOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <IconButton
        id="sort-order-toggle-btn"
        onClick={handleSortOrderToggle}
        color="primary"
        sx={{
          border: '1px solid',
          borderColor: 'primary.main',
          borderRadius: 1,
        }}
      >
        {sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
      </IconButton>
    </Box>
  );
};

export default SearchFilter;