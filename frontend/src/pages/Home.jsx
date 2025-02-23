import { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Footer from '../components/Footer';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { toast } from 'react-toastify';

export default function Home() {
    const { scrollY } = useScroll();
    const heroRef = useRef(null);
    const contentRef = useRef(null);
    const ctaRef = useRef(null);
    const faqRef = useRef(null);
    const postsRef = useRef(null);

    // Parallax effect for hero section
    const heroY = useTransform(scrollY, [0, 500], [0, -150]);
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        fade: true,
        cssEase: 'linear',
        arrows: false,
    };

    const images = [
        {
            url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
            caption: "Discover Nature's Beauty",
        },
        {
            url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
            caption: 'Explore Hidden Gems',
        },
        {
            url: 'https://images.unsplash.com/photo-1433838552652-f9a46b332c40',
            caption: 'Experience Adventure',
        },
    ];

    const features = [
        {
            icon: '🎯',
            title: 'Personalized Itineraries',
            desc: 'AI-powered custom travel plans tailored to your preferences and travel style',
        },
        {
            icon: '🌟',
            title: 'Smart Recommendations',
            desc: 'Data-driven suggestions for attractions, restaurants, and activities',
        },
        { icon: '🎨', title: 'Dynamic Planning', desc: 'Real-time adjustments and optimization of your travel schedule' },
        { icon: '🌍', title: 'Global Coverage', desc: 'Access to worldwide destinations and local insights' },
        { icon: '⚡', title: 'Instant Generation', desc: 'Create complete itineraries in seconds with AI' },
        { icon: '💰', title: 'Budget Optimization', desc: 'Smart cost management and expense tracking' },
    ];

    // Add new statistics data
    const stats = [
        { number: '50K+', label: 'Happy Travelers' },
        { number: '100+', label: 'Countries Covered' },
        { number: '1M+', label: 'Itineraries Created' },
        { number: '4.9/5', label: 'User Rating' },
    ];

    // Add how it works steps
    const howItWorks = [
        {
            step: 1,
            title: 'Share Your Preferences',
            description: 'Tell us about your travel style, interests, and budget',
            icon: '📝',
        },
        {
            step: 2,
            title: 'AI Processing',
            description: 'Our AI analyzes millions of data points to create your perfect trip',
            icon: '🤖',
        },
        {
            step: 3,
            title: 'Get Your Itinerary',
            description: 'Receive a detailed day-by-day plan with all the details you need',
            icon: '✨',
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut',
            },
        },
    };

    const floatingAnimation = {
        y: [-10, 10],
        transition: {
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
        },
    };

    return (
        <div className="w-full">
            {/* Hero Section */}
            <motion.section ref={heroRef} className="relative min-h-screen" style={{ y: heroY, opacity: heroOpacity }}>
                <div className="absolute inset-0">
                    <Slider {...carouselSettings}>
                        {images.map((image, index) => (
                            <div key={index} className="relative h-screen">
                                <motion.div
                                    className="absolute inset-0"
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 10 }}
                                >
                                    <img src={image.url} alt={image.caption} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50"></div>
                                </motion.div>
                            </div>
                        ))}
                    </Slider>
                </div>

                <motion.div
                    className="relative z-10 pt-32 px-6"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-8 text-center">
                        <motion.h1
                            className="text-6xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg"
                            animate={floatingAnimation}
                        >
                            Craft Unforgettable Itineraries with{' '}
                            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                AI Travel Planner
                            </span>
                        </motion.h1>

                        <motion.p
                            className="text-2xl text-gray-200 max-w-3xl leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Your personal trip planner and travel curator, creating custom itineraries tailored to your interests
                            and budget.
                        </motion.p>

                        <motion.div
                            className="flex gap-6 mt-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <motion.div>
                                <Link
                                    onClick={(e) => {
                                        if (!auth.currentUser) {
                                            e.preventDefault();
                                            toast.warning('Please sign in to create an itinerary', {
                                                position: 'top-center',
                                                autoClose: 3000,
                                                hideProgressBar: false,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: true,
                                            });
                                        }
                                    }}
                                    to="/trip-planner"
                                    className="bg-white text-black px-8 py-4 rounded-lg text-lg font-medium 
                                        hover:bg-gray-200 transition-all duration-300 transform hover:scale-[1.05] 
                                        shadow-lg group flex items-center gap-3"
                                >
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        Get Started
                                        <motion.span
                                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            ✈️
                                        </motion.span>
                                    </motion.div>
                                </Link>
                            </motion.div>
                            <motion.button
                                className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg text-lg font-medium 
                                    hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.05]"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Learn More
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.section>

            {/* Main Content Section */}
            <div ref={contentRef}>
                {/* Features Section */}
                <motion.section
                    className="py-32 px-6 bg-white"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.h2 className="text-4xl md:text-5xl font-bold text-center mb-16" variants={itemVariants}>
                        Features that make travel planning
                        <span className="bg-gradient-to-r from-black to-neutral-700 bg-clip-text text-transparent">
                            {' '}
                            effortless
                        </span>
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="feature-card bg-white rounded-xl p-8 border border-gray-200 
                                    shadow-lg hover:shadow-xl transition-shadow duration-300
                                    flex flex-col items-center text-center"
                                variants={itemVariants}
                                whileHover={{
                                    scale: 1.05,
                                    rotate: [0, 2, -2, 0],
                                    transition: { duration: 0.3 },
                                }}
                            >
                                <motion.div className="text-4xl mb-4" animate={floatingAnimation}>
                                    {feature.icon}
                                </motion.div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Stats Section */}
                <motion.section
                    className="py-24 px-6 bg-[url('https://images.unsplash.com/photo-1469474968028-56623f02e42e')] bg-fixed bg-cover relative"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                    <div className="relative z-10 max-w-6xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <motion.h3
                                        className="text-4xl md:text-5xl font-bold mb-2"
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        {stat.number}
                                    </motion.h3>
                                    <p className="text-gray-300">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* How It Works Section */}
                <motion.section
                    className="py-32 px-6 bg-gradient-to-b from-gray-50 to-white"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <div className="max-w-6xl mx-auto">
                        <motion.h2 className="text-4xl md:text-5xl font-bold text-center mb-16" variants={itemVariants}>
                            How It
                            <span className="bg-gradient-to-r from-black to-neutral-700 bg-clip-text text-transparent">
                                {' '}
                                Works
                            </span>
                        </motion.h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {howItWorks.map((item, index) => (
                                <motion.div key={index} className="relative" variants={itemVariants}>
                                    <motion.div
                                        className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl
                                            hover:shadow-2xl transition-all duration-300"
                                        whileHover={{ y: -10 }}
                                    >
                                        <motion.div className="text-4xl mb-4" animate={floatingAnimation}>
                                            {item.icon}
                                        </motion.div>
                                        <h3 className="text-2xl font-semibold mb-4">
                                            <span className="text-gray-400 mr-2">{item.step}.</span>
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600">{item.description}</p>
                                    </motion.div>
                                    {index < howItWorks.length - 1 && (
                                        <motion.div
                                            className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-4xl text-gray-300"
                                            animate={{ x: [0, 10, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            →
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* AI Capabilities Section */}
                <motion.section
                    className="py-24 px-6 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080')] bg-cover bg-fixed relative"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>
                    <div className="relative z-10 max-w-6xl mx-auto text-white">
                        <motion.h2 className="text-4xl md:text-5xl font-bold text-center mb-16" variants={itemVariants}>
                            AI-Powered
                            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                {' '}
                                Capabilities
                            </span>
                        </motion.h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    title: 'Natural Language Processing',
                                    description:
                                        'Simply tell us what you want in your own words, and our AI understands your preferences',
                                    icon: '🗣️',
                                },
                                {
                                    title: 'Real-time Optimization',
                                    description:
                                        'Continuous adjustment of your itinerary based on weather, events, and local conditions',
                                    icon: '⚡',
                                },
                                {
                                    title: 'Local Expertise',
                                    description: 'Access to vast database of local knowledge and hidden gems',
                                    icon: '🏛️',
                                },
                                {
                                    title: 'Smart Scheduling',
                                    description:
                                        'Optimal timing and routing for attractions, considering opening hours and travel time',
                                    icon: '⏰',
                                },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <motion.div className="text-4xl mb-4" animate={floatingAnimation}>
                                        {item.icon}
                                    </motion.div>
                                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                                    <p className="text-gray-300">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* CTA Section */}
                <motion.section
                    ref={ctaRef}
                    className="py-24 px-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <motion.div
                        className="max-w-6xl mx-auto relative rounded-3xl bg-gradient-to-r from-gray-50 to-white p-12 md:p-16 
                            shadow-lg border border-gray-100"
                        initial={{ scale: 0.95 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="absolute inset-0 bg-grid-pattern opacity-10 rounded-3xl"></div>

                        <div className="relative z-10 text-center">
                            <motion.h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight" animate={floatingAnimation}>
                                Start Your Journey with
                                <span className="bg-gradient-to-r from-black to-neutral-700 bg-clip-text text-transparent">
                                    {' '}
                                    AI Travel Planner
                                </span>
                            </motion.h2>
                            <motion.p
                                className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                Skip the manual planning. Let AI create your perfect itinerary, completely free.
                            </motion.p>
                            <motion.button
                                className="bg-black text-white px-8 py-4 rounded-xl text-lg font-medium 
                                    hover:bg-black/90 transition-all duration-300 transform hover:scale-[1.05] 
                                    shadow-lg hover:shadow-black/20 group flex items-center gap-3 mx-auto"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Get Started - It's Free
                                <motion.svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <path d="M5 12h14m-7-7 7 7-7 7" />
                                </motion.svg>
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.section>

                {/* FAQ Section */}
                <motion.section
                    ref={faqRef}
                    className="py-32 px-6 bg-gray-900 text-white"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <div className="max-w-4xl mx-auto">
                        <motion.h2 className="text-center text-4xl font-bold mb-16" variants={itemVariants}>
                            Frequently Asked
                            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                {' '}
                                Questions
                            </span>
                        </motion.h2>

                        <motion.div className="space-y-6" variants={containerVariants}>
                            {/* FAQ Items with stagger animation */}
                            <AnimatePresence>
                                <motion.div
                                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 
                                        shadow-lg hover:shadow-xl transition-shadow duration-300 group"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-3 text-white">
                                        <motion.span
                                            className="text-2xl"
                                            animate={{ rotate: [0, 10, -10, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            🤔
                                        </motion.span>
                                        What is AI Travel Planner?
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                                        AI Travel Planner is your intelligent travel companion that uses advanced AI technology to
                                        create personalized travel itineraries based on your preferences, budget, and travel
                                        style. It's designed to make trip planning effortless and enjoyable.
                                    </p>
                                </motion.div>

                                <motion.div
                                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 
                                        shadow-lg hover:shadow-xl transition-shadow duration-300 group"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-3 text-white">
                                        <motion.span
                                            className="text-2xl"
                                            animate={{ rotate: [0, 10, -10, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                                        >
                                            💰
                                        </motion.span>
                                        Is AI Travel Planner free to use?
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                                        Yes! AI Travel Planner offers a generous free tier that includes basic itinerary planning
                                        and recommendations. For advanced features and unlimited planning, we offer premium plans
                                        tailored to different needs.
                                    </p>
                                </motion.div>

                                <motion.div
                                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 
                                        shadow-lg hover:shadow-xl transition-shadow duration-300 group"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-3 text-white">
                                        <motion.span
                                            className="text-2xl"
                                            animate={{ rotate: [0, 10, -10, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                                        >
                                            📱
                                        </motion.span>
                                        Can I access my itineraries offline?
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                                        Absolutely! You can download your itineraries as PDFs for offline access. This ensures you
                                        always have access to your travel plans, even in areas with limited internet connectivity.
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Featured Posts Section */}
                <motion.section
                    ref={postsRef}
                    className="py-32 px-6 bg-white"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <div className="max-w-6xl mx-auto">
                        <motion.h2 className="text-4xl md:text-5xl font-bold mb-16 text-center" variants={itemVariants}>
                            Featured
                            <span className="bg-gradient-to-r from-black to-neutral-700 bg-clip-text text-transparent">
                                {' '}
                                Posts
                            </span>
                        </motion.h2>

                        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={containerVariants}>
                            {[1, 2, 3].map((index) => (
                                <motion.div
                                    key={index}
                                    className="post-card group"
                                    variants={itemVariants}
                                    whileHover={{
                                        scale: 1.05,
                                        transition: { duration: 0.3 },
                                    }}
                                >
                                    <div
                                        className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-gray-900 to-black
                                        shadow-lg hover:shadow-xl transition-shadow duration-500 text-white"
                                    >
                                        <motion.div
                                            className="overflow-hidden"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <img
                                                src={images[index - 1].url}
                                                alt="Post thumbnail"
                                                className="aspect-[3/2] object-cover w-full opacity-80 hover:opacity-100 transition-opacity"
                                            />
                                        </motion.div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="bg-white text-black text-sm px-3 py-1 rounded-full font-medium">
                                                    Travel Tips
                                                </span>
                                                <span className="text-gray-400 text-sm">15 Mar, 2024</span>
                                            </div>
                                            <h3 className="text-xl font-semibold mb-3 line-clamp-1 group-hover:text-white/90 transition-colors">
                                                Ultimate Guide to Smart Travel Planning
                                            </h3>
                                            <p className="text-gray-300 text-sm line-clamp-2 group-hover:text-gray-100 transition-colors">
                                                Discover how AI-powered travel planning can transform your journey from ordinary
                                                to extraordinary. Learn expert tips for creating the perfect itinerary.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>
            </div>
        </div>
    );
}
