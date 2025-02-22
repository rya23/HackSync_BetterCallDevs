import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
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
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>DevBlog</span>
                        </Link>
                    </motion.h1>

                    {/* Navigation Links */}
                    <ul className="hidden md:flex items-center space-x-8">
                        {['Home', 'Trip Planner', 'Blog'].map((item) => (
                            <motion.li 
                                key={item}
                                whileHover={{ y: -2 }}
                                whileTap={{ y: 0 }}
                            >
                                <Link 
                                    to={item === 'Trip Planner' ? '/trip-planner' : '/blog'} 
                                    className="relative text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                                >
                                    {item}
                                    <motion.div
                                        className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-gray-500 to-gray-900 origin-left"
                                        initial={{ scaleX: 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </Link>
                            </motion.li>
                        ))}
                    </ul>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative px-6 py-2 group rounded-xl overflow-hidden"
                        >
                            <span className="relative z-10 text-gray-900 font-medium">
                                Login
                            </span>
                            <div className="absolute inset-0 h-full w-full border-2 border-black rounded-xl transform transition-transform group-hover:translate-x-1 group-hover:translate-y-1"/>
                            <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-white to-gray-100 border-2 border-black rounded-xl"/>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative px-6 py-2 group rounded-xl overflow-hidden"
                        >
                            <span className="relative z-10 text-white font-medium">
                                Sign Up
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black transform transition-transform group-hover:translate-x-1 group-hover:translate-y-1 rounded-xl"/>
                            <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-black to-gray-800 border-2 border-black rounded-xl"/>
                        </motion.button>

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-50 to-gray-100"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
