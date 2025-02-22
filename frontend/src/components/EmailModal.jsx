import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';

export default function EmailModal({ isOpen, onClose, itineraryData }) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const formatItineraryMessage = (data) => {
        let message = `Here's your travel itinerary for ${data.destination.name}!\n\n`;
        message += `Travel Dates: ${data.travel_dates}\n`;
        message += `Duration: ${data.duration} days\n`;
        message += `Budget: ${data.budget.currency} ${data.budget.amount}\n`;
        message += `Companions: ${data.companions}\n\n`;
        message += `Activities: ${data.activities.join(', ')}\n\n`;

        message += `Daily Itinerary:\n\n`;

        data.itinerary.forEach((day) => {
            message += `Day ${day.day}:\n`;
            message += `Morning: ${day.morning.activity} at ${day.morning.location.name}\n`;
            message += `Afternoon: ${day.afternoon.activity} at ${day.afternoon.location.name}\n`;
            message += `Evening: ${day.evening.activity} at ${day.evening.location.name}\n\n`;

            message += `Meals:\n`;
            message += `Breakfast: ${day.meals.breakfast.name}\n`;
            message += `Lunch: ${day.meals.lunch.name}\n`;
            message += `Dinner: ${day.meals.dinner.name}\n\n`;
        });

        message += `Other Preferences: ${data.other_preferences}\n\n`;
        message += `We hope you have a wonderful trip!\n`;

        return message;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        try {
            const templateParams = {
                to_email: email,
                to_name: email.split('@')[0], // Using the part before @ as the name
                message: formatItineraryMessage(itineraryData),
            };

            await emailjs.send('service_qu48wzy', 'template_5tbe3yt', templateParams, 'DlhnPk2Yera3L0NZY');

            setStatus('success');
            setEmail('');
            setTimeout(() => onClose(), 2000);
        } catch (error) {
            console.error('Email sending error:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-xl p-6 w-full max-w-md"
                    >
                        <h3 className="text-xl font-semibold mb-4">Send Itinerary to Email</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-gray-800 
                                        focus:ring-1 focus:ring-gray-800 transition-all duration-200"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>

                            {status === 'success' && <p className="text-green-600 text-sm">Itinerary sent successfully!</p>}
                            {status === 'error' && (
                                <p className="text-red-600 text-sm">Failed to send itinerary. Please try again.</p>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 border-2 border-gray-800 text-gray-800 rounded-lg 
                                        hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg 
                                        hover:bg-gray-700 transition-colors disabled:bg-gray-400"
                                >
                                    {loading ? 'Sending...' : 'Send'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
