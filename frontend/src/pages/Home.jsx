import { useEffect, useRef } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "../components/Footer";

export default function Home() {
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

    const heroRef = useRef(null);
    const contentRef = useRef(null);
    const ctaRef = useRef(null);
    const faqRef = useRef(null);
    const postsRef = useRef(null);

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section ref={heroRef} className="relative min-h-screen">
                <div className="absolute inset-0">
                    <Slider {...carouselSettings}>
                        {images.map((image, index) => (
                            <div key={index} className="relative h-screen">
                                <div className="absolute inset-0">
                                    <img 
                                        src={image.url} 
                                        alt={image.caption}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50"></div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>

                <div className="relative z-10 pt-32 px-6">
                    <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-8 text-center">
                        <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
                            Craft Unforgettable Itineraries with{" "}
                            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                AI Travel Planner
                            </span>
                        </h1>
                        
                        <p className="text-2xl text-gray-200 max-w-3xl leading-relaxed">
                            Your personal trip planner and travel curator, creating custom itineraries 
                            tailored to your interests and budget.
                        </p>

                        <div className="flex gap-6 mt-4">
                            <button className="bg-white text-black px-8 py-4 rounded-lg text-lg font-medium 
                                hover:bg-gray-200 transition-all duration-300 transform hover:scale-[1.05] 
                                shadow-lg group flex items-center gap-3">
                                Get Started
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" 
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    className="group-hover:translate-x-1 transition-transform duration-300">
                                    <path d="M5 12h14m-7-7 7 7-7 7"/>
                                </svg>
                            </button>
                            <button className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg text-lg font-medium 
                                hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.05]">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Section */}
            <div ref={contentRef}>
                {/* Features Section */}
                <section className="py-32 px-6 bg-white">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
                        Features that make travel planning
                        <span className="bg-gradient-to-r from-black to-neutral-700 bg-clip-text text-transparent"> effortless</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card bg-white rounded-xl p-8 border border-gray-200 
                                shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-[1.02] 
                                flex flex-col items-center text-center">
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section ref={ctaRef} className="py-24 px-6">
                    <div className="max-w-6xl mx-auto relative rounded-3xl bg-gradient-to-r from-gray-50 to-white p-12 md:p-16 
                        shadow-lg border border-gray-100">
                        <div className="absolute inset-0 bg-grid-pattern opacity-10 rounded-3xl"></div>
                        
                        <div className="relative z-10 text-center">
                            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                                Start Your Journey with
                                <span className="bg-gradient-to-r from-black to-neutral-700 bg-clip-text text-transparent"> AI Travel Planner</span>
                            </h2>
                            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
                                Skip the manual planning. Let AI create your perfect itinerary, completely free.
                            </p>
                            <button className="bg-black text-white px-8 py-4 rounded-xl text-lg font-medium 
                                hover:bg-black/90 transition-all duration-300 transform hover:scale-[1.05] 
                                shadow-lg hover:shadow-black/20 group flex items-center gap-3 mx-auto">
                                Get Started - It's Free
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="24" 
                                    height="24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                    className="group-hover:translate-x-1 transition-transform duration-300"
                                >
                                    <path d="M5 12h14m-7-7 7 7-7 7"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section ref={faqRef} className="py-32 px-6 bg-gradient-to-b from-white to-gray-50">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-center text-4xl font-bold mb-16">
                            Frequently Asked
                            <span className="bg-gradient-to-r from-black to-neutral-700 bg-clip-text text-transparent"> Questions</span>
                        </h2>

                        <div className="space-y-6">
                            {/* FAQ Item 1 */}
                            <div className="bg-white rounded-2xl p-8 border border-gray-100 
                                shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                                    <span className="text-2xl">🤔</span>
                                    What is AI Travel Planner?
                                </h3>
                                <p className="text-gray-600 leading-relaxed group-hover:text-black transition-colors">
                                    AI Travel Planner is your intelligent travel companion that uses advanced AI technology 
                                    to create personalized travel itineraries based on your preferences, budget, and travel style. 
                                    It's designed to make trip planning effortless and enjoyable.
                                </p>
                            </div>

                            {/* FAQ Item 2 */}
                            <div className="bg-white rounded-2xl p-8 border border-gray-100 
                                shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                                    <span className="text-2xl">💰</span>
                                    Is AI Travel Planner free to use?
                                </h3>
                                <p className="text-gray-600 leading-relaxed group-hover:text-black transition-colors">
                                    Yes! AI Travel Planner offers a generous free tier that includes basic itinerary planning 
                                    and recommendations. For advanced features and unlimited planning, we offer premium 
                                    plans tailored to different needs.
                                </p>
                            </div>

                            {/* FAQ Item 3 */}
                            <div className="bg-white rounded-2xl p-8 border border-gray-100 
                                shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                                    <span className="text-2xl">📱</span>
                                    Can I access my itineraries offline?
                                </h3>
                                <p className="text-gray-600 leading-relaxed group-hover:text-black transition-colors">
                                    Absolutely! You can download your itineraries as PDFs for offline access. This ensures 
                                    you always have access to your travel plans, even in areas with limited internet connectivity.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Posts Section */}
                <section ref={postsRef} className="py-32 px-6 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
                            Featured
                            <span className="bg-gradient-to-r from-black to-neutral-700 bg-clip-text text-transparent"> Posts</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Post Card 1 */}
                            <div className="post-card group">
                                <div className="relative rounded-2xl overflow-hidden border border-gray-100 
                                    shadow-lg hover:shadow-xl transition-shadow duration-500">
                                    <div className="overflow-hidden">
                                        <img 
                                            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e" 
                                            alt="Travel Planning Tips" 
                                            className="aspect-[3/2] object-cover w-full scale-100 group-hover:scale-110 transition-all duration-500"
                                        />
                                    </div>
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
                            </div>

                            {/* Post Card 2 */}
                            <div className="post-card group">
                                <div className="relative rounded-2xl overflow-hidden border border-gray-100 
                                    shadow-lg hover:shadow-xl transition-shadow duration-500">
                                    <div className="overflow-hidden">
                                        <img 
                                            src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d" 
                                            alt="Hidden Destinations" 
                                            className="aspect-[3/2] object-cover w-full scale-100 group-hover:scale-110 transition-all duration-500"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="bg-black text-white text-sm px-3 py-1 rounded-full">Destinations</span>
                                            <span className="text-gray-500 text-sm">12 Mar, 2024</span>
                                        </div>
                                        <h3 className="text-xl font-semibold mb-3 line-clamp-1 group-hover:text-black/70 transition-colors">
                                            Hidden Gems: Unexplored Destinations
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-2">
                                            Discover lesser-known destinations that offer unique experiences. From secluded beaches 
                                            to charming mountain towns, explore the road less traveled.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Post Card 3 */}
                            <div className="post-card group">
                                <div className="relative rounded-2xl overflow-hidden border border-gray-100 
                                    shadow-lg hover:shadow-xl transition-shadow duration-500">
                                    <div className="overflow-hidden">
                                        <img 
                                            src="https://images.unsplash.com/photo-1433838552652-f9a46b332c40" 
                                            alt="Budget Travel" 
                                            className="aspect-[3/2] object-cover w-full scale-100 group-hover:scale-110 transition-all duration-500"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="bg-black text-white text-sm px-3 py-1 rounded-full">Budget</span>
                                            <span className="text-gray-500 text-sm">10 Mar, 2024</span>
                                        </div>
                                        <h3 className="text-xl font-semibold mb-3 line-clamp-1 group-hover:text-black/70 transition-colors">
                                            Budget-Friendly Travel in 2024
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-2">
                                            Expert strategies for maximizing your travel budget without compromising on experiences. 
                                            Smart booking tips and destination recommendations.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
