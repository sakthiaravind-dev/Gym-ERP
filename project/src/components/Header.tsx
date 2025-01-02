import React, { useState } from 'react';
import { Search, Bell, BarChart2, Dumbbell, MessageCircle, User } from 'lucide-react';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false); 

  return (
    <div className="h-16 bg-white flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search with ID/Phone No"
            className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <User size={20} className="text-purple-700" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Bell size={20} className="text-purple-700" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <MessageCircle size={20} className="text-purple-700" />
        </button>
        <div className="relative">
          <button
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={() => setShowMenu(!showMenu)}
          >
            <Dumbbell size={20} className="text-purple-700" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <ul className="py-1">
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-purple-100 text-gray-700"
                    onClick={() => alert('Personal Diet selected!')}
                  >
                    Personal Diet
                  </button>
                </li>
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-purple-100 text-gray-700"
                    onClick={() => alert('Common Diet selected!')}
                  >
                    Common Diet
                  </button>
                </li>
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-purple-100 text-gray-700"
                    onClick={() => alert('Work-Out selected!')}
                  >
                    Work-Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        <button className="p-2 hover:bg-gray-100 rounded-full">
          <BarChart2 size={20} className="text-purple-700" />
        </button>
      </div>
    </div>
  );
};

export default Header;
