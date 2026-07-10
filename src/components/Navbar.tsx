import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-gray-900"
        >
          Social<span className="text-blue-600">Media</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="font-medium text-gray-700 transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/create"
            className="font-medium text-gray-700 transition hover:text-blue-600"
          >
            Create Post
          </Link>

          <Link
            to="/communities"
            className="font-medium text-gray-700 transition hover:text-blue-600"
          >
            Communities
          </Link>

          <Link
            to="/community/create"
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Create Community
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-md p-2 transition hover:bg-gray-100 md:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t bg-white md:hidden">
          <div className="flex flex-col gap-2 px-4 py-4">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-3 py-2 font-medium text-gray-700 hover:bg-gray-100"
            >
              Home
            </Link>

            <Link
              to="/create"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-3 py-2 font-medium text-gray-700 hover:bg-gray-100"
            >
              Create Post
            </Link>

            <Link
              to="/communities"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-3 py-2 font-medium text-gray-700 hover:bg-gray-100"
            >
              Communities
            </Link>

            <Link
              to="/community/create"
              onClick={() => setIsOpen(false)}
              className="rounded-md bg-blue-600 px-3 py-2 text-center font-medium text-white hover:bg-blue-700"
            >
              Create Community
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;