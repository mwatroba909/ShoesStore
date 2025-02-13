import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"

import Navbar from "./components/Navbar.jsx"

function App() {
  return (
    <div>
      <div className="min-h-screen bg-gray-100 text-white relative overflow-hidden"> 

      </div>

      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />\
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  )
}

export default App
