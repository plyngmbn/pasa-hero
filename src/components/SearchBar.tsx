/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, Mic } from 'lucide-react';

interface SearchBarProps {
  onClick?: () => void;
  placeholder?: string;
  readOnly?: boolean;
}

export default function SearchBar({ onClick, placeholder = 'Where are you going?', readOnly = true }: SearchBarProps) {
  return (
    <div 
      id="search-bar-container"
      onClick={onClick}
      className="flex items-center gap-3 bg-brand-yellow border border-brand-yellow/30 rounded-2xl p-4 shadow-xl cursor-pointer hover:shadow-2xl transition-all"
    >
      <Search className="text-brand-blue" size={20} />
      <input 
        id="search-input"
        type="text" 
        placeholder={placeholder}
        readOnly={readOnly}
        className="flex-1 bg-transparent outline-none text-brand-blue placeholder:text-brand-blue/70 text-sm font-bold"
      />
      <button id="mic-button" className="p-1 text-brand-blue/80">
        <Mic size={18} />
      </button>
    </div>
  );
}
