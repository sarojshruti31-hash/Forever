import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate, token } = useContext(ShopContext)
  const [cartData, setCartData] = useState([])

  useEffect(() => {

    const tempData = []

    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          tempData.push({
            _id: itemId,
            size: size,
            quantity: cartItems[itemId][size]
          })
        }
      }
    }

    setCartData(tempData)

  }, [cartItems])

  return (
    <div className='border-t pt-14'>

      {/* Title */}
      <div className='text-2xl mb-6'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      {/* Cart Items */}
      <div>
        {
          cartData.map((item, index) => {

            const productData = products.find(
              (product) => product._id === item._id
            )

            if (!productData) return null

            return (
              <div
                key={index}
                className='py-4 border-t border-b text-gray-700 
                grid grid-cols-[4fr_1fr_1fr] 
                sm:grid-cols-[4fr_2fr_1fr] 
                items-center gap-4'
              >

                {/* Product */}
                <div className='flex items-start gap-6'>
                  <img
                    className='w-16 sm:w-20'
                    src={productData.image[0]}
                    alt=""
                  />
                  <div>
                    <p className='text-xs sm:text-lg font-medium'>
                      {productData.name}
                    </p>
                    <div className='flex items-center gap-3 mt-2'>
                      <p>{currency}{productData.price}</p>
                      <p className='px-2 border text-sm'>{item.size}</p>
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(
                      item._id,
                      item.size,
                      Number(e.target.value)
                    )
                  }
                  className='border max-w-12 sm:max-w-20 px-1 py-1'
                />

                {/* Remove */}
                <img
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                  src={assets.bin_icon}
                  className='w-4 cursor-pointer'
                  alt=""
                />

              </div>
            )
          })
        }
      </div>

      {/* Cart Total + Checkout (RIGHT SIDE, BUTTON BELOW TOTAL) */}
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px] text-right'>

          <CartTotal />

          <button onClick={()=> token ? navigate('/place-order') : navigate('/login')} className='bg-black text-white text-sm mt-8 px-8 py-3'>
            PROCEED TO CHECKOUT
          </button>

        </div>
      </div>

    </div>
  )
}

export default Cart
