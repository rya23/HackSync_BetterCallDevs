import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Navigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import TestData from './TestData.json';
import MapComponent from '../components/TestMap';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import EmailModal from '../components/EmailModal';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI('AIzaSyC28IFWjv0_Jn-a7VPEbF5Iz2r7kuQv5xY');
const styles = StyleSheet.create({
    page: {
        padding: 30,
        backgroundColor: '#ffffff',
    },
    section: {
        marginBottom: 20,
        padding: 15,
        borderRadius: 5,
    },
    header: {
        fontSize: 24,
        marginBottom: 15,
        color: '#1a365d',
        textTransform: 'uppercase',
        textAlign: 'center',
        paddingBottom: 10,
        borderBottom: 2,
        borderColor: '#e2e8f0',
    },
    dayHeader: {
        fontSize: 20,
        color: '#2b6cb0',
        textAlign: 'center',
        marginBottom: 20,
    },
    timeBlock: {
        marginBottom: 15,
        paddingLeft: 10,
    },
    timeHeader: {
        fontSize: 16,
        color: '#2d3748',
        marginBottom: 8,
    },
    activityLabel: {
        fontSize: 11,
        color: '#4a5568',
        marginBottom: 2,
    },
    activityText: {
        fontSize: 11,
        color: '#4a5568',
        marginBottom: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: '#4A5568',
        fontSize: 12,
    },
});

const TravelPDF = ({ data }) => (
    <Document>
        {/* First page with general information */}
        <Page style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.header}>Travel Itinerary</Text>
                <Text style={styles.activityText}>Destination: {data.destination?.name || 'Not specified'}</Text>
                <Text style={styles.activityText}>Duration: {data.duration || 'Not specified'} days</Text>
                <Text style={styles.activityText}>Travel Dates: {data.travel_dates || 'Not specified'}</Text>
            </View>
            <Text style={styles.footer}>Powered by DevBlog</Text>
        </Page>

        {/* Separate page for each day */}
        {data.itinerary.map((day) => (
            <Page key={day.day} style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.dayHeader}>Day {day.day}</Text>

                    <View style={styles.timeBlock}>
                        <Text style={styles.timeHeader}>Morning:</Text>
                        <Text style={styles.activityLabel}>Activity:</Text>
                        <Text style={styles.activityText}>{day.morning?.activity || 'Not specified'}</Text>
                        <Text style={styles.activityLabel}>Location:</Text>
                        <Text style={styles.activityText}>{day.morning?.location?.name || 'Not specified'}</Text>
                        <Text style={styles.activityLabel}>Breakfast:</Text>
                        <Text style={styles.activityText}>{day.meals?.breakfast?.name || 'Not specified'}</Text>
                    </View>

                    <View style={styles.timeBlock}>
                        <Text style={styles.timeHeader}>Afternoon:</Text>
                        <Text style={styles.activityLabel}>Activity:</Text>
                        <Text style={styles.activityText}>{day.afternoon?.activity || 'Not specified'}</Text>
                        <Text style={styles.activityLabel}>Location:</Text>
                        <Text style={styles.activityText}>{day.afternoon?.location?.name || 'Not specified'}</Text>
                        <Text style={styles.activityLabel}>Lunch:</Text>
                        <Text style={styles.activityText}>{day.meals?.lunch?.name || 'Not specified'}</Text>
                    </View>

                    <View style={styles.timeBlock}>
                        <Text style={styles.timeHeader}>Evening:</Text>
                        <Text style={styles.activityLabel}>Activity:</Text>
                        <Text style={styles.activityText}>{day.evening?.activity || 'Not specified'}</Text>
                        <Text style={styles.activityLabel}>Location:</Text>
                        <Text style={styles.activityText}>{day.evening?.location?.name || 'Not specified'}</Text>
                        <Text style={styles.activityLabel}>Dinner:</Text>
                        <Text style={styles.activityText}>{day.meals?.dinner?.name || 'Not specified'}</Text>
                    </View>
                </View>
                <Text style={styles.footer}>Powered by DevBlog</Text>
            </Page>
        ))}
    </Document>
);

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
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};

const DayCard = ({ day }) => (
    <motion.div variants={itemVariants} className="mb-12">
        <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                {day.day}
            </div>
            <div className="h-px flex-1 bg-gray-300 ml-4"></div>
            <div className="text-lg font-semibold text-gray-700">₹{day.daily_total.toLocaleString()}</div>
        </div>

        <div className="space-y-6">
            {/* Morning Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
                    Morning
                    <span className="text-sm font-normal text-gray-500">
                        Total: ₹{(day.morning.cost + day.meals.breakfast.cost).toLocaleString()}
                    </span>
                </h3>

                <div className="space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-medium text-gray-700">{day.morning.activity}</p>
                            <p className="text-sm text-gray-500">{day.morning.location.name}</p>
                        </div>
                        <span className="text-gray-600">₹{day.morning.cost.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-start pt-2 border-t">
                        <div>
                            <p className="font-medium text-gray-700">Breakfast</p>
                            <p className="text-sm text-gray-500">{day.meals.breakfast.name}</p>
                        </div>
                        <span className="text-gray-600">₹{day.meals.breakfast.cost.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Afternoon Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
                    Afternoon
                    <span className="text-sm font-normal text-gray-500">
                        Total: ₹{(day.afternoon.cost + day.meals.lunch.cost).toLocaleString()}
                    </span>
                </h3>

                <div className="space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-medium text-gray-700">{day.afternoon.activity}</p>
                            <p className="text-sm text-gray-500">{day.afternoon.location.name}</p>
                        </div>
                        <span className="text-gray-600">₹{day.afternoon.cost.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-start pt-2 border-t">
                        <div>
                            <p className="font-medium text-gray-700">Lunch</p>
                            <p className="text-sm text-gray-500">{day.meals.lunch.name}</p>
                        </div>
                        <span className="text-gray-600">₹{day.meals.lunch.cost.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Evening Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
                    Evening
                    <span className="text-sm font-normal text-gray-500">
                        Total: ₹{(day.evening.cost + day.meals.dinner.cost).toLocaleString()}
                    </span>
                </h3>

                <div className="space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-medium text-gray-700">{day.evening.activity}</p>
                            <p className="text-sm text-gray-500">{day.evening.location.name}</p>
                        </div>
                        <span className="text-gray-600">₹{day.evening.cost.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-start pt-2 border-t">
                        <div>
                            <p className="font-medium text-gray-700">Dinner</p>
                            <p className="text-sm text-gray-500">{day.meals.dinner.name}</p>
                        </div>
                        <span className="text-gray-600">₹{day.meals.dinner.cost.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Daily Summary */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Daily Budget</span>
                    <span className="font-bold text-gray-800">₹{day.daily_total.toLocaleString()}</span>
                </div>
            </div>
        </div>
    </motion.div>
);

export default function Itinerary() {
    const location = useLocation();
    const tripData = location.state?.tripData;
    const [aiItinerary, setAiItinerary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const savedRef = useRef(false);

    useEffect(() => {
        const generateAIItinerary = async () => {
            if (!tripData) return;

            // Add default values and validation

            const userInput = `
        Destination: ${tripData.destination}
        Travel Dates: ${tripData.date}
        Duration: ${tripData.duration} days
        Budget Level: ${tripData.budget} (Please consider this ${tripData.budget}-budget level in INR relative to ${
                tripData.destination
            }'s local cost of living and currency)
        Companions: ${tripData.travelWith}
        Activities: ${tripData.activities.join(', ')}
        Other Preferences: Family-friendly activities preferred
    `;
            const generationConfig = {
                temperature: 1,
                topP: 0.95,
                topK: 64,
                maxOutputTokens: 8192,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: 'object',
                    properties: {
                        destination: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                },
                                place_id: {
                                    type: 'string',
                                },
                                coordinates: {
                                    type: 'object',
                                    properties: {
                                        latitude: {
                                            type: 'number',
                                        },
                                        longitude: {
                                            type: 'number',
                                        },
                                    },
                                    required: ['latitude', 'longitude'],
                                },
                            },
                            required: ['name', 'coordinates'],
                        },
                        travel_dates: {
                            type: 'string',
                        },
                        duration: {
                            type: 'integer',
                        },
                        budget: {
                            type: 'object',
                            properties: {
                                currency: {
                                    type: 'string',
                                },
                                daily_range: {
                                    type: 'object',
                                    properties: {
                                        min: {
                                            type: 'number',
                                        },
                                        max: {
                                            type: 'number',
                                        },
                                    },
                                    required: ['min', 'max'],
                                },
                                total_range: {
                                    type: 'object',
                                    properties: {
                                        min: {
                                            type: 'number',
                                        },
                                        max: {
                                            type: 'number',
                                        },
                                    },
                                    required: ['min', 'max'],
                                },
                            },
                            required: ['currency', 'daily_range', 'total_range'],
                        },
                        companions: {
                            type: 'string',
                        },
                        activities: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                        },
                        itinerary: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    day: {
                                        type: 'integer',
                                    },
                                    morning: {
                                        type: 'object',
                                        properties: {
                                            activity: {
                                                type: 'string',
                                            },
                                            cost: {
                                                type: 'number',
                                            },
                                            location: {
                                                type: 'object',
                                                properties: {
                                                    name: {
                                                        type: 'string',
                                                    },
                                                    coordinates: {
                                                        type: 'object',
                                                        properties: {
                                                            latitude: {
                                                                type: 'number',
                                                            },
                                                            longitude: {
                                                                type: 'number',
                                                            },
                                                        },
                                                        required: ['latitude', 'longitude'],
                                                    },
                                                },
                                                required: ['name', 'coordinates'],
                                            },
                                        },
                                        required: ['activity', 'cost', 'location'],
                                    },
                                    afternoon: {
                                        type: 'object',
                                        properties: {
                                            activity: {
                                                type: 'string',
                                            },
                                            cost: {
                                                type: 'number',
                                            },
                                            location: {
                                                type: 'object',
                                                properties: {
                                                    name: {
                                                        type: 'string',
                                                    },
                                                    coordinates: {
                                                        type: 'object',
                                                        properties: {
                                                            latitude: {
                                                                type: 'number',
                                                            },
                                                            longitude: {
                                                                type: 'number',
                                                            },
                                                        },
                                                        required: ['latitude', 'longitude'],
                                                    },
                                                },
                                                required: ['name', 'coordinates'],
                                            },
                                        },
                                        required: ['activity', 'cost', 'location'],
                                    },
                                    evening: {
                                        type: 'object',
                                        properties: {
                                            activity: {
                                                type: 'string',
                                            },
                                            cost: {
                                                type: 'number',
                                            },
                                            location: {
                                                type: 'object',
                                                properties: {
                                                    name: {
                                                        type: 'string',
                                                    },
                                                    coordinates: {
                                                        type: 'object',
                                                        properties: {
                                                            latitude: {
                                                                type: 'number',
                                                            },
                                                            longitude: {
                                                                type: 'number',
                                                            },
                                                        },
                                                        required: ['latitude', 'longitude'],
                                                    },
                                                },
                                                required: ['name', 'coordinates'],
                                            },
                                        },
                                        required: ['activity', 'cost', 'location'],
                                    },
                                    meals: {
                                        type: 'object',
                                        properties: {
                                            breakfast: {
                                                type: 'object',
                                                properties: {
                                                    name: {
                                                        type: 'string',
                                                    },
                                                    cost: {
                                                        type: 'number',
                                                    },
                                                    coordinates: {
                                                        type: 'object',
                                                        properties: {
                                                            latitude: {
                                                                type: 'number',
                                                            },
                                                            longitude: {
                                                                type: 'number',
                                                            },
                                                        },
                                                        required: ['latitude', 'longitude'],
                                                    },
                                                },
                                                required: ['name', 'cost', 'coordinates'],
                                            },
                                            lunch: {
                                                type: 'object',
                                                properties: {
                                                    name: {
                                                        type: 'string',
                                                    },
                                                    cost: {
                                                        type: 'number',
                                                    },
                                                    coordinates: {
                                                        type: 'object',
                                                        properties: {
                                                            latitude: {
                                                                type: 'number',
                                                            },
                                                            longitude: {
                                                                type: 'number',
                                                            },
                                                        },
                                                        required: ['latitude', 'longitude'],
                                                    },
                                                },
                                                required: ['name', 'cost', 'coordinates'],
                                            },
                                            dinner: {
                                                type: 'object',
                                                properties: {
                                                    name: {
                                                        type: 'string',
                                                    },
                                                    cost: {
                                                        type: 'number',
                                                    },
                                                    coordinates: {
                                                        type: 'object',
                                                        properties: {
                                                            latitude: {
                                                                type: 'number',
                                                            },
                                                            longitude: {
                                                                type: 'number',
                                                            },
                                                        },
                                                        required: ['latitude', 'longitude'],
                                                    },
                                                },
                                                required: ['name', 'cost', 'coordinates'],
                                            },
                                        },
                                        required: ['breakfast', 'lunch', 'dinner'],
                                    },
                                    daily_total: {
                                        type: 'number',
                                    },
                                },
                                required: ['day', 'morning', 'afternoon', 'evening', 'meals', 'daily_total'],
                            },
                        },
                        other_preferences: {
                            type: 'string',
                        },
                    },
                    required: [
                        'destination',
                        'travel_dates',
                        'duration',
                        'budget',
                        'companions',
                        'activities',
                        'itinerary',
                        'other_preferences',
                    ],
                },
            };

            try {
                const model = genAI.getGenerativeModel({
                    model: 'gemini-2.0-flash-lite-preview-02-05',
                    systemInstruction:
                        'You are an AI-powered travel planner that generates customized itineraries in a structured JSON format based on user preferences. The user will provide details such as destination, travel dates, duration, budget, companions, preferred activities, and any additional preferences.\n\nResponse Format:\n\nAlways return a well-structured JSON object with the following fields:\n\n{\n  "destination": {\n    "name": "User\'s chosen travel destination",\n    "place_id": "Optional unique identifier",\n    "coordinates": {\n      "latitude": "Latitude of the destination",\n      "longitude": "Longitude of the destination"\n    }\n  },\n  "travel_dates": "User-specified travel dates",\n  "duration": "Number of days",\n  "budget": {\n    "currency": "INR",\n    "daily_range": {\n      "min": "Minimum daily budget",\n      "max": "Maximum daily budget"\n    },\n    "total_range": {\n      "min": "Minimum total budget for the trip",\n      "max": "Maximum total budget for the trip"\n    }\n  },\n  "companions": "Who the user is traveling with",\n  "activities": ["List of preferred activities"],\n  "itinerary": [\n    {\n      "day": 1,\n      "morning": {\n        "activity": "Suggested morning activity",\n        "cost": "Activity cost in INR",\n        "location": {\n          "name": "Exact place name",\n          "coordinates": {\n            "latitude": "Latitude",\n            "longitude": "Longitude"\n          }\n        }\n      },\n      "afternoon": {\n        "activity": "Suggested afternoon activity",\n        "cost": "Activity cost in INR",\n        "location": {\n          "name": "Exact place name",\n          "coordinates": {\n            "latitude": "Latitude",\n            "longitude": "Longitude"\n          }\n        }\n      },\n      "evening": {\n        "activity": "Suggested evening activity",\n        "cost": "Activity cost in INR",\n        "location": {\n          "name": "Exact place name",\n          "coordinates": {\n            "latitude": "Latitude",\n            "longitude": "Longitude"\n          }\n        }\n      },\n      "meals": {\n        "breakfast": {\n          "name": "Breakfast place",\n          "cost": "Meal cost in INR",\n          "coordinates": {\n            "latitude": "...",\n            "longitude": "..."\n          }\n        },\n        "lunch": {\n          "name": "Lunch place",\n          "cost": "Meal cost in INR",\n          "coordinates": {\n            "latitude": "...",\n            "longitude": "..."\n          }\n        },\n        "dinner": {\n          "name": "Dinner place",\n          "cost": "Meal cost in INR",\n          "coordinates": {\n            "latitude": "...",\n            "longitude": "..."\n          }\n        }\n      },\n      "daily_total": "Total cost for the day in INR"\n    }\n  ],\n  "other_preferences": "Any additional user preferences"\n}\n\nInstructions:\n\n- Always respond in JSON format.\n- Include coordinates for the destination and each recommended place.\n- Store the travel destination separately as { "name": "Paris" } for easy reference.\n- Generate a complete itinerary, suggesting morning, afternoon, and evening activities.\n- Recommend restaurants based on local cuisine and budget.\n- Adjust recommendations based on user constraints:\n    - Low budget → Prioritize free or budget-friendly activities.\n    - Family trip → Suggest family-friendly options.\n    - Cultural focus → Emphasize museums, historical sites, and local traditions.\n\nExample Input:\n\n    Destination: Paris\n    Travel Dates: April 10-15, 2025\n    Duration: 5 days\n    Budget: Medium (Please consider this Medium-budget level in INR relative to Paris local cost of living and currency)\n    Companions: Solo\n    Activities: Museums, Cafés, Walking Tours\n    Other Preferences: Prefer cultural experiences over nightlife\n\nExample Output:\n\n{\n  "destination": {\n    "name": "Paris",\n    "coordinates": {\n      "latitude": 48.8566,\n      "longitude": 2.3522\n    }\n  },\n  "travel_dates": "April 10-15, 2025",\n  "duration": 5,\n  "budget": {\n    "currency": "INR",\n    "daily_range": {\n      "min": 6640,\n      "max": 9960\n    },\n    "total_range": {\n      "min": 33200,\n      "max": 49800\n    }\n  },\n  "companions": "Solo",\n  "activities": ["Museums", "Cafés", "Walking Tours"],\n  "itinerary": [\n    {\n      "day": 1,\n      "morning": {\n        "activity": "Visit the Louvre Museum",\n        "cost": 1411,\n        "location": {\n          "name": "Louvre Museum",\n          "coordinates": {\n            "latitude": 48.8606,\n            "longitude": 2.3376\n          }\n        }\n      },\n      "afternoon": {\n        "activity": "Enjoy coffee and pastries",\n        "cost": 830,\n        "location": {\n          "name": "Café de Flore",\n          "coordinates": {\n            "latitude": 48.8545,\n            "longitude": 2.3333\n          }\n        }\n      },\n      "evening": {\n        "activity": "Take a sunset walk along the Seine River",\n        "cost": 0,\n        "location": {\n          "name": "Seine River",\n          "coordinates": {\n            "latitude": 48.8566,\n            "longitude": 2.3425\n          }\n        }\n      },\n      "meals": {\n        "breakfast": {\n          "name": "Maison Landemaine",\n          "cost": 664,\n          "coordinates": {\n            "latitude": 48.8721,\n            "longitude": 2.3430\n          }\n        },\n        "lunch": {\n          "name": "Le Petit Cambodge",\n          "cost": 1245,\n          "coordinates": {\n            "latitude": 48.8700,\n            "longitude": 2.3700\n          }\n        },\n        "dinner": {\n          "name": "Bistrot Paul Bert",\n          "cost": 2490,\n          "coordinates": {\n            "latitude": 48.8510,\n            "longitude": 2.3800\n          }\n        }\n      },\n      "daily_total": 6640\n    }\n  ],\n  "other_preferences": "Prefer cultural experiences over nightlife"\n}\n',
                    generationConfig: {
                        temperature: 1,
                        topP: 0.95,
                        topK: 64,
                        maxOutputTokens: 8192,
                    },
                });

                const chatSession = model.startChat({
                    generationConfig,
                    history: [],
                    // System message is included in the model configuration
                });

                const result = await chatSession.sendMessage(userInput);
                const response = result.response.text();

                console.log(response);
                const jsonResponse = JSON.parse(response);
                setAiItinerary(jsonResponse);
            } catch (error) {
                console.error('Error generating itinerary:', error);
                setError('Failed to generate itinerary. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        generateAIItinerary();

        // setAiItinerary(TestData);
        // setLoading(false);
    }, [tripData]);

    useEffect(() => {
        const saveItinerary = async () => {
            if (!aiItinerary || !auth.currentUser || savedRef.current) return;

            try {
                await addDoc(collection(db, 'itineraries'), {
                    ...aiItinerary,
                    userId: auth.currentUser.uid,
                    createdAt: new Date().toISOString(),
                });

                savedRef.current = true;
            } catch (error) {
                console.error('Error saving itinerary:', error);
            }
        };

        saveItinerary();
    }, [aiItinerary]);

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
                activity: 'Morning ' + (preferredActivities[0] || 'Sightseeing'),
                description: 'Start your day with an exciting activity.',
                duration: '2 hours',
                cost: tripData.budget === 'Low' ? '€20' : tripData.budget === 'Medium' ? '€40' : '€60',
            },
            {
                time: '12:00 PM',
                activity: 'Afternoon ' + (preferredActivities[1] || 'Experience'),
                description: 'Continue your adventure with this activity.',
                duration: '3 hours',
                cost: tripData.budget === 'Low' ? '€30' : tripData.budget === 'Medium' ? '€50' : '€70',
            },
            {
                time: '16:00 PM',
                activity: 'Evening ' + (preferredActivities[2] || 'Activity'),
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

    if (error) {
        return <div>{error}</div>;
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
                        {aiItinerary?.budget?.amount
                            ? `${aiItinerary.budget.amount} ${aiItinerary.budget.currency}`
                            : tripData.budget}{' '}
                        Budget
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
                    {aiItinerary?.itinerary.map((day) => (
                        <DayCard key={day.day} day={day} />
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
                <PDFDownloadLink
                    document={<TravelPDF data={aiItinerary} />}
                    fileName="travel_plan.pdf"
                    className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition-colors"
                >
                    {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
                </PDFDownloadLink>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEmailModalOpen(true)}
                    className="relative px-6 py-3 border-2 border-black text-black rounded-xl font-medium transition-colors duration-300"
                >
                    Email Itinerary
                </motion.button>
            </motion.div>

            <EmailModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} itineraryData={aiItinerary} />
        </div>
    );
}
