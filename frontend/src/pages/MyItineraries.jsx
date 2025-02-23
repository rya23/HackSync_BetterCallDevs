import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPinIcon, BuildingOffice2Icon, GlobeEuropeAfricaIcon } from '@heroicons/react/24/outline';

const cityIcons = {
    paris: '🗼',
    london: '🎡',
    'new york': '🗽',
    tokyo: '⛩️',
    rome: '🏛️',
    sydney: '🎨',
    dubai: '🏙️',
    hongkong: '🌉',
    singapore: '🌿',
    bangkok: '🏮',
    istanbul: '🕌',
    barcelona: '🎨',
    moscow: '🏰',
    berlin: '🖼️',
    amsterdam: '🚲',
    toronto: '🍁',
    losangeles: '🌴',
    lasvegas: '🎰',
    chicago: '🌆',
    sanfrancisco: '🌁',
    beijing: '🏯',
    seoul: '🎎',
    shanghai: '🏙️',
    cairo: '🐫',
    athens: '🏺',
    vienna: '🎼',
    prague: '⛪',
    madrid: '⚽',
    buenosaires: '💃',
    capeTown: '🦁',
    saoPaulo: '🎭',
    mexicoCity: '🌮',
    jakarta: '🌋',

    // Indian Cities
    mumbai: '🌊',
    delhi: '🕌',
    bangalore: '💻',
    chennai: '🏖️',
    kolkata: '🌉',
    hyderabad: '🏰',
    pune: '📚',
    jaipur: '🏰',
    udaipur: '⛵',
    varanasi: '🕉️',
    agra: '🏯',
    goa: '🏝️',
    kochi: '🚢',
    ahmedabad: '🏗️',
    chandigarh: '🌳',
    lucknow: '🍛',
};

export default function MyItineraries() {
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activityCounts, setActivityCounts] = useState({});
    const [userProfile, setUserProfile] = useState(null);

    // Helper function to determine region from coordinates
    const getRegionFromCoordinates = (coordinates) => {
        const { latitude, longitude } = coordinates;

        // Simple region determination based on coordinates
        if (latitude > 0) {
            if (longitude > 0) {
                return 'Asia/Europe';
            } else {
                return 'North America';
            }
        } else {
            if (longitude > 0) {
                return 'Africa/Oceania';
            } else {
                return 'South America';
            }
        }
    };

    // Calculate user profile based on itineraries
    const calculateUserProfile = useMemo(() => {
        if (!itineraries.length) return null;

        const profile = {
            totalTrips: itineraries.length,
            averageDuration: 0,
            preferredCompanionType: {},
            budgetPreferences: {
                high: 0,
                medium: 0,
                low: 0,
            },
            mostVisitedRegions: {},
            upcomingTrips: 0,
            completedTrips: 0,
        };

        let totalDuration = 0;

        itineraries.forEach((itinerary) => {
            totalDuration += itinerary.duration;

            profile.preferredCompanionType[itinerary.companions] =
                (profile.preferredCompanionType[itinerary.companions] || 0) + 1;

            // Handle budget amount directly
            if (itinerary.budget?.amount) {
                profile.budgetPreferences[itinerary.budget.amount]++;
            }

            // Track trip timing
            const tripDate = new Date(itinerary.travel_dates);
            const today = new Date();
            if (tripDate > today) {
                profile.upcomingTrips++;
            } else {
                profile.completedTrips++;
            }

            // Track regions (using rough coordinates)
            const region = getRegionFromCoordinates(itinerary.destination.coordinates);
            profile.mostVisitedRegions[region] = (profile.mostVisitedRegions[region] || 0) + 1;
        });

        profile.averageDuration = totalDuration / itineraries.length;
        return profile;
    }, [itineraries]);

    useEffect(() => {
        const fetchItineraries = async () => {
            if (!auth.currentUser) return;

            try {
                const q = query(collection(db, 'itineraries'), where('userId', '==', auth.currentUser.uid));
                const querySnapshot = await getDocs(q);
                const itinerariesData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Calculate activity counts
                const counts = {};
                itinerariesData.forEach((itinerary) => {
                    itinerary.activities.forEach((activity) => {
                        counts[activity] = (counts[activity] || 0) + 1;
                    });
                });

                setActivityCounts(counts);
                setItineraries(itinerariesData);
            } catch (error) {
                console.error('Error fetching itineraries:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchItineraries();
    }, []);

    useEffect(() => {
        setUserProfile(calculateUserProfile);
    }, [calculateUserProfile]);

    const getCityIcon = (cityName) => {
        const lowercaseCity = cityName.toLowerCase();
        return cityIcons[lowercaseCity] || <GlobeEuropeAfricaIcon className="w-6 h-6" />;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 py-12">
            <motion.h1 initial={{ y: -20 }} animate={{ y: 0 }} className="text-4xl font-bold mb-8">
                My Itineraries
            </motion.h1>

            {/* User Profile Summary */}
            {userProfile && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100"
                >
                    <h2 className="text-xl font-semibold mb-4">Your Travel Profile</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <p className="text-gray-600">Total Trips: {userProfile.totalTrips}</p>
                            <p className="text-gray-600">Average Duration: {userProfile.averageDuration.toFixed(1)} days</p>
                            <p className="text-gray-600">Upcoming Trips: {userProfile.upcomingTrips}</p>
                            <p className="text-gray-600">Completed Trips: {userProfile.completedTrips}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-gray-600">Preferred Travel Style:</p>
                            {Object.entries(userProfile.preferredCompanionType)
                                .sort(([, a], [, b]) => b - a)
                                .map(([type, count]) => (
                                    <span key={type} className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm mr-2">
                                        {type} ({count})
                                    </span>
                                ))}
                        </div>
                        <div className="space-y-2">
                            <p className="text-gray-600">Budget Preference:</p>
                            {Object.entries(userProfile.budgetPreferences)
                                .filter(([, count]) => count > 0)
                                .map(([level, count]) => (
                                    <span key={level} className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm mr-2">
                                        {level.charAt(0).toUpperCase() + level.slice(1)} ({count})
                                    </span>
                                ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Add Activity Summary Section */}
            {Object.keys(activityCounts).length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100"
                >
                    <h2 className="text-xl font-semibold mb-4">Activity Summary</h2>
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(activityCounts).map(([activity, count]) => (
                            <div key={activity} className="bg-gray-100 px-4 py-2 rounded-full flex items-center gap-2">
                                <span className="font-medium">{activity}</span>
                                <span className="bg-black text-white rounded-full px-2 py-0.5 text-sm">{count}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {itineraries.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">You haven't created any itineraries yet.</p>
                    <Link
                        to="/trip-planner"
                        className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Create New Itinerary
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {itineraries.map((itinerary, index) => (
                        <motion.div
                            key={itinerary.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{
                                scale: 1.03,
                                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                            }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transform-gpu"
                        >
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">{getCityIcon(itinerary.destination.name)}</span>
                                    <h2 className="text-xl font-semibold">Trip to {itinerary.destination.name}</h2>
                                </div>
                                <p className="text-gray-600 mb-4 flex items-center gap-2">
                                    <MapPinIcon className="w-4 h-4" />
                                    {itinerary.duration} days • {itinerary.travel_dates}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {itinerary.activities.slice(0, 3).map((activity, index) => (
                                        <motion.span
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                        >
                                            {activity}
                                        </motion.span>
                                    ))}
                                </div>
                                <Link
                                    to={`/itinerary/${itinerary.id}`}
                                    className="text-black font-medium hover:underline flex items-center gap-2 group"
                                >
                                    View Details
                                    <motion.svg
                                        className="w-4 h-4"
                                        initial={{ x: 0 }}
                                        whileHover={{ x: 3 }}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </motion.svg>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
