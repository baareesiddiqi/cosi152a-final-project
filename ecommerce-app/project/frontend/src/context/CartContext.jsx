import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const exists = state.items.find(i => i._id === action.item._id)
      const items = exists
        ? state.items.map(i => i._id === action.item._id ? { ...i, qty: i.qty + (action.item.qty || 1) } : i)
        : [...state.items, { ...action.item, qty: action.item.qty || 1 }]
      return { ...state, items }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i._id !== action.id) }
    case 'UPDATE_QTY':
      return { ...state, items: state.items.map(i => i._id === action.id ? { ...i, qty: action.qty } : i) }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'SET_SHIPPING':
      return { ...state, shippingAddress: action.address }
    case 'SET_PAYMENT':
      return { ...state, paymentMethod: action.method }
    default:
      return state
  }
}

const initial = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
  shippingAddress: JSON.parse(localStorage.getItem('shipping') || 'null'),
  paymentMethod: 'PayPal'
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initial)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart.items))
  }, [cart.items])

  useEffect(() => {
    if (cart.shippingAddress) localStorage.setItem('shipping', JSON.stringify(cart.shippingAddress))
  }, [cart.shippingAddress])

  const itemCount = cart.items.reduce((acc, i) => acc + i.qty, 0)
  const subtotal = cart.items.reduce((acc, i) => acc + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, dispatch, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
