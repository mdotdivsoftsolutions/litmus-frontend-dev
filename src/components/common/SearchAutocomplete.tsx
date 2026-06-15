import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchApi } from "@/lib/api/search";

interface SearchAutocompleteProps {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  hideIcon?: boolean;
  children?: React.ReactNode;
}

export function SearchAutocomplete({ 
  placeholder = "Search for tests, products...", 
  className = "", 
  inputClassName = "",
  hideIcon = false,
  children
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading } = useQuery({
    queryKey: ["searchSuggestions", debouncedQuery],
    queryFn: () => searchApi.getSuggestions(debouncedQuery),
    enabled: debouncedQuery.length > 1,
    staleTime: 60000,
  });

  const suggestions = data?.data || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsOpen(false);
      navigate(`/tests?search=${encodeURIComponent(query)}`);
    }
  };

  const handleSelect = (item: any) => {
    setIsOpen(false);
    setQuery("");
    
    // Navigate based on type
    if (item.type === 'test') navigate(`/tests/${item.id}`);
    else if (item.type === 'package') navigate(`/packages/${item.id}`);
    else if (item.type === 'category') navigate(`/tests?category=${encodeURIComponent(item.name)}`);
    else navigate(`/tests?search=${encodeURIComponent(item.name)}`); // fallback
  };



  return (
    <div ref={wrapperRef} className={`relative flex-1 ${className}`}>
      {!hideIcon && (
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        className={`${!hideIcon ? 'pl-9' : ''} ${inputClassName}`}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {children}
      
      {/* Dropdown Menu */}
      {isOpen && query.length > 1 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
          {isLoading ? (
            <div className="p-4 flex items-center justify-center text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span className="text-sm">Searching...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="max-h-[300px] overflow-y-auto py-2">
              {suggestions.map((item: any, idx: number) => (
                <li key={`${item.type}-${item.id}-${idx}`}>
                  <button
                    onClick={() => handleSelect(item)}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex flex-col gap-0.5 transition-colors"
                  >
                    <div className="text-sm font-medium text-slate-800">{item.name}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{item.type}</div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-slate-500">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
