import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogCards } from '../assets/blogData';
import { motion } from 'framer-motion';

const BlogPost = () => {
    const { id } = useParams();
    const blogPost = blogCards.find(card => card.id === parseInt(id));

    if (!blogPost) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Blog post not found.</h2>
                    <Link to="/blog" className="mt-4 inline-block text-gray-600 hover:text-gray-900">
                        Return to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
            {/* Side Navigation Arrows */}
            {blogPost.id > 1 && (
                <Link to={`/blog/${blogPost.id - 1}`}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ x: -5, scale: 1.1 }}
                        className="fixed left-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 group"
                    >
                        <svg className="w-6 h-6 text-gray-600 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </motion.div>
                </Link>
            )}
            
            {blogPost.id < blogCards.length && (
                <Link to={`/blog/${blogPost.id + 1}`}>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ x: 5, scale: 1.1 }}
                        className="fixed right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 group"
                    >
                        <svg className="w-6 h-6 text-gray-600 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </motion.div>
                </Link>
            )}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-4xl mx-auto"
            >
                {/* Back Button */}
                <Link 
                    to="/blog"
                    className="inline-flex items-center mb-8 text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
                >
                    <motion.svg 
                        whileHover={{ x: -4 }}
                        className="w-5 h-5 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </motion.svg>
                    <span className="group-hover:underline">Back to Blog</span>
                </Link>

                {/* Main Content */}
                <article className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gray-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-200 rounded-full translate-y-1/2 -translate-x-1/2 opacity-20"></div>

                    {/* Header Section */}
                    <motion.div 
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="relative h-[400px] overflow-hidden"
                    >
                        <img 
                            src={blogPost.image} 
                            alt={blogPost.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                        
                        {/* Title Overlay */}
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="absolute bottom-0 left-0 right-0 p-8 text-white"
                        >
                            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
                                {blogPost.title}
                            </h1>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                    {blogPost.date}
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Content Section */}
                    <div className="relative px-8 sm:px-12 py-10">
                        {/* Decorative Line */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200"></div>

                        {/* Content */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="prose prose-lg max-w-none"
                        >
                            <p className="text-gray-700 leading-relaxed space-y-4 first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-gray-900">
                                {blogPost.content}
                            </p>
                        </motion.div>

                        {/* Decorative Footer */}
                        <div className="mt-12 flex items-center justify-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        </div>
                    </div>
                </article>
            </motion.div>
        </div>
    );
};

export default BlogPost;
