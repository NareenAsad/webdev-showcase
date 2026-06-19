import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks.ts';
import { searchLocations, clearSuggestions } from '../store/slices/locationsSlice.ts';
import type { Location } from '../store/slices/locationsSlice.ts';

interface Props {
  id: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  onSelect: (loc: Location) => void;
}

export default function Autocomplete({ id, placeholder, value, onChange, onSelect }: Props) {
  const dispatch    = useAppDispatch();
  const suggestions = useAppSelector((s) => s.locations.suggestions);
  const [open, setOpen]           = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      dispatch(clearSuggestions());
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      dispatch(searchLocations(value)).then(() => setOpen(true));
    }, 280);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [value, dispatch]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (loc: Location) => {
    onSelect(loc);
    onChange(loc.name);
    setOpen(false);
    dispatch(clearSuggestions());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted((h) => Math.min(h + 1, suggestions.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setHighlighted((h) => Math.max(h - 1, 0)); }
    if (e.key === 'Enter' && highlighted >= 0) { handleSelect(suggestions[highlighted]); }
    if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div className="autocomplete-wrapper" ref={wrapperRef}>
      <input
        id={id}
        type="text"
        className="form-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => { onChange(e.target.value); setHighlighted(-1); }}
        onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <div className="autocomplete-dropdown" role="listbox">
          {suggestions.map((loc, i) => (
            <div
              key={loc._id}
              className={`autocomplete-item${highlighted === i ? ' highlighted' : ''}`}
              role="option"
              aria-selected={highlighted === i}
              onMouseDown={() => handleSelect(loc)}
              onMouseEnter={() => setHighlighted(i)}
            >
              <div>{loc.name}</div>
              {loc.city && <div className="item-sub">{loc.city}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
