import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const CartTotal = () => {

  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext)

  return (
    <div className='border p-5'>
      <div className='text-2xl mb-4'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='flex flex-col gap-2 text-sm'>
        <div className='flex justify-between'>
          <p>Subtotal</p>
          <p>{currency}{getCartAmount()}.00</p>
        </div>

        <hr />

        <div className='flex justify-between'>
          <p>Shipping Fee</p>
          <p>{currency}{delivery_fee}.00</p>
        </div>

        <hr />

        <div className='flex justify-between'>
          <p>Total</p>
          <p>{currency}{getCartAmount() + delivery_fee}.00</p>
        </div>
      </div>
    </div>
  )
}

export default CartTotal
