import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex space-x-6 py-4">
          <li>
            <Link
              to="/"
              className="hover:text-sky-400 transition-colors"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/inventory"
              className="hover:text-sky-400 transition-colors"
            >
              Inventory
            </Link>
          </li>
          <li>
            <Link
              to="/billing"
              className="hover:text-sky-400 transition-colors"
            >
              Billing
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
