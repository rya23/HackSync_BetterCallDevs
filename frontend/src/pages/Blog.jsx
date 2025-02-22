import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogCards } from '../assets/blogData';

export default function Blog() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 grid-flow-row mt-8 px-4 md:px-8 mb-4"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {blogCards.map((card) => (
                <motion.div 
                    key={card.id}
                    variants={item}
                    whileHover={{ 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                    }}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300"
                >
                    <Link to={`/blog/${card.id}`} className="block">
                        <div className="relative overflow-hidden">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.4 }}
                                className="aspect-[3/2]"
                            >
                                <img 
                                    src={card.image} 
                                    alt={card.title} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"/>
                            </motion.div>
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                <p className="text-sm font-medium text-gray-800">{card.date}</p>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="h-px flex-1 bg-gray-200"></div>
                                <motion.div 
                                    whileHover={{ rotate: 180 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-8 h-8 rounded-full border-2 border-gray-800 flex items-center justify-center"
                                >
                                    <svg className="w-4 h-4 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </motion.div>
                                <div className="h-px flex-1 bg-gray-200"></div>
                            </div>

                            <h4 className="text-xl font-semibold text-gray-900 group-hover:text-black transition-colors duration-200 mb-2 line-clamp-2">
                                {card.title}
                            </h4>
                            
                            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                {card.content.substring(0, 120)}...
                            </p>

                            <div className="flex items-center justify-between">
                                <motion.div 
                                    whileHover={{ x: 5 }}
                                    className="text-sm font-medium text-gray-900 flex items-center"
                                >
                                    Read More
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </motion.div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );
}