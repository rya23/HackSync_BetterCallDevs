import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

export default function Navbar() {
    const [user, setUser] = useState(auth.currentUser);
    const navigate = useNavigate();

    auth.onAuthStateChanged((user) => {
        setUser(user);
    });

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/');
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <motion.h1
                        className="text-2xl font-bold text-gray-900"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to="/" className="flex items-center space-x-2">
                            <img src="/logo-logo.png" alt="WayFinder Logo" className="w-8 h-8" />
                            <span>WayFinder</span>
                        </Link>
                    </motion.h1>

                    {/* Navigation Links */}
                    <ul className="hidden md:flex items-center space-x-8">
                        <motion.li whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                            <Link
                                to="/"
                                className="relative text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                            >
                                Home
                            </Link>
                        </motion.li>
                        {user && (
                            <motion.li whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                                <Link
                                    to="/trip-planner"
                                    className="relative text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                                >
                                    Trip Planner
                                </Link>
                            </motion.li>
                        )}
                        {user && (
                            <motion.li whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                                <Link
                                    to="/my-itineraries"
                                    className="relative text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                                >
                                    My Itineraries
                                </Link>
                            </motion.li>
                        )}
                        <motion.li whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                            <Link
                                to="/blog"
                                className="relative text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                            >
                                Blog
                            </Link>
                        </motion.li>
                    </ul>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700">{user.displayName}</span>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSignOut}
                                    className="relative px-6 py-2 group rounded-xl overflow-hidden"
                                >
                                    <span className="relative z-10 text-gray-900 font-medium">Sign Out</span>
                                    <div className="absolute inset-0 h-full w-full border-2 border-black rounded-xl transform transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                                    <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-white to-gray-100 border-2 border-black rounded-xl" />
                                </motion.button>
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGoogleSignIn}
                                className="relative px-6 py-2 group rounded-xl overflow-hidden"
                            >
                                <span className="relative z-10 text-white font-medium">Sign In with Google</span>
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black transform transition-transform group-hover:translate-x-1 group-hover:translate-y-1 rounded-xl" />
                                <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-black to-gray-800 border-2 border-black rounded-xl" />
                            </motion.button>
                        )}

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-50 to-gray-100"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
