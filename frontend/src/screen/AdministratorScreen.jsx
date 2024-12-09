import { Link, Outlet } from "react-router-dom";
import { useState } from "react";

function AdministratorScreen() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow text-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Branding */}
            <h2 className="text-2xl font-bold">Admin Panel</h2>

            {/* Hamburger Menu for Mobile */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-4">
              <Link
                to="/admin"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Admin Statistics"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 16l4-4 3 3 5-5 4 4M21 12V8a2 2 0 00-2-2h-4m0 0a2 2 0 00-2 2v4m0 0l4-4m-4 4l-4 4"
                  />
                </svg>
                Dashboard
              </Link>

              <Link
                to="/admin/products"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Admin Products"
              >
                <i className="fas fa-shopping-cart mr-2"></i>
                Products
              </Link>

              <Link
                to="/admin/orders"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Admin Orders"
              >
                <i className="fas fa-clipboard mr-2"></i>
                Orders
              </Link>

              <Link
                to="/admin/users"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Admin Users"
              >
                <i className="fas fa-users mr-2"></i>
                Users
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          {menuOpen && (
            <div className="lg:hidden space-y-2 mt-2">
              <Link
                to="/admin"
                className="block px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/products"
                className="block px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
              >
                Products
              </Link>
              <Link
                to="/admin/orders"
                className="block px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
              >
                Orders
              </Link>
              <Link
                to="/admin/users"
                className="block px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
              >
                Users
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
}

export default AdministratorScreen;
