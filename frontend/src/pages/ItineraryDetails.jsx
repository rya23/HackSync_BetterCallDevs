import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import MapComponent from '../components/TestMap';
import EmailModal from '../components/EmailModal';
import { motion } from 'framer-motion';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { GoogleGenerativeAI } from '@google/generative-ai';

const styles = StyleSheet.create({
    page: { padding: 30, backgroundColor: '#ffffff' },
    section: { marginBottom: 20, padding: 15 },
    header: {
        fontSize: 24,
        marginBottom: 15,
        color: '#1a365d',
        textAlign: 'center',
    },
    text: { fontSize: 12, marginBottom: 8, color: '#4a5568' },
    dayHeader: { fontSize: 18, marginBottom: 10, color: '#2d3748', marginTop: 15 },
    subHeader: { fontSize: 14, marginBottom: 5, color: '#4a5568', marginTop: 10 },
    activityText: { fontSize: 10, marginBottom: 5, color: '#718096' },
});

const TravelPDF = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.header}>Travel Itinerary</Text>
                <Text style={styles.text}>Destination: {data.destination?.name || 'Not specified'}</Text>
                <Text style={styles.text}>Duration: {data.duration || 'Not specified'} days</Text>
                <Text style={styles.text}>Travel Dates: {data.travel_dates || 'Not specified'}</Text>

                {data.itinerary.map((day) => (
                    <View key={day.day}>
                        <Text style={styles.dayHeader}>Day {day.day}</Text>

                        <Text style={styles.subHeader}>Morning</Text>
                        <Text style={styles.activityText}>Activity: {day.morning?.activity || 'Not specified'}</Text>
                        <Text style={styles.activityText}>Location: {day.morning?.location?.name || 'Not specified'}</Text>
                        <Text style={styles.activityText}>Breakfast: {day.meals?.breakfast?.name || 'Not specified'}</Text>

                        <Text style={styles.subHeader}>Afternoon</Text>
                        <Text style={styles.activityText}>Activity: {day.afternoon?.activity || 'Not specified'}</Text>
                        <Text style={styles.activityText}>Location: {day.afternoon?.location?.name || 'Not specified'}</Text>
                        <Text style={styles.activityText}>Lunch: {day.meals?.lunch?.name || 'Not specified'}</Text>

                        <Text style={styles.subHeader}>Evening</Text>
                        <Text style={styles.activityText}>Activity: {day.evening?.activity || 'Not specified'}</Text>
                        <Text style={styles.activityText}>Location: {day.evening?.location?.name || 'Not specified'}</Text>
                        <Text style={styles.activityText}>Dinner: {day.meals?.dinner?.name || 'Not specified'}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyAew4snbMiz71yOBzM8-pj_cvEuvd0OjlA');

const model = genAI.getGenerativeModel({
    model: 'gemini-pro',
    generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
    },
});

export default function ItineraryDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

    // Chat state
    const [chatHistory, setChatHistory] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);

    useEffect(() => {
        const fetchItinerary = async () => {
            try {
                const docRef = doc(db, 'itineraries', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log(data);
                    // Verify the itinerary belongs to the current user
                    if (data.userId !== auth.currentUser?.uid) {
                        navigate('/my-itineraries');
                        return;
                    }
                    setItinerary(data);
                } else {
                    navigate('/my-itineraries');
                }
            } catch (error) {
                console.error('Error fetching itinerary:', error);
                navigate('/my-itineraries');
            } finally {
                setLoading(false);
            }
        };

        fetchItinerary();
    }, [id, navigate]);

    // Handle chat submission
    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        const userMessage = userInput.trim();
        setUserInput('');
        // Show the user message in chat with 'user' role
        setChatHistory((prev) => [...prev, { role: 'user', content: userMessage }]);
        setIsChatLoading(true);

        try {
            // Combine user input with itinerary data in a structured format
            const combinedMessage = `
Question: ${userMessage}

Current Itinerary Details:
Destination: ${itinerary.destination?.name || 'Not specified'}
Travel Dates: ${itinerary.travel_dates || 'Not specified'}
Duration: ${itinerary.duration || 'Not specified'} days

Daily Schedule:
${itinerary.itinerary
    .map(
        (day) => `
Day ${day.day}:
Morning: ${day.morning?.activity || 'Not specified'} at ${day.morning?.location?.name || 'Not specified'}
Afternoon: ${day.afternoon?.activity || 'Not specified'} at ${day.afternoon?.location?.name || 'Not specified'}
Evening: ${day.evening?.activity || 'Not specified'} at ${day.evening?.location?.name || 'Not specified'}

Meals:
Breakfast: ${day.meals?.breakfast?.name || 'Not specified'}
Lunch: ${day.meals?.lunch?.name || 'Not specified'}
Dinner: ${day.meals?.dinner?.name || 'Not specified'}
`
    )
    .join('\n')}`;

            // Convert chat history to use 'model' instead of 'assistant'
            const formattedHistory = chatHistory.map((msg) => ({
                role: msg.role === 'assistant' ? 'model' : msg.role,
                parts: [{ text: msg.content }],
            }));

            const chat = model.startChat({
                history: formattedHistory,
            });

            const result = await chat.sendMessage(combinedMessage);
            const response = await result.response;
            let text = response.text();

            // Clean up the response text
            text = text
                .replace(/\*\*/g, '')
                .replace(/\*/g, '')
                .split('\n')
                .map((line) => line.trim())
                .filter((line) => line)
                .join('\n');

            // Store in chat history as 'assistant' for display purposes
            setChatHistory((prev) => [
                ...prev,
                {
                    role: 'assistant', // Keep as 'assistant' for UI purposes
                    content: text,
                },
            ]);
        } catch (error) {
            console.error('Error sending message:', error);
            setChatHistory((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.',
                },
            ]);
        } finally {
            setIsChatLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!itinerary) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Itinerary not found</h2>
                    <Link to="/my-itineraries" className="mt-4 text-blue-600 hover:underline">
                        Return to My Itineraries
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8">
                    <Link to="/my-itineraries" className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to My Itineraries
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Trip to {itinerary.destination.name}</h1>
                    <p className="text-gray-600">
                        {itinerary.duration} days • {itinerary.travel_dates}
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Itinerary Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {itinerary.itinerary.map((day) => (
                            <motion.div
                                key={day.day}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-lg p-6"
                            >
                                <h2 className="text-2xl font-semibold mb-4">Day {day.day}</h2>
                                {['morning', 'afternoon', 'evening'].map((timeOfDay) => (
                                    <div key={timeOfDay} className="mb-6 last:mb-0">
                                        <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h3 className="text-lg font-medium capitalize mb-2">
                                                    {timeOfDay}: {day[timeOfDay]?.activity || 'Not specified'}
                                                </h3>
                                                <p className="text-gray-600 mb-2">
                                                    {day[timeOfDay]?.location?.name || 'Location not specified'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Meal:{' '}
                                                    {day.meals?.[
                                                        timeOfDay === 'morning'
                                                            ? 'breakfast'
                                                            : timeOfDay === 'afternoon'
                                                            ? 'lunch'
                                                            : 'dinner'
                                                    ]?.name || 'Not specified'}
                                                </p>
                                            </div>
                                            <span className="text-gray-500">
                                                {timeOfDay === 'morning'
                                                    ? '09:00 AM'
                                                    : timeOfDay === 'afternoon'
                                                    ? '02:00 PM'
                                                    : '07:00 PM'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        ))}
                    </div>

                    {/* Map and Actions */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="h-[400px]">
                                    <MapComponent itineraryData={itinerary} />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <PDFDownloadLink
                                    document={<TravelPDF data={itinerary} />}
                                    fileName="travel_itinerary.pdf"
                                    className="w-full bg-black text-white text-center py-3 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
                                </PDFDownloadLink>

                                <button
                                    onClick={() => setIsEmailModalOpen(true)}
                                    className="w-full border-2 border-black text-black py-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Email Itinerary
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Interface */}
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Chat with AI Assistant</h2>

                    {/* Chat Messages */}
                    <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                        {chatHistory.map((message, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg ${
                                    message.role === 'user'
                                        ? 'bg-blue-100 ml-auto max-w-[80%]'
                                        : 'bg-gray-100 mr-auto max-w-[80%]'
                                }`}
                            >
                                <p className="text-gray-800">{message.content}</p>
                            </div>
                        ))}
                        {isChatLoading && (
                            <div className="flex items-center space-x-2">
                                <div className="animate-bounce h-2 w-2 bg-gray-400 rounded-full"></div>
                                <div className="animate-bounce h-2 w-2 bg-gray-400 rounded-full delay-100"></div>
                                <div className="animate-bounce h-2 w-2 bg-gray-400 rounded-full delay-200"></div>
                            </div>
                        )}
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleChatSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ask about your itinerary..."
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isChatLoading}
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={isChatLoading}
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                        >
                            Send
                        </motion.button>
                    </form>
                </div>
            </div>

            <EmailModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} itineraryData={itinerary} />
        </div>
    );
}
