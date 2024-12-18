import React from 'react';
import SearchBar from './SearchBar';
import HeaderIcons from './HeaderIcons';

const Header: React.FC = () => {
  return (
    <div className="h-16 bg-white flex items-center justify-between px-4 shadow-sm">
      <SearchBar />
      <HeaderIcons />
    </div>
  );
};

export default Header;