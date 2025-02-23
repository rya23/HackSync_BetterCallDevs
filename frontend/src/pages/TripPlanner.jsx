import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const slideIn = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
};

export default function TripPlanner() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        destination: '',
        date: '',
        duration: 3,
        budget: '',
        travelWith: '',
        activities: [],
    });
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleBudgetSelect = (budget) => {
        setFormData({
            ...formData,
            budget,
        });
    };

    const handleTravelWithSelect = (travelWith) => {
        setFormData({
            ...formData,
            travelWith,
        });
    };

    const handleActivityToggle = (activity) => {
        setFormData((prev) => ({
            ...prev,
            activities: prev.activities.includes(activity)
                ? prev.activities.filter((a) => a !== activity)
                : [...prev.activities, activity],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Navigate to itinerary page with form data
        navigate('/itenary', { state: { tripData: formData } });
    };

    return (
        <div className="flex flex-col lg:flex-row gap-16 max-w-7xl mx-auto px-4 py-12">
            {/* Left Column - Form */}
            <motion.div
                className="flex-1 sm:flex-[0_0_65%] xl:flex-[0_0_55%] sm:mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    Tell us your travel
                    <span className="bg-gradient-to-r from-black to-neutral-700 bg-clip-text text-transparent"> preferences</span>
                </h1>
                <p className="mb-12 text-gray-600 text-lg leading-relaxed">
                    Just provide some basic information, and our trip planner will generate a customized itinerary based on your
                    preferences.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                    {/* Destination Section */}
                    <motion.div
                        className="space-y-4"
                        initial="hidden"
                        animate="visible"
                        variants={slideIn}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            <h2 className="font-medium text-xl">What is your destination of choice?</h2>
                        </div>
                        <input
                            type="text"
                            name="destination"
                            value={formData.destination}
                            onChange={handleInputChange}
                            placeholder="e.g., New York, Paris, Tokyo"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-800 
                                focus:ring-1 focus:ring-gray-800 transition-all duration-200"
                        />
                    </motion.div>

                    {/* Date Section */}
                    <motion.div
                        className="space-y-4"
                        initial="hidden"
                        animate="visible"
                        variants={slideIn}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <h2 className="font-medium text-xl">When are you planning to travel?</h2>
                        </div>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-800 
                                focus:ring-1 focus:ring-gray-800 transition-all duration-200"
                        />
                    </motion.div>

                    {/* Duration Section */}
                    <motion.div
                        className="space-y-4"
                        initial="hidden"
                        animate="visible"
                        variants={slideIn}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h2 className="font-medium text-xl">How many days are you planning to travel?</h2>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-300">
                            <span className="text-gray-600">Days</span>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            duration: Math.max(1, prev.duration - 1),
                                        }))
                                    }
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                </button>
                                <span className="text-xl font-medium min-w-[2rem] text-center">{formData.duration}</span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            duration: prev.duration + 1,
                                        }))
                                    }
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Budget Section */}
                    <motion.div
                        className="space-y-4"
                        initial="hidden"
                        animate="visible"
                        variants={slideIn}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h2 className="font-medium text-xl">What is your budget?</h2>
                        </div>
                        <p className="text-gray-500 text-sm">
                            The budget is exclusively allocated for activities and dining purposes.
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                            {['Low', 'Medium', 'High'].map((budget) => (
                                <button
                                    key={budget}
                                    type="button"
                                    onClick={() => handleBudgetSelect(budget)}
                                    className={`p-4 rounded-lg border transition-colors duration-500 ${
                                        formData.budget === budget ? 'border-2 border-gray-800 bg-gray-200' : 'border border-gray-300'
                                    }`}
                                >
                                    {budget}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Who do you plan on traveling with? Section */}
                    <motion.div
                        className="space-y-4"
                        initial="hidden"
                        animate="visible"
                        variants={slideIn}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM12 12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"
                                />
                            </svg>
                            <h2 className="font-medium text-xl">Who do you plan on traveling with?</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {['Solo', 'Couple', 'Family', 'Friends'].map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => handleTravelWithSelect(option)}
                                    className={`p-4 rounded-lg border transition-colors duration-500 ${
                                        formData.travelWith === option ? 'border-2 border-gray-800 bg-gray-200' : 'border border-gray-300'
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Which activities are you interested in? Section */}
                    <motion.div
                        className="space-y-4"
                        initial="hidden"
                        animate="visible"
                        variants={slideIn}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM12 12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"
                                />
                            </svg>
                            <h2 className="font-medium text-xl">Which activities are you interested in?</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                'Beaches',
                                'City Sightseeing',
                                'Outdoor Adventures',
                                'Festivals/Events',
                                'Food Exploration',
                                'Nightlife',
                                'Shopping',
                                'Spa Wellness',
                            ].map((activity) => (
                                <button
                                    key={activity}
                                    type="button"
                                    onClick={() => handleActivityToggle(activity)}
                                    className={`p-4 rounded-lg border transition-colors duration-500 ${
                                        formData.activities.includes(activity) ? 'border-2 border-gray-800 bg-gray-200' : 'border border-gray-300'
                                    }`}
                                >
                                    {activity}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Submit Button */}
                    <div className="fixed bottom-0 left-0 w-full py-4 px-4 bg-white border-t border-gray-200">
                        <div className="max-w-7xl mx-auto flex justify-end">
                            <motion.button
                                type="submit"
                                className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium
                                    hover:bg-gray-800 transform hover:scale-[1.05] transition-all duration-300
                                    flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Generate Itinerary
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    />
                                </svg>
                            </motion.button>
                        </div>
                    </div>
                </form>
            </motion.div>

            {/* Right Column - Preview/Image */}
            <motion.div
                className="hidden lg:block flex-1"
                initial="hidden"
                animate="visible"
                variants={slideIn}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <div className="sticky top-24">
                    <img
                        src="https://goingawesomeplaces.com/wp-content/uploads/2017/10/Art-of-Trip-Planning-Featured.jpg"
                        alt="Trip Planning Preview"
                        className="w-full h-auto rounded-2xl shadow-2xl"
                    />
                    <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                        <h3 className="text-xl font-semibold mb-4">Why plan with us?</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>AI-powered personalized recommendations</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Real-time availability updates</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>24/7 travel support</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
