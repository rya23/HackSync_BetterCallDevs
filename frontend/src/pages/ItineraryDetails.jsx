import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import MapComponent from '../components/TestMap';
import EmailModal from '../components/EmailModal';
import { motion } from 'framer-motion';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import airportCodes from 'airport-codes';

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
                <Text style={data.travel_dates ? styles.text : null}>Travel Dates: {data.travel_dates || 'Not specified'}</Text>

                {data.itinerary.map((day) => (
                    <View key={day.day}>
                        <Text style={styles.dayHeader}>Day {day.day}</Text>

                        <Text style={styles.subHeader}>
                            <strong>Morning:</strong>
                        </Text>
                        <Text style={styles.activityText}>
                            Visit Mani Bhavan Gandhi Museum to learn about Mahatma Gandhi's life and work. Afterwards, explore the
                            nearby areas.
                        </Text>

                        <Text style={styles.subHeader}>
                            <strong>Afternoon:</strong>
                        </Text>
                        <Text style={styles.activityText}>Activity: {day.afternoon?.activity || 'Not specified'}</Text>
                        <Text style={styles.activityText}>Location: {day.afternoon?.location?.name || 'Not specified'}</Text>
                        <Text style={styles.activityText}>Lunch: {day.meals?.lunch?.name || 'Not specified'}</Text>

                        <Text style={styles.subHeader}>
                            <strong>Evening:</strong>
                        </Text>
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

// Add this helper function before the useEffect hooks
const getCityAirportCode = async (cityName) => {
    try {
        // Fetch airports data from local JSON file
        const response = await axios.get('/airports.json');
        const airports = response.data;

        // Clean up the city name
        const cleanCityName = cityName
            .toLowerCase()
            .replace(/city|international airport|airport/g, '')
            .trim();

        // Find matching airports
        const matchingAirports = airports.filter((airport) => {
            const airportCity = airport.city.toLowerCase();
            return airportCity.includes(cleanCityName) || cleanCityName.includes(airportCity);
        });

        // Sort by international status (prefer international airports)
        const sortedAirports = matchingAirports.sort((a, b) => {
            const aIsIntl = a.name.toLowerCase().includes('international');
            const bIsIntl = b.name.toLowerCase().includes('international');
            return bIsIntl - aIsIntl;
        });

        // Return the IATA code of the first (most relevant) airport
        return sortedAirports.length > 0 ? sortedAirports[0].iata : null;
    } catch (error) {
        console.error('Error loading airports data:', error);
        return null;
    }
};

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

    // Add this state near other useState declarations
    const [hotels, setHotels] = useState([]);
    const [hotelsLoading, setHotelsLoading] = useState(false);

    // Add these new state variables near other useState declarations
    const [showHotels, setShowHotels] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const hotelsPerPage = 4;

    // Add these new state variables near other useState declarations
    const [flights, setFlights] = useState([]);
    const [flightsLoading, setFlightsLoading] = useState(false);
    const [showFlights, setShowFlights] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

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

    // Replace the previous useEffect for hotels with this new one
    useEffect(() => {
        const fetchHotels = async () => {
            if (!itinerary?.destination?.coordinates) return;

            setHotelsLoading(true);
            try {
                const { latitude, longitude } = itinerary.destination.coordinates;

                const options = {
                    method: 'GET',
                    url: 'https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-geocode',
                    params: {
                        latitude: latitude,
                        longitude: longitude,
                        radius: 5,
                        radiusUnit: 'KM',
                        hotelSource: 'ALL',
                    },
                    headers: {
                        Authorization: `Bearer dOyXKlAJ1yQrQLBbALQNms90DGm6`,
                    },
                };

                const response = await axios.request(options);
                setHotels(response.data.data || []);
            } catch (error) {
                console.error('Error fetching hotels:', error);
            } finally {
                setHotelsLoading(false);
            }
        };

        fetchHotels();
    }, [itinerary?.destination?.coordinates]);

    // Get user's location and nearest airport
    useEffect(() => {
        const getUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        // Get nearest airport using Amadeus API
                        const options = {
                            method: 'GET',
                            url: 'https://test.api.amadeus.com/v1/reference-data/locations/airports',
                            params: {
                                latitude: latitude,
                                longitude: longitude,
                                radius: 100,
                                sort: 'distance',
                            },
                            headers: {
                                Authorization: `Bearer dOyXKlAJ1yQrQLBbALQNms90DGm6`,
                            },
                        };

                        const response = await axios.request(options);
                        if (response.data.data.length > 0) {
                            setUserLocation({
                                latitude,
                                longitude,
                                nearestAirport: response.data.data[0],
                            });
                        }
                    } catch (error) {
                        console.error('Error fetching nearest airport:', error);
                    }
                });
            }
        };

        getUserLocation();
    }, []);

    // Update the flight search useEffect
    useEffect(() => {
        const fetchFlights = async () => {
            if (!userLocation?.nearestAirport || !itinerary?.destination?.name) return;

            setFlightsLoading(true);
            try {
                // Get destination airport code
                const destinationCode = await getCityAirportCode(itinerary.destination.name);

                if (!destinationCode) {
                    console.error('Could not find airport code for destination');
                    return;
                }

                // Search for flights directly using airport codes
                const flightOptions = {
                    method: 'GET',
                    url: 'https://test.api.amadeus.com/v2/shopping/flight-offers',
                    params: {
                        originLocationCode: userLocation.nearestAirport.iataCode,
                        destinationLocationCode: destinationCode,
                        departureDate: itinerary.travel_dates
                            ? (() => {
                                  const date = new Date(itinerary.travel_dates.split(' - ')[0]);
                                  date.setDate(date.getDate() + 10);
                                  return date.toISOString().split('T')[0];
                              })()
                            : '2024-06-11',
                        adults: '1',
                        max: '5',
                        currencyCode: 'INR',
                    },
                    headers: {
                        Authorization: `Bearer CegOcGSfCKLyXT6lWDVEriXRtTsq`,
                    },
                };

                const flightResponse = await axios.request(flightOptions);
                setFlights(flightResponse.data.data || []);
            } catch (error) {
                console.error('Error fetching flights:', error);
            } finally {
                setFlightsLoading(false);
            }
        };

        fetchFlights();
    }, [userLocation, itinerary?.destination?.name, itinerary?.travel_dates]);

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

    // Add this helper function before the return statement
    const paginatedHotels = hotels.slice((currentPage - 1) * hotelsPerPage, currentPage * hotelsPerPage);
    const totalPages = Math.ceil(hotels.length / hotelsPerPage);

    // Add this helper function before the return statement
    const handleHotelClick = (hotelName) => {
        const searchQuery = encodeURIComponent(hotelName);
        window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
    };

    // Add this helper function before the return statement
    const getBookingLinks = (flight) => {
        const departureCode = flight.itineraries[0].segments[0].departure.iataCode;
        const arrivalCode = flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.iataCode;
        const departureDate = flight.itineraries[0].segments[0].departure.at.split('T')[0];

        return [
            {
                name: 'Google Flights',
                url: `https://www.google.com/travel/flights?q=Flights%20from%20${departureCode}%20to%20${arrivalCode}%20on%20${departureDate}`,
            },
            {
                name: 'Kayak',
                url: `https://www.kayak.com/flights/${departureCode}-${arrivalCode}/${departureDate}`,
            },
            {
                name: 'Skyscanner',
                url: `https://www.skyscanner.com/transport/flights/${departureCode}/${arrivalCode}/${departureDate}`,
            },
        ];
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
                                                    {day[timeOfDay]?.location?.name && (
                                                        <a
                                                            href={`https://www.google.com/maps?q=${encodeURIComponent(
                                                                day[timeOfDay].location.name
                                                            )}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hover:text-blue-600 hover:underline flex items-center gap-1"
                                                        >
                                                            {day[timeOfDay].location.name}
                                                            <svg
                                                                className="w-4 h-4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                                />
                                                            </svg>
                                                        </a>
                                                    )}
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

                                <motion.button
                                    whileHover={{ scale: 1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsEmailModalOpen(true)}
                                    className="group relative px-6 py-3 border-2 border-black text-black rounded-xl font-medium transition-all duration-300 hover:bg-gray-600"
                                >
                                    <span className="opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                                        Email Itinerary
                                    </span>
                                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-2xl">
                                        📧
                                    </span>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hotels Section */}
                <div className="mt-8">
                    <button
                        onClick={() => setShowHotels(!showHotels)}
                        className="w-full bg-white rounded-xl shadow-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-all"
                    >
                        <h2 className="text-2xl font-semibold">Hotels near {itinerary.destination.name}</h2>
                        <svg
                            className={`w-6 h-6 transform transition-transform ${showHotels ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {showHotels && (
                        <div className="mt-4 bg-white rounded-xl shadow-lg p-6">
                            {hotelsLoading ? (
                                <div className="flex justify-center p-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                                </div>
                            ) : hotels.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {paginatedHotels.map((hotel) => (
                                            <div
                                                key={hotel.hotelId}
                                                onClick={() => handleHotelClick(hotel.name)}
                                                className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden cursor-pointer hover:bg-gray-50"
                                            >
                                                {/* Hotel Chain Badge */}
                                                {hotel.chainCode && (
                                                    <span className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                        {hotel.chainCode}
                                                    </span>
                                                )}

                                                <h3 className="font-semibold text-xl text-gray-900 mb-4 pr-20">{hotel.name}</h3>

                                                <div className="space-y-3">
                                                    {/* Distance Info */}
                                                    <div className="flex items-center text-gray-600">
                                                        <svg
                                                            className="w-5 h-5 mr-2"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
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
                                                        <span className="text-sm">
                                                            {hotel.distance.value} {hotel.distance.unit} from center
                                                        </span>
                                                    </div>

                                                    {/* Location Info */}
                                                    <div className="flex items-center text-gray-600">
                                                        <svg
                                                            className="w-5 h-5 mr-2"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064"
                                                            />
                                                        </svg>
                                                        <span className="text-sm">
                                                            {hotel.geoCode.latitude.toFixed(4)},{' '}
                                                            {hotel.geoCode.longitude.toFixed(4)}
                                                        </span>
                                                    </div>

                                                    {/* Country Info */}
                                                    {hotel.address && (
                                                        <div className="flex items-center text-gray-600">
                                                            <svg
                                                                className="w-5 h-5 mr-2"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                                                                />
                                                            </svg>
                                                            <span className="text-sm">{hotel.address.countryCode}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center items-center space-x-4 mt-8">
                                            <button
                                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                            >
                                                Previous
                                            </button>
                                            <span className="text-gray-600">
                                                Page {currentPage} of {totalPages}
                                            </span>
                                            <button
                                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-gray-600 text-center py-8">No hotels found in this area.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Flights Section */}
                <div className="mt-8">
                    <button
                        onClick={() => setShowFlights(!showFlights)}
                        className="w-full bg-white rounded-xl shadow-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-all"
                    >
                        <h2 className="text-2xl font-semibold">Flights to {itinerary.destination.name}</h2>
                        <svg
                            className={`w-6 h-6 transform transition-transform ${showFlights ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {showFlights && (
                        <div className="mt-4 bg-white rounded-xl shadow-lg p-6">
                            {flightsLoading ? (
                                <div className="flex justify-center p-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                                </div>
                            ) : flights.length > 0 ? (
                                <div className="space-y-6">
                                    {flights.map((flight, index) => (
                                        <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                            {/* Flight Header */}
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <span className="text-sm text-gray-500">Flight Option {index + 1}</span>
                                                    <p className="text-lg font-semibold">
                                                        Total Duration:{' '}
                                                        {flight.itineraries[0].duration
                                                            .replace('PT', '')
                                                            .replace('H', 'h ')
                                                            .replace('M', 'm')}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold">
                                                        {flight.price.total} {flight.price.currency}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {flight.travelerPricings[0].fareDetailsBySegment[0].cabin} Class
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Flight Segments */}
                                            <div className="space-y-4">
                                                {flight.itineraries[0].segments.map((segment, segIndex) => (
                                                    <div key={segIndex} className="flex items-start space-x-4">
                                                        {/* Airline Logo/Code */}
                                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            <span className="font-bold">{segment.carrierCode}</span>
                                                        </div>

                                                        {/* Flight Details */}
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start">
                                                                {/* Departure */}
                                                                <div>
                                                                    <p className="font-semibold">{segment.departure.iataCode}</p>
                                                                    <p className="text-sm text-gray-600">
                                                                        {new Date(segment.departure.at).toLocaleTimeString()}
                                                                    </p>
                                                                    {segment.departure.terminal && (
                                                                        <p className="text-sm text-gray-500">
                                                                            Terminal {segment.departure.terminal}
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                {/* Flight Info */}
                                                                <div className="text-center px-4">
                                                                    <p className="text-sm text-gray-500">
                                                                        Flight {segment.carrierCode}-{segment.number}
                                                                    </p>
                                                                    <div className="flex items-center justify-center my-2">
                                                                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                                        <div className="w-20 h-0.5 bg-gray-300"></div>
                                                                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                                    </div>
                                                                    <p className="text-sm text-gray-500">
                                                                        {segment.duration
                                                                            .replace('PT', '')
                                                                            .replace('H', 'h ')
                                                                            .replace('M', 'm')}
                                                                    </p>
                                                                </div>

                                                                {/* Arrival */}
                                                                <div className="text-right">
                                                                    <p className="font-semibold">{segment.arrival.iataCode}</p>
                                                                    <p className="text-sm text-gray-600">
                                                                        {new Date(segment.arrival.at).toLocaleTimeString()}
                                                                    </p>
                                                                    {segment.arrival.terminal && (
                                                                        <p className="text-sm text-gray-500">
                                                                            Terminal {segment.arrival.terminal}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Aircraft Info */}
                                                            <div className="mt-2 text-sm text-gray-500">
                                                                <p>
                                                                    Aircraft:{' '}
                                                                    {flight.dictionaries?.aircraft[segment.aircraft.code] ||
                                                                        segment.aircraft.code}
                                                                </p>
                                                                {segment.operating && (
                                                                    <p>
                                                                        Operated by:{' '}
                                                                        {flight.dictionaries?.carriers[
                                                                            segment.operating.carrierCode
                                                                        ] || segment.operating.carrierCode}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Additional Info */}

                                            {/* Booking Links */}
                                            <div className="mt-6 pt-4 border-t">
                                                <p className="text-sm font-semibold mb-3">Book this flight:</p>
                                                <div className="flex flex-wrap gap-3">
                                                    {getBookingLinks(flight).map((link, linkIndex) => (
                                                        <a
                                                            key={linkIndex}
                                                            href={link.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md 
                                                                     shadow-sm text-sm font-medium text-gray-700 bg-white 
                                                                     hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                                        >
                                                            {link.name}
                                                            <svg
                                                                className="ml-2 -mr-1 h-4 w-4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                                />
                                                            </svg>
                                                        </a>
                                                    ))}

                                                    {/* Direct Airline Link if available */}
                                                    {flight.validatingAirlineCodes[0] && (
                                                        <a
                                                            href={`https://www.google.com/search?q=${flight.validatingAirlineCodes[0]}+airlines+booking`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md 
                                                                     shadow-sm text-sm font-medium text-gray-700 bg-white 
                                                                     hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                                        >
                                                            Book with{' '}
                                                            {flight.dictionaries?.carriers[flight.validatingAirlineCodes[0]] ||
                                                                flight.validatingAirlineCodes[0]}
                                                            <svg
                                                                className="ml-2 -mr-1 h-4 w-4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                                />
                                                            </svg>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600 text-center py-8">No flights found for these dates.</p>
                            )}
                        </div>
                    )}
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
                            ➤
                        </motion.button>
                    </form>
                </div>
            </div>

            <EmailModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} itineraryData={itinerary} />
        </div>
    );
}
