import { CartProvider } from './context/CartProvider'
import Header from './components/Header/Header'
import ProductPage from './pages/ProductPage'

export default function App() {
  return (
    <CartProvider>
      <Header />
      <ProductPage />
    </CartProvider>
  )
}
