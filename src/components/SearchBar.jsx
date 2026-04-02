import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { useLocation } from 'react-router-dom'

const SearchBar = () => {

  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext)
  const [visible,setVisible] = useState()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.includes('collection')) {
        setVisible(true)
    }
    else {
        setVisible(false)
    }
  }, [location])

  return showSearch && visible ?  (
    <div className="border-t border-b bg-white py-6 text-center">

      <div className="inline-flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full w-3/4 sm:w-1/2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-transparent text-sm"
          type="text"
          placeholder="Search"
        />
        <img src={assets.search_icon} className="w-4" alt="search" />
      </div>

      <img
        onClick={() => setShowSearch(false)}
        src={assets.cross_icon}
        className="inline w-3 ml-4 cursor-pointer"
        alt="close"
      />

    </div>
  ) : null
}

export default SearchBar
