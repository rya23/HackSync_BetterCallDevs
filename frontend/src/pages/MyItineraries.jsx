import React, { useState, useEffect } from 'react';
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
                setItineraries(itinerariesData);
            } catch (error) {
                console.error('Error fetching itineraries:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchItineraries();
    }, []);

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
