import { useEffect, useRef } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "../components/Footer";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

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
        cssEase: "linear",
        arrows: false
    };

    const images = [
        {
            url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
            caption: "Discover Nature's Beauty"
        },
        {
            url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d",
            caption: "Explore Hidden Gems"
        },
        {
            url: "https://images.unsplash.com/photo-1433838552652-f9a46b332c40",
            caption: "Experience Adventure"
        }
    ];

    const features = [
        { icon: "🎯", title: "Personalized Itineraries", desc: "Tailored to your preferences" },
        { icon: "🌟", title: "AI-Powered", desc: "Smart recommendations" },
        { icon: "🎨", title: "Custom Experience", desc: "Unique travel moments" }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const floatingAnimation = {
        y: [-10, 10],
        transition: {
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
        }
    };

    return (
        <div className="w-full">
            {/* Hero Section */}
            <motion.section 
                ref={heroRef} 
                className="relative min-h-screen"
                style={{ y: heroY, opacity: heroOpacity }}
            >
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
                                    <img 
                                        src={image.url} 
                                        alt={image.caption}
                                        className="w-full h-full object-cover"
                                    />
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
                            Craft Unforgettable Itineraries with{" "}
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
                            Your personal trip planner and travel curator, creating custom itineraries 
                            tailored to your interests and budget.
                        </motion.p>

                        <motion.div 
                            className="flex gap-6 mt-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <motion.button 
                                className="bg-white text-black px-8 py-4 rounded-lg text-lg font-medium 
                                    hover:bg-gray-200 transition-all duration-300 transform hover:scale-[1.05] 
                                    shadow-lg group flex items-center gap-3"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Get Started
                                <motion.svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="24" 
                                    height="24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                    className="group-hover:translate-x-1 transition-transform duration-300"
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <path d="M5 12h14m-7-7 7 7-7 7"/>
                                </motion.svg>
                            </motion.button>
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
                    <motion.h2 
                        className="text-4xl md:text-5xl font-bold text-center mb-16"
                        variants={itemVariants}
                    >
                        Features that make travel planning
                        <span className="bg-gradient-to-r from-black to-neutral-700 bg-clip-text text-transparent"> effortless</span>
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
                                    transition: { duration: 0.3 }
                                }}
                            >
                                <motion.div 
                                    className="text-4xl mb-4"
                                    animate={floatingAnimation}
                                >{feature.icon}</motion.div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.desc}</p>
                            </motion.div>
                        ))}
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
                            <motion.h2 
                                className="text-4xl md:text-5xl font-bold mb-8 leading-tight"
                                animate={floatingAnimation}
                            >
                                Start Your Journey with
                                <span className="bg-gradient-to-r from-black to-neutral-700 bg-clip-text text-transparent"> AI Travel Planner</span>
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
                                    <path d="M5 12h14m-7-7 7 7-7 7"/>
                                </motion.svg>
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.section>

                {/* FAQ Section */}
                <motion.section 
                    ref={faqRef} 
                    className="py-32 px-6 bg-gradient-to-b from-white to-gray-50"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <div className="max-w-4xl mx-auto">
                        <motion.h2 
                            className="text-center text-4xl font-bold mb-16"
                            variants={itemVariants}
                        >
                            Frequently Asked
                            <span className="bg-gradient-to-r from-black to-neutral-700 bg-clip-text text-transparent"> Questions</span>
                        </motion.h2>

                        <motion.div 
                            className="space-y-6"
                            variants={containerVariants}
                        >
                            {/* FAQ Items with stagger animation */}
                            <AnimatePresence>
                                <motion.div 
                                    className="bg-white rounded-2xl p-8 border border-gray-100 
                                        shadow-lg hover:shadow-xl transition-shadow duration-300 group"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                                        <motion.span 
                                            className="text-2xl"
                                            animate={{ rotate: [0, 10, -10, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >🤔</motion.span>
                                        What is AI Travel Planner?
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed group-hover:text-black transition-colors">
                                        AI Travel Planner is your intelligent travel companion that uses advanced AI technology 
                                        to create personalized travel itineraries based on your preferences, budget, and travel style. 
                                        It's designed to make trip planning effortless and enjoyable.
                                    </p>
                                </motion.div>

                                <motion.div 
                                    className="bg-white rounded-2xl p-8 border border-gray-100 
                                        shadow-lg hover:shadow-xl transition-shadow duration-300 group"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                                        <motion.span 
                                            className="text-2xl"
                                            animate={{ rotate: [0, 10, -10, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                                        >💰</motion.span>
                                        Is AI Travel Planner free to use?
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed group-hover:text-black transition-colors">
                                        Yes! AI Travel Planner offers a generous free tier that includes basic itinerary planning 
                                        and recommendations. For advanced features and unlimited planning, we offer premium 
                                        plans tailored to different needs.
                                    </p>
                                </motion.div>

                                <motion.div 
                                    className="bg-white rounded-2xl p-8 border border-gray-100 
                                        shadow-lg hover:shadow-xl transition-shadow duration-300 group"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                                        <motion.span 
                                            className="text-2xl"
                                            animate={{ rotate: [0, 10, -10, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                                        >📱</motion.span>
                                        Can I access my itineraries offline?
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed group-hover:text-black transition-colors">
                                        Absolutely! You can download your itineraries as PDFs for offline access. This ensures 
                                        you always have access to your travel plans, even in areas with limited internet connectivity.
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Featured Posts Section */}
                <motion.section 
                    ref={postsRef} 
                    className="py-32 px-6 bg-gradient-to-b from-gray-50 to-white"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <div className="max-w-6xl mx-auto">
                        <motion.h2 
                            className="text-4xl md:text-5xl font-bold mb-16 text-center"
                            variants={itemVariants}
                        >
                            Featured
                            <span className="bg-gradient-to-r from-black to-neutral-700 bg-clip-text text-transparent"> Posts</span>
                        </motion.h2>

                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                            variants={containerVariants}
                        >
                            {/* Post cards with hover animations */}
                            {[1, 2, 3].map((index) => (
                                <motion.div 
                                    key={index}
                                    className="post-card group"
                                    variants={itemVariants}
                                    whileHover={{ 
                                        scale: 1.05,
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    <div className="relative rounded-2xl overflow-hidden border border-gray-100 
                                        shadow-lg hover:shadow-xl transition-shadow duration-500">
                                        <motion.div 
                                            className="overflow-hidden"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <img 
                                                src={images[index - 1].url}
                                                alt="Post thumbnail" 
                                                className="aspect-[3/2] object-cover w-full"
                                            />
                                        </motion.div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="bg-black text-white text-sm px-3 py-1 rounded-full">Travel Tips</span>
                                                <span className="text-gray-500 text-sm">15 Mar, 2024</span>
                                            </div>
                                            <h3 className="text-xl font-semibold mb-3 line-clamp-1 group-hover:text-black/70 transition-colors">
                                                Ultimate Guide to Smart Travel Planning
                                            </h3>
                                            <p className="text-gray-600 text-sm line-clamp-2">
                                                Discover how AI-powered travel planning can transform your journey from ordinary to extraordinary. 
                                                Learn expert tips for creating the perfect itinerary.
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
