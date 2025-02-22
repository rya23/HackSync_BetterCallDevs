import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, Navigate } from 'react-router-dom';

export default function Itinerary() {
    const location = useLocation();
    const tripData = location.state?.tripData;

    // Redirect if no trip data is present
    if (!tripData) {
        return <Navigate to="/trip-planner" replace />;
    }

    // Generate activities based on preferences
    const generateDailyActivities = () => {
        const activities = [];
        for (let i = 0; i < tripData.duration; i++) {
            activities.push({
                day: i + 1,
                activities: generateActivitiesForDay(tripData.activities)
            });
        }
        return activities;
    };

    // Helper function to generate activities for a day
    const generateActivitiesForDay = (preferredActivities) => {
        // This is a simplified version - you might want to make this more sophisticated
        return [
            {
                time: "09:00 AM",
                activity: `Morning ${preferredActivities[0] || 'Sightseeing'}`,
                description: "Start your day with an exciting activity.",
                duration: "2 hours",
                cost: tripData.budget === 'Low' ? "€20" : tripData.budget === 'Medium' ? "€40" : "€60"
            },
            {
                time: "12:00 PM",
                activity: `Afternoon ${preferredActivities[1] || 'Experience'}`,
                description: "Continue your adventure with this activity.",
                duration: "3 hours",
                cost: tripData.budget === 'Low' ? "€30" : tripData.budget === 'Medium' ? "€50" : "€70"
            },
            {
                time: "16:00 PM",
                activity: `Evening ${preferredActivities[2] || 'Activity'}`,
                description: "End your day with this exciting activity.",
                duration: "2 hours",
                cost: tripData.budget === 'Low' ? "€25" : tripData.budget === 'Medium' ? "€45" : "€65"
            }
        ];
    };

    const itineraryData = {
        destination: tripData.destination,
        duration: tripData.duration,
        budget: tripData.budget,
        travelWith: tripData.travelWith,
        activities: tripData.activities,
        days: generateDailyActivities()
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto text-center mb-12"
            >
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Your Trip to {itineraryData.destination}
                </h1>
                <div className="flex flex-wrap justify-center gap-4 items-center">
                    <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                        {itineraryData.duration} Days
                    </span>
                    <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                        {itineraryData.budget} Budget
                    </span>
                    <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                        {itineraryData.travelWith}
                    </span>
                </div>
            </motion.div>

            {/* Timeline Section */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto"
            >
                {itineraryData.days.map((day, dayIndex) => (
                    <motion.div
                        key={day.day}
                        variants={itemVariants}
                        className="mb-12"
                    >
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                                {day.day}
                            </div>
                            <div className="h-px flex-1 bg-gray-300 ml-4"></div>
                        </div>

                        <div className="space-y-6">
                            {day.activities.map((activity, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {activity.activity}
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                {activity.description}
                                            </p>
                                        </div>
                                        <span className="text-lg font-medium text-gray-900">
                                            {activity.time}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {activity.duration}
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {activity.cost}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-4xl mx-auto mt-12 flex justify-center gap-4"
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition-colors"
                >
                    Download Itinerary
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 border-2 border-black text-black rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                    Share Itinerary
                </motion.button>
            </motion.div>
        </div>
    );
}