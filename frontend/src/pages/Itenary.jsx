import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Navigate } from 'react-router-dom';
import { HfInference } from '@huggingface/inference';
import TestData from './TestData.json';
import MapComponent from '../components/TestMap';
const client = new HfInference(import.meta.env.VITE_HUGGINGFACE);

export default function Itinerary() {
    const location = useLocation();
    const tripData = location.state?.tripData;
    const [aiItinerary, setAiItinerary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const generateAIItinerary = async () => {
            if (!tripData) return;

            const userInput = `
                Destination: ${tripData.destination}
                Travel Dates: ${tripData.date}
                Duration: ${tripData.duration} days
                Budget: ${tripData.budget}
                Companions: ${tripData.travelWith}
                Activities: ${tripData.activities.join(', ')}
                Other Preferences: Family-friendly activities preferred
            `;

            try {
                let out = '';
                const stream = await client.chatCompletionStream({
                    model: 'meta-llama/Llama-3.2-3B-Instruct',
                    messages: [
                        {
                            role: 'system',
                            content:
                                'System Prompt: AI Travel Planner\n\nYou are an AI-powered travel planner that generates customized itineraries in a structured JSON format based on user preferences. The user will provide details about their trip, including destination, travel dates, duration, budget, companions, preferred activities, and any additional preferences.\n\nYour response must always be a well-structured JSON object containing the following fields:\n\n{\n  "destination": {\n    "name": "User\'s chosen travel destination",\n    "place_id": "Unique identifier if applicable (optional)",\n    "coordinates": {\n      "latitude": "Latitude of the destination",\n      "longitude": "Longitude of the destination"\n    }\n  },\n  "travel_dates": "User\'s specified travel dates",\n  "duration": "Number of days",\n  "budget": {\n    "currency": "USD",\n    "amount": "User\'s budget for activities and dining"\n  },\n  "companions": "Who the user is traveling with",\n  "activities": [\n    "List of activities the user is interested in"\n  ],\n  "itinerary": [\n    {\n      "day": 1,\n      "morning": {\n        "activity": "Suggested morning activity",\n        "location": {\n          "name": "Exact place name",\n          "coordinates": {\n            "latitude": "Latitude of the place",\n            "longitude": "Longitude of the place"\n          }\n        }\n      },\n      "afternoon": {\n        "activity": "Suggested afternoon activity",\n        "location": {\n          "name": "Exact place name",\n          "coordinates": {\n            "latitude": "Latitude of the place",\n            "longitude": "Longitude of the place"\n          }\n        }\n      },\n      "evening": {\n        "activity": "Suggested evening activity",\n        "location": {\n          "name": "Exact place name",\n          "coordinates": {\n            "latitude": "Latitude of the place",\n            "longitude": "Longitude of the place"\n          }\n        }\n      },\n      "meals": {\n        "breakfast": {\n          "name": "Recommended breakfast place",\n          "coordinates": {\n            "latitude": "Latitude of the place",\n            "longitude": "Longitude of the place"\n          }\n        },\n        "lunch": {\n          "name": "Recommended lunch place",\n          "coordinates": {\n            "latitude": "Latitude of the place",\n            "longitude": "Longitude of the place"\n          }\n        },\n        "dinner": {\n          "name": "Recommended dinner place",\n          "coordinates": {\n            "latitude": "Latitude of the place",\n            "longitude": "Longitude of the place"\n          }\n        }\n      }\n    }\n  ],\n  "other_preferences": "Any additional user preferences"\n}\n\nInstructions:\n\n    Always respond in JSON format.\n    Include coordinates (latitude & longitude) for the destination and each place.\n    Store the travel destination separately as "destination": { "name": "Paris" } to make it easy to retrieve place-related data.\n    Use the provided user input to generate a detailed itinerary with morning, afternoon, and evening activities.\n    Suggest restaurants based on local cuisine and budget.\n    If the budget is low, prioritize free or budget-friendly activities.\n    If traveling with family, adjust recommendations for family-friendly options.\n\nExample Input:\n\nDestination: Paris  \nTravel Dates: April 10-15, 2025  \nDuration: 5 days  \nBudget: $500  \nCompanions: Solo  \nActivities: Museums, Cafés, Walking Tours  \nOther Preferences: Prefer cultural experiences over nightlife  \n\nExample Output:\n\n{\n  "destination": {\n    "name": "Paris",\n    "coordinates": {\n      "latitude": 48.8566,\n      "longitude": 2.3522\n    }\n  },\n  "travel_dates": "April 10-15, 2025",\n  "duration": 5,\n  "budget": {\n    "currency": "USD",\n    "amount": 500\n  },\n  "companions": "Solo",\n  "activities": ["Museums", "Cafés", "Walking Tours"],\n  "itinerary": [\n    {\n      "day": 1,\n      "morning": {\n        "activity": "Visit the Louvre Museum",\n        "location": {\n          "name": "Louvre Museum",\n          "coordinates": {\n            "latitude": 48.8606,\n            "longitude": 2.3376\n          }\n        }\n      },\n      "afternoon": {\n        "activity": "Enjoy coffee and pastries",\n        "location": {\n          "name": "Café de Flore",\n          "coordinates": {\n            "latitude": 48.8545,\n            "longitude": 2.3333\n          }\n        }\n      },\n      "evening": {\n        "activity": "Take a sunset walk along the Seine River",\n        "location": {\n          "name": "Seine River",\n          "coordinates": {\n            "latitude": 48.8566,\n            "longitude": 2.3425\n          }\n        }\n      },\n      "meals": {\n        "breakfast": {\n          "name": "Maison Landemaine",\n          "coordinates": {\n            "latitude": 48.8721,\n            "longitude": 2.3430\n          }\n        },\n        "lunch": {\n          "name": "Le Petit Cambodge",\n          "coordinates": {\n            "latitude": 48.8700,\n            "longitude": 2.3700\n          }\n        },\n        "dinner": {\n          "name": "Bistrot Paul Bert",\n          "coordinates": {\n            "latitude": 48.8510,\n            "longitude": 2.3800\n          }\n        }\n      }\n    }\n  ],\n  "other_preferences": "Prefer cultural experiences over nightlife"\n}\n',
                        },
                        { role: 'user', content: userInput },
                    ],
                    temperature: 0.5,
                    max_tokens: 2048,
                    top_p: 0.7,
                });

                for await (const chunk of stream) {
                    if (chunk.choices && chunk.choices.length > 0) {
                        const newContent = chunk.choices[0].delta.content;
                        out += newContent;
                    }
                }
                console.log(out);

                const jsonResponse = JSON.parse(out);
                setAiItinerary(jsonResponse);
            } catch (error) {
                console.error('Error generating itinerary:', error);
            } finally {
                setLoading(false);
            }
        };

        generateAIItinerary();

        // setAiItinerary(TestData);
        // setLoading(false);
    }, [tripData]);

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
                activities: generateActivitiesForDay(tripData.activities),
            });
        }
        return activities;
    };

    // Helper function to generate activities for a day
    const generateActivitiesForDay = (preferredActivities) => {
        // This is a simplified version - you might want to make this more sophisticated
        return [
            {
                time: '09:00 AM',
                activity: `Morning ${preferredActivities[0] || 'Sightseeing'}`,
                description: 'Start your day with an exciting activity.',
                duration: '2 hours',
                cost: tripData.budget === 'Low' ? '€20' : tripData.budget === 'Medium' ? '€40' : '€60',
            },
            {
                time: '12:00 PM',
                activity: `Afternoon ${preferredActivities[1] || 'Experience'}`,
                description: 'Continue your adventure with this activity.',
                duration: '3 hours',
                cost: tripData.budget === 'Low' ? '€30' : tripData.budget === 'Medium' ? '€50' : '€70',
            },
            {
                time: '16:00 PM',
                activity: `Evening ${preferredActivities[2] || 'Activity'}`,
                description: 'End your day with this exciting activity.',
                duration: '2 hours',
                cost: tripData.budget === 'Low' ? '€25' : tripData.budget === 'Medium' ? '€45' : '€65',
            },
        ];
    };

    const itineraryData = {
        destination: tripData.destination,
        duration: tripData.duration,
        budget: tripData.budget,
        travelWith: tripData.travelWith,
        activities: tripData.activities,
        days: generateDailyActivities(),
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-xl font-medium text-gray-700">Generating your personalized itinerary...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto text-center mb-12"
            >
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Your Trip to {aiItinerary?.destination?.name || tripData.destination}
                </h1>
                <div className="flex flex-wrap justify-center gap-4 items-center">
                    <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                        {aiItinerary?.duration || tripData.duration} Days
                    </span>
                    <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                        {aiItinerary?.budget?.amount ? `$${aiItinerary.budget.amount}` : tripData.budget} Budget
                    </span>
                    <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                        {aiItinerary?.companions || tripData.travelWith}
                    </span>
                </div>
            </motion.div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Timeline Section */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    {aiItinerary?.itinerary.map((day, index) => (
                        <motion.div key={day.day} variants={itemVariants} className="mb-12">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                                    {day.day}
                                </div>
                                <div className="h-px flex-1 bg-gray-300 ml-4"></div>
                            </div>

                            <div className="space-y-6">
                                {['morning', 'afternoon', 'evening'].map((timeOfDay, idx) => (
                                    <motion.div
                                        key={timeOfDay}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                    {day[timeOfDay].activity}
                                                </h3>
                                                <p className="text-gray-500 text-sm mb-2">{day[timeOfDay].location.name}</p>
                                                <p className="text-gray-600">
                                                    {
                                                        day.meals[
                                                            timeOfDay === 'morning'
                                                                ? 'breakfast'
                                                                : timeOfDay === 'afternoon'
                                                                ? 'lunch'
                                                                : 'dinner'
                                                        ].name
                                                    }
                                                </p>
                                                <p className="text-gray-500 text-sm">
                                                    {
                                                        day.meals[
                                                            timeOfDay === 'morning'
                                                                ? 'breakfast'
                                                                : timeOfDay === 'afternoon'
                                                                ? 'lunch'
                                                                : 'dinner'
                                                        ].name
                                                    }
                                                </p>
                                            </div>
                                            <span className="text-lg font-medium text-gray-900">
                                                {timeOfDay === 'morning'
                                                    ? '09:00 AM'
                                                    : timeOfDay === 'afternoon'
                                                    ? '02:00 PM'
                                                    : '07:00 PM'}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Map Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="sticky top-8 h-[calc(100vh-200px)]"
                >
                    <MapComponent itineraryData={aiItinerary} />
                </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-7xl mx-auto mt-20 flex justify-center gap-4"
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
