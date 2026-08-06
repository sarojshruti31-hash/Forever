import { createContext, useEffect, useState } from "react"
import { products as fallbackProducts } from "../assets/assets"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

export const ShopContext = createContext()

const ShopContextProvider = (props) => {

  const currency = '$'
  const delivery_fee = 10
  const backendUrl = import.meta.env.VITE_BACKEND_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4000')
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [cartItems, setCartItems] = useState({})
  const [products, setProducts] = useState(fallbackProducts)
  const [token, setTokenState] = useState(localStorage.getItem('token') || '')
  const navigate = useNavigate()

  const setToken = (newToken) => {
    setTokenState(newToken)
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  // Fetch products from backend API (with local fallback)
  const getProductsData = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/product/list`)
      const data = await response.json()
      if (data.success && data.products && data.products.length > 0) {
        const formattedProducts = data.products.map(item => ({
          ...item,
          image: item.image.map(img => img.startsWith('/uploads') ? `${backendUrl}${img}` : img)
        }))
        setProducts(formattedProducts)
      }
    } catch (error) {
      // Use local fallback silently
    }
  }

  // Sync cart from backend
  const getUserCart = async (authToken) => {
    try {
      const response = await fetch(`${backendUrl}/api/cart/get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'token': authToken }
      })
      const data = await response.json()
      if (data.success) {
        setCartItems(data.cartData || {})
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error.message)
    }
  }

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error('Select Product Size')
      return
    }

    let cartData = { ...cartItems }
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1
      } else {
        cartData[itemId][size] = 1
      }
    } else {
      cartData[itemId] = {}
      cartData[itemId][size] = 1
    }
    setCartItems(cartData)

    if (token) {
      try {
        await fetch(`${backendUrl}/api/cart/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'token': token },
          body: JSON.stringify({ itemId, size })
        })
      } catch (error) {
        console.error("Cart sync error:", error.message)
      }
    }
  }

  const getCartCount = () => {
    let totalCount = 0
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          totalCount += cartItems[itemId][size]
        }
      }
    }
    return totalCount
  }

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = { ...cartItems }
    if (!cartData[itemId]) return
    cartData[itemId] = { ...cartData[itemId] }
    cartData[itemId][size] = quantity
    setCartItems(cartData)

    if (token) {
      try {
        await fetch(`${backendUrl}/api/cart/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'token': token },
          body: JSON.stringify({ itemId, size, quantity })
        })
      } catch (error) {
        console.error("Cart update error:", error.message)
      }
    }
  }

  const getCartAmount = () => {
    let totalAmount = 0
    for (const itemId in cartItems) {
      const itemInfo = products.find(product => product._id === itemId)
      if (!itemInfo) continue
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          totalAmount += itemInfo.price * cartItems[itemId][size]
        }
      }
    }
    return totalAmount
  }

  useEffect(() => {
    getProductsData()
  }, [])

  useEffect(() => {
    if (token) {
      getUserCart(token)
    }
  }, [token])

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken
  }

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider
