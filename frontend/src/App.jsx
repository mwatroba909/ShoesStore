import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";

import Navbar from "./components/Navbar.jsx";
import { Toaster } from "react-hot-toast";
import { useUser } from "./stores/useUser.js";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import { useCart } from "./stores/useCart.js";
import CartPage from "./pages/CartPage.jsx";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage.jsx";
import PurchaseCancelPage from "./pages/PurchaseCancelPage.jsx";

function App() {
  const {user, checkAuth, checkingAuth} = useUser()
  const { getCartItems } = useCart()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if(!user) return; 
    
    getCartItems()
  },[getCartItems, user])

  if(checkingAuth) return <LoadingSpinner />

  return (
    <div className='min-h-screen bg-gradient-to-b from-purple-950 to-purple-900 text-white'>
      
      <div className="pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to='/' />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to='/' />} />
          <Route path="/admin-Dashboard" element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/login"/>} />
          <Route path='/category/:category' element={<CategoryPage />} />
          <Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
					<Route
						path='/purchase-success'
						element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />}
					/>
					<Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
