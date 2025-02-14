import React from 'react'
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUser } from '../stores/useUser';
import { useCart } from '../stores/useCart';

const Navbar = () => {
    const {user, logout} = useUser()
    const isAdmin = user?.role === 'admin'
    const { cart } = useCart()

    return (
        <header className='fixed top-0 left-0 w-full bg-purple-950/90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-purple-800'>
            <div className='container mx-auto px-4 py-3'>
                <div className='flex flex-wrap justify-between items-center'>
                    <Link to='/' className='text-2xl font-bold text-purple-400 items-center space-x-2 flex'>
                        ShoeShop
                    </Link>

                    <nav className='flex flex-wrap items-center gap-4'>
                        {user && (
                            <Link
                                to={"/cart"}
                                className='relative group text-gray-300 hover:text-purple-400 transition duration-300 ease-in-out'
                            >
                                <ShoppingCart className='inline-block mr-1 group-hover:text-purple-400' size={20} />
                                <span className='hidden sm:inline'>Koszyk</span>
                                {cart.length > 0 && (
                                    <span
                                        className='absolute -top-2 -left-2 bg-purple-500 text-white rounded-full px-2 py-0.5 
                                        text-xs group-hover:bg-purple-400 transition duration-300 ease-in-out'
                                    >
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        )}
                        {isAdmin && (
                            <Link
                                className='bg-purple-700 hover:bg-purple-600 text-white px-3 py-1 rounded-md font-medium
                                transition duration-300 ease-in-out flex items-center'
                                to={"/admin-Dashboard"}
                            >
                                <Lock className='inline-block mr-1' size={18} />
                                <span className='hidden sm:inline'>Panel Sterowania</span>
                            </Link>
                        )}

                        {user ? (
                            <button
                                className='bg-gray-700 hover:bg-purple-600 text-white py-2 px-4 
                                rounded-md flex items-center transition duration-300 ease-in-out'
                                onClick={logout}
                            >
                                <LogOut size={18} />
                                <span className='hidden sm:inline ml-2'>Wyloguj</span>
                            </button>
                        ) : (
                            <>
                                <Link
                                    to={"/signup"}
                                    className='bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 
                                    rounded-md flex items-center transition duration-300 ease-in-out'
                                >
                                    <UserPlus className='mr-2' size={18} />
                                    Zarejestruj sie
                                </Link>
                                <Link
                                    to={"/login"}
                                    className='bg-gray-700 hover:bg-purple-600 text-white py-2 px-4 
                                    rounded-md flex items-center transition duration-300 ease-in-out'
                                >
                                    <LogIn className='mr-2' size={18} />
                                    Zaloguj sie
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;