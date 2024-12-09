import { useContext, useState, useEffect } from "react";
import { Store } from "../Store";
import "./header.css";
import toast from "react-hot-toast";
import SearchBox from "../mainpage/SearchBox";

function Header() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    toast.success("User Logged Out");
    window.location.href = "/signin";
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10); // Adjust the scroll threshold as needed
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`bg-neutral text-white ${
        isScrolled ? "header-blur" : ""
      } transition-all duration-300`}
    >
      <div className="navbar bg-base-100 px-4 md:px-8 flex justify-between items-center">
        {/* Navbar Start */}
        <div className="flex items-center">
          <button
            className="btn btn-ghost lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
          <a
            href="/"
            className="btn btn-ghost normal-case text-xl font-bold text-amber-500"
          >
            E-STOCKS
          </a>
        </div>

        {/* Navbar Center */}
        <div className="hidden lg:flex flex-1 justify-center">
          <SearchBox />
        </div>

        {/* Navbar End */}
        <div className="flex items-center space-x-4">
          <a href="/cart" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cart.cartItems.length > 0 && (
                <span className="badge badge-xs badge-error indicator-item">
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </span>
              )}
            </div>
          </a>
          {userInfo ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost">
                {userInfo.name}
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a href="/orderhistory" className="text-gray-700">
                    Order History
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-700"
                    href="#signout"
                    onClick={signoutHandler}
                  >
                    Sign Out
                  </a>
                </li>
              </ul>
            </div>
          ) : (
            <a href="/signin" className="btn btn-ghost">
              Sign In
            </a>
          )}
        </div>
      </div>
      {menuOpen && (
        <div className="lg:hidden bg-base-100 p-4 space-y-2">
          <SearchBox />
          <a href="/orderhistory" className="block text-gray-700">
            Order History
          </a>
          <a
            href="#signout"
            className="block text-gray-700"
            onClick={signoutHandler}
          >
            Sign Out
          </a>
        </div>
      )}
    </header>
  );
}

export default Header;

