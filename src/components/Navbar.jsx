import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {

  const [visible, setVisible] = useState(false);

  const { setShowSearch, getCartCount } = useContext(ShopContext);

  return (
    <div className="relative">

      <div className="flex items-center justify-between font-medium">

        {/* Logo */}
        <Link to='/'>
          <img src={assets.logo} className="w-36" alt="logo" />
        </Link>

        {/* Nav Links */}
        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          <li>
            <NavLink to="/" end className={({ isActive }) =>
              isActive ? "border-b-2 border-gray-700 pb-1" : "pb-1"
            }>
              HOME
            </NavLink>
          </li>

          <li>
            <NavLink to="/collection" className={({ isActive }) =>
              isActive ? "border-b-2 border-gray-700 pb-1" : "pb-1"
            }>
              COLLECTION
            </NavLink>
          </li>

          <li>
            <NavLink to="/about" className={({ isActive }) =>
              isActive ? "border-b-2 border-gray-700 pb-1" : "pb-1"
            }>
              ABOUT
            </NavLink>
          </li>

          <li>
            <NavLink to="/contact" className={({ isActive }) =>
              isActive ? "border-b-2 border-gray-700 pb-1" : "pb-1"
            }>
              CONTACT
            </NavLink>
          </li>
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-6">

          <img
            onClick={() => setShowSearch(true)}
            src={assets.search_icon}
            className="w-5 cursor-pointer"
            alt="search"
          />

          {/* Profile Dropdown */}
          <div className="group relative">
            <Link to='/login'><img
              src={assets.profile_icon}
              className="w-5 cursor-pointer"
              alt="profile"
            /></Link>
            

            <div className="absolute right-0 pt-4 hidden group-hover:block">
              <div className="flex flex-col gap-2 w-36 py-5 bg-slate-100 text-gray-500 rounded shadow">
                <p className="cursor-pointer hover:text-black">My Profile</p>
                <p className="cursor-pointer hover:text-black">Orders</p>
                <p className="cursor-pointer hover:text-black">Logout</p>
              </div>
            </div>
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <img
              src={assets.cart_icon}
              className="w-5 min-w-5"
              alt="cart"
            />
            <p className="absolute -right-1 -bottom-1 w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {getCartCount()}
            </p>
          </Link>

          {/* Mobile Menu Icon */}
          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            className="w-5 cursor-pointer sm:hidden"
            alt="menu"
          />
        </div>
      </div>

      {/* Sidebar menu for small screens */}
      <div className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? "w-full" : "w-0"}`}>
        <div className="flex flex-col text-gray-600">

          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img className="h-4" src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>

          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection'>COLLECTION</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>

        </div>
      </div>

    </div>
  );
};

export default Navbar;
